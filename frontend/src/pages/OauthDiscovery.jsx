import { useMemo, useState } from 'react'
import { ArrowDown, KeyRound, Search } from 'lucide-react'
import { oauthGrants, OAUTH_PROVIDERS } from '../data/platform.js'

function statusTone(status) {
  if (status === 'orphaned') return 'bg-danger-soft text-danger'
  if (status === 'personal') return 'bg-warn-soft text-warn'
  return 'bg-muted text-ink'
}

function riskTone(risk) {
  if (risk >= 75) return 'bg-danger-soft text-danger'
  if (risk >= 50) return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

export default function OauthDiscovery() {
  const [provider, setProvider] = useState('ALL')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(oauthGrants[0]?.id ?? null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return oauthGrants.filter((g) => {
      if (provider !== 'ALL' && g.provider !== provider) return false
      if (!q) return true
      return (
        g.user.toLowerCase().includes(q) ||
        g.app.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.provider.toLowerCase().includes(q)
      )
    })
  }, [provider, query])

  const active = rows.find((g) => g.id === selected) || rows[0] || null

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <KeyRound size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">OAuth Discovery</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              User → OAuth App → Permissions → Resources
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Connect Google, Microsoft, GitHub, Slack, Notion, and Atlassian. Map every grant to the
              data it can touch.
            </p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold">
            {oauthGrants.length} grants
          </span>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setProvider('ALL')}
            className={`shrink-0 cursor-pointer rounded-btn px-3 py-2 text-xs font-semibold ${
              provider === 'ALL' ? 'bg-forest text-white' : 'bg-muted text-ink hover:bg-line'
            }`}
          >
            All
          </button>
          {OAUTH_PROVIDERS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`shrink-0 cursor-pointer rounded-btn px-3 py-2 text-xs font-semibold ${
                provider === p ? 'bg-forest text-white' : 'bg-muted text-ink hover:bg-line'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Search OAuth grants</span>
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user, app, email…"
            className="w-full rounded-btn border border-line bg-card py-2.5 pr-4 pl-10 text-sm shadow-soft outline-none transition-colors placeholder:text-sub focus:border-brand"
          />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <section className="overflow-hidden rounded-card bg-card shadow-soft lg:col-span-7">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-muted/60 text-xs font-semibold tracking-wide text-sub uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold sm:px-5">User</th>
                  <th className="px-4 py-3 font-semibold">Provider</th>
                  <th className="px-4 py-3 font-semibold">OAuth app</th>
                  <th className="px-4 py-3 font-semibold">Risk</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((g) => (
                  <tr
                    key={g.id}
                    onClick={() => setSelected(g.id)}
                    className={`cursor-pointer border-b border-line/70 last:border-0 hover:bg-muted/40 ${
                      active?.id === g.id ? 'bg-brand-soft/40' : ''
                    }`}
                  >
                    <td className="px-4 py-3.5 sm:px-5">
                      <p className="font-semibold text-ink">{g.user}</p>
                      <p className="text-xs text-sub">{g.email}</p>
                    </td>
                    <td className="px-4 py-3.5">{g.provider}</td>
                    <td className="px-4 py-3.5 font-medium">{g.app}</td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskTone(g.risk)}`}>
                        {g.risk}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone(g.status)}`}>
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-card bg-card p-5 shadow-soft sm:p-6 lg:col-span-5">
          <p className="ox-label text-sub">Grant chain</p>
          {active ? (
            <div className="mt-4 space-y-2">
              {[
                { label: 'User', value: `${active.user} · ${active.email}` },
                { label: 'OAuth App', value: `${active.app} via ${active.provider}` },
                { label: 'Permissions', value: active.permissions.join(', ') },
                { label: 'Resources', value: active.resources.join(', ') },
              ].map((step, i, arr) => (
                <div key={step.label}>
                  <div className="rounded-2xl border border-line bg-canvas p-3.5">
                    <p className="text-[11px] font-semibold tracking-wide text-sub uppercase">{step.label}</p>
                    <p className="mt-1 text-sm font-medium text-ink">{step.value}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-center py-1 text-sub">
                      <ArrowDown size={14} aria-hidden="true" />
                    </div>
                  )}
                </div>
              ))}
              <p className="pt-2 text-xs text-sub">
                Granted {active.grantedAt} · Last used {active.lastUsed}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-sub">Select a grant to inspect the chain.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
