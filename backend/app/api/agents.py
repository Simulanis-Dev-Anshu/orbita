from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_role
from app.db.base import get_session
from app.db.models import Agent, Notification, User
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
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Agent).order_by(Agent.risk.desc())
    if q:
        pattern = f"%{q.lower()}%"
        stmt = stmt.where(
            Agent.name.ilike(pattern) | Agent.owner_name.ilike(pattern) | Agent.platform.ilike(pattern)
        )
    if status_filter:
        stmt = stmt.where(Agent.status == status_filter)
    if min_risk is not None:
        stmt = stmt.where(Agent.risk >= min_risk)
    return (await session.scalars(stmt)).all()


@router.post("", response_model=AgentOut, status_code=status.HTTP_201_CREATED)
async def create_agent(
    body: AgentIn,
    user: User = Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    risk = body.risk if body.risk is not None else score_agent(
        body.platform, body.scopes, body.owner_name, body.status
    )
    orphaned = body.owner_name.strip().lower() in ("", "unassigned")
    agent = Agent(
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
    session.add(agent)
    session.add(
        Notification(
            title="Agent registered manually",
            detail=f"{body.name} ({body.platform}) added by {user.name} · risk {risk}",
            severity="high" if risk >= 75 else "info",
        )
    )
    await session.commit()
    await session.refresh(agent)
    return agent


@router.get("/{agent_id}", response_model=AgentOut)
async def get_agent(
    agent_id: str,
    _: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    agent = await session.get(Agent, agent_id)
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Agent not found")
    return agent


@router.patch("/{agent_id}", response_model=AgentOut)
async def update_agent(
    agent_id: str,
    body: AgentPatch,
    _: User = Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    agent = await session.get(Agent, agent_id)
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Agent not found")

    changes = body.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(agent, field, value)

    # Re-score when the inputs to the score change and no explicit score given
    if "risk" not in changes and changes.keys() & {"scopes", "owner_name", "status", "platform"}:
        agent.risk = score_agent(agent.platform, agent.scopes, agent.owner_name, agent.status)

    agent.last_active_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(agent)
    return agent


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(
    agent_id: str,
    _: User = Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    agent = await session.get(Agent, agent_id)
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Agent not found")
    await session.delete(agent)
    await session.commit()


@router.post("/{agent_id}/revoke", response_model=AgentOut)
async def revoke_access(
    agent_id: str,
    user: User = Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Kill switch: strip scopes and mark the agent revoked."""
    agent = await session.get(Agent, agent_id)
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Agent not found")
    agent.scopes = []
    agent.status = "pending"
    agent.risk = 0
    session.add(
        Notification(
            title="Access revoked",
            detail=f"All grants for {agent.name} were revoked by {user.name}",
            severity="info",
        )
    )
    await session.commit()
    await session.refresh(agent)
    return agent
