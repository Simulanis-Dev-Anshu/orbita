from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user, require_role
from app.db.models import User
from app.schemas import (
    ComplianceOverviewOut,
    DashboardMetricsOut,
    SettingsOverviewOut,
    TeamMemberOut,
    TeamRolePatchIn,
)
from app.services.dashboard import build_dashboard

router = APIRouter(tags=["insights"])


@router.get("/dashboard/metrics", response_model=DashboardMetricsOut)
async def dashboard_metrics(_: User = Depends(get_current_user)):
    return await build_dashboard()


@router.get("/compliance/overview", response_model=ComplianceOverviewOut)
async def compliance_overview(
    _: User = Depends(get_current_user),
):
    return {
        "complianceFrameworks": [
            {
                "id": "dpdp",
                "name": "DPDP Act 2023",
                "region": "India",
                "progress": 78,
                "controls": {"passed": 25, "total": 32},
                "note": "Breach-notice pipeline ready · 2 transfer gaps",
            },
            {
                "id": "soc2",
                "name": "SOC 2 Type II",
                "region": "US / Global",
                "progress": 64,
                "controls": {"passed": 41, "total": 64},
                "note": "Agent inventory mapped to CC6 access controls",
            },
            {
                "id": "iso",
                "name": "ISO 27001",
                "region": "Global",
                "progress": 71,
                "controls": {"passed": 66, "total": 93},
                "note": "Annex A.8 asset registry auto-generated",
            },
            {
                "id": "euai",
                "name": "EU AI Act",
                "region": "EU",
                "progress": 42,
                "controls": {"passed": 13, "total": 31},
                "note": "Risk-tier classification in progress",
            },
        ],
        "dpdpChecklist": [
            {
                "id": "dp-1",
                "label": "72-hour breach notification pipeline",
                "status": "pass",
                "detail": "Alert routing to DPO configured",
            },
            {
                "id": "dp-2",
                "label": "12-month audit log retention",
                "status": "pass",
                "detail": "Immutable log store · 347 days retained",
            },
            {
                "id": "dp-3",
                "label": "Register of AI data processors",
                "status": "pass",
                "detail": "Auto-generated from agent inventory",
            },
            {
                "id": "dp-4",
                "label": "Cross-border transfer inventory",
                "status": "warn",
                "detail": "2 agents send PII to US LLM endpoints",
            },
            {
                "id": "dp-5",
                "label": "Consent-purpose mapping for agents",
                "status": "fail",
                "detail": "4 agents access consented data for new purposes",
            },
        ],
        "complianceTrend": [
            {"month": "Feb", "dpdp": 48, "soc2": 38, "iso": 50, "euai": 12},
            {"month": "Mar", "dpdp": 55, "soc2": 42, "iso": 54, "euai": 18},
            {"month": "Apr", "dpdp": 61, "soc2": 47, "iso": 58, "euai": 24},
            {"month": "May", "dpdp": 67, "soc2": 53, "iso": 63, "euai": 30},
            {"month": "Jun", "dpdp": 73, "soc2": 58, "iso": 67, "euai": 36},
            {"month": "Jul", "dpdp": 78, "soc2": 64, "iso": 71, "euai": 42},
        ],
        "auditCalendar": [
            {"id": "ac-1", "name": "EU AI Act GPAI obligations apply", "date": "Aug 2, 2026", "days": 25},
            {"id": "ac-2", "name": "SOC 2 Type II observation window closes", "date": "Aug 15, 2026", "days": 38},
            {"id": "ac-3", "name": "DPDP quarterly processor register due", "date": "Sep 30, 2026", "days": 84},
            {"id": "ac-4", "name": "ISO 27001 surveillance audit", "date": "Oct 12, 2026", "days": 96},
        ],
    }


@router.get("/settings/overview", response_model=SettingsOverviewOut)
async def settings_overview(
    _: User = Depends(get_current_user),
):
    return {
        "workspace": {
            "companyName": "Zintellix",
            "dataResidency": "India, AWS Mumbai (DPDP-aligned)",
        },
        "teamMembers": [
            {
                "id": "tm-1",
                "name": "Prabhhav",
                "email": "prabhhav@zintellix.com",
                "role": "Owner",
                "status": "active",
            },
            {
                "id": "tm-2",
                "name": "Riya Sharma",
                "email": "riya@zintellix.com",
                "role": "Security Admin",
                "status": "active",
            },
            {
                "id": "tm-3",
                "name": "Dev Patel",
                "email": "dev@zintellix.com",
                "role": "Viewer",
                "status": "invited",
            },
        ],
        "plans": [
            {
                "id": "starter",
                "name": "Starter",
                "priceInr": "₹40,000",
                "priceUsd": "$1,500",
                "period": "/mo",
                "features": [
                    "Up to 100 agents",
                    "5 connectors",
                    "Weekly discovery scans",
                    "Email alerts",
                    "DPDP starter report",
                ],
                "current": False,
            },
            {
                "id": "growth",
                "name": "Growth",
                "priceInr": "₹80,000",
                "priceUsd": "$3,000",
                "period": "/mo",
                "features": [
                    "Unlimited agents",
                    "All connectors",
                    "Continuous monitoring",
                    "Kill switch + approvals",
                    "All compliance packs",
                    "Peer benchmarks",
                ],
                "current": True,
            },
            {
                "id": "enterprise",
                "name": "Enterprise",
                "priceInr": "Custom",
                "priceUsd": "Custom",
                "period": "",
                "features": [
                    "Self-hosted / data residency",
                    "Keycloak SSO",
                    "Custom connectors",
                    "Dedicated CSM",
                    "Auditor workspace",
                ],
                "current": False,
            },
        ],
    }


@router.get("/settings/team", response_model=list[TeamMemberOut])
async def list_team_members(_: User = Depends(get_current_user)):
    return [
        {"id": "tm-1", "name": "Prabhhav", "email": "prabhhav@zintellix.com", "role": "Owner", "status": "active"},
        {"id": "tm-2", "name": "Riya Sharma", "email": "riya@zintellix.com", "role": "Security Admin", "status": "active"},
        {"id": "tm-3", "name": "Dev Patel", "email": "dev@zintellix.com", "role": "Viewer", "status": "invited"},
    ]


@router.patch("/settings/team/{member_id}", response_model=TeamMemberOut)
async def update_team_member_role(
    member_id: str,
    body: TeamRolePatchIn,
    _: User = Depends(require_role("admin")),
):
    # MVP: role patch accepted and echoed; persistence can move to dedicated table later.
    baseline = {
        "tm-1": {"name": "Prabhhav", "email": "prabhhav@zintellix.com", "status": "active"},
        "tm-2": {"name": "Riya Sharma", "email": "riya@zintellix.com", "status": "active"},
        "tm-3": {"name": "Dev Patel", "email": "dev@zintellix.com", "status": "invited"},
    }
    item = baseline.get(member_id)
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Team member not found")
    return {"id": member_id, "name": item["name"], "email": item["email"], "role": body.role, "status": item["status"]}


@router.get("/copilot/signals")
async def copilot_signals(_: User = Depends(get_current_user)):
    return [
        {"id": "cs-1", "label": "OAuth grants watched", "value": "312", "trend": "+9 today"},
        {"id": "cs-2", "label": "DNS egress events / hr", "value": "1.4k", "trend": "normal"},
        {"id": "cs-3", "label": "Behavioral classifications", "value": "147", "trend": "3 flagged"},
        {"id": "cs-4", "label": "Policy checks tonight", "value": "96", "trend": "2 failed"},
    ]


@router.get("/copilot/suggestions")
async def copilot_suggestions(_: User = Depends(get_current_user)):
    return [
        "Which agents can access customer PII?",
        "Show orphaned agents from the last 30 days",
        "Draft the DPDP compliance summary",
    ]


@router.get("/connectors/source-health")
async def source_health(_: User = Depends(get_current_user)):
    return [
        {"name": "Google Workspace", "status": "healthy", "lastSync": "2 min ago"},
        {"name": "Slack", "status": "healthy", "lastSync": "4 min ago"},
        {"name": "GitHub", "status": "healthy", "lastSync": "9 min ago"},
        {"name": "Microsoft 365", "status": "degraded", "lastSync": "43 min ago"},
    ]
