// Mock data for the AgentLens dashboard — replace with FastAPI calls later.

export const kpis = {
  totalAgents: 147,
  newThisWeek: 12,
  orphaned: 8,
  highRisk: 23,
  avgRiskScore: 62,
  connectedSources: 12,
}

export const discoveryTrend = [
  { week: 'W1', discovered: 12, highRisk: 2 },
  { week: 'W2', discovered: 19, highRisk: 4 },
  { week: 'W3', discovered: 15, highRisk: 3 },
  { week: 'W4', discovered: 27, highRisk: 6 },
  { week: 'W5', discovered: 22, highRisk: 4 },
  { week: 'W6', discovered: 31, highRisk: 7 },
  { week: 'W7', discovered: 26, highRisk: 5 },
  { week: 'W8', discovered: 38, highRisk: 9 },
]

export const riskDistribution = [
  { name: 'Critical', value: 9, color: '#E5484D' },
  { name: 'High', value: 14, color: '#E8930C' },
  { name: 'Medium', value: 41, color: '#86E64A' },
  { name: 'Low', value: 83, color: '#103E2D' },
]

export const agents = [
  {
    id: 'ag-01',
    name: 'Zapier Invoice Bot',
    platform: 'Zapier',
    owner: 'Riya Sharma',
    ownerRole: 'Finance Ops',
    scopes: ['Gmail', 'Sheets', 'Tally'],
    risk: 87,
    status: 'orphaned',
    lastActive: '2 min ago',
  },
  {
    id: 'ag-02',
    name: 'Sales Outreach GPT',
    platform: 'Custom GPT',
    owner: 'Arjun Mehta',
    ownerRole: 'Sales Lead',
    scopes: ['HubSpot', 'Gmail'],
    risk: 74,
    status: 'active',
    lastActive: '11 min ago',
  },
  {
    id: 'ag-03',
    name: 'HR Onboarding Flow',
    platform: 'n8n',
    owner: 'Priya Nair',
    ownerRole: 'HR Manager',
    scopes: ['Slack', 'Notion', 'Drive'],
    risk: 58,
    status: 'active',
    lastActive: '34 min ago',
  },
  {
    id: 'ag-04',
    name: 'Claude Support Triage',
    platform: 'Claude',
    owner: 'Kabir Singh',
    ownerRole: 'Support Head',
    scopes: ['Zendesk', 'Slack'],
    risk: 41,
    status: 'active',
    lastActive: '1 hr ago',
  },
  {
    id: 'ag-05',
    name: 'Payroll Sync Agent',
    platform: 'Make',
    owner: 'Unassigned',
    ownerRole: '—',
    scopes: ['Zoho Payroll', 'Sheets', 'Gmail'],
    risk: 92,
    status: 'orphaned',
    lastActive: '3 hrs ago',
  },
  {
    id: 'ag-06',
    name: 'GitHub PR Reviewer',
    platform: 'GitHub App',
    owner: 'Dev Patel',
    ownerRole: 'Eng Manager',
    scopes: ['GitHub'],
    risk: 22,
    status: 'active',
    lastActive: '5 hrs ago',
  },
  {
    id: 'ag-07',
    name: 'Marketing Content Bot',
    platform: 'Zapier',
    owner: 'Sneha Rao',
    ownerRole: 'Marketing',
    scopes: ['Notion', 'Buffer', 'Drive'],
    risk: 49,
    status: 'pending',
    lastActive: '1 day ago',
  },
  {
    id: 'ag-08',
    name: 'Customer Data Enricher',
    platform: 'n8n',
    owner: 'Unassigned',
    ownerRole: '—',
    scopes: ['CRM', 'Clearbit', 'Postgres'],
    risk: 81,
    status: 'orphaned',
    lastActive: '2 days ago',
  },
  {
    id: 'ag-09',
    name: 'Meeting Notes Summarizer',
    platform: 'Custom GPT',
    owner: 'Ananya Iyer',
    ownerRole: 'Chief of Staff',
    scopes: ['Meet', 'Docs'],
    risk: 33,
    status: 'active',
    lastActive: '2 days ago',
  },
  {
    id: 'ag-11',
    name: 'Postgres MCP Server',
    platform: 'MCP',
    owner: 'Dev Patel',
    ownerRole: 'Eng Manager',
    scopes: ['Postgres', 'Claude Desktop'],
    risk: 71,
    status: 'active',
    lastActive: '18 min ago',
  },
  {
    id: 'ag-10',
    name: 'Inventory Reorder Agent',
    platform: 'Make',
    owner: 'Rohan Gupta',
    ownerRole: 'Ops Manager',
    scopes: ['Zoho Inventory', 'Gmail'],
    risk: 66,
    status: 'pending',
    lastActive: '3 days ago',
  },
]

export const approvals = [
  {
    id: 'ap-1',
    title: 'Payroll Sync Agent',
    detail: 'Requests write access to Zoho Payroll',
    risk: 'critical',
  },
  {
    id: 'ap-2',
    title: 'Customer Data Enricher',
    detail: 'New agent found on employee credentials',
    risk: 'high',
  },
  {
    id: 'ap-3',
    title: 'Marketing Content Bot',
    detail: 'Scope expanded: Drive read → read/write',
    risk: 'medium',
  },
]

export const aiSuggestions = [
  'Which agents can access customer PII?',
  'Show orphaned agents from the last 30 days',
  'Draft the DPDP compliance summary',
]

export const sourceHealth = [
  { name: 'Google Workspace', status: 'healthy', lastSync: '2 min ago' },
  { name: 'Slack', status: 'healthy', lastSync: '4 min ago' },
  { name: 'GitHub', status: 'healthy', lastSync: '9 min ago' },
  { name: 'Microsoft 365', status: 'degraded', lastSync: '43 min ago' },
]

export const alerts = [
  {
    id: 'al-1',
    type: 'Permission drift',
    severity: 'critical',
    agent: 'Payroll Sync Agent',
    detail: 'Scope expanded from payroll.read to payroll.rw without approval',
    time: '12 min ago',
    resolved: false,
  },
  {
    id: 'al-2',
    type: 'Orphaned agent',
    severity: 'critical',
    agent: 'Customer Data Enricher',
    detail: 'Owner account deactivated in Google Workspace — agent still executing',
    time: '1 hr ago',
    resolved: false,
  },
  {
    id: 'al-3',
    type: 'New agent detected',
    severity: 'high',
    agent: 'Unknown Zapier workflow',
    detail: 'New OAuth grant on rohan@ credentials · touches Sheets + Gmail',
    time: '3 hrs ago',
    resolved: false,
  },
  {
    id: 'al-4',
    type: 'LLM egress',
    severity: 'high',
    agent: 'Sales Outreach GPT',
    detail: 'First-seen DNS egress to api.openai.com from finance subnet',
    time: '5 hrs ago',
    resolved: false,
  },
  {
    id: 'al-5',
    type: 'Machine-speed anomaly',
    severity: 'medium',
    agent: 'HR Onboarding Flow',
    detail: 'Behavioral classifier: 03:00 IST activity spike, 98% machine confidence',
    time: 'Yesterday',
    resolved: false,
  },
  {
    id: 'al-6',
    type: 'Stale credential',
    severity: 'medium',
    agent: 'Zapier Invoice Bot',
    detail: 'OAuth grant not rotated in 240 days',
    time: 'Yesterday',
    resolved: true,
  },
  {
    id: 'al-7',
    type: 'New agent detected',
    severity: 'low',
    agent: 'Meeting Notes Summarizer',
    detail: 'Registered via approval workflow — auto-approved by policy',
    time: '2 days ago',
    resolved: true,
  },
]

export const complianceFrameworks = [
  {
    id: 'dpdp',
    name: 'DPDP Act 2023',
    region: 'India',
    progress: 78,
    controls: { passed: 25, total: 32 },
    note: 'Breach-notice pipeline ready · 2 transfer gaps',
  },
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    region: 'US / Global',
    progress: 64,
    controls: { passed: 41, total: 64 },
    note: 'Agent inventory mapped to CC6 access controls',
  },
  {
    id: 'iso',
    name: 'ISO 27001',
    region: 'Global',
    progress: 71,
    controls: { passed: 66, total: 93 },
    note: 'Annex A.8 asset registry auto-generated',
  },
  {
    id: 'euai',
    name: 'EU AI Act',
    region: 'EU',
    progress: 42,
    controls: { passed: 13, total: 31 },
    note: 'Risk-tier classification in progress',
  },
]

export const dpdpChecklist = [
  { id: 'dp-1', label: '72-hour breach notification pipeline', status: 'pass', detail: 'Alert routing to DPO configured' },
  { id: 'dp-2', label: '12-month audit log retention', status: 'pass', detail: 'Immutable log store · 347 days retained' },
  { id: 'dp-3', label: 'Register of AI data processors', status: 'pass', detail: 'Auto-generated from agent inventory' },
  { id: 'dp-4', label: 'Cross-border transfer inventory', status: 'warn', detail: '2 agents send PII to US LLM endpoints' },
  { id: 'dp-5', label: 'Consent-purpose mapping for agents', status: 'fail', detail: '4 agents access consented data for new purposes' },
]

export const connectors = [
  { id: 'cn-1', name: 'Google Workspace', category: 'Identity & OAuth', status: 'connected', agents: 61, lastSync: '2 min ago' },
  { id: 'cn-2', name: 'Microsoft 365', category: 'Identity & OAuth', status: 'connected', agents: 34, lastSync: '43 min ago' },
  { id: 'cn-3', name: 'Okta', category: 'Identity & OAuth', status: 'available' },
  { id: 'cn-4', name: 'Slack', category: 'Collaboration', status: 'connected', agents: 18, lastSync: '4 min ago' },
  { id: 'cn-5', name: 'Notion', category: 'Collaboration', status: 'connected', agents: 9, lastSync: '12 min ago' },
  { id: 'cn-6', name: 'Zoho One', category: 'Collaboration', status: 'connected', agents: 11, lastSync: '8 min ago' },
  { id: 'cn-7', name: 'Freshworks', category: 'Collaboration', status: 'available' },
  { id: 'cn-8', name: 'GitHub', category: 'Engineering', status: 'connected', agents: 8, lastSync: '9 min ago' },
  { id: 'cn-9', name: 'Zapier', category: 'Automation', status: 'connected', agents: 4, lastSync: '6 min ago' },
  { id: 'cn-10', name: 'Make', category: 'Automation', status: 'connected', agents: 2, lastSync: '31 min ago' },
  { id: 'cn-11', name: 'n8n (self-hosted)', category: 'Automation', status: 'available' },
  { id: 'cn-12', name: 'DNS Egress Sensor', category: 'Network', status: 'connected', agents: 0, lastSync: 'streaming' },
  { id: 'cn-13', name: 'MCP Server Scanner', category: 'Network', status: 'connected', agents: 6, lastSync: '5 min ago' },
]

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    priceInr: '₹40,000',
    priceUsd: '$1,500',
    period: '/mo',
    features: ['Up to 100 agents', '5 connectors', 'Weekly discovery scans', 'Email alerts', 'DPDP starter report'],
    current: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    priceInr: '₹80,000',
    priceUsd: '$3,000',
    period: '/mo',
    features: ['Unlimited agents', 'All connectors', 'Continuous monitoring', 'Kill switch + approvals', 'All compliance packs', 'Peer benchmarks'],
    current: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceInr: 'Custom',
    priceUsd: 'Custom',
    period: '',
    features: ['Self-hosted / data residency', 'Keycloak SSO', 'Custom connectors', 'Dedicated CSM', 'Auditor workspace'],
    current: false,
  },
]

export const teamMembers = [
  { id: 'tm-1', name: 'Prabhhav', email: 'prabhhav@zintellix.com', role: 'Owner', status: 'active' },
  { id: 'tm-2', name: 'Riya Sharma', email: 'riya@zintellix.com', role: 'Security Admin', status: 'active' },
  { id: 'tm-3', name: 'Dev Patel', email: 'dev@zintellix.com', role: 'Viewer', status: 'invited' },
]

export const benchmark = {
  orphanedVsPeers: 2.1,
  riskPercentile: 68,
  peerGroup: 'Indian mid-market SaaS · 200–500 employees',
}
