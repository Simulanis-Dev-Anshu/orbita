import { useMemo, useState } from 'react'
import { ArrowDown, Database, Search } from 'lucide-react'
import { dataAccessMaps } from '../data/platform.js'

function riskTone(risk) {
  if (risk >= 75) return 'bg-danger-soft text-danger'
  if (risk >= 50) return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

export default function DataAccess() {
  const [query, setQuery] = useState('')
  const [piiOnly, setPiiOnly] = useState(false)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return dataAccessMaps.filter((d) => {
      if (piiOnly && d.sensitivity !== 'PII') return false
      if (!q) return true
      return (
        d.ai.toLowerCase().includes(q) ||
        d.system.toLowerCase().includes(q) ||
        d.dataset.toLowerCase().includes(q) ||
        d.sensitivity.toLowerCase().includes(q)
      )
    })
  }, [query, piiOnly])

  const piiSystems = dataAccessMaps.filter((d) => d.sensitivity === 'PII')

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Database size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">Data Access Mapping</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Claude → MCP → Postgres → customer_profiles → PII
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Answer “Which AI systems can access PII?” with a concrete path to the dataset.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPiiOnly((v) => !v)}
            className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold ${
              piiOnly ? 'bg-danger text-white' : 'bg-danger-soft text-danger'
            }`}
          >
            {piiSystems.length} with PII
          </button>
        </div>
      </section>

      <label className="relative block max-w-sm">
        <span className="sr-only">Search data access</span>
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search PII, Postgres, Claude…"
          className="w-full rounded-btn border border-line bg-card py-2.5 pr-4 pl-10 text-sm shadow-soft outline-none placeholder:text-sub focus:border-brand"
        />
      </label>

      <ul className="grid gap-3 lg:grid-cols-2">
        {rows.map((d) => (
          <li key={d.id} className="rounded-card border border-line bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 font-mono text-[13px] text-sub">
                <p className="font-sans text-sm font-semibold text-ink">{d.ai}</p>
                <p className="flex items-center gap-1">
                  <ArrowDown size={12} aria-hidden="true" /> {d.via}
                </p>
                <p className="flex items-center gap-1">
                  <ArrowDown size={12} aria-hidden="true" /> {d.system}
                </p>
                <p className="flex items-center gap-1">
                  <ArrowDown size={12} aria-hidden="true" /> {d.dataset}
                </p>
                <p className="flex items-center gap-1 font-sans font-semibold text-danger">
                  <ArrowDown size={12} aria-hidden="true" /> {d.sensitivity}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskTone(d.risk)}`}>
                {d.risk}
              </span>
            </div>
            <p className="mt-3 text-xs text-sub">
              Owner <span className="font-semibold text-ink">{d.owner}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
