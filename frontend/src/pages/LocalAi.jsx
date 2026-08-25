import { useMemo, useState } from 'react'
import { Cpu, Search, Server } from 'lucide-react'
import { localAiRuntimes } from '../data/platform.js'

const RUNTIMES = ['All', 'Ollama', 'LM Studio', 'GPT4All', 'vLLM', 'Jan', 'Llama', 'Mistral', 'Qwen']

function statusTone(status) {
  if (status === 'orphaned') return 'bg-danger-soft text-danger'
  if (status === 'idle') return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

function riskTone(risk) {
  if (risk >= 75) return 'bg-danger-soft text-danger'
  if (risk >= 50) return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

export default function LocalAi() {
  const [runtime, setRuntime] = useState('All')
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return localAiRuntimes.filter((r) => {
      if (runtime !== 'All' && r.runtime !== runtime) return false
      if (!q) return true
      return (
        r.name.toLowerCase().includes(q) ||
        r.host.toLowerCase().includes(q) ||
        r.user.toLowerCase().includes(q) ||
        r.models.some((m) => m.toLowerCase().includes(q))
      )
    })
  }, [runtime, query])

  const running = localAiRuntimes.filter((r) => r.status === 'running').length
  const orphaned = localAiRuntimes.filter((r) => r.status === 'orphaned').length
  const modelCount = localAiRuntimes.reduce((n, r) => n + r.models.length, 0)

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Cpu size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">Local AI Discovery</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Models and runtimes on managed endpoints
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Ollama, LM Studio, GPT4All, vLLM, Jan, Llama, Mistral, Qwen — endpoint-layer visibility
              for locally running models (Netskope-class coverage, Orbita inventory).
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-muted px-3 py-1.5">{localAiRuntimes.length} hosts</span>
            <span className="rounded-full bg-muted px-3 py-1.5">{modelCount} models</span>
            <span className="rounded-full bg-brand-soft px-3 py-1.5 text-forest">{running} running</span>
            <span className="rounded-full bg-danger-soft px-3 py-1.5 text-danger">{orphaned} orphaned</span>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {RUNTIMES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRuntime(r)}
              className={`shrink-0 cursor-pointer rounded-btn px-3 py-2 text-xs font-semibold transition-colors ${
                runtime === r ? 'bg-forest text-white' : 'bg-muted text-ink hover:bg-line'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Search local AI</span>
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Ollama, host, model, user…"
            className="w-full rounded-btn border border-line bg-card py-2.5 pr-4 pl-10 text-sm shadow-soft outline-none transition-colors placeholder:text-sub focus:border-brand"
          />
        </label>
      </div>

      <ul className="grid gap-3 lg:grid-cols-2">
        {rows.map((r) => (
          <li key={r.id} className="rounded-card border border-line bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-ink">
                  <Server size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-ink">{r.name}</p>
                  <p className="text-xs text-sub">
                    {r.runtime} · {r.host}
                    {r.port ? `:${r.port}` : ''}
                  </p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone(r.status)}`}>
                {r.status}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.models.map((m) => (
                <span key={m} className="rounded-[4px] bg-canvas px-2 py-1 font-mono text-[11px] text-sub">
                  {m}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-line pt-3 text-xs">
              <div className="text-sub">
                <p>
                  <span className="font-semibold text-ink">{r.user}</span> · {r.team}
                </p>
                <p className="mt-0.5">Last seen {r.lastSeen}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskTone(r.risk)}`}>
                risk {r.risk}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {rows.length === 0 && (
        <p className="rounded-card bg-card px-5 py-10 text-center text-sm text-sub shadow-soft">
          No local runtimes match this filter.
        </p>
      )}
    </div>
  )
}
