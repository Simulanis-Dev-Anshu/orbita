import { useMemo, useState } from 'react'
import { Building2, Search, UserRound, UserRoundX } from 'lucide-react'
import { aiAccounts } from '../data/platform.js'

function kindTone(kind) {
  if (kind === 'personal') return 'bg-danger-soft text-danger border-danger/20'
  return 'bg-brand-soft text-forest border-brand/20'
}

export default function AiAccounts() {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState('ALL')

  const stats = useMemo(() => {
    let company = 0
    let personal = 0
    for (const u of aiAccounts) {
      for (const app of u.apps) {
        for (const a of app.accounts) {
          if (a.kind === 'personal') personal += 1
          else company += 1
        }
      }
    }
    return { company, personal }
  }, [])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return aiAccounts
      .map((u) => {
        const apps = u.apps
          .map((app) => ({
            ...app,
            accounts: app.accounts.filter((a) => kind === 'ALL' || a.kind === kind),
          }))
          .filter((app) => app.accounts.length > 0)
        return { ...u, apps }
      })
      .filter((u) => {
        if (u.apps.length === 0) return false
        if (!q) return true
        return (
          u.user.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.apps.some((app) => app.name.toLowerCase().includes(q))
        )
      })
  }, [query, kind])

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <UserRound size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">AI Account Detection</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Company account vs personal account
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Knowing someone uses ChatGPT is not enough. See whether they are on the controlled
              corporate account or a personal one, the visibility gap Netskope calls out for AI.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-brand-soft px-3 py-1.5 text-forest">
              {stats.company} company
            </span>
            <span className="rounded-full bg-danger-soft px-3 py-1.5 text-danger">
              {stats.personal} personal
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: 'All accounts' },
            { id: 'company', label: 'Company only' },
            { id: 'personal', label: 'Personal only' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setKind(f.id)}
              className={`cursor-pointer rounded-btn px-3 py-2 text-xs font-semibold ${
                kind === f.id ? 'bg-forest text-white' : 'bg-muted text-ink hover:bg-line'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Search AI accounts</span>
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Anshu, ChatGPT, Claude…"
            className="w-full rounded-btn border border-line bg-card py-2.5 pr-4 pl-10 text-sm shadow-soft outline-none transition-colors placeholder:text-sub focus:border-brand"
          />
        </label>
      </div>

      <ul className="space-y-4">
        {rows.map((u) => (
          <li key={u.id} className="rounded-card border border-line bg-card p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-xs font-semibold text-brand">
                {u.user.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="font-semibold text-ink">{u.user}</p>
                <p className="text-xs text-sub">
                  {u.email} · {u.team}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4 border-l border-line pl-4 font-mono text-[13px]">
              {u.apps.map((app) => (
                <div key={app.name}>
                  <p className="font-sans text-sm font-semibold text-ink">{app.name}</p>
                  <ul className="mt-2 space-y-2">
                    {app.accounts.map((a, i) => (
                      <li
                        key={a.id}
                        className={`rounded-2xl border px-3.5 py-3 ${kindTone(a.kind)}`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 font-mono text-sub" aria-hidden="true">
                              {i === app.accounts.length - 1 ? '└──' : '├──'}
                            </span>
                            <div>
                              <p className="flex items-center gap-1.5 font-sans text-sm font-semibold">
                                {a.kind === 'company' ? (
                                  <Building2 size={14} aria-hidden="true" />
                                ) : (
                                  <UserRoundX size={14} aria-hidden="true" />
                                )}
                                {a.label}
                              </p>
                              <p className="mt-0.5 font-sans text-xs opacity-80">
                                {a.identity} · {a.plan}
                              </p>
                            </div>
                          </div>
                          <div className="text-right font-sans text-xs">
                            <p className="font-semibold">risk {a.risk}</p>
                            <p className="opacity-80">{a.lastSeen}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {rows.length === 0 && (
        <p className="rounded-card bg-card px-5 py-10 text-center text-sm text-sub shadow-soft">
          No account mappings match this filter.
        </p>
      )}
    </div>
  )
}
