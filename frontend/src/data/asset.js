/** Canonical AI Asset. Every later source (browser, IDE, OAuth, MCP) maps here. */

export const ASSET_TYPES = [
  'AI_APP',
  'AI_AGENT',
  'AI_MODEL',
  'MCP_SERVER',
  'AI_API',
  'BROWSER_EXTENSION',
  'IDE_EXTENSION',
  'LOCAL_MODEL',
]

export const ASSET_TYPE_META = {
  AI_APP: { label: 'AI App', short: 'App' },
  AI_AGENT: { label: 'AI Agent', short: 'Agent' },
  AI_MODEL: { label: 'AI Model', short: 'Model' },
  MCP_SERVER: { label: 'MCP Server', short: 'MCP' },
  AI_API: { label: 'AI API', short: 'API' },
  BROWSER_EXTENSION: { label: 'Browser Extension', short: 'Browser' },
  IDE_EXTENSION: { label: 'IDE Extension', short: 'IDE' },
  LOCAL_MODEL: { label: 'Local Model', short: 'Local' },
}

const VENDORS = {
  chatgpt: 'OpenAI',
  'custom gpt': 'OpenAI',
  claude: 'Anthropic',
  gemini: 'Google',
  perplexity: 'Perplexity',
  grok: 'xAI',
  cursor: 'Anysphere',
  lovable: 'Lovable',
  replit: 'Replit',
  v0: 'Vercel',
  copilot: 'GitHub',
  cline: 'Cline',
  continue: 'Continue',
  grammarly: 'Grammarly',
  mcp: 'MCP',
  'gpt-4o': 'OpenAI',
  'claude-sonnet': 'Anthropic',
  'gemini-pro': 'Google',
}

const APP_KEYS = new Set([
  'chatgpt',
  'claude',
  'gemini',
  'perplexity',
  'cursor',
  'lovable',
  'replit',
  'v0',
  'grok',
  'custom gpt',
])

const MODEL_KEYS = new Set([
  'gpt-4o',
  'gpt-4.1',
  'claude-sonnet',
  'claude-opus',
  'gemini-pro',
  'gemini-flash',
  'grok-3',
])

export function inferType(platform) {
  const p = (platform || '').toLowerCase()
  if (p.includes('mcp')) return 'MCP_SERVER'
  if (p.includes('ollama') || p.includes('lm studio')) return 'LOCAL_MODEL'
  if (MODEL_KEYS.has(p) || p.includes('model')) return 'AI_MODEL'
  if (p.includes('ide') || p.includes('copilot') || p === 'cline' || p === 'continue') return 'IDE_EXTENSION'
  if (p.includes('extension') || p === 'grammarly') return 'BROWSER_EXTENSION'
  if (p.includes('oauth')) return 'OAUTH_APP'
  if (APP_KEYS.has(p)) return 'AI_APP'
  if (p.endsWith(' api') || p.endsWith('_api') || p.includes(' api')) return 'AI_API'
  if (p.includes('local')) return 'LOCAL_MODEL'
  return 'AI_AGENT'
}

export function inferVendor(platform) {
  return VENDORS[(platform || '').toLowerCase()] || platform || 'Unknown'
}

/** Fill canonical fields; keep platform/owner/scopes aliases so existing UI keeps working. */
export function asAsset(row) {
  const platform = row.platform || row.vendor || 'Unknown'
  const type = row.type || inferType(platform)
  const vendor = row.vendor || inferVendor(platform)
  const user = row.user || row.owner || 'Unassigned'
  const permissions = row.permissions || row.scopes || []
  const lastSeen = row.lastSeen || row.lastActive || ''
  return {
    ...row,
    type,
    vendor,
    user,
    device: row.device || '',
    source: row.source || 'scan',
    firstSeen: row.firstSeen || lastSeen,
    lastSeen,
    permissions,
    connections: row.connections || [],
    dataAccess: row.dataAccess || permissions,
    risk: row.risk ?? 0,
    status: row.status || 'pending',
    platform,
    owner: user,
    scopes: permissions,
    lastActive: lastSeen,
  }
}

if (import.meta.env?.DEV) {
  console.assert(inferType('ChatGPT') === 'AI_APP', 'ChatGPT → AI_APP')
  console.assert(inferType('Postgres MCP') === 'MCP_SERVER', 'MCP → MCP_SERVER')
  console.assert(inferType('Zapier') === 'AI_AGENT', 'Zapier → AI_AGENT')
  console.assert(inferType('gpt-4o') === 'AI_MODEL', 'gpt-4o → AI_MODEL')
  console.assert(ASSET_TYPES.length === 8, 'eight asset types')
}
