"""Normalize discovery inputs into Agent rows (upsert by external_key)."""
from __future__ import annotations

import csv
import io
import json
import re
from datetime import datetime, timezone
from typing import Any, Iterable
from urllib.parse import urlparse

from app.db import mongo as db
from app.db.models import Agent, Connector, make_agent, make_alert, make_connector, make_notification
from app.domain.asset import infer_asset_type, infer_vendor
from app.services.risk import score_agent

CONNECTOR_CATALOG = {
    "google": ("Google Workspace", "Identity & OAuth"),
    "microsoft": ("Microsoft 365", "Identity & OAuth"),
    "github": ("GitHub", "Engineering"),
    "dns": ("DNS Egress Sensor", "Network"),
    "zapier": ("Zapier", "Automation"),
    "make": ("Make", "Automation"),
    "collector": ("Managed endpoint collector", "Endpoint"),
}

LLM_HOSTS = {
    "api.openai.com": ("OpenAI", "ChatGPT / API"),
    "chatgpt.com": ("OpenAI", "ChatGPT"),
    "chat.openai.com": ("OpenAI", "ChatGPT"),
    "api.anthropic.com": ("Anthropic", "Claude"),
    "claude.ai": ("Anthropic", "Claude"),
    "generativelanguage.googleapis.com": ("Google", "Gemini"),
    "gemini.google.com": ("Google", "Gemini"),
    "api.groq.com": ("Groq", "Groq"),
    "api.mistral.ai": ("Mistral", "Mistral"),
    "api.cohere.ai": ("Cohere", "Cohere"),
    "api.perplexity.ai": ("Perplexity", "Perplexity"),
    "www.perplexity.ai": ("Perplexity", "Perplexity"),
    "api.x.ai": ("xAI", "Grok"),
    "openrouter.ai": ("OpenRouter", "OpenRouter"),
    "api.together.xyz": ("Together", "Together AI"),
    "api.fireworks.ai": ("Fireworks", "Fireworks"),
    "ollama.com": ("Ollama", "Ollama"),
    "localhost:11434": ("Ollama", "Ollama"),
    "cursor.com": ("Anysphere", "Cursor"),
    "api2.cursor.sh": ("Anysphere", "Cursor"),
}

KNOWN_APPS = {
    "zapier": "Zapier",
    "make.com": "Make",
    "integromat": "Make",
    "n8n": "n8n",
    "chatgpt": "ChatGPT",
    "openai": "ChatGPT",
    "claude": "Claude",
    "anthropic": "Claude",
    "cursor": "Cursor",
    "copilot": "Copilot",
    "grammarly": "Grammarly",
    "perplexity": "Perplexity",
    "notion": "Notion AI",
    "slack": "Slack",
}


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (value or "").lower()).strip("-")[:80]


def _host(value: str) -> str:
    raw = (value or "").strip().lower()
    if not raw:
        return ""
    if "://" not in raw:
        raw = "https://" + raw
    try:
        parsed = urlparse(raw)
        host = (parsed.hostname or "").lower()
        if parsed.port and parsed.port not in (80, 443):
            return f"{host}:{parsed.port}"
        return host
    except ValueError:
        return ""


def classify_app(name: str) -> str:
    blob = (name or "").lower()
    for needle, platform in KNOWN_APPS.items():
        if needle in blob:
            return platform
    return (name or "Unknown app").strip()[:80] or "Unknown app"


def scopes_from_google(raw: Iterable[str] | None) -> list[str]:
    out = []
    for scope in raw or []:
        s = str(scope)
        if "/" in s:
            s = s.rsplit("/", 1)[-1]
        if s and s not in out:
            out.append(s[:80])
    return out[:12]


async def get_or_create_connector(kind: str) -> Connector:
    name, category = CONNECTOR_CATALOG[kind]
    row = await db.find_one("connectors", {"kind": kind})
    if row is None:
        row = await db.find_one("connectors", {"name": name})
    if row is None:
        row = make_connector(name=name, category=category, status="connected", kind=kind, meta={})
        await db.insert("connectors", row)
    else:
        row.kind = kind
        row.status = "connected"
        row.last_error = ""
    row.last_sync_at = _now()
    await db.save("connectors", row)
    return row


async def upsert_findings(kind: str, findings: list[dict[str, Any]]) -> dict:
    connector = await get_or_create_connector(kind)
    created = 0
    updated = 0
    agents: list[Agent] = []

    for raw in findings:
        key = (raw.get("external_key") or "")[:240]
        if not key:
            continue
        name = (raw.get("name") or "Unknown")[:200]
        platform = (raw.get("platform") or classify_app(name))[:60]
        owner = (raw.get("owner_name") or "Unassigned")[:120]
        owner_role = (raw.get("owner_role") or "-")[:120]
        scopes = list(raw.get("scopes") or [])
        status = raw.get("status") or "active"
        if owner.strip().lower() in ("", "unassigned"):
            status = "orphaned"
        device = (raw.get("device") or "")[:120]
        existing = await db.find_one("agents", {"external_key": key})
        risk = score_agent(platform, scopes, owner, status)
        payload = {
            "name": name,
            "platform": platform,
            "owner_name": owner,
            "owner_role": owner_role,
            "scopes": scopes,
            "risk": risk,
            "status": status,
            "source": "scan",
            "last_active_at": _now(),
            "scored_at": _now(),
            "asset_type": raw.get("asset_type") or infer_asset_type(platform),
            "vendor": raw.get("vendor") or infer_vendor(platform),
            "device": device,
            "connections": list(raw.get("connections") or scopes),
            "data_access": list(raw.get("data_access") or scopes),
            "discovery_kind": kind,
            "external_key": key,
        }
        if existing is None:
            agent = make_agent(**payload)
            await db.insert("agents", agent)
            created += 1
            if status == "orphaned" or risk >= 75:
                await db.insert(
                    "alerts",
                    make_alert(
                        type="New agent detected" if risk < 75 else "High-risk grant",
                        severity="critical" if status == "orphaned" or risk >= 85 else "high",
                        agent_name=name,
                        detail=raw.get("detail") or f"{name} discovered via {connector.name} · risk {risk}",
                    ),
                )
            await db.insert(
                "notifications",
                make_notification(
                    title="New agent discovered",
                    detail=f"{name} ({platform}) via {connector.name}",
                    severity="high" if risk >= 75 else "info",
                ),
            )
            agents.append(agent)
        else:
            for field, value in payload.items():
                setattr(existing, field, value)
            await db.save("agents", existing)
            updated += 1
            agents.append(existing)

    connector.agents_count = await db.count("agents", {"discovery_kind": kind})
    await db.save("connectors", connector)
    return {
        "kind": kind,
        "connector_id": connector.id,
        "created": created,
        "updated": updated,
        "total": created + updated,
        "agents": agents[:80],
    }


def parse_dns(text: str) -> list[dict[str, Any]]:
    text = text.lstrip("\ufeff")
    rows: list[dict[str, Any]] = []
    if text.strip().startswith("{") or text.strip().startswith("["):
        data = json.loads(text)
        items = data if isinstance(data, list) else data.get("rows") or data.get("queries") or []
        for item in items:
            if isinstance(item, str):
                item = {"host": item}
            host = _host(item.get("host") or item.get("domain") or item.get("dest") or item.get("query") or "")
            if host:
                rows.append({"host": host, "user": item.get("user") or item.get("client") or "", "device": item.get("device") or ""})
    else:
        sample = text[:4096]
        try:
            dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
        except csv.Error:
            dialect = csv.excel
        reader = csv.DictReader(io.StringIO(text), dialect=dialect)
        if not reader.fieldnames:
            reader = csv.DictReader(io.StringIO("host,user,device\n" + text))
        for item in reader:
            keys = {k.lower().strip(): v for k, v in item.items() if k}
            host = _host(
                keys.get("host")
                or keys.get("domain")
                or keys.get("query")
                or keys.get("dest")
                or keys.get("url")
                or keys.get("destination")
                or ""
            )
            if host:
                rows.append({"host": host, "user": keys.get("user") or keys.get("client") or "", "device": keys.get("device") or keys.get("src") or ""})

    findings = []
    seen = set()
    for row in rows:
        host = row["host"]
        match = None
        for needle, meta in LLM_HOSTS.items():
            if host == needle or host.endswith("." + needle) or needle in host:
                match = meta
                break
        if not match:
            continue
        vendor, platform = match
        key = f"dns:{host}:{_slug(row['user'] or row['device'] or 'unknown')}"
        if key in seen:
            continue
        seen.add(key)
        findings.append(
            {
                "external_key": key,
                "name": f"{platform} egress · {host}",
                "platform": platform,
                "vendor": vendor,
                "owner_name": row["user"] or "Unassigned",
                "device": row["device"],
                "scopes": ["network.egress", host],
                "asset_type": "AI_API" if "api." in host else infer_asset_type(platform),
                "detail": f"DNS/proxy log hit {host}",
            }
        )
    return findings


def parse_automation(text: str, kind: str) -> list[dict[str, Any]]:
    text = text.lstrip("\ufeff")
    findings: list[dict[str, Any]] = []
    if text.strip().startswith("{") or text.strip().startswith("["):
        data = json.loads(text)
        zaps = []
        if isinstance(data, list):
            zaps = data
        elif isinstance(data, dict):
            zaps = data.get("zaps") or data.get("scenarios") or data.get("workflows") or data.get("items") or [data]
        for zap in zaps:
            if not isinstance(zap, dict):
                continue
            title = zap.get("title") or zap.get("name") or zap.get("label") or "Untitled automation"
            owner = zap.get("owner") or zap.get("author") or zap.get("created_by") or "Unassigned"
            if isinstance(owner, dict):
                owner = owner.get("name") or owner.get("email") or "Unassigned"
            nodes = zap.get("nodes") or zap.get("modules") or zap.get("steps") or []
            apps = []
            for node in nodes if isinstance(nodes, list) else []:
                if isinstance(node, dict):
                    apps.append(str(node.get("app") or node.get("module") or node.get("name") or ""))
                elif isinstance(node, str):
                    apps.append(node)
            if zap.get("app"):
                apps.append(str(zap["app"]))
            scopes = [a for a in apps if a][:12] or [kind]
            findings.append(
                {
                    "external_key": f"{kind}:{zap.get('id') or _slug(str(title))}",
                    "name": str(title)[:200],
                    "platform": "Zapier" if kind == "zapier" else "Make",
                    "owner_name": str(owner)[:120],
                    "scopes": scopes,
                    "asset_type": "AI_AGENT",
                    "detail": f"Imported {kind} automation",
                }
            )
        return findings

    reader = csv.DictReader(io.StringIO(text))
    for item in reader:
        keys = {k.lower().strip(): v for k, v in item.items() if k}
        title = keys.get("name") or keys.get("title") or keys.get("zap") or "Untitled"
        owner = keys.get("owner") or keys.get("user") or "Unassigned"
        app = keys.get("app") or keys.get("apps") or kind
        findings.append(
            {
                "external_key": f"{kind}:{_slug(title)}:{_slug(owner)}",
                "name": title[:200],
                "platform": "Zapier" if kind == "zapier" else "Make",
                "owner_name": owner,
                "scopes": [p.strip() for p in str(app).split(",") if p.strip()][:12],
                "asset_type": "AI_AGENT",
            }
        )
    return findings


def parse_google_tokens(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, str):
        payload = json.loads(payload)
    items = []
    if isinstance(payload, list):
        items = payload
    elif isinstance(payload, dict):
        items = payload.get("items") or payload.get("tokens") or payload.get("apps") or []
    findings = []
    for item in items:
        if not isinstance(item, dict):
            continue
        user = item.get("user") or item.get("userKey") or item.get("email") or "Unassigned"
        display = item.get("displayText") or item.get("displayName") or item.get("name") or item.get("clientId") or "OAuth app"
        client = item.get("clientId") or item.get("client_id") or _slug(str(display))
        scopes = scopes_from_google(item.get("scopes") or item.get("scope") or [])
        if isinstance(item.get("scopes"), str):
            scopes = scopes_from_google(item["scopes"].split())
        platform = classify_app(str(display))
        findings.append(
            {
                "external_key": f"google:{client}:{_slug(str(user))}",
                "name": str(display)[:200],
                "platform": platform,
                "owner_name": str(user)[:120],
                "scopes": scopes or ["oauth"],
                "asset_type": infer_asset_type(platform),
                "detail": f"Google OAuth grant for {user}",
            }
        )
    return findings


def parse_github_payload(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, str):
        payload = json.loads(payload)
    items = []
    if isinstance(payload, list):
        items = payload
    elif isinstance(payload, dict):
        items = (
            payload.get("installations")
            or payload.get("apps")
            or payload.get("repositories")
            or [payload]
        )
    findings = []
    for item in items:
        if not isinstance(item, dict):
            continue
        account = item.get("account") or {}
        owner = account.get("login") if isinstance(account, dict) else item.get("owner") or item.get("account") or "Unassigned"
        slug = item.get("app_slug") or item.get("slug") or item.get("name") or item.get("app") or "GitHub App"
        app_id = item.get("app_id") or item.get("id") or _slug(str(slug))
        findings.append(
            {
                "external_key": f"github:{app_id}:{_slug(str(owner))}",
                "name": str(slug)[:200],
                "platform": "GitHub App" if "copilot" not in str(slug).lower() else "Copilot",
                "owner_name": str(owner)[:120],
                "scopes": item.get("permissions") and list(item.get("permissions").keys())[:12] or ["github"],
                "asset_type": infer_asset_type(str(slug)),
            }
        )
    return findings


def parse_microsoft_grants(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, str):
        payload = json.loads(payload)
    items = payload.get("value") if isinstance(payload, dict) else payload
    findings = []
    for item in items or []:
        if not isinstance(item, dict):
            continue
        client = item.get("clientId") or item.get("appId") or item.get("id") or "app"
        name = item.get("displayName") or item.get("appDisplayName") or str(client)
        user = item.get("principalId") or item.get("user") or "Unassigned"
        scopes = str(item.get("scope") or "").split()
        findings.append(
            {
                "external_key": f"microsoft:{client}:{_slug(str(user))}",
                "name": str(name)[:200],
                "platform": classify_app(str(name)),
                "owner_name": str(user)[:120],
                "scopes": scopes_from_google(scopes) or ["graph"],
            }
        )
    return findings


def parse_collector(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, str):
        payload = json.loads(payload)
    host = payload.get("hostname") or payload.get("host") or "endpoint"
    user = payload.get("user") or payload.get("username") or "Unassigned"
    findings = []
    for app in payload.get("apps") or []:
        name = app if isinstance(app, str) else app.get("name")
        if not name:
            continue
        findings.append(
            {
                "external_key": f"collector:app:{_slug(host)}:{_slug(str(name))}",
                "name": str(name)[:200],
                "platform": classify_app(str(name)),
                "owner_name": user,
                "device": host,
                "scopes": ["endpoint.install"],
                "asset_type": infer_asset_type(str(name)),
            }
        )
    for ext in payload.get("extensions") or []:
        name = ext if isinstance(ext, str) else ext.get("name")
        if not name:
            continue
        findings.append(
            {
                "external_key": f"collector:ext:{_slug(host)}:{_slug(str(name))}",
                "name": str(name)[:200],
                "platform": classify_app(str(name)),
                "owner_name": user,
                "device": host,
                "scopes": ["browser.extension"],
                "asset_type": "BROWSER_EXTENSION",
            }
        )
    for mcp in payload.get("mcp") or []:
        name = mcp if isinstance(mcp, str) else mcp.get("name") or mcp.get("server")
        if not name:
            continue
        target = "" if isinstance(mcp, str) else (mcp.get("url") or mcp.get("command") or "")
        findings.append(
            {
                "external_key": f"collector:mcp:{_slug(host)}:{_slug(str(name))}",
                "name": str(name)[:200],
                "platform": "MCP",
                "owner_name": user,
                "device": host,
                "scopes": [target] if target else ["mcp"],
                "asset_type": "MCP_SERVER",
            }
        )
    models = payload.get("ollama") or payload.get("models") or []
    if models:
        findings.append(
            {
                "external_key": f"collector:ollama:{_slug(host)}",
                "name": "Ollama",
                "platform": "Ollama",
                "owner_name": user,
                "device": host,
                "scopes": [str(m) for m in models][:12],
                "asset_type": "LOCAL_MODEL",
            }
        )
    return findings


SAMPLE_GOOGLE = [
    {"user": "riya@acme.com", "displayText": "Zapier", "clientId": "zapier-demo", "scopes": ["gmail", "spreadsheets"]},
    {"user": "arjun@acme.com", "displayText": "ChatGPT", "clientId": "openai-demo", "scopes": ["openid", "email"]},
    {"user": "dev@acme.com", "displayText": "Cursor", "clientId": "cursor-demo", "scopes": ["github"]},
    {"user": "unassigned", "displayText": "Payroll Sync (Make)", "clientId": "make-payroll", "scopes": ["payroll.rw"]},
]

SAMPLE_GITHUB = [
    {"id": "copilot", "app_slug": "GitHub Copilot", "account": {"login": "acme"}},
    {"id": "cursor-gh", "app_slug": "Cursor", "account": {"login": "acme"}},
]

SAMPLE_DNS = """host,user,device
api.openai.com,riya@acme.com,finance-laptop
api.anthropic.com,dev@acme.com,dev-workstation
api2.cursor.sh,anshu@acme.com,anshu-macbook
generativelanguage.googleapis.com,priya@acme.com,hr-desktop
"""
