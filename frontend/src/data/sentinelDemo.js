import { Check, FileText, Radar, ScanSearch, Share2, ShieldAlert, UserX } from 'lucide-react'

export const SENTINEL_DEMO_PROMPT =
  "Scan our stack and show every AI agent we don't already know about."

export const SENTINEL_DEMO_SUMMARY =
  'First pass found 147 agents across 12 sources. 8 are orphaned and 23 score high risk. Two still run on credentials of people who left.'

export const SENTINEL_DEMO_STEPS = [
  { verb: 'Connected', target: 'Google Workspace · OAuth grants', ms: '0.4s', Icon: Check },
  { verb: 'Read', target: 'Slack audit log · last 30 days', ms: '1.1s', Icon: FileText },
  { verb: 'Scanned', target: 'DNS egress · LLM endpoints', ms: '0.8s', Icon: Radar },
  { verb: 'Found', target: 'Zapier Invoice Bot · risk 87', ms: '0.6s', Icon: ScanSearch, risk: 87 },
  { verb: 'Flagged', target: 'Payroll Sync Agent · orphaned', ms: '0.5s', Icon: UserX, risk: 92 },
  { verb: 'Compared', target: 'peer mid-market · 200-500 emp', ms: '1.2s', Icon: ShieldAlert },
]

export const SENTINEL_DEMO_AGENTS = [
  { name: 'Zapier Invoice Bot', risk: 87 },
  { name: 'Payroll Sync Agent', risk: 92 },
  { name: 'Postgres MCP Server', risk: 71 },
  { name: 'Sales Outreach GPT', risk: 74 },
]

export const SENTINEL_DEMO_EVIDENCE = {
  file: 'shadow-agents-report.pdf',
  meta: 'Evidence pack · DPDP + SOC 2',
}

export const SENTINEL_RECENTS = [
  { title: 'Shadow agents · Orbita', prompt: SENTINEL_DEMO_PROMPT, active: true },
  { title: 'Orphaned OAuth grants', prompt: 'Which employees use personal AI accounts?' },
  { title: 'DPDP transfer inventory', prompt: 'Who can access PII through AI?' },
]

export const SENTINEL_WORKSPACE = [
  { label: 'Inventory', to: '/app/discovery', Icon: ScanSearch, active: true },
  { label: 'Identity graph', to: '/app/relationships', Icon: Share2 },
  { label: 'Compliance', to: '/app/governance', Icon: ShieldAlert },
]
