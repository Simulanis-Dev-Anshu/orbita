import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text, inspect, text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def _id() -> str:
    return uuid.uuid4().hex


def _now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_id)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    hashed_password: Mapped[str] = mapped_column(String(128))
    role: Mapped[str] = mapped_column(String(20), default="viewer")  # owner | admin | viewer
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)


class Agent(Base):
    __tablename__ = "agents"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_id)
    name: Mapped[str] = mapped_column(String(200), index=True)
    platform: Mapped[str] = mapped_column(String(60))
    owner_name: Mapped[str] = mapped_column(String(120), default="Unassigned")
    owner_role: Mapped[str] = mapped_column(String(120), default="—")
    scopes: Mapped[List[str]] = mapped_column(JSON, default=list)
    risk: Mapped[int] = mapped_column(Integer, default=50)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # active | pending | orphaned
    source: Mapped[str] = mapped_column(String(20), default="manual")  # manual | scan
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    last_active_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    created_by: Mapped[Optional[str]] = mapped_column(ForeignKey("users.id"), nullable=True)
    # Canonical AI Asset fields (Phase 0). platform/owner/scopes stay as UI aliases.
    asset_type: Mapped[str] = mapped_column(String(32), default="AI_AGENT")
    vendor: Mapped[str] = mapped_column(String(80), default="")
    device: Mapped[str] = mapped_column(String(120), default="")
    connections: Mapped[List[str]] = mapped_column(JSON, default=list)
    data_access: Mapped[List[str]] = mapped_column(JSON, default=list)


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_id)
    type: Mapped[str] = mapped_column(String(60))
    severity: Mapped[str] = mapped_column(String(20))  # critical | high | medium | low
    agent_name: Mapped[str] = mapped_column(String(200))
    detail: Mapped[str] = mapped_column(Text)
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)


class Connector(Base):
    __tablename__ = "connectors"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_id)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    category: Mapped[str] = mapped_column(String(60))
    status: Mapped[str] = mapped_column(String(20), default="available")  # connected | available
    agents_count: Mapped[int] = mapped_column(Integer, default=0)
    last_sync_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_id)
    title: Mapped[str] = mapped_column(String(200))
    detail: Mapped[str] = mapped_column(Text)
    severity: Mapped[str] = mapped_column(String(20), default="info")  # critical | high | info
    unread: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)


class Approval(Base):
    __tablename__ = "approvals"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_id)
    title: Mapped[str] = mapped_column(String(200))
    detail: Mapped[str] = mapped_column(Text)
    risk: Mapped[str] = mapped_column(String(20), default="medium")  # critical | high | medium
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending | approved | rejected
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)


def ensure_asset_columns(sync_conn) -> None:
    """Add Phase 0 columns on existing SQLite files. create_all won't alter."""
    tables = inspect(sync_conn).get_table_names()
    if "agents" not in tables:
        return
    cols = {c["name"] for c in inspect(sync_conn).get_columns("agents")}
    for name, ddl in {
        "asset_type": "VARCHAR(32) DEFAULT 'AI_AGENT'",
        "vendor": "VARCHAR(80) DEFAULT ''",
        "device": "VARCHAR(120) DEFAULT ''",
        "connections": "JSON DEFAULT '[]'",
        "data_access": "JSON DEFAULT '[]'",
    }.items():
        if name not in cols:
            sync_conn.execute(text(f"ALTER TABLE agents ADD COLUMN {name} {ddl}"))
