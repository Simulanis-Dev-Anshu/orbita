"""OAuth helpers for Google, GitHub, and Microsoft. Tokens stored on ConnectorToken."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any
from urllib.parse import urlencode

import httpx
import jwt

from app.core.config import settings
from app.core.security import ALGORITHM, decode_token
from app.db import mongo as db
from app.db.models import Connector, make_connector_token
from app.services.discover import get_or_create_connector, parse_github_payload, parse_google_tokens, parse_microsoft_grants

GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN = "https://oauth2.googleapis.com/token"
GOOGLE_SCOPES = " ".join(
    [
        "openid",
        "email",
        "https://www.googleapis.com/auth/admin.directory.user.readonly",
        "https://www.googleapis.com/auth/admin.directory.user.security",
    ]
)
GITHUB_AUTH = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN = "https://github.com/login/oauth/access_token"
MS_AUTH = "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize"
MS_TOKEN = "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token"


def configured(kind: str) -> bool:
    if kind == "google":
        return bool(settings.google_client_id and settings.google_client_secret)
    if kind == "github":
        return bool(settings.github_client_id and settings.github_client_secret)
    if kind == "microsoft":
        return bool(settings.microsoft_client_id and settings.microsoft_client_secret)
    return False


def _callback(kind: str) -> str:
    return f"{settings.api_public_url.rstrip('/')}/api/discovery/oauth/{kind}/callback"


def encode_state(user_id: str, kind: str) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": user_id,
            "type": "oauth_state",
            "kind": kind,
            "exp": now + timedelta(minutes=15),
            "iat": now,
        },
        settings.secret_key,
        algorithm=ALGORITHM,
    )


def decode_state(token: str, kind: str) -> str | None:
    payload = decode_token(token, expected_type="oauth_state")
    if payload is None or payload.get("kind") != kind:
        return None
    return payload.get("sub")


def authorize_url(kind: str, user_id: str) -> str:
    state = encode_state(user_id, kind)
    if kind == "google":
        return GOOGLE_AUTH + "?" + urlencode(
            {
                "client_id": settings.google_client_id,
                "redirect_uri": _callback(kind),
                "response_type": "code",
                "scope": GOOGLE_SCOPES,
                "access_type": "offline",
                "prompt": "consent",
                "state": state,
            }
        )
    if kind == "github":
        return GITHUB_AUTH + "?" + urlencode(
            {
                "client_id": settings.github_client_id,
                "redirect_uri": _callback(kind),
                "scope": "read:org read:user",
                "state": state,
            }
        )
    return MS_AUTH.format(tenant=settings.microsoft_tenant) + "?" + urlencode(
        {
            "client_id": settings.microsoft_client_id,
            "redirect_uri": _callback(kind),
            "response_type": "code",
            "scope": "offline_access User.Read Directory.Read.All",
            "state": state,
        }
    )


async def _save_token(kind: str, access: str, refresh: str, extra: dict) -> Connector:
    connector = await get_or_create_connector(kind)
    row = await db.find_one("connector_tokens", {"connector_id": connector.id})
    if row is None:
        row = make_connector_token(connector_id=connector.id)
    row.access_token = access
    row.refresh_token = refresh or row.refresh_token
    row.extra = extra
    row.expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    await db.save("connector_tokens", row)
    return connector


async def exchange_code(kind: str, code: str) -> dict[str, Any]:
    async with httpx.AsyncClient(timeout=20) as client:
        if kind == "google":
            res = await client.post(
                GOOGLE_TOKEN,
                data={
                    "code": code,
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "redirect_uri": _callback(kind),
                    "grant_type": "authorization_code",
                },
            )
            res.raise_for_status()
            return res.json()
        if kind == "github":
            res = await client.post(
                GITHUB_TOKEN,
                data={
                    "client_id": settings.github_client_id,
                    "client_secret": settings.github_client_secret,
                    "code": code,
                    "redirect_uri": _callback(kind),
                },
                headers={"Accept": "application/json"},
            )
            res.raise_for_status()
            return res.json()
        res = await client.post(
            MS_TOKEN.format(tenant=settings.microsoft_tenant),
            data={
                "client_id": settings.microsoft_client_id,
                "client_secret": settings.microsoft_client_secret,
                "code": code,
                "redirect_uri": _callback(kind),
                "grant_type": "authorization_code",
                "scope": "offline_access User.Read Directory.Read.All",
            },
        )
        res.raise_for_status()
        return res.json()


async def pull_google(access_token: str) -> list[dict]:
    headers = {"Authorization": f"Bearer {access_token}"}
    findings: list[dict] = []
    async with httpx.AsyncClient(timeout=30) as client:
        users = await client.get(
            "https://admin.googleapis.com/admin/directory/v1/users",
            params={"customer": "my_customer", "maxResults": 50, "orderBy": "email"},
            headers=headers,
        )
        users.raise_for_status()
        for user in users.json().get("users") or []:
            email = user.get("primaryEmail")
            if not email:
                continue
            tokens = await client.get(
                f"https://admin.googleapis.com/admin/directory/v1/users/{email}/tokens",
                headers=headers,
            )
            if tokens.status_code >= 400:
                continue
            for item in tokens.json().get("items") or []:
                item["user"] = email
                findings.extend(parse_google_tokens({"items": [item]}))
    return findings


async def pull_github(access_token: str) -> list[dict]:
    headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}
    async with httpx.AsyncClient(timeout=30) as client:
        inst = await client.get("https://api.github.com/user/installations", headers=headers)
        inst.raise_for_status()
        return parse_github_payload(inst.json())


async def pull_microsoft(access_token: str) -> list[dict]:
    headers = {"Authorization": f"Bearer {access_token}"}
    async with httpx.AsyncClient(timeout=30) as client:
        grants = await client.get("https://graph.microsoft.com/v1.0/oauth2PermissionGrants", headers=headers)
        grants.raise_for_status()
        return parse_microsoft_grants(grants.json())
