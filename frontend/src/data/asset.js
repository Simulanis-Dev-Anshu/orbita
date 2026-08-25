/** Canonical AI Asset. Every later source (browser, IDE, OAuth, MCP) maps here. */

export const ASSET_TYPES = [
  'AI_APP',
  'AI_AGENT',
  'MCP_SERVER',
  'LOCAL_MODEL',
  'BROWSER_EXTENSION',
  'IDE_EXTENSION',
  'AI_API',
  'OAUTH_APP',
]

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

export function inferType(platform) {
  const p = (platform || '').toLowerCase()
  if (p.includes('mcp')) return 'MCP_SERVER'
  if (p.includes('ollama') || p.includes('lm studio') || p.includes('local')) return 'LOCAL_MODEL'
  if (p.includes('ide') || p.includes('copilot') || p === 'cline' || p === 'continue') return 'IDE_EXTENSION'
  if (p.includes('extension') || p === 'grammarly') return 'BROWSER_EXTENSION'
  if (p.includes('oauth')) return 'OAUTH_APP'
  if (APP_KEYS.has(p)) return 'AI_APP'
  if (p.endsWith(' api') || p.endsWith('_api')) return 'AI_API'
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
  console.assert(ASSET_TYPES.length === 8, 'eight asset types')
}
