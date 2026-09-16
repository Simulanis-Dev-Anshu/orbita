from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps import get_current_user, require_role
from app.db import mongo as db
from app.db.models import User, make_agent, make_notification
from app.domain.asset import infer_asset_type, infer_vendor
from app.schemas import AgentIn, AgentOut, AgentPatch
from app.services.risk import score_agent

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("", response_model=List[AgentOut])
async def list_agents(
    q: Optional[str] = None,
    status_filter: Optional[str] = Query(default=None, alias="status"),
    min_risk: Optional[int] = None,
    _: User = Depends(get_current_user),
):
    query: dict = {}
    if q:
        rx = {"$regex": q, "$options": "i"}
        query["$or"] = [{"name": rx}, {"owner_name": rx}, {"platform": rx}]
    if status_filter:
        query["status"] = status_filter
    if min_risk is not None:
        query["risk"] = {"$gte": min_risk}
    return await db.find_many("agents", query, sort=[("risk", -1)])


@router.post("", response_model=AgentOut, status_code=status.HTTP_201_CREATED)
async def create_agent(
    body: AgentIn,
    user: User = Depends(require_role("admin")),
):
    risk = body.risk if body.risk is not None else score_agent(
        body.platform, body.scopes, body.owner_name, body.status
    )
    orphaned = body.owner_name.strip().lower() in ("", "unassigned")
    agent = make_agent(
        name=body.name,
        platform=body.platform,
        owner_name=body.owner_name or "Unassigned",
        owner_role=body.owner_role or "-",
        scopes=body.scopes,
        risk=risk,
        status="orphaned" if orphaned else body.status,
        created_by=user.id,
        asset_type=body.asset_type or infer_asset_type(body.platform),
        vendor=body.vendor or infer_vendor(body.platform),
        device=body.device or "",
        connections=body.connections or body.scopes,
        data_access=body.data_access or body.scopes,
    )
    await db.insert("agents", agent)
    await db.insert(
        "notifications",
        make_notification(
            title="Agent registered manually",
            detail=f"{body.name} ({body.platform}) added by {user.name} · risk {risk}",
            severity="high" if risk >= 75 else "info",
        ),
    )
    return agent


@router.get("/{agent_id}", response_model=AgentOut)
async def get_agent(
    agent_id: str,
    _: User = Depends(get_current_user),
):
    agent = await db.find_id("agents", agent_id)
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Agent not found")
    return agent


@router.patch("/{agent_id}", response_model=AgentOut)
async def update_agent(
    agent_id: str,
    body: AgentPatch,
    _: User = Depends(require_role("admin")),
):
    agent = await db.find_id("agents", agent_id)
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Agent not found")

    changes = body.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(agent, field, value)

    if "risk" not in changes and changes.keys() & {"scopes", "owner_name", "status", "platform"}:
        agent.risk = score_agent(agent.platform, agent.scopes, agent.owner_name, agent.status)

    agent.last_active_at = datetime.now(timezone.utc)
    await db.save("agents", agent)
    return agent


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(
    agent_id: str,
    _: User = Depends(require_role("admin")),
):
    agent = await db.find_id("agents", agent_id)
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Agent not found")
    await db.delete_id("agents", agent_id)


@router.post("/{agent_id}/revoke", response_model=AgentOut)
async def revoke_access(
    agent_id: str,
    user: User = Depends(require_role("admin")),
):
    """Kill switch: strip scopes and mark the agent revoked."""
    agent = await db.find_id("agents", agent_id)
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Agent not found")
    agent.scopes = []
    agent.status = "pending"
    agent.risk = 0
    await db.save("agents", agent)
    await db.insert(
        "notifications",
        make_notification(
            title="Access revoked",
            detail=f"All grants for {agent.name} were revoked by {user.name}",
            severity="info",
        ),
    )
    return agent
