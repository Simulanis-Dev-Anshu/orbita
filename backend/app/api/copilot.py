from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.db.base import get_session
from app.db.models import Agent, Alert, User
from app.schemas import ChatIn, ChatOut

router = APIRouter(prefix="/copilot", tags=["copilot"])


@router.post("/chat", response_model=ChatOut)
async def chat(
    body: ChatIn,
    _: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """MVP copilot responder grounded in live DB state.

    This is intentionally deterministic now; replace with a real LLM + RAG flow later.
    """
    text = body.message.lower()

    if "orphan" in text:
        orphaned = (
            await session.scalars(select(Agent).where(Agent.status == "orphaned").order_by(Agent.risk.desc()))
        ).all()
        if not orphaned:
            return ChatOut(reply="No orphaned agents found in this workspace.")
        names = ", ".join(f"{a.name} ({a.risk})" for a in orphaned[:5])
        return ChatOut(reply=f"Found {len(orphaned)} orphaned agents. Highest risk: {names}.")

    if "pii" in text or "customer" in text or "sensitive" in text:
        risky = (await session.scalars(select(Agent).where(Agent.risk >= 75).order_by(Agent.risk.desc()))).all()
        names = ", ".join(a.name for a in risky[:5]) or "none"
        return ChatOut(reply=f"Agents likely touching sensitive data (risk >= 75): {names}.")

    if "alert" in text:
        open_alerts = (
            await session.scalars(select(Alert).where(Alert.resolved.is_(False)).order_by(Alert.created_at.desc()))
        ).all()
        if not open_alerts:
            return ChatOut(reply="No open alerts right now.")
        return ChatOut(reply=f"There are {len(open_alerts)} open alerts. Latest: {open_alerts[0].detail}")

    return ChatOut(
        reply=(
            "I can help with orphaned agents, sensitive-scope exposure, and open alerts. "
            "Try: 'show orphaned agents' or 'which agents can access customer PII?'."
        )
    )
