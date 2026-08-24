from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

# ---------- Auth ----------


class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=120)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class RefreshIn(BaseModel):
    refresh_token: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    name: str
    role: str
    created_at: datetime


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Agents ----------


class AgentIn(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    platform: str = "Other"
    owner_name: str = "Unassigned"
    owner_role: str = "—"
    scopes: List[str] = []
    risk: Optional[int] = Field(default=None, ge=0, le=100)
    status: str = "pending"
    asset_type: Optional[str] = None
    vendor: Optional[str] = None
    device: str = ""
    connections: List[str] = []
    data_access: List[str] = []


class AgentPatch(BaseModel):
    name: Optional[str] = None
    platform: Optional[str] = None
    owner_name: Optional[str] = None
    owner_role: Optional[str] = None
    scopes: Optional[List[str]] = None
    risk: Optional[int] = Field(default=None, ge=0, le=100)
    status: Optional[str] = None
    asset_type: Optional[str] = None
    vendor: Optional[str] = None
    device: Optional[str] = None
    connections: Optional[List[str]] = None
    data_access: Optional[List[str]] = None


class AgentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    platform: str
    owner_name: str
    owner_role: str
    scopes: List[str]
    risk: int
    status: str
    source: str
    first_seen_at: datetime
    last_active_at: datetime
    asset_type: str = "AI_AGENT"
    vendor: str = ""
    device: str = ""
    connections: List[str] = []
    data_access: List[str] = []


# ---------- Alerts / notifications / approvals ----------


class AlertOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    type: str
    severity: str
    agent_name: str
    detail: str
    resolved: bool
    created_at: datetime


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    detail: str
    severity: str
    unread: bool
    created_at: datetime


class ApprovalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    detail: str
    risk: str
    status: str
    created_at: datetime


# ---------- Connectors ----------


class ConnectorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    category: str
    status: str
    agents_count: int
    last_sync_at: Optional[datetime]


# Connector registration (MCP/API URL)
class ConnectorRegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    url: str = Field(min_length=6, max_length=1000)
    category: str = "Custom (MCP / API)"


# ---------- Copilot ----------


class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


class ChatOut(BaseModel):
    reply: str


# ---------- Analytics / dashboard ----------


class RiskBucketOut(BaseModel):
    name: str
    value: int
    color: str


class DiscoveryPointOut(BaseModel):
    week: str
    discovered: int
    highRisk: int


class PlatformBreakdownOut(BaseModel):
    platform: str
    agents: int
    highRisk: int


class FleetActivityOut(BaseModel):
    hour: str
    actions: int
    anomalies: int


class ScopeExposureOut(BaseModel):
    scope: str
    agents: int
    pii: bool


class BenchmarkOut(BaseModel):
    orphanedVsPeers: float
    riskPercentile: int
    peerGroup: str


class DashboardMetricsOut(BaseModel):
    kpis: dict
    kpiTrends: dict
    discoveryTrend: list[DiscoveryPointOut]
    riskDistribution: list[RiskBucketOut]
    platformBreakdown: list[PlatformBreakdownOut]
    fleetActivity: list[FleetActivityOut]
    scopeExposure: list[ScopeExposureOut]
    benchmark: BenchmarkOut


# ---------- Compliance ----------


class FrameworkControlsOut(BaseModel):
    passed: int
    total: int


class ComplianceFrameworkOut(BaseModel):
    id: str
    name: str
    region: str
    progress: int
    controls: FrameworkControlsOut
    note: str


class DpdpChecklistOut(BaseModel):
    id: str
    label: str
    status: str
    detail: str


class ComplianceTrendPointOut(BaseModel):
    month: str
    dpdp: int
    soc2: int
    iso: int
    euai: int


class AuditCalendarOut(BaseModel):
    id: str
    name: str
    date: str
    days: int


class ComplianceOverviewOut(BaseModel):
    complianceFrameworks: list[ComplianceFrameworkOut]
    dpdpChecklist: list[DpdpChecklistOut]
    complianceTrend: list[ComplianceTrendPointOut]
    auditCalendar: list[AuditCalendarOut]


# ---------- Settings ----------


class TeamMemberOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    status: str


class BillingPlanOut(BaseModel):
    id: str
    name: str
    priceInr: str
    priceUsd: str
    period: str
    features: list[str]
    current: bool


class WorkspaceOut(BaseModel):
    companyName: str
    dataResidency: str


class SettingsOverviewOut(BaseModel):
    workspace: WorkspaceOut
    teamMembers: list[TeamMemberOut]
    plans: list[BillingPlanOut]


class TeamRolePatchIn(BaseModel):
    role: str = Field(min_length=3, max_length=50)
