import { useMemo, useState } from 'react'
import { ArrowDown, Search, Server } from 'lucide-react'
import { mcpDiscoveries } from '../data/platform.js'

function statusTone(status) {
  if (status === 'shadow' || status === 'orphaned') return 'bg-danger-soft text-danger'
  if (status === 'new') return 'bg-warn-soft text-warn'
  return 'bg-muted text-ink'
}

function riskTone(risk) {
  if (risk >= 75) return 'bg-danger-soft text-danger'
  if (risk >= 50) return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

export default function McpDiscovery() {
  const [query, setQuery] = useState('')
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return mcpDiscoveries
    return mcpDiscoveries.filter(
      (m) =>
        m.app.toLowerCase().includes(q) ||
        m.mcp.toLowerCase().includes(q) ||
        m.target.toLowerCase().includes(q) ||
        m.owner.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Server size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">MCP Discovery</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              AI app → MCP server → system
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Claude → GitHub MCP → GitHub. Cursor → Postgres MCP → Database. MCP is first-class
              visibility, not an afterthought.
            </p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold">
            {mcpDiscoveries.length} chains
          </span>
        </div>
      </section>

      <label className="relative block max-w-sm">
        <span className="sr-only">Search MCP</span>
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Claude, Postgres MCP…"
          className="w-full rounded-btn border border-line bg-card py-2.5 pr-4 pl-10 text-sm shadow-soft outline-none placeholder:text-sub focus:border-brand"
        />
      </label>

      <ul className="grid gap-3 lg:grid-cols-2">
        {rows.map((m) => (
          <li key={m.id} className="rounded-card border border-line bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 font-mono text-[13px]">
                <p className="font-sans text-sm font-semibold text-ink">{m.app}</p>
                <p className="flex items-center gap-1 text-sub">
                  <ArrowDown size={12} aria-hidden="true" /> {m.mcp}
                </p>
                <p className="flex items-center gap-1 text-sub">
                  <ArrowDown size={12} aria-hidden="true" /> {m.target}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskTone(m.risk)}`}>
                  {m.risk}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone(m.status)}`}>
                  {m.status}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-sub">
              <span>
                Owner <span className="font-semibold text-ink">{m.owner}</span>
              </span>
              <span className={m.approved ? 'text-forest' : 'font-semibold text-danger'}>
                {m.approved ? 'Allowlisted' : 'Unapproved MCP'}
              </span>
              <span>{m.lastSeen}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
