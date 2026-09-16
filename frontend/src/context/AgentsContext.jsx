import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { agents as seed } from '../data/mock.js'
import { asAsset } from '../data/asset.js'
import { endpoints, mapAgent } from '../lib/api.js'
import { getDemoAgents, isDemoMode, mergeDemoAgents } from '../lib/demoSession.js'

const AgentsContext = createContext(null)

export function AgentsProvider({ children }) {
  const [agents, setAgents] = useState(seed)

  const ingestAgents = useCallback((rows) => {
    if (!Array.isArray(rows) || !rows.length) return
    setAgents((prev) => {
      const byId = new Map(prev.map((a) => [a.id, a]))
      const mappedRows = []
      for (const row of rows) {
        const mapped = row.owner_name != null ? asAsset(mapAgent(row)) : asAsset(row)
        byId.set(mapped.id, mapped)
        mappedRows.push(mapped)
      }
      if (isDemoMode()) mergeDemoAgents(mappedRows)
      return [...byId.values()]
    })
  }, [])

  const reload = useCallback(() => {
    if (isDemoMode()) {
      const extra = getDemoAgents()
      if (extra.length) {
        setAgents((prev) => {
          const byId = new Map(prev.map((a) => [a.id, a]))
          for (const row of extra) byId.set(row.id, asAsset(row))
          return [...byId.values()]
        })
      }
      return
    }
    endpoints
      .agents()
      .then((rows) => {
        if (Array.isArray(rows) && rows.length) {
          setAgents(rows.map((row) => asAsset(mapAgent(row))))
        }
      })
      .catch(() => {
        const extra = getDemoAgents()
        if (extra.length) {
          setAgents((prev) => {
            const byId = new Map(prev.map((a) => [a.id, a]))
            for (const row of extra) byId.set(row.id, asAsset(row))
            return [...byId.values()]
          })
        }
      })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const addAgent = useCallback(async (agent) => {
    try {
      const created = await endpoints.createAgent({
        name: agent.name,
        platform: agent.platform,
        owner_name: agent.owner || agent.owner_name || 'Unassigned',
        owner_role: agent.ownerRole || agent.owner_role || '-',
        scopes: agent.scopes || [],
        risk: agent.risk,
        status: agent.status || 'pending',
      })
      setAgents((prev) => [asAsset(mapAgent(created)), ...prev])
    } catch {
      setAgents((prev) => [
        asAsset({ ...agent, id: `ag-${Date.now()}`, lastActive: 'just now' }),
        ...prev,
      ])
    }
  }, [])

  const updateAgent = useCallback(async (id, patch) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
    try {
      const body = {}
      if (patch.name != null) body.name = patch.name
      if (patch.platform != null) body.platform = patch.platform
      if (patch.owner != null) body.owner_name = patch.owner
      if (patch.ownerRole != null) body.owner_role = patch.ownerRole
      if (patch.scopes != null) body.scopes = patch.scopes
      if (patch.risk != null) body.risk = patch.risk
      if (patch.status != null) body.status = patch.status
      if (Object.keys(body).length) await endpoints.patchAgent(id, body)
    } catch {
      /* optimistic */
    }
  }, [])

  const deleteAgent = useCallback(async (id) => {
    setAgents((prev) => prev.filter((a) => a.id !== id))
    try {
      await endpoints.deleteAgent(id)
    } catch {
      /* optimistic */
    }
  }, [])

  return (
    <AgentsContext.Provider value={{ agents, addAgent, updateAgent, deleteAgent, reload, ingestAgents }}>
      {children}
    </AgentsContext.Provider>
  )
}

export function useAgents() {
  const ctx = useContext(AgentsContext)
  if (!ctx) throw new Error('useAgents must be used inside <AgentsProvider>')
  return ctx
}
