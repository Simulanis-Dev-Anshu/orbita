import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import AgentsTable from '../components/AgentsTable.jsx'
import AgentFormModal from '../components/AgentFormModal.jsx'
import { useAgents } from '../context/AgentsContext.jsx'

export default function Inventory() {
  const location = useLocation()
  const { agents, addAgent } = useAgents()
  const [query, setQuery] = useState(location.state?.q ?? '')
  const [adding, setAdding] = useState(false)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return agents
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.owner.toLowerCase().includes(q) ||
        a.platform.toLowerCase().includes(q) ||
        a.scopes.some((s) => s.toLowerCase().includes(q)),
    )
  }, [agents, query])

  const orphaned = agents.filter((a) => a.status === 'orphaned').length
  const highRisk = agents.filter((a) => a.risk >= 75).length

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Search inventory</span>
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, owner, platform, scope…"
            className="w-full rounded-btn border border-line bg-card py-2.5 pr-4 pl-10 text-sm shadow-soft outline-none transition-colors placeholder:text-sub focus:border-forest"
          />
        </label>
        <div className="flex gap-2 text-xs font-semibold">
          <span className="rounded-full bg-card px-3 py-2 shadow-soft">{agents.length} agents</span>
          <span className="rounded-full bg-danger-soft px-3 py-2 text-danger shadow-soft">
            {orphaned} orphaned
          </span>
          <span className="rounded-full bg-warn-soft px-3 py-2 text-warn shadow-soft">
            {highRisk} high risk
          </span>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-btn bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={16} aria-hidden="true" />
          Register agent
        </button>
      </div>

      <AgentsTable rows={rows} title="All discovered agents" />

      {adding && (
        <AgentFormModal onSave={addAgent} onClose={() => setAdding(false)} />
      )}
    </div>
  )
}
