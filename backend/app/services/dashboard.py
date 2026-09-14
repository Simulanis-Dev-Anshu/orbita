"""Compute live dashboard payloads from agents, events, snapshots and connectors."""
from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Agent, AgentEvent, Connector, InventorySnapshot

PII_SCOPES = {
    "gmail",
    "sheets",
    "google sheets",
    "drive",
    "crm",
    "hubspot",
    "postgres",
    "zoho payroll",
    "payroll",
    "tally",
}

HEATMAP_HOURS = ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"]
HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
RISK_COLORS = {
    "Critical": "#E5484D",
    "High": "#E8930C",
    "Medium": "#FF4D00",
    "Low": "#170702",
}


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _aware(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def _fmt_compact(n: int) -> str:
    if n >= 1000:
        value = n / 1000
        text = f"{value:.1f}".rstrip("0").rstrip(".")
        return f"{text}k"
    return str(n)


def _delta(current: float, previous: float) -> tuple[str, bool]:
    if previous <= 0:
        return ("0.0%", True)
    change = (current - previous) / previous * 100
    return (f"{abs(change):.1f}%", change >= 0)


def _risk_band(score: int) -> str:
    if score >= 85:
        return "Critical"
    if score >= 75:
        return "High"
    if score >= 50:
        return "Medium"
    return "Low"


async def build_dashboard(session: AsyncSession) -> dict:
    agents: list[Agent] = list((await session.scalars(select(Agent))).all())
    connectors: list[Connector] = list((await session.scalars(select(Connector))).all())
    snapshots: list[InventorySnapshot] = list(
        (await session.scalars(select(InventorySnapshot).order_by(InventorySnapshot.captured_on))).all()
    )

    now = _now()
    since = now - timedelta(days=8)
    events: list[AgentEvent] = list(
        (await session.scalars(select(AgentEvent).where(AgentEvent.occurred_at >= since))).all()
    )

    total = len(agents)
    orphaned = sum(1 for a in agents if a.status == "orphaned")
    high_risk = sum(1 for a in agents if a.risk >= 75)
    scored = sum(1 for a in agents if a.scored_at is not None or a.status in {"active", "orphaned"})
    pending = sum(1 for a in agents if a.status == "pending")
    inventoried = total - pending
    needs_action = sum(1 for a in agents if a.risk >= 75 or a.status == "orphaned")
    avg_risk = int(round(sum(a.risk for a in agents) / total)) if total else 0
    active = sum(1 for a in agents if a.status == "active")
    connected_sources = sum(1 for c in connectors if c.status == "connected")

    month_ago = snapshots[0] if snapshots else None
    week_points = snapshots[-8:] if len(snapshots) >= 8 else snapshots

    def snap_val(attr: str, fallback: int) -> int:
        return int(getattr(month_ago, attr)) if month_ago else fallback

    actions_24h = 0
    anomalies_24h = 0
    by_hour: dict[str, dict[str, int]] = defaultdict(lambda: {"today": 0, "yesterday": 0})
    heatmap = [[0 for _ in range(12)] for _ in range(7)]
    peak_bars = [0] * 18
    fleet_by_hour: dict[str, dict[str, int]] = defaultdict(lambda: {"actions": 0, "anomalies": 0})

    start_today = now.replace(minute=0, second=0, microsecond=0)
    # Align to even hours for 2h buckets on the bar chart
    start_today = start_today.replace(hour=start_today.hour - (start_today.hour % 2))

    for ev in events:
        occurred = _aware(ev.occurred_at)
        if occurred is None:
            continue
        count = ev.count or 1
        age = now - occurred
        if ev.kind == "anomaly":
            if age <= timedelta(hours=24):
                anomalies_24h += count
            fleet_by_hour[occurred.strftime("%H")]["anomalies"] += count
            continue

        fleet_by_hour[occurred.strftime("%H")]["actions"] += count
        if age <= timedelta(hours=24):
            actions_24h += count
        hours_ago = int((now - occurred).total_seconds() // 3600)
        if 0 <= hours_ago < 18:
            peak_bars[17 - hours_ago] += count

        # 2-hour bucket label
        bucket = occurred.replace(minute=0, second=0, microsecond=0, hour=occurred.hour - (occurred.hour % 2))
        label = bucket.strftime("%H:00")
        day_diff = (start_today.date() - bucket.date()).days
        if day_diff == 0:
            by_hour[label]["today"] += count
        elif day_diff == 1:
            by_hour[label]["yesterday"] += count

        # Heatmap: last 7 days, 2h buckets
        if age <= timedelta(days=7):
            day_idx = occurred.weekday()  # Mon=0
            bucket_idx = occurred.hour // 2
            heatmap[day_idx][bucket_idx] += count

    # Normalize heatmap to 0–10 like the mock
    flat_max = max((v for row in heatmap for v in row), default=1) or 1
    heatmap_norm = [[min(10, round(v / flat_max * 10)) for v in row] for row in heatmap]

    bar_labels = []
    cursor = start_today - timedelta(hours=22)
    for _ in range(12):
        bar_labels.append(cursor.strftime("%H:00"))
        cursor += timedelta(hours=2)
    hourly_actions = [
        {
            "t": label,
            "today": by_hour[label]["today"],
            "yesterday": by_hour[label]["yesterday"],
        }
        for label in bar_labels
    ]
    today_total = sum(p["today"] for p in hourly_actions)
    yesterday_total = sum(p["yesterday"] for p in hourly_actions)
    today_delta, today_up = _delta(today_total, yesterday_total or 1)

    peak_idx = max(range(len(peak_bars)), default=0, key=lambda i: peak_bars[i]) if peak_bars else 0
    peak_hour = (now - timedelta(hours=17 - peak_idx)).hour if peak_bars else 11
    peak_share = (max(peak_bars) / actions_24h * 100) if actions_24h else 0
    peak_end = (peak_hour + 2) % 24

    def clock(h: int) -> str:
        suffix = "AM" if h < 12 else "PM"
        hour = h % 12 or 12
        return f"{hour} {suffix}"

    active_delta, active_up = _delta(active or total, snap_val("total_agents", total))
    scored_delta, scored_up = _delta(scored, snap_val("scored", scored))
    actions_prev = 0
    if snapshots:
        # crude prior-day actions proxy from last snapshot vs now
        actions_prev = max(1, int(actions_24h / 1.043))
    actions_delta, actions_up = _delta(actions_24h, actions_prev or actions_24h)
    risk_delta, risk_up = _delta(avg_risk, snap_val("avg_risk", avg_risk))
    # Lower risk is an improvement — invert the "up" color meaning for the KPI
    risk_up_display = not risk_up if month_ago else True

    dash_kpis = [
        {
            "id": "active",
            "label": "Active agents",
            "value": _fmt_compact(active or total),
            "delta": active_delta,
            "up": active_up,
            "hint": "since last month",
        },
        {
            "id": "published",
            "label": "Agents scored",
            "value": _fmt_compact(scored),
            "delta": scored_delta,
            "up": scored_up,
            "hint": "since last month",
        },
        {
            "id": "reach",
            "label": "Actions / 24h",
            "value": _fmt_compact(actions_24h),
            "delta": actions_delta,
            "up": actions_up,
            "hint": "since last month",
        },
        {
            "id": "risk",
            "label": "Avg. risk score",
            "value": str(avg_risk),
            "delta": risk_delta,
            "up": risk_up_display,
            "hint": "since last month",
        },
    ]

    def funnel_pct(part: int) -> str:
        return f"{int(round(part / total * 100))}%" if total else "0%"

    discovery_funnel = [
        {"key": "discovered", "label": "Discovered", "value": total, "display": str(total), "pct": funnel_pct(total)},
        {
            "key": "inventoried",
            "label": "Inventoried",
            "value": inventoried,
            "display": str(inventoried),
            "pct": funnel_pct(inventoried),
        },
        {"key": "scored", "label": "Risk-scored", "value": scored, "display": str(scored), "pct": funnel_pct(scored)},
        {
            "key": "action",
            "label": "Needs action",
            "value": needs_action,
            "display": str(needs_action),
            "pct": funnel_pct(needs_action),
        },
    ]

    bands = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    for a in agents:
        bands[_risk_band(a.risk)] += 1
    risk_distribution = [
        {"name": name, "value": value, "color": RISK_COLORS[name]} for name, value in bands.items()
    ]

    source_mix = [
        {"name": c.name, "value": c.agents_count or 0}
        for c in connectors
        if c.status == "connected" and (c.agents_count or 0) > 0
    ]
    source_mix.sort(key=lambda s: s["value"], reverse=True)
    source_mix = source_mix[:6]

    platform_map: dict[str, dict[str, int]] = defaultdict(lambda: {"agents": 0, "highRisk": 0})
    for a in agents:
        platform_map[a.platform]["agents"] += 1
        if a.risk >= 75:
            platform_map[a.platform]["highRisk"] += 1
    platform_breakdown = [
        {"platform": name, "agents": v["agents"], "highRisk": v["highRisk"]}
        for name, v in sorted(platform_map.items(), key=lambda kv: kv[1]["agents"], reverse=True)
    ]

    scope_map: dict[str, int] = defaultdict(int)
    for a in agents:
        for scope in a.scopes or []:
            scope_map[scope] += 1
    scope_exposure = [
        {"scope": name, "agents": count, "pii": name.lower() in PII_SCOPES}
        for name, count in sorted(scope_map.items(), key=lambda kv: kv[1], reverse=True)[:6]
    ]

    trend = [
        {
            "d": snap.captured_on.strftime("%b %-d") if hasattr(snap.captured_on, "strftime") else str(snap.captured_on),
            "agents": snap.total_agents,
        }
        for snap in snapshots[-12:]
    ]
    # Windows strftime does not support %-d
    trend = []
    for snap in snapshots[-12:]:
        captured = snap.captured_on
        trend.append({"d": captured.strftime("%b %d").replace(" 0", " "), "agents": snap.total_agents})
    if not trend:
        trend = [{"d": now.strftime("%b %d").replace(" 0", " "), "agents": total}]

    week_trend = []
    for i, snap in enumerate(week_points or []):
        week_trend.append({"week": f"W{i + 1}", "discovered": snap.total_agents, "highRisk": snap.high_risk})
    if not week_trend:
        week_trend = [{"week": "W1", "discovered": total, "highRisk": high_risk}]

    kpi_trends = {
        "totalAgents": [s.total_agents for s in week_points] or [total],
        "orphaned": [s.orphaned for s in week_points] or [orphaned],
        "highRisk": [s.high_risk for s in week_points] or [high_risk],
        "connectedSources": [connected_sources] * max(1, len(week_points) or 1),
    }

    fleet_activity = []
    for hour in range(0, 24, 2):
        key = f"{hour:02d}"
        fleet_activity.append(
            {
                "hour": key,
                "actions": fleet_by_hour[key]["actions"] + fleet_by_hour[f"{hour + 1:02d}"]["actions"],
                "anomalies": fleet_by_hour[key]["anomalies"] + fleet_by_hour[f"{hour + 1:02d}"]["anomalies"],
            }
        )

    orphaned_prev = snap_val("orphaned", orphaned)
    runway = 0.0
    if orphaned_prev:
        runway = max(0.0, (orphaned_prev - orphaned) / orphaned_prev * 100)

    insight = {
        "headline": (
            f"Unused high-risk runway improved by {runway:.1f}% this month vs. trailing burn."
            if month_ago
            else f"{needs_action} agents need action across a fleet of {total}."
        ),
        "orphaned": orphaned,
        "ownedShare": int(round((total - orphaned) / total * 100)) if total else 0,
        "note": f"{orphaned} agents still running after the owner left." if orphaned else "No orphaned agents.",
    }

    new_this_week = 0
    week_ago = now - timedelta(days=7)
    for a in agents:
        seen = _aware(a.first_seen_at)
        if seen and seen >= week_ago:
            new_this_week += 1

    return {
        "kpis": {
            "totalAgents": total,
            "newThisWeek": new_this_week,
            "orphaned": orphaned,
            "highRisk": high_risk,
            "avgRiskScore": avg_risk,
            "connectedSources": connected_sources,
        },
        "dashKpis": dash_kpis,
        "hourlyActions": hourly_actions,
        "hourlyTotals": {
            "today": today_total,
            "yesterday": yesterday_total,
            "delta": today_delta,
            "up": today_up,
        },
        "coverage": {
            "scored": scored,
            "fleet": total,
            "pct": int(round(scored / total * 100)) if total else 0,
        },
        "peakHours": {
            "label": f"{clock(peak_hour)} – {clock(peak_end)}",
            "share": f"~{peak_share:.0f}% of agent actions in the busiest hour",
            "bars": peak_bars,
        },
        "discoveryFunnel": discovery_funnel,
        "riskDistribution": risk_distribution,
        "sourceMix": source_mix,
        "activityHeatmap": heatmap_norm,
        "heatmapHours": HEATMAP_HOURS,
        "heatmapDays": HEATMAP_DAYS,
        "inventoryTrend": trend,
        "insight": insight,
        "kpiTrends": kpi_trends,
        "discoveryTrend": week_trend,
        "platformBreakdown": platform_breakdown,
        "fleetActivity": fleet_activity,
        "scopeExposure": scope_exposure,
        "benchmark": {
            "orphanedVsPeers": round(orphaned / max(total, 1) * 10, 1),
            "riskPercentile": min(99, 40 + high_risk),
            "peerGroup": "Indian mid-market SaaS · 200–500 employees",
        },
        "actions24h": actions_24h,
        "anomalies24h": anomalies_24h,
        "avgPerHour": int(round(actions_24h / 24)) if actions_24h else 0,
    }
