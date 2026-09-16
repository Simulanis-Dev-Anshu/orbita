from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from app.api.deps import get_current_user, require_role
from app.db import mongo as db
from app.db.models import User, make_connector
from app.schemas import AlertOut, ApprovalOut, ConnectorOut, ConnectorRegisterIn, NotificationOut

router = APIRouter(tags=["telemetry"])


@router.get("/dashboard/summary")
async def dashboard_summary(_: User = Depends(get_current_user)):
    return {
        "total_agents": await db.count("agents"),
        "orphaned_agents": await db.count("agents", {"status": "orphaned"}),
        "high_risk_agents": await db.count("agents", {"risk": {"$gte": 75}}),
        "unresolved_alerts": await db.count("alerts", {"resolved": False}),
    }


@router.get("/alerts", response_model=list[AlertOut])
async def list_alerts(
    severity: str | None = None,
    resolved: bool | None = None,
    _: User = Depends(get_current_user),
):
    query: dict = {}
    if severity:
        query["severity"] = severity
    if resolved is not None:
        query["resolved"] = resolved
    return await db.find_many("alerts", query, sort=[("created_at", -1)])


@router.post("/alerts/{alert_id}/resolve", response_model=AlertOut)
async def resolve_alert(
    alert_id: str,
    _: User = Depends(require_role("admin")),
):
    alert = await db.find_id("alerts", alert_id)
    if alert is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alert not found")
    alert.resolved = True
    await db.save("alerts", alert)
    return alert


@router.get("/connectors", response_model=list[ConnectorOut])
async def list_connectors(_: User = Depends(get_current_user)):
    return await db.find_many("connectors", sort=[("status", 1), ("name", 1)])


@router.post("/connectors/{connector_id}/toggle", response_model=ConnectorOut)
async def toggle_connector(
    connector_id: str,
    _: User = Depends(require_role("admin")),
):
    connector = await db.find_id("connectors", connector_id)
    if connector is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Connector not found")
    connector.status = "available" if connector.status == "connected" else "connected"
    connector.last_sync_at = datetime.now(timezone.utc) if connector.status == "connected" else None
    await db.save("connectors", connector)
    return connector


@router.post("/connectors/register", response_model=ConnectorOut, status_code=status.HTTP_201_CREATED)
async def register_connector(
    body: ConnectorRegisterIn,
    _: User = Depends(require_role("admin")),
):
    connector = make_connector(
        name=body.name.strip(),
        category=body.category,
        status="connected",
        agents_count=0,
        last_sync_at=datetime.now(timezone.utc),
    )
    try:
        await db.insert("connectors", connector)
    except DuplicateKeyError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, "Connector with this name already exists") from exc
    return connector


@router.delete("/connectors/{connector_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_connector(
    connector_id: str,
    _: User = Depends(require_role("admin")),
):
    connector = await db.find_id("connectors", connector_id)
    if connector is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Connector not found")
    await db.delete_id("connectors", connector_id)


@router.get("/notifications", response_model=list[NotificationOut])
async def list_notifications(
    unread_only: bool = False,
    _: User = Depends(get_current_user),
):
    query = {"unread": True} if unread_only else {}
    return await db.find_many("notifications", query, sort=[("created_at", -1)])


@router.post("/notifications/{notification_id}/read", response_model=NotificationOut)
async def mark_notification_read(
    notification_id: str,
    _: User = Depends(get_current_user),
):
    notification = await db.find_id("notifications", notification_id)
    if notification is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found")
    notification.unread = False
    await db.save("notifications", notification)
    return notification


@router.get("/approvals", response_model=list[ApprovalOut])
async def list_approvals(_: User = Depends(get_current_user)):
    return await db.find_many("approvals", sort=[("created_at", -1)])


@router.post("/approvals/{approval_id}/{decision}", response_model=ApprovalOut)
async def decide_approval(
    approval_id: str,
    decision: str,
    _: User = Depends(require_role("admin")),
):
    if decision not in {"approve", "reject"}:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Decision must be approve or reject")
    approval = await db.find_id("approvals", approval_id)
    if approval is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Approval not found")
    approval.status = "approved" if decision == "approve" else "rejected"
    await db.save("approvals", approval)
    return approval
