import { useMemo, useState } from 'react'
import { Globe, Network, KeyRound, Monitor, Radar, Search } from 'lucide-react'
import { discoveredApps, DISCOVERY_SOURCES } from '../data/platform.js'

const SOURCE_META = {
  Browser: { icon: Globe, tone: 'bg-brand-soft text-forest' },
  Network: { icon: Network, tone: 'bg-muted text-ink' },
  OAuth: { icon: KeyRound, tone: 'bg-warn-soft text-warn' },
  Endpoint: { icon: Monitor, tone: 'bg-danger-soft text-danger' },
}

function statusTone(status) {
  if (status === 'shadow') return 'bg-danger-soft text-danger'
  if (status === 'new') return 'bg-warn-soft text-warn'
  return 'bg-muted text-ink'
}

function riskTone(risk) {
  if (risk >= 75) return 'text-danger'
  if (risk >= 50) return 'text-warn'
  return 'text-forest'
}

export default function Discovery() {
  const [source, setSource] = useState('ALL')
  const [query, setQuery] = useState('')

  const sourceCounts = useMemo(() => {
    const map = Object.fromEntries(DISCOVERY_SOURCES.map((s) => [s, 0]))
    for (const app of discoveredApps) {
      for (const s of app.sources) map[s] = (map[s] || 0) + 1
    }
    return map
  }, [])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return discoveredApps.filter((a) => {
      if (source !== 'ALL' && !a.sources.includes(source)) return false
      if (!q) return true
      return (
        a.name.toLowerCase().includes(q) ||
        a.vendor.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      )
    })
  }, [source, query])

  const shadow = discoveredApps.filter((a) => a.status === 'shadow').length
  const neu = discoveredApps.filter((a) => a.status === 'new').length

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Radar size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">AI Application Discovery</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Detect ChatGPT, Claude, Cursor, and more
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Signals from browser, network, OAuth grants, and endpoints — no agent SDKs required.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-muted px-3 py-1.5">{discoveredApps.length} apps</span>
            <span className="rounded-full bg-warn-soft px-3 py-1.5 text-warn">{neu} new</span>
            <span className="rounded-full bg-danger-soft px-3 py-1.5 text-danger">{shadow} shadow</span>
          </div>
        </div>

        {/* Source chips */}
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {DISCOVERY_SOURCES.map((s) => {
            const Meta = SOURCE_META[s]
            const Icon = Meta.icon
            const active = source === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSource(active ? 'ALL' : s)}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-colors ${
                  active
                    ? 'border-forest bg-forest text-white'
                    : 'border-line bg-canvas hover:border-ink/20'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    active ? 'bg-white/10 text-white' : Meta.tone
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{s}</span>
                  <span className={`block text-xs ${active ? 'text-white/60' : 'text-sub'}`}>
                    {sourceCounts[s]} detections
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Search discovered apps</span>
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ChatGPT, Claude, Cursor…"
            className="w-full rounded-btn border border-line bg-card py-2.5 pr-4 pl-10 text-sm shadow-soft outline-none transition-colors placeholder:text-sub focus:border-brand"
          />
        </label>
        {source !== 'ALL' && (
          <button
            type="button"
            onClick={() => setSource('ALL')}
            className="cursor-pointer text-xs font-semibold text-brand hover:underline"
          >
            Clear source filter
          </button>
        )}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((app) => (
          <li
            key={app.id}
            className="card-hover flex flex-col rounded-card border border-line bg-card p-5 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold tracking-tight text-ink">{app.name}</p>
                <p className="mt-0.5 text-xs text-sub">
                  {app.vendor} · {app.category}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone(app.status)}`}>
                {app.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {app.sources.map((s) => {
                const Icon = SOURCE_META[s].icon
                return (
                  <span
                    key={s}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${SOURCE_META[s].tone}`}
                  >
                    <Icon size={11} aria-hidden="true" />
                    {s}
                  </span>
                )
              })}
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-line pt-3 text-xs">
              <div className="space-y-0.5 text-sub">
                <p>
                  <span className="font-semibold text-ink">{app.users}</span> users
                </p>
                <p>First seen {app.firstSeen}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-semibold tabular-nums ${riskTone(app.risk)}`}>{app.risk}</p>
                <p className="text-sub">risk · {app.lastSeen}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {rows.length === 0 && (
        <p className="rounded-card bg-card px-5 py-10 text-center text-sm text-sub shadow-soft">
          No discoveries for this filter.
        </p>
      )}
    </div>
  )
}
