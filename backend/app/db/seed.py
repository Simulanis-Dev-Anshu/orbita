"""Demo workspace seed: mirrors the frontend mock data so the dashboard
lights up on first boot. Runs only when the users table is empty and
SEED_DEMO_DATA is true.

Demo login: prabhhav@zintellix.com / orbita-demo-123
"""
from datetime import date, datetime, timedelta, timezone
from random import Random

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.db.models import Agent, AgentEvent, Alert, Approval, Connector, InventorySnapshot, Notification, User
from app.domain.asset import infer_asset_type, infer_vendor


def _ago(**kwargs) -> datetime:
    return datetime.now(timezone.utc) - timedelta(**kwargs)


AGENTS = [
    ("Zapier Invoice Bot", "Zapier", "Riya Sharma", "Finance Ops", ["Gmail", "Sheets", "Tally"], 87, "orphaned", _ago(minutes=2)),
    ("Sales Outreach GPT", "Custom GPT", "Arjun Mehta", "Sales Lead", ["HubSpot", "Gmail"], 74, "active", _ago(minutes=11)),
    ("HR Onboarding Flow", "n8n", "Priya Nair", "HR Manager", ["Slack", "Notion", "Drive"], 58, "active", _ago(minutes=34)),
    ("Claude Support Triage", "Claude", "Kabir Singh", "Support Head", ["Zendesk", "Slack"], 41, "active", _ago(hours=1)),
    ("Payroll Sync Agent", "Make", "Unassigned", "-", ["Zoho Payroll", "Sheets", "Gmail"], 92, "orphaned", _ago(hours=3)),
    ("GitHub PR Reviewer", "GitHub App", "Dev Patel", "Eng Manager", ["GitHub"], 22, "active", _ago(hours=5)),
    ("Marketing Content Bot", "Zapier", "Sneha Rao", "Marketing", ["Notion", "Buffer", "Drive"], 49, "pending", _ago(days=1)),
    ("Customer Data Enricher", "n8n", "Unassigned", "-", ["CRM", "Clearbit", "Postgres"], 81, "orphaned", _ago(days=2)),
    ("Meeting Notes Summarizer", "Custom GPT", "Ananya Iyer", "Chief of Staff", ["Meet", "Docs"], 33, "active", _ago(days=2)),
    ("Postgres MCP Server", "MCP", "Dev Patel", "Eng Manager", ["Postgres", "Claude Desktop"], 71, "active", _ago(minutes=18)),
    ("Inventory Reorder Agent", "Make", "Rohan Gupta", "Ops Manager", ["Zoho Inventory", "Gmail"], 66, "pending", _ago(days=3)),
    ("ChatGPT", "ChatGPT", "Anshu Nishad", "Founder", ["Web", "Memory"], 28, "active", _ago(minutes=4)),
    ("ChatGPT", "ChatGPT", "Riya Sharma", "Finance Ops", ["Web"], 31, "active", _ago(minutes=22)),
    ("Claude", "Claude", "Dev Patel", "Eng Manager", ["Web", "Projects"], 24, "active", _ago(minutes=9)),
    ("Microsoft Copilot", "Copilot", "Priya Nair", "HR Manager", ["Workspace"], 36, "active", _ago(hours=1)),
    ("Cursor", "Cursor", "Anshu Nishad", "Founder", ["Editor"], 44, "active", _ago(minutes=1)),
    ("Perplexity", "Perplexity", "Kabir Singh", "Support Head", ["Web"], 19, "active", _ago(hours=3)),
    ("ChatGPT for Chrome", "Browser extension", "Arjun Mehta", "Sales Lead", ["Active tab"], 52, "active", _ago(minutes=40)),
    ("GitHub Copilot", "Copilot", "Dev Patel", "Eng Manager", ["Workspace"], 48, "active", _ago(minutes=8)),
]

ALERTS = [
    ("Permission drift", "critical", "Payroll Sync Agent", "Scope expanded from payroll.read to payroll.rw without approval", False, _ago(minutes=12)),
    ("Orphaned agent", "critical", "Customer Data Enricher", "Owner account deactivated in Google Workspace, agent still executing", False, _ago(hours=1)),
    ("New agent detected", "high", "Unknown Zapier workflow", "New OAuth grant on rohan@ credentials · touches Sheets + Gmail", False, _ago(hours=3)),
    ("LLM egress", "high", "Sales Outreach GPT", "First-seen DNS egress to api.openai.com from finance subnet", False, _ago(hours=5)),
    ("Machine-speed anomaly", "medium", "HR Onboarding Flow", "Behavioral classifier: 03:00 IST activity spike, 98% machine confidence", False, _ago(days=1)),
    ("Stale credential", "medium", "Zapier Invoice Bot", "OAuth grant not rotated in 240 days", True, _ago(days=1)),
    ("New agent detected", "low", "Meeting Notes Summarizer", "Registered via approval workflow, auto-approved by policy", True, _ago(days=2)),
]

CONNECTORS = [
    ("Google Workspace", "Identity & OAuth", "connected", 61, _ago(minutes=2)),
    ("Microsoft 365", "Identity & OAuth", "connected", 34, _ago(minutes=43)),
    ("Okta", "Identity & OAuth", "available", 0, None),
    ("Slack", "Collaboration", "connected", 18, _ago(minutes=4)),
    ("Notion", "Collaboration", "connected", 9, _ago(minutes=12)),
    ("Zoho One", "Collaboration", "connected", 11, _ago(minutes=8)),
    ("Freshworks", "Collaboration", "available", 0, None),
    ("GitHub", "Engineering", "connected", 8, _ago(minutes=9)),
    ("Zapier", "Automation", "connected", 4, _ago(minutes=6)),
    ("Make", "Automation", "connected", 2, _ago(minutes=31)),
    ("n8n (self-hosted)", "Automation", "available", 0, None),
    ("DNS Egress Sensor", "Network", "connected", 0, _ago(minutes=1)),
    ("MCP Server Scanner", "Network", "connected", 6, _ago(minutes=5)),
]

NOTIFICATIONS = [
    ("Permission drift detected", "Payroll Sync Agent expanded to payroll.rw without approval", "critical", True, _ago(minutes=12)),
    ("Orphaned agent still executing", "Customer Data Enricher owner was deactivated in Workspace", "critical", True, _ago(hours=1)),
    ("New agent discovered", "Unknown Zapier workflow on rohan@ credentials", "high", True, _ago(hours=3)),
    ("Weekly scan completed", "147 agents inventoried · 12 new since last week", "info", False, _ago(days=1)),
]

APPROVALS = [
    ("Payroll Sync Agent", "Requests write access to Zoho Payroll", "critical"),
    ("Customer Data Enricher", "New agent found on employee credentials", "high"),
    ("Marketing Content Bot", "Scope expanded: Drive read → read/write", "medium"),
]


EXTRA_PLATFORMS = [
    ("Zapier", ["Gmail", "Sheets"], 18),
    ("n8n", ["Slack", "Notion"], 16),
    ("Make", ["Gmail", "HubSpot"], 14),
    ("Custom GPT", ["Gmail"], 20),
    ("Claude", ["Drive"], 10),
    ("MCP", ["Postgres"], 12),
    ("GitHub App", ["GitHub"], 8),
    ("ChatGPT", ["Web"], 22),
    ("Copilot", ["Workspace"], 10),
    ("Cursor", ["Editor"], 8),
]


def _hour_weight(hour: int) -> float:
    if 9 <= hour <= 16:
        return 1.45
    if 7 <= hour <= 18:
        return 1.0
    if hour in (11, 12, 13):
        return 1.7
    return 0.42


async def _seed_named_agents(session: AsyncSession) -> None:
    for name, platform, owner, owner_role, scopes, risk, status, last_active in AGENTS:
        scored = last_active - timedelta(days=3) if status != "pending" else None
        session.add(
            Agent(
                name=name,
                platform=platform,
                owner_name=owner,
                owner_role=owner_role,
                scopes=scopes,
                risk=risk,
                status=status,
                source="scan",
                first_seen_at=last_active - timedelta(days=14),
                last_active_at=last_active,
                scored_at=scored,
                asset_type=infer_asset_type(platform),
                vendor=infer_vendor(platform),
                connections=scopes,
                data_access=scopes,
            )
        )


async def _seed_extra_agents(session: AsyncSession, rng: Random) -> None:
    owners = [
        ("Riya Sharma", "Finance Ops"),
        ("Arjun Mehta", "Sales Lead"),
        ("Priya Nair", "HR Manager"),
        ("Dev Patel", "Eng Manager"),
        ("Kabir Singh", "Support Head"),
        ("Unassigned", "-"),
        ("Sneha Rao", "Marketing"),
        ("Anshu Nishad", "Founder"),
    ]
    for i in range(128):
        platform, scopes, base_risk = EXTRA_PLATFORMS[i % len(EXTRA_PLATFORMS)]
        owner, role = owners[i % len(owners)]
        risk = max(12, min(96, base_risk + rng.randint(-12, 28)))
        if owner == "Unassigned":
            status = "orphaned"
            risk = min(96, risk + 20)
        elif risk >= 70 and rng.random() < 0.2:
            status = "pending"
        else:
            status = "active"
        last_active = _ago(hours=rng.randint(1, 240))
        session.add(
            Agent(
                name=f"{platform} worker {i + 1:03d}",
                platform=platform,
                owner_name=owner,
                owner_role=role,
                scopes=list(scopes),
                risk=risk,
                status=status,
                source="scan",
                first_seen_at=last_active - timedelta(days=rng.randint(4, 40)),
                last_active_at=last_active,
                scored_at=None if status == "pending" else last_active - timedelta(days=rng.randint(0, 10)),
                asset_type=infer_asset_type(platform),
                vendor=infer_vendor(platform),
                connections=list(scopes),
                data_access=list(scopes),
            )
        )


async def seed_telemetry(session: AsyncSession) -> bool:
    """Fill events + snapshots when those tables are empty (safe to call on every boot)."""
    event_count = (await session.execute(select(func.count()).select_from(AgentEvent))).scalar_one()
    if event_count:
        return False

    agents = list((await session.scalars(select(Agent))).all())
    total = len(agents) or 1
    orphaned = sum(1 for a in agents if a.status == "orphaned")
    high_risk = sum(1 for a in agents if a.risk >= 75)
    scored = sum(1 for a in agents if a.scored_at is not None)
    avg_risk = int(round(sum(a.risk for a in agents) / total)) if agents else 0

    rng = Random(42)
    now = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
    for hours_ago in range(8 * 24):
        occurred = now - timedelta(hours=hours_ago)
        weight = _hour_weight(occurred.hour)
        weekend = 0.55 if occurred.weekday() >= 5 else 1.0
        actions = max(4, int(28 * weight * weekend + rng.randint(-6, 10)))
        anomalies = max(0, int(rng.random() * 4 * weight))
        session.add(AgentEvent(occurred_at=occurred, kind="action", count=actions))
        if anomalies:
            session.add(AgentEvent(occurred_at=occurred, kind="anomaly", count=anomalies))

    today = date.today()
    for days_ago in range(30, -1, -1):
        captured = today - timedelta(days=days_ago)
        progress = (30 - days_ago) / 30
        session.add(
            InventorySnapshot(
                captured_on=captured,
                total_agents=max(90, int(90 + (total - 90) * progress)),
                orphaned=max(3, int(orphaned + (1 - progress) * 4)),
                high_risk=max(10, int(high_risk - (1 - progress) * 6)),
                avg_risk=max(40, int(avg_risk + (1 - progress) * 8)),
                scored=max(70, int(70 + (scored - 70) * progress)),
            )
        )

    await session.commit()
    return True


async def seed_if_empty(session: AsyncSession) -> bool:
    count = (await session.execute(select(func.count()).select_from(User))).scalar_one()
    if count:
        await seed_telemetry(session)
        return False

    rng = Random(42)
    session.add(
        User(
            email="prabhhav@zintellix.com",
            name="Prabhhav",
            hashed_password=hash_password("orbita-demo-123"),
            role="owner",
        )
    )
    await _seed_named_agents(session)
    await _seed_extra_agents(session, rng)
    for type_, severity, agent_name, detail, resolved, created in ALERTS:
        session.add(
            Alert(
                type=type_,
                severity=severity,
                agent_name=agent_name,
                detail=detail,
                resolved=resolved,
                created_at=created,
            )
        )
    for name, category, status, agents_count, last_sync in CONNECTORS:
        session.add(
            Connector(
                name=name,
                category=category,
                status=status,
                agents_count=agents_count,
                last_sync_at=last_sync,
            )
        )
    for title, detail, severity, unread, created in NOTIFICATIONS:
        session.add(
            Notification(
                title=title,
                detail=detail,
                severity=severity,
                unread=unread,
                created_at=created,
            )
        )
    for title, detail, risk in APPROVALS:
        session.add(Approval(title=title, detail=detail, risk=risk))

    await session.commit()
    await seed_telemetry(session)
    return True
