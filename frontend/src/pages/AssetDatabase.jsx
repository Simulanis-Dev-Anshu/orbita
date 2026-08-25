import { useMemo, useState } from 'react'
import { Boxes, Search } from 'lucide-react'
import { ASSET_TYPES, ASSET_TYPE_META } from '../data/asset.js'
import { aiAssets } from '../data/platform.js'

function riskTone(risk) {
  if (risk >= 75) return 'bg-danger-soft text-danger'
  if (risk >= 50) return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

function statusTone(status) {
  if (status === 'orphaned') return 'bg-danger-soft text-danger'
  if (status === 'pending') return 'bg-warn-soft text-warn'
  return 'bg-muted text-ink'
}

export default function Assets() {
  const [type, setType] = useState('ALL')
  const [query, setQuery] = useState('')

  const counts = useMemo(() => {
    const map = Object.fromEntries(ASSET_TYPES.map((t) => [t, 0]))
    for (const a of aiAssets) map[a.type] = (map[a.type] || 0) + 1
    return map
  }, [])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return aiAssets.filter((a) => {
      if (type !== 'ALL' && a.type !== type) return false
      if (!q) return true
      return (
        a.name.toLowerCase().includes(q) ||
        a.vendor.toLowerCase().includes(q) ||
        a.owner.toLowerCase().includes(q) ||
        a.team.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      )
    })
  }, [type, query])

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Boxes size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">AI Asset Database</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Central inventory of every AI surface
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Apps, agents, models, MCP servers, APIs, extensions, and local models, typed and owned.
            </p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold">
            {aiAssets.length} assets
          </span>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setType('ALL')}
            className={`shrink-0 cursor-pointer rounded-btn px-3 py-2 text-xs font-semibold transition-colors ${
              type === 'ALL' ? 'bg-forest text-white' : 'bg-muted text-ink hover:bg-line'
            }`}
          >
            All · {aiAssets.length}
          </button>
          {ASSET_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`shrink-0 cursor-pointer rounded-btn px-3 py-2 text-xs font-semibold transition-colors ${
                type === t ? 'bg-forest text-white' : 'bg-muted text-ink hover:bg-line'
              }`}
            >
              {ASSET_TYPE_META[t].label} · {counts[t] || 0}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Search assets</span>
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, vendor, owner, team…"
            className="w-full rounded-btn border border-line bg-card py-2.5 pr-4 pl-10 text-sm shadow-soft outline-none transition-colors placeholder:text-sub focus:border-brand"
          />
        </label>
        <span className="text-xs font-medium text-sub">{rows.length} shown</span>
      </div>

      <section className="overflow-hidden rounded-card bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-muted/60 text-xs font-semibold tracking-wide text-sub uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold sm:px-5">Asset</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Risk</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-b border-line/70 last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3.5 sm:px-5">
                    <p className="font-semibold text-ink">{a.name}</p>
                    <p className="text-xs text-sub">
                      {a.vendor} · {a.team}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold">
                      {ASSET_TYPE_META[a.type]?.label ?? a.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-ink">{a.owner}</td>
                  <td className="px-4 py-3.5 text-sub">{a.source}</td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskTone(a.risk)}`}>
                      {a.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone(a.status)}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sub">{a.lastSeen}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-sub">
                    No assets match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
