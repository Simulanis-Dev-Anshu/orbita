import { useMemo } from 'react'
import { useAgents } from '../context/AgentsContext.jsx'

const SOURCE = {
  google: 'OAuth',
  microsoft: 'OAuth',
  github: 'OAuth',
  dns: 'Network',
  zapier: 'OAuth',
  make: 'OAuth',
  collector: 'Endpoint',
}

function mergeByName(live, mock, key = 'name') {
  const names = new Set(live.map((row) => String(row[key] || '').toLowerCase()))
  return [...live, ...mock.filter((row) => !names.has(String(row[key] || '').toLowerCase()))]
}

export function useLiveFindings() {
  const { agents } = useAgents()
  return useMemo(() => {
    const live = agents.filter((a) => a.discoveryKind)
    const apps = live
      .filter((a) => !['BROWSER_EXTENSION', 'MCP_SERVER', 'LOCAL_MODEL'].includes(a.type))
      .map((a) => ({
        id: a.id,
        name: a.name,
        vendor: a.vendor || a.platform,
        category: a.type === 'AI_API' ? 'AI API' : a.type === 'AI_AGENT' ? 'AI Agent' : 'AI App',
        sources: [SOURCE[a.discoveryKind] || 'Endpoint'],
        users: 1,
        firstSeen: a.firstSeen || a.lastActive || 'just now',
        lastSeen: a.lastActive || 'just now',
        status: a.status === 'orphaned' ? 'shadow' : 'new',
        risk: a.risk,
      }))
    const extensions = live
      .filter((a) => a.type === 'BROWSER_EXTENSION' || (a.scopes || []).includes('browser.extension'))
      .map((a) => ({
        id: a.id,
        name: a.name,
        vendor: a.vendor || a.platform,
        browsers: ['Chrome'],
        version: 'live',
        devices: 1,
        users: [a.owner || a.user || 'Unassigned'],
        risk: a.risk,
        status: a.status === 'orphaned' ? 'shadow' : 'new',
        permissions: a.scopes?.length ? a.scopes : ['browser.extension'],
        firstSeen: a.firstSeen || a.lastActive || 'just now',
        lastSeen: a.lastActive || 'just now',
      }))
    const local = live
      .filter((a) => a.type === 'LOCAL_MODEL' || /ollama|lm studio/i.test(a.platform || ''))
      .map((a) => ({
        id: a.id,
        name: a.name,
        runtime: a.platform || 'Ollama',
        models: a.scopes?.length ? a.scopes : ['unknown'],
        host: a.device || 'managed-endpoint',
        user: a.owner || a.user || 'Unassigned',
        team: a.ownerRole || '-',
        port: /ollama/i.test(a.platform || '') ? 11434 : 0,
        status: a.status === 'orphaned' ? 'orphaned' : 'running',
        risk: a.risk,
        firstSeen: a.firstSeen || a.lastActive || 'just now',
        lastSeen: a.lastActive || 'just now',
      }))
    const mcp = live
      .filter((a) => a.type === 'MCP_SERVER' || a.platform === 'MCP')
      .map((a) => ({
        id: a.id,
        app: a.device || 'Endpoint',
        mcp: a.name,
        target: (a.scopes || [])[0] || 'system',
        owner: a.owner || a.user || 'Unassigned',
        approved: false,
        status: a.status === 'orphaned' ? 'orphaned' : 'new',
        risk: a.risk,
        lastSeen: a.lastActive || 'just now',
      }))
    return { apps, extensions, local, mcp, liveCount: live.length, mergeByName }
  }, [agents])
}
