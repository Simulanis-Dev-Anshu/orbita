import { createContext, useContext, useState, useCallback } from 'react'
import { agents as seed } from '../data/mock.js'

const AgentsContext = createContext(null)

export function AgentsProvider({ children }) {
  const [agents, setAgents] = useState(seed)

  const addAgent = useCallback((agent) => {
    setAgents((prev) => [
      { ...agent, id: `ag-${Date.now()}`, lastActive: 'just now' },
      ...prev,
    ])
  }, [])

  const updateAgent = useCallback((id, patch) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }, [])

  const deleteAgent = useCallback((id) => {
    setAgents((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return (
    <AgentsContext.Provider value={{ agents, addAgent, updateAgent, deleteAgent }}>
      {children}
    </AgentsContext.Provider>
  )
}

export function useAgents() {
  const ctx = useContext(AgentsContext)
  if (!ctx) throw new Error('useAgents must be used inside <AgentsProvider>')
  return ctx
}
