import { useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { useAgents } from '../context/AgentsContext.jsx'
import AgentDrawer from './AgentDrawer.jsx'
import AgentFormModal from './AgentFormModal.jsx'

const platformInitials = {
  Zapier: 'Z',
  'Custom GPT': 'G',
  n8n: 'n',
  Claude: 'C',
  Make: 'M',
  'GitHub App': 'GH',
}

const statusStyles = {
  active: 'bg-brand-soft text-forest',
  orphaned: 'bg-danger-soft text-danger',
  pending: 'bg-warn-soft text-warn',
}

function riskTone(risk) {
  if (risk >= 75) return { bar: 'bg-danger', text: 'text-danger' }
  if (risk >= 50) return { bar: 'bg-warn', text: 'text-warn' }
  return { bar: 'bg-forest', text: 'text-forest' }
}

const filters = ['All', 'Orphaned', 'High risk', 'Pending']

export default function AgentsTable({ rows, limit, title = 'Recently discovered agents' }) {
  const { agents, updateAgent, deleteAgent } = useAgents()
  const [filter, setFilter] = useState('All')
  const [sortDesc, setSortDesc] = useState(true)
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)

  const base = rows ?? (limit ? agents.slice(0, limit) : agents)

  const visible = useMemo(() => {
    let out = base
    if (filter === 'Orphaned') out = out.filter((a) => a.status === 'orphaned')
    if (filter === 'High risk') out = out.filter((a) => a.risk >= 75)
    if (filter === 'Pending') out = out.filter((a) => a.status === 'pending')
    return [...out].sort((a, b) => (sortDesc ? b.risk - a.risk : a.risk - b.risk))
  }, [base, filter, sortDesc])

  return (
    <section aria-label={title} className="flex h-full flex-col rounded-card bg-card p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="cursor-pointer rounded-btn border border-line bg-canvas px-3 py-2 text-sm outline-none focus:border-brand"
            aria-label="Filter agents"
          >
            {filters.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSortDesc((v) => !v)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-btn border border-line bg-canvas px-3 py-2 text-sm transition-colors hover:border-brand"
            aria-label={`Sort by risk, currently ${sortDesc ? 'highest' : 'lowest'} first`}
          >
            <ArrowUpDown size={14} aria-hidden="true" />
            Risk
          </button>
        </div>
      </div>

      <div className="mt-4 flex-1 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-sub uppercase tracking-wide">
              <th scope="col" className="py-3 pr-4 font-semibold">Agent</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Type</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Owner</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Access</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Risk</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Status</th>
              <th scope="col" className="py-3 font-semibold">Last active</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((a) => {
              const tone = riskTone(a.risk)
              return (
                <tr
                  key={a.id}
                  onClick={() => setSelected(a)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(a)}
                  tabIndex={0}
                  aria-label={`Open details for ${a.name}`}
                  className="cursor-pointer border-b border-line/70 transition-colors outline-none last:border-0 hover:bg-canvas/60 focus-visible:bg-canvas/80"
                >
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-canvas text-xs font-semibold text-forest">
                        {platformInitials[a.platform] ?? a.platform[0]}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{a.name}</p>
                        <p className="text-xs text-sub">{a.platform}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="ox-label text-sub">{(a.type || 'AI_AGENT').replaceAll('_', ' ')}</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className={a.owner === 'Unassigned' ? 'font-medium text-danger' : ''}>{a.owner}</p>
                    <p className="text-xs text-sub">{a.ownerRole}</p>
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex max-w-44 flex-wrap gap-1">
                      {a.scopes.map((s) => (
                        <span key={s} className="rounded-md bg-canvas px-2 py-0.5 text-xs text-sub">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 text-sm font-semibold tabular-nums ${tone.text}`}>{a.risk}</span>
                      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-canvas">
                        <span
                          className={`block h-full rounded-full ${tone.bar}`}
                          style={{ width: `${a.risk}%` }}
                        />
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-sub">{a.lastActive}</td>
                </tr>
              )
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-sub">
                  No agents match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <AgentDrawer
          agent={selected}
          onClose={() => setSelected(null)}
          onEdit={(a) => {
            setSelected(null)
            setEditing(a)
          }}
          onDelete={(a) => {
            deleteAgent(a.id)
            setSelected(null)
          }}
        />
      )}

      {editing && (
        <AgentFormModal
          agent={editing}
          onSave={(patch) => updateAgent(editing.id, patch)}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  )
}
