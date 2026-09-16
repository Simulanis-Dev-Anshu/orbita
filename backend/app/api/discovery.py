import json
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse, RedirectResponse

from app.api.deps import get_current_user, require_role
from app.core.config import settings
from app.db import mongo as db
from app.db.models import User
from app.schemas import AgentOut, ConnectorOut
from app.services import oauth_connectors as oauth
from app.services.discover import (
    SAMPLE_DNS,
    SAMPLE_GITHUB,
    SAMPLE_GOOGLE,
    parse_automation,
    parse_collector,
    parse_dns,
    parse_github_payload,
    parse_google_tokens,
    parse_microsoft_grants,
    upsert_findings,
)

router = APIRouter(prefix="/discovery", tags=["discovery"])
COLLECTOR = Path(__file__).resolve().parents[2] / "scripts" / "orbita_collect.py"
SAMPLES = Path(__file__).resolve().parents[2] / "samples"


def _redirect(query: str) -> RedirectResponse:
    dest = f"{settings.frontend_url.rstrip('/')}/app/discovery?tab=sources&{query}"
    return RedirectResponse(dest, status_code=302)


def _pack(result: dict) -> dict:
    return {
        "kind": result["kind"],
        "connector_id": result["connector_id"],
        "created": result["created"],
        "updated": result["updated"],
        "total": result["total"],
        "agents": [AgentOut.model_validate(a).model_dump() for a in result["agents"]],
    }


@router.get("/status")
async def discovery_status(_: User = Depends(get_current_user)):
    rows = await db.find_many("connectors")
    return {
        "oauth": {
            "google": oauth.configured("google"),
            "github": oauth.configured("github"),
            "microsoft": oauth.configured("microsoft"),
        },
        "frontend_url": settings.frontend_url,
        "connectors": [ConnectorOut.model_validate(c).model_dump() | {"kind": c.kind, "last_error": c.last_error} for c in rows],
    }


@router.get("/samples/{name}")
async def download_sample(name: str, _: User = Depends(get_current_user)):
    allowed = {"dns-egress.csv", "zapier-export.json", "google-tokens.json"}
    if name not in allowed:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Unknown sample")
    path = SAMPLES / name
    if not path.exists():
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Sample missing")
    return FileResponse(path, filename=name)


@router.get("/collector.py")
async def download_collector(_: User = Depends(get_current_user)):
    if not COLLECTOR.exists():
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Collector script missing")
    return FileResponse(COLLECTOR, filename="orbita_collect.py", media_type="text/x-python")


@router.get("/oauth/{kind}/start")
async def oauth_start(
    kind: str,
    user: User = Depends(require_role("admin")),
):
    if kind not in {"google", "github", "microsoft"}:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Unsupported provider")
    if not oauth.configured(kind):
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"{kind} OAuth is not configured. Set client id/secret in backend .env, or import a JSON export.",
        )
    return {"url": oauth.authorize_url(kind, user.id)}


@router.get("/oauth/{kind}/callback")
async def oauth_callback(
    kind: str,
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
):
    if error:
        return _redirect(f"{kind}=error&reason={error}")
    if kind not in {"google", "github", "microsoft"} or not code or not state:
        return _redirect(f"{kind}=error&reason=missing_code")
    user_id = oauth.decode_state(state, kind)
    if user_id is None:
        return _redirect(f"{kind}=error&reason=bad_state")
    try:
        token = await oauth.exchange_code(kind, code)
        access = token.get("access_token") or ""
        refresh = token.get("refresh_token") or ""
        await oauth._save_token(kind, access, refresh, {"token_type": token.get("token_type")})
        if kind == "google":
            findings = await oauth.pull_google(access)
        elif kind == "github":
            findings = await oauth.pull_github(access)
        else:
            findings = await oauth.pull_microsoft(access)
        result = await upsert_findings(kind, findings)
        return _redirect(f"{kind}=ok&created={result['created']}&updated={result['updated']}")
    except Exception as exc:  # noqa: BLE001 — surface vendor errors to the UI
        return _redirect(f"{kind}=error&reason={type(exc).__name__}")


@router.post("/import/{kind}")
async def import_json(
    kind: str,
    body: dict,
    _: User = Depends(require_role("admin")),
):
    parsers = {
        "google": parse_google_tokens,
        "github": parse_github_payload,
        "microsoft": parse_microsoft_grants,
        "collector": parse_collector,
    }
    if kind not in parsers:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Unsupported import kind")
    try:
        findings = parsers[kind](body)
    except (TypeError, ValueError, json.JSONDecodeError) as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Could not parse {kind} payload: {exc}") from exc
    if not findings:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No recognizable grants in that file")
    return _pack(await upsert_findings(kind, findings))


@router.post("/upload/{kind}")
async def upload_file(
    kind: str,
    file: UploadFile = File(...),
    _: User = Depends(require_role("admin")),
):
    if kind not in {"dns", "zapier", "make"}:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Upload kind must be dns, zapier, or make")
    raw = await file.read()
    if len(raw) > 5_000_000:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "File too large (5 MB max)")
    text = raw.decode("utf-8", errors="replace")
    try:
        findings = parse_dns(text) if kind == "dns" else parse_automation(text, kind)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Could not parse file: {exc}") from exc
    if not findings:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No LLM hosts or automations found in that file")
    return _pack(await upsert_findings(kind, findings))


@router.post("/collector")
async def collector_ingest(
    body: dict,
    _: User = Depends(require_role("admin")),
):
    findings = parse_collector(body)
    if not findings:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Collector payload had no apps, extensions, MCP, or models")
    return _pack(await upsert_findings("collector", findings))


@router.post("/demo/{kind}")
async def demo_scan(
    kind: str,
    _: User = Depends(require_role("admin")),
):
    if kind == "google":
        findings = parse_google_tokens(SAMPLE_GOOGLE)
    elif kind == "github":
        findings = parse_github_payload(SAMPLE_GITHUB)
    elif kind == "dns":
        findings = parse_dns(SAMPLE_DNS)
    elif kind == "zapier":
        findings = parse_automation(
            json.dumps(
                {
                    "zaps": [
                        {
                            "id": "zap-invoice",
                            "title": "Invoice bot",
                            "owner": "Riya Sharma",
                            "nodes": [{"app": "Gmail"}, {"app": "Sheets"}, {"app": "Tally"}],
                        }
                    ]
                }
            ),
            "zapier",
        )
    elif kind == "collector":
        findings = parse_collector(
            {
                "hostname": "anshu-macbook.local",
                "user": "Anshu",
                "apps": ["Cursor", "ChatGPT", "Ollama"],
                "extensions": ["ChatGPT for Google"],
                "mcp": [{"name": "Postgres MCP", "url": "postgres://localhost"}],
                "ollama": ["llama3.1:8b", "qwen2.5:14b"],
            }
        )
    else:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No demo for this kind")
    return _pack(await upsert_findings(kind if kind != "collector" else "collector", findings))
