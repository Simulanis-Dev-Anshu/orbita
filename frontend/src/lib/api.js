const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

const ACCESS_KEY = 'orbita_access'
const REFRESH_KEY = 'orbita_refresh'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function setTokens({ access_token, refresh_token }) {
  if (access_token) localStorage.setItem(ACCESS_KEY, access_token)
  if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function formatAgo(iso) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.max(0, (Date.now() - then) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    return hours === 1 ? '1 hr ago' : `${hours} hrs ago`
  }
  const days = Math.floor(seconds / 86400)
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

async function parseError(res) {
  try {
    const body = await res.json()
    const detail = body.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return detail.map((d) => d.msg || d).join(', ')
    return res.statusText
  } catch {
    return res.statusText
  }
}

async function raw(path, { method = 'GET', body, token, retry = true, timeoutMs = 6000, form } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined && !form) headers['Content-Type'] = 'application/json'
  const access = token ?? getAccessToken()
  if (access) headers.Authorization = `Bearer ${access}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  let res
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: form ? form : body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    if (err?.name === 'AbortError') throw new Error('API timed out')
    throw new Error('API is offline')
  }
  clearTimeout(timer)

  if (res.status === 401 && retry && localStorage.getItem(REFRESH_KEY)) {
    const refreshed = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refresh_token: localStorage.getItem(REFRESH_KEY) }),
    })
    if (refreshed.ok) {
      const pair = await refreshed.json()
      setTokens(pair)
      return raw(path, { method, body, token: pair.access_token, retry: false, timeoutMs, form })
    }
    clearTokens()
  }

  if (!res.ok) {
    throw new Error(await parseError(res))
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (path) => raw(path),
  post: (path, body) => raw(path, { method: 'POST', body }),
  patch: (path, body) => raw(path, { method: 'PATCH', body }),
  del: (path) => raw(path, { method: 'DELETE' }),
}

export function mapAgent(row) {
  return {
    id: row.id,
    name: row.name,
    platform: row.platform,
    owner: row.owner_name,
    ownerRole: row.owner_role,
    scopes: row.scopes || [],
    risk: row.risk,
    status: row.status,
    source: row.source,
    lastActive: formatAgo(row.last_active_at),
    lastSeen: formatAgo(row.last_active_at),
    firstSeen: formatAgo(row.first_seen_at),
    type: row.asset_type,
    vendor: row.vendor,
    device: row.device || '',
    connections: row.connections || [],
    dataAccess: row.data_access || row.scopes || [],
    user: row.owner_name,
    permissions: row.scopes || [],
    discoveryKind: row.discovery_kind || '',
  }
}

export function mapAlert(row) {
  return {
    id: row.id,
    type: row.type,
    severity: row.severity,
    agent: row.agent_name,
    detail: row.detail,
    resolved: row.resolved,
    time: formatAgo(row.created_at),
  }
}

export function mapNotification(row) {
  return {
    id: row.id,
    title: row.title,
    detail: row.detail,
    severity: row.severity,
    unread: row.unread,
    time: formatAgo(row.created_at),
  }
}

export const endpoints = {
  metrics: () => api.get('/dashboard/metrics'),
  agents: () => api.get('/agents'),
  createAgent: (body) => api.post('/agents', body),
  patchAgent: (id, body) => api.patch(`/agents/${id}`, body),
  deleteAgent: (id) => api.del(`/agents/${id}`),
  alerts: () => api.get('/alerts'),
  resolveAlert: (id) => api.post(`/alerts/${id}/resolve`),
  notifications: () => api.get('/notifications'),
  readNotification: (id) => api.post(`/notifications/${id}/read`),
  approvals: () => api.get('/approvals'),
  decideApproval: (id, decision) => api.post(`/approvals/${id}/${decision}`),
  connectors: () => api.get('/connectors'),
  sourceHealth: () => api.get('/connectors/source-health'),
  discoveryStatus: () => api.get('/discovery/status'),
  discoveryOAuthStart: (kind) => api.get(`/discovery/oauth/${kind}/start`),
  discoveryImport: (kind, body) => raw(`/discovery/import/${kind}`, { method: 'POST', body, timeoutMs: 20000 }),
  discoveryUpload: (kind, file) => {
    const form = new FormData()
    form.append('file', file)
    return raw(`/discovery/upload/${kind}`, { method: 'POST', form, timeoutMs: 20000 })
  },
  discoveryDemo: (kind) => raw(`/discovery/demo/${kind}`, { method: 'POST', timeoutMs: 4000 }),
  discoveryCollector: (body) => raw('/discovery/collector', { method: 'POST', body, timeoutMs: 20000 }),
  downloadDiscovery: async (path, filename) => {
    const access = getAccessToken()
    const headers = { Accept: '*/*' }
    if (access) headers.Authorization = `Bearer ${access}`
    let res
    try {
      res = await fetch(`${API_URL}/api${path}`, { headers })
    } catch {
      res = null
    }
    if (!res?.ok) {
      if (path.includes('collector')) throw new Error('Start the API to download the collector, or copy backend/scripts/orbita_collect.py')
      res = await fetch(`/samples/${filename}`)
    }
    if (!res.ok) throw new Error('Download failed')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  },
  settings: () => api.get('/settings/overview'),
  login: (body) => api.post('/auth/login', body),
  signup: (body) => api.post('/auth/signup', body),
  chat: (message) => api.post('/copilot/chat', { message }),
}
