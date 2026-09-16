import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppWindow, Puzzle, Search, ShieldAlert } from 'lucide-react'
import { browserExtensions, BROWSERS } from '../data/platform.js'
import { useLiveFindings } from '../lib/liveDiscovery.js'

function statusTone(status) {
  if (status === 'shadow') return 'bg-danger-soft text-danger'
  if (status === 'new') return 'bg-warn-soft text-warn'
  return 'bg-muted text-ink'
}

function riskTone(risk) {
  if (risk >= 70) return 'bg-danger-soft text-danger'
  if (risk >= 50) return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

function browserTone(browser) {
  if (browser === 'Chrome') return 'bg-[#fff0e8] text-forest'
  if (browser === 'Edge') return 'bg-[#e8f1ff] text-[#1a4d9c]'
  return 'bg-[#f3f0ff] text-[#4b3f8a]'
}

export default function BrowserExtensions() {
  const [browser, setBrowser] = useState('ALL')
  const [query, setQuery] = useState('')
  const { extensions: liveExt, mergeByName } = useLiveFindings()
  const catalog = useMemo(() => mergeByName(liveExt, browserExtensions), [liveExt, mergeByName])

  const browserCounts = useMemo(() => {
    const map = Object.fromEntries(BROWSERS.map((b) => [b, 0]))
    for (const ext of catalog) {
      for (const b of ext.browsers) map[b] = (map[b] || 0) + 1
    }
    return map
  }, [catalog])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.filter((ext) => {
      if (browser !== 'ALL' && !ext.browsers.includes(browser)) return false
      if (!q) return true
      return (
        ext.name.toLowerCase().includes(q) ||
        ext.vendor.toLowerCase().includes(q) ||
        ext.users.some((u) => u.toLowerCase().includes(q))
      )
    })
  }, [browser, query, catalog])

  const shadow = catalog.filter((e) => e.status === 'shadow').length
  const devices = catalog.reduce((n, e) => n + e.devices, 0)

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Puzzle size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">Browser Extension Discovery</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Endpoint inventory across Chrome, Edge & Safari
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Detect ChatGPT, Claude, Grammarly, Perplexity, Monica, Sider and other AI extensions,
              the same class of coverage Netskope provides for browser endpoints.{' '}
              <Link to="/app/discovery?tab=sources" className="font-semibold text-brand hover:underline">
                Upload a collector JSON
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-muted px-3 py-1.5">{catalog.length} extensions</span>
            <span className="rounded-full bg-muted px-3 py-1.5">{devices} devices</span>
            <span className="rounded-full bg-danger-soft px-3 py-1.5 text-danger">{shadow} shadow</span>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {BROWSERS.map((b) => {
            const active = browser === b
            return (
              <button
                key={b}
                type="button"
                onClick={() => setBrowser(active ? 'ALL' : b)}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-colors ${
                  active
                    ? 'border-forest bg-forest text-white'
                    : 'border-line bg-canvas hover:border-ink/20'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    active ? 'bg-white/10 text-white' : browserTone(b)
                  }`}
                >
                  <AppWindow size={16} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{b}</span>
                  <span className={`block text-xs ${active ? 'text-white/60' : 'text-sub'}`}>
                    {browserCounts[b]} extensions
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Search extensions</span>
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ChatGPT, Grammarly, Monica…"
            className="w-full rounded-btn border border-line bg-card py-2.5 pr-4 pl-10 text-sm shadow-soft outline-none transition-colors placeholder:text-sub focus:border-brand"
          />
        </label>
        {browser !== 'ALL' && (
          <button
            type="button"
            onClick={() => setBrowser('ALL')}
            className="cursor-pointer text-xs font-semibold text-brand hover:underline"
          >
            Clear browser filter
          </button>
        )}
      </div>

      <section className="overflow-hidden rounded-card bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-line bg-muted/60 text-xs font-semibold tracking-wide text-sub uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold sm:px-5">Extension</th>
                <th className="px-4 py-3 font-semibold">Browsers</th>
                <th className="px-4 py-3 font-semibold">Devices</th>
                <th className="px-4 py-3 font-semibold">Permissions</th>
                <th className="px-4 py-3 font-semibold">Risk</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((ext) => (
                <tr key={ext.id} className="border-b border-line/70 last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3.5 sm:px-5">
                    <p className="font-semibold text-ink">{ext.name}</p>
                    <p className="text-xs text-sub">
                      {ext.vendor} · v{ext.version}
                    </p>
                    <p className="mt-1 text-[11px] text-sub">
                      Users: {ext.users.slice(0, 3).join(', ')}
                      {ext.users.length > 3 ? ` +${ext.users.length - 3}` : ''}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {ext.browsers.map((b) => (
                        <span
                          key={b}
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${browserTone(b)}`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold tabular-nums text-ink">{ext.devices}</td>
                  <td className="max-w-[220px] px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {ext.permissions.slice(0, 2).map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center gap-1 rounded-[4px] bg-canvas px-1.5 py-0.5 text-[10px] text-sub"
                        >
                          {(p.toLowerCase().includes('all') || p.toLowerCase().includes('history')) && (
                            <ShieldAlert size={10} className="text-warn" aria-hidden="true" />
                          )}
                          {p}
                        </span>
                      ))}
                      {ext.permissions.length > 2 && (
                        <span className="text-[10px] text-sub">+{ext.permissions.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskTone(ext.risk)}`}>
                      {ext.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone(ext.status)}`}>
                      {ext.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sub">{ext.lastSeen}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-sub">
                    No extensions match this filter.
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
