import { clearTokens, setTokens } from './api.js'
import { localSample } from '../data/discoverySamples.js'

const MODE_KEY = 'orbita_demo_mode'
const STATE_KEY = 'orbita_demo_state'

export const DEMO_ACCOUNT = {
  email: (import.meta.env.VITE_DEMO_EMAIL || 'anshu@orbita.com').toLowerCase(),
  password: 'orbita-demo-123',
  name: 'Anshu Nishad',
  initials: 'AN',
  company: 'Acme Inc.',
  workspace: 'Acme · demo',
  googleEmail: 'anshu@acme.com',
}

const CONNECTOR_NAMES = {
  google: 'Google Workspace',
  microsoft: 'Microsoft 365',
  github: 'GitHub',
  dns: 'DNS / proxy CSV',
  zapier: 'Zapier export',
  make: 'Make export',
  collector: 'Managed laptop CLI',
}

export const OAUTH_CONSENT = {
  login: {
    provider: 'Google',
    product: 'Orbita',
    account: DEMO_ACCOUNT.name,
    email: DEMO_ACCOUNT.googleEmail,
    scopes: ['See your email address', 'See your basic profile info'],
    allowLabel: 'Continue',
  },
  google: {
    provider: 'Google',
    product: 'Orbita Discovery',
    account: DEMO_ACCOUNT.name,
    email: DEMO_ACCOUNT.googleEmail,
    scopes: [
      'View users in your Google Workspace directory',
      'View third-party OAuth apps and granted scopes',
      'Read-only Admin SDK · tokens.list',
    ],
    allowLabel: 'Continue demo',
  },
  microsoft: {
    provider: 'Microsoft',
    product: 'Orbita Discovery',
    account: DEMO_ACCOUNT.name,
    email: 'anshu@acme.com',
    scopes: ['Sign in and read user profile', 'Read directory data', 'Read OAuth2 permission grants'],
    allowLabel: 'Continue demo',
  },
  github: {
    provider: 'GitHub',
    product: 'Orbita Discovery',
    account: 'acme',
    email: 'anshu@acme.com',
    scopes: ['Read org membership', 'Read GitHub App installations', 'Read Copilot seat metadata'],
    allowLabel: 'Continue demo',
  },
}

function emptyState() {
  return {
    user: { ...DEMO_ACCOUNT },
    oauth: { google: true, github: true, microsoft: true },
    connectors: [],
    agents: [],
  }
}

export function isDemoMode() {
  try {
    return localStorage.getItem(MODE_KEY) === '1'
  } catch {
    return false
  }
}

export function loadDemoState() {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return emptyState()
    return { ...emptyState(), ...JSON.parse(raw) }
  } catch {
    return emptyState()
  }
}

export function saveDemoState(next) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(next))
  } catch {
    /* ignore quota */
  }
}

export function enterDemoMode() {
  try {
    localStorage.setItem(MODE_KEY, '1')
  } catch {
    /* ignore */
  }
  setTokens({ access_token: 'demo-access', refresh_token: 'demo-refresh' })
  const state = loadDemoState()
  if (!state.user?.email) saveDemoState(emptyState())
}

export function exitDemoMode() {
  try {
    localStorage.removeItem(MODE_KEY)
  } catch {
    /* ignore */
  }
  clearTokens()
}

export function matchesDemoAccount(email, password) {
  const e = (email || '').trim().toLowerCase()
  const aliases = [DEMO_ACCOUNT.email, 'anshu@acme.com', 'prabhhav@zintellix.com']
  return password === DEMO_ACCOUNT.password && aliases.includes(e)
}

export function getDemoConnectors() {
  return loadDemoState().connectors || []
}

export function getDemoAgents() {
  return loadDemoState().agents || []
}

export function markDemoConnector(kind, count) {
  const state = loadDemoState()
  const rest = (state.connectors || []).filter((c) => c.kind !== kind)
  const row = {
    id: kind,
    kind,
    name: CONNECTOR_NAMES[kind] || kind,
    status: 'connected',
    agents_count: count,
    last_sync_at: new Date().toISOString(),
  }
  saveDemoState({ ...state, connectors: [row, ...rest] })
  return row
}

export function mergeDemoAgents(rows) {
  if (!Array.isArray(rows) || !rows.length) return
  const state = loadDemoState()
  const byId = new Map((state.agents || []).map((a) => [a.id, a]))
  for (const row of rows) byId.set(row.id, row)
  saveDemoState({ ...state, agents: [...byId.values()] })
}

export function applyDemoScan(kind) {
  const sample = localSample(kind, { connected: true })
  if (!sample) return null
  mergeDemoAgents(sample.agents)
  markDemoConnector(kind, sample.created)
  return sample
}
