import { asAsset } from './asset.js'

export const SAMPLE_DNS = `host,user,device
api.openai.com,riya@acme.com,finance-laptop
api.anthropic.com,dev@acme.com,dev-workstation
api2.cursor.sh,anshu@acme.com,anshu-macbook
generativelanguage.googleapis.com,priya@acme.com,hr-desktop
chatgpt.com,arjun@acme.com,sales-laptop
api.perplexity.ai,kabir@acme.com,support-desktop
`

export const SAMPLE_GOOGLE = {
  items: [
    {
      user: 'riya@acme.com',
      displayText: 'Zapier',
      clientId: 'zapier-demo',
      scopes: ['gmail', 'spreadsheets'],
    },
    {
      user: 'arjun@acme.com',
      displayText: 'ChatGPT',
      clientId: 'openai-demo',
      scopes: ['openid', 'email'],
    },
    {
      user: 'unassigned',
      displayText: 'Payroll Sync (Make)',
      clientId: 'make-payroll',
      scopes: ['payroll.rw'],
    },
  ],
}

export const SAMPLE_ZAPIER = {
  zaps: [
    {
      id: 'zap-invoice',
      title: 'Invoice bot',
      owner: 'Riya Sharma',
      nodes: [{ app: 'Gmail' }, { app: 'Sheets' }, { app: 'Tally' }],
    },
    {
      id: 'zap-outreach',
      title: 'Sales outreach GPT',
      owner: 'Arjun Mehta',
      nodes: [{ app: 'HubSpot' }, { app: 'Gmail' }],
    },
  ],
}

function row(kind, partial) {
  return asAsset({
    id: `live-${kind}-${partial.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    lastActive: 'just now',
    lastSeen: 'just now',
    firstSeen: 'just now',
    source: 'scan',
    status: partial.owner === 'Unassigned' ? 'orphaned' : 'active',
    discoveryKind: kind,
    ...partial,
  })
}

export const SAMPLE_FILES = {
  'google-tokens.json': JSON.stringify(SAMPLE_GOOGLE, null, 2),
  'zapier-export.json': JSON.stringify(SAMPLE_ZAPIER, null, 2),
  'dns-egress.csv': SAMPLE_DNS,
}

export function localSample(kind, options = {}) {
  const demos = {
    google: {
      note: options.connected
        ? 'Synced OAuth apps from Google Workspace (demo tenant Acme Inc.).'
        : 'Sample Google Admin tokens. Connect Workspace when OAuth env is set.',
      agents: [
        row('google', { name: 'Zapier', platform: 'Zapier', owner: 'riya@acme.com', scopes: ['gmail', 'spreadsheets'], risk: 74, type: 'AI_AGENT' }),
        row('google', { name: 'ChatGPT', platform: 'ChatGPT', owner: 'arjun@acme.com', scopes: ['openid', 'email'], risk: 41, type: 'AI_APP' }),
        row('google', { name: 'Payroll Sync (Make)', platform: 'Make', owner: 'Unassigned', scopes: ['payroll.rw'], risk: 92, type: 'AI_AGENT' }),
      ],
    },
    microsoft: {
      note: options.connected
        ? 'Synced Entra oauth2PermissionGrants for the Acme demo tenant.'
        : 'Sample Microsoft 365 grants.',
      agents: [
        row('microsoft', { name: 'Microsoft Copilot', platform: 'Copilot', owner: 'priya@acme.com', scopes: ['Files.Read.All', 'Mail.Read'], risk: 61, type: 'AI_APP' }),
        row('microsoft', { name: 'ChatGPT', platform: 'ChatGPT', owner: 'arjun@acme.com', scopes: ['User.Read', 'openid'], risk: 39, type: 'AI_APP' }),
        row('microsoft', { name: 'Zapier', platform: 'Zapier', owner: 'riya@acme.com', scopes: ['Mail.ReadWrite', 'Files.ReadWrite'], risk: 78, type: 'AI_AGENT' }),
      ],
    },
    github: {
      note: options.connected
        ? 'Synced GitHub App installations and Copilot for org acme.'
        : 'Sample GitHub App installations for this workspace.',
      agents: [
        row('github', { name: 'GitHub Copilot', platform: 'Copilot', owner: 'acme', scopes: ['github'], risk: 48, type: 'IDE_EXTENSION' }),
        row('github', { name: 'Cursor', platform: 'Cursor', owner: 'acme', scopes: ['github'], risk: 44, type: 'AI_APP' }),
      ],
    },
    dns: {
      note: 'Sample DNS/proxy hits against known LLM hosts.',
      agents: [
        row('dns', { name: 'ChatGPT / API egress · api.openai.com', platform: 'ChatGPT / API', owner: 'riya@acme.com', device: 'finance-laptop', scopes: ['network.egress', 'api.openai.com'], risk: 68, type: 'AI_API' }),
        row('dns', { name: 'Claude egress · api.anthropic.com', platform: 'Claude', owner: 'dev@acme.com', device: 'dev-workstation', scopes: ['network.egress', 'api.anthropic.com'], risk: 55, type: 'AI_API' }),
        row('dns', { name: 'Cursor egress · api2.cursor.sh', platform: 'Cursor', owner: 'anshu@acme.com', device: 'anshu-macbook', scopes: ['network.egress', 'api2.cursor.sh'], risk: 44, type: 'AI_APP' }),
      ],
    },
    zapier: {
      note: options.connected
        ? 'Imported Zapier export for the Acme workspace.'
        : 'Sample Zapier export. Upload your own JSON/CSV for a live ingest.',
      agents: [
        row('zapier', { name: 'Invoice bot', platform: 'Zapier', owner: 'Riya Sharma', scopes: ['Gmail', 'Sheets', 'Tally'], risk: 81, type: 'AI_AGENT' }),
        row('zapier', { name: 'Sales outreach GPT', platform: 'Zapier', owner: 'Arjun Mehta', scopes: ['HubSpot', 'Gmail'], risk: 70, type: 'AI_AGENT' }),
      ],
    },
    make: {
      note: options.connected
        ? 'Imported Make scenarios for the Acme workspace.'
        : 'Sample Make export.',
      agents: [
        row('make', { name: 'Payroll Sync', platform: 'Make', owner: 'Unassigned', scopes: ['Zoho Payroll', 'Sheets'], risk: 92, type: 'AI_AGENT' }),
        row('make', { name: 'Inventory reorder', platform: 'Make', owner: 'Rohan Gupta', scopes: ['Zoho Inventory', 'Gmail'], risk: 66, type: 'AI_AGENT' }),
      ],
    },
    collector: {
      note: options.connected
        ? 'Collector payload from anshu-macbook.local (managed device).'
        : 'Sample managed-laptop inventory. Run orbita_collect.py on company devices.',
      agents: [
        row('collector', { name: 'Cursor', platform: 'Cursor', owner: 'Anshu', device: 'anshu-macbook.local', scopes: ['endpoint.install'], risk: 44, type: 'AI_APP' }),
        row('collector', { name: 'ChatGPT', platform: 'ChatGPT', owner: 'Anshu', device: 'anshu-macbook.local', scopes: ['endpoint.install'], risk: 28, type: 'AI_APP' }),
        row('collector', { name: 'ChatGPT for Google', platform: 'ChatGPT', owner: 'Anshu', device: 'anshu-macbook.local', scopes: ['browser.extension'], risk: 52, type: 'BROWSER_EXTENSION' }),
        row('collector', { name: 'Postgres MCP', platform: 'MCP', owner: 'Anshu', device: 'anshu-macbook.local', scopes: ['postgres://localhost'], risk: 71, type: 'MCP_SERVER' }),
        row('collector', { name: 'Ollama', platform: 'Ollama', owner: 'Anshu', device: 'anshu-macbook.local', scopes: ['llama3.1:8b', 'qwen2.5:14b'], risk: 58, type: 'LOCAL_MODEL' }),
      ],
    },
  }
  const rowset = demos[kind]
  if (!rowset) return null
  return {
    kind,
    created: rowset.agents.length,
    updated: 0,
    agents: rowset.agents,
    note: options.connected ? rowset.note : `${rowset.note} Loaded locally so you can try the flow without the API.`,
  }
}
