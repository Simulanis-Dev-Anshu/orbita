from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user, require_role
from app.db.base import get_session
from app.db.models import Agent, Alert, Approval, Connector, Notification, User
from app.schemas import AlertOut, ApprovalOut, ConnectorOut, ConnectorRegisterIn, NotificationOut

router = APIRouter(tags=["telemetry"])


@router.get("/dashboard/summary")
async def dashboard_summary(
    _: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    total_agents = (await session.execute(select(func.count()).select_from(Agent))).scalar_one()
    orphaned_agents = (
        await session.execute(select(func.count()).select_from(Agent).where(Agent.status == "orphaned"))
    ).scalar_one()
    high_risk_agents = (
        await session.execute(select(func.count()).select_from(Agent).where(Agent.risk >= 75))
    ).scalar_one()
    unresolved_alerts = (
        await session.execute(select(func.count()).select_from(Alert).where(Alert.resolved.is_(False)))
    ).scalar_one()

    return {
        "total_agents": total_agents,
        "orphaned_agents": orphaned_agents,
        "high_risk_agents": high_risk_agents,
        "unresolved_alerts": unresolved_alerts,
    }


@router.get("/alerts", response_model=list[AlertOut])
async def list_alerts(
    severity: str | None = None,
    resolved: bool | None = None,
    _: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Alert).order_by(Alert.created_at.desc())
    if severity:
        stmt = stmt.where(Alert.severity == severity)
    if resolved is not None:
        stmt = stmt.where(Alert.resolved == resolved)
    return (await session.scalars(stmt)).all()


@router.post("/alerts/{alert_id}/resolve", response_model=AlertOut)
async def resolve_alert(
    alert_id: str,
    _: User = Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    alert = await session.get(Alert, alert_id)
    if alert is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alert not found")
    alert.resolved = True
    await session.commit()
    await session.refresh(alert)
    return alert


@router.get("/connectors", response_model=list[ConnectorOut])
async def list_connectors(
    _: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Connector).order_by(Connector.status.asc(), Connector.name.asc())
    return (await session.scalars(stmt)).all()


@router.post("/connectors/{connector_id}/toggle", response_model=ConnectorOut)
async def toggle_connector(
    connector_id: str,
    _: User = Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    connector = await session.get(Connector, connector_id)
    if connector is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Connector not found")
    connector.status = "available" if connector.status == "connected" else "connected"
    connector.last_sync_at = datetime.now(timezone.utc) if connector.status == "connected" else None
    await session.commit()
    await session.refresh(connector)
    return connector


@router.post("/connectors/register", response_model=ConnectorOut, status_code=status.HTTP_201_CREATED)
async def register_connector(
    body: ConnectorRegisterIn,
    _: User = Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    # MVP keeps URL off-table; name/category/status are persisted in Connector.
    connector = Connector(
        name=body.name.strip(),
        category=body.category,
        status="connected",
        agents_count=0,
        last_sync_at=datetime.now(timezone.utc),
    )
    session.add(connector)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Connector with this name already exists")
    await session.refresh(connector)
    return connector


@router.delete("/connectors/{connector_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_connector(
    connector_id: str,
    _: User = Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    connector = await session.get(Connector, connector_id)
    if connector is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Connector not found")
    await session.delete(connector)
    await session.commit()


@router.get("/notifications", response_model=list[NotificationOut])
async def list_notifications(
    unread_only: bool = False,
    _: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Notification).order_by(Notification.created_at.desc())
    if unread_only:
        stmt = stmt.where(Notification.unread.is_(True))
    return (await session.scalars(stmt)).all()


@router.post("/notifications/{notification_id}/read", response_model=NotificationOut)
async def mark_notification_read(
    notification_id: str,
    _: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    notification = await session.get(Notification, notification_id)
    if notification is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found")
    notification.unread = False
    await session.commit()
    await session.refresh(notification)
    return notification


@router.get("/approvals", response_model=list[ApprovalOut])
async def list_approvals(
    _: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Approval).order_by(Approval.created_at.desc())
    return (await session.scalars(stmt)).all()


@router.post("/approvals/{approval_id}/{decision}", response_model=ApprovalOut)
async def decide_approval(
    approval_id: str,
    decision: str,
    _: User = Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    if decision not in {"approve", "reject"}:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Decision must be approve or reject")
    approval = await session.get(Approval, approval_id)
    if approval is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Approval not found")
    approval.status = "approved" if decision == "approve" else "rejected"
    await session.commit()
    await session.refresh(approval)
    return approval
