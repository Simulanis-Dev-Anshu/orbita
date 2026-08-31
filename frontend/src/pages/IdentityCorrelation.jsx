import { useMemo, useState } from 'react'
import { ArrowDown, GitBranch, Search } from 'lucide-react'
import { identityCorrelations } from '../data/platform.js'

const KIND_TONE = {
  Employee: 'bg-forest text-brand',
  Device: 'bg-muted text-ink',
  'AI App': 'bg-brand-soft text-forest',
  Account: 'bg-[#fff3dc] text-[#9a6200]',
  OAuth: 'bg-[#e8f1ff] text-[#1a4d9c]',
  Activity: 'bg-danger-soft text-danger',
}

function riskTone(risk) {
  if (risk >= 75) return 'bg-danger-soft text-danger'
  if (risk >= 50) return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

export default function IdentityCorrelation() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(identityCorrelations[0]?.id ?? null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return identityCorrelations
    return identityCorrelations.filter(
      (c) =>
        c.employee.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.chain.some(
          (step) =>
            step.label.toLowerCase().includes(q) ||
            step.detail.toLowerCase().includes(q) ||
            step.kind.toLowerCase().includes(q),
        ),
    )
  }, [query])

  const active = rows.find((r) => r.id === selected) || rows[0] || null

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <GitBranch size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">Identity Correlation</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Employee + Device + App + Account + OAuth + Activity
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Stitch every signal into one chain, e.g. Anshu → MacBook → Cursor → GitHub → Production
              Repo.
            </p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold">
            {identityCorrelations.length} correlated paths
          </span>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Search correlations</span>
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Anshu, Cursor, GitHub, production…"
            className="w-full rounded-btn border border-line bg-card py-2.5 pr-4 pl-10 text-sm shadow-soft outline-none transition-colors placeholder:text-sub focus:border-brand"
          />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <section className="space-y-2 lg:col-span-5">
          {rows.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c.id)}
              className={`w-full cursor-pointer rounded-card border p-4 text-left shadow-soft transition-colors ${
                active?.id === c.id
                  ? 'border-forest bg-brand-soft/30'
                  : 'border-line bg-card hover:border-ink/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{c.employee}</p>
                  <p className="text-xs text-sub">
                    {c.team} · {c.lastActivity}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskTone(c.risk)}`}>
                  {c.risk}
                </span>
              </div>
              <p className="mt-2 truncate font-mono text-[11px] text-sub">
                {c.chain.map((s) => s.label).join(' → ')}
              </p>
            </button>
          ))}
          {rows.length === 0 && (
            <p className="rounded-card bg-card px-5 py-10 text-center text-sm text-sub shadow-soft">
              No correlations match.
            </p>
          )}
        </section>

        <aside className="rounded-card bg-card p-5 shadow-soft sm:p-6 lg:col-span-7">
          <p className="ox-label text-sub">Correlated path</p>
          {active ? (
            <div className="mt-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold tracking-tight text-ink">{active.employee}</h3>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskTone(active.risk)}`}>
                  path risk {active.risk}
                </span>
              </div>
              <ol className="space-y-1">
                {active.chain.map((step, i) => (
                  <li key={`${step.kind}-${i}`}>
                    <div className="flex items-start gap-3 rounded-2xl border border-line bg-canvas p-3.5">
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${KIND_TONE[step.kind] || 'bg-muted'}`}
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold tracking-wide text-sub uppercase">
                          {step.kind}
                        </p>
                        <p className="text-sm font-semibold text-ink">{step.label}</p>
                        <p className="mt-0.5 text-xs text-sub">{step.detail}</p>
                      </div>
                    </div>
                    {i < active.chain.length - 1 && (
                      <div className="flex justify-center py-1 text-sub">
                        <ArrowDown size={14} aria-hidden="true" />
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="mt-4 text-sm text-sub">Select a path to inspect.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
