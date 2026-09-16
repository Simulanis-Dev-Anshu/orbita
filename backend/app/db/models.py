"""Mongo documents as attribute objects so existing Pydantic schemas keep working."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any


def new_id() -> str:
    return uuid.uuid4().hex


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Obj:
    """Thin wrapper: obj.field reads/writes the underlying dict."""

    __slots__ = ("_d",)

    def __init__(self, data: dict[str, Any] | None = None, **extra: Any):
        payload = dict(data or {})
        payload.update(extra)
        ident = payload.get("id") or payload.get("_id") or new_id()
        payload["_id"] = ident
        payload["id"] = ident
        if not payload.get("external_key"):
            payload.pop("external_key", None)
        object.__setattr__(self, "_d", payload)

    def __getattr__(self, name: str) -> Any:
        data = object.__getattribute__(self, "_d")
        try:
            return data[name]
        except KeyError as exc:
            raise AttributeError(name) from exc

    def __setattr__(self, name: str, value: Any) -> None:
        if name == "_d":
            object.__setattr__(self, name, value)
            return
        self._d[name] = value

    def to_mongo(self) -> dict[str, Any]:
        data = dict(self._d)
        data["_id"] = data.get("_id") or data.get("id") or new_id()
        data["id"] = data["_id"]
        if not data.get("external_key"):
            data.pop("external_key", None)
        return data


def as_obj(raw: dict[str, Any] | None) -> Obj | None:
    if raw is None:
        return None
    return Obj(raw)


User = Obj
Agent = Obj
Alert = Obj
Connector = Obj
ConnectorToken = Obj
Notification = Obj
Approval = Obj
AgentEvent = Obj
InventorySnapshot = Obj


def make_user(**kwargs: Any) -> Obj:
    now = utcnow()
    return Obj(
        {
            "email": kwargs.get("email", ""),
            "name": kwargs.get("name", ""),
            "hashed_password": kwargs.get("hashed_password", ""),
            "role": kwargs.get("role", "viewer"),
            "is_active": kwargs.get("is_active", True),
            "created_at": kwargs.get("created_at", now),
        }
    )


def make_agent(**kwargs: Any) -> Obj:
    now = utcnow()
    return Obj(
        {
            "name": kwargs.get("name", ""),
            "platform": kwargs.get("platform", "Other"),
            "owner_name": kwargs.get("owner_name", "Unassigned"),
            "owner_role": kwargs.get("owner_role", "-"),
            "scopes": list(kwargs.get("scopes") or []),
            "risk": kwargs.get("risk", 50),
            "status": kwargs.get("status", "pending"),
            "source": kwargs.get("source", "manual"),
            "first_seen_at": kwargs.get("first_seen_at", now),
            "last_active_at": kwargs.get("last_active_at", now),
            "scored_at": kwargs.get("scored_at"),
            "created_by": kwargs.get("created_by"),
            "external_key": kwargs.get("external_key"),
            "discovery_kind": kwargs.get("discovery_kind", ""),
            "asset_type": kwargs.get("asset_type", "AI_AGENT"),
            "vendor": kwargs.get("vendor", ""),
            "device": kwargs.get("device", ""),
            "connections": list(kwargs.get("connections") or []),
            "data_access": list(kwargs.get("data_access") or []),
        }
    )


def make_alert(**kwargs: Any) -> Obj:
    return Obj(
        {
            "type": kwargs.get("type", ""),
            "severity": kwargs.get("severity", "medium"),
            "agent_name": kwargs.get("agent_name", ""),
            "detail": kwargs.get("detail", ""),
            "resolved": kwargs.get("resolved", False),
            "created_at": kwargs.get("created_at", utcnow()),
        }
    )


def make_connector(**kwargs: Any) -> Obj:
    return Obj(
        {
            "name": kwargs.get("name", ""),
            "category": kwargs.get("category", ""),
            "status": kwargs.get("status", "available"),
            "agents_count": kwargs.get("agents_count", 0),
            "last_sync_at": kwargs.get("last_sync_at"),
            "kind": kwargs.get("kind", ""),
            "last_error": kwargs.get("last_error", ""),
            "meta": dict(kwargs.get("meta") or {}),
        }
    )


def make_connector_token(**kwargs: Any) -> Obj:
    return Obj(
        {
            "connector_id": kwargs.get("connector_id", ""),
            "access_token": kwargs.get("access_token", ""),
            "refresh_token": kwargs.get("refresh_token", ""),
            "expires_at": kwargs.get("expires_at"),
            "extra": dict(kwargs.get("extra") or {}),
        }
    )


def make_notification(**kwargs: Any) -> Obj:
    return Obj(
        {
            "title": kwargs.get("title", ""),
            "detail": kwargs.get("detail", ""),
            "severity": kwargs.get("severity", "info"),
            "unread": kwargs.get("unread", True),
            "created_at": kwargs.get("created_at", utcnow()),
        }
    )


def make_approval(**kwargs: Any) -> Obj:
    return Obj(
        {
            "title": kwargs.get("title", ""),
            "detail": kwargs.get("detail", ""),
            "risk": kwargs.get("risk", "medium"),
            "status": kwargs.get("status", "pending"),
            "created_at": kwargs.get("created_at", utcnow()),
        }
    )


def make_event(**kwargs: Any) -> Obj:
    return Obj(
        {
            "agent_id": kwargs.get("agent_id"),
            "occurred_at": kwargs.get("occurred_at", utcnow()),
            "kind": kwargs.get("kind", "action"),
            "count": kwargs.get("count", 1),
        }
    )


def make_snapshot(**kwargs: Any) -> Obj:
    return Obj(
        {
            "captured_on": kwargs.get("captured_on"),
            "total_agents": kwargs.get("total_agents", 0),
            "orphaned": kwargs.get("orphaned", 0),
            "high_risk": kwargs.get("high_risk", 0),
            "avg_risk": kwargs.get("avg_risk", 0),
            "scored": kwargs.get("scored", 0),
        }
    )
