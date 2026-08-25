import { useMemo, useState } from 'react'
import { ArrowDown, Search } from 'lucide-react'
import { analystReplies, nlSearchQueries } from '../data/platform.js'

function toneClass(tone) {
  if (tone === 'critical') return 'bg-danger-soft text-danger'
  if (tone === 'high') return 'bg-warn-soft text-warn'
  return 'bg-[#fff3dc] text-[#9a6200]'
}

export default function NlSecuritySearch() {
  const [query, setQuery] = useState(nlSearchQueries[0])
  const reply = useMemo(() => analystReplies[query], [query])

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Search size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="ox-label text-sub">Natural Language Security Search</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Your AI-native security interface
            </h2>
            <p className="mt-1 text-sm text-sub">
              Ask what changed, who has write access, who uses personal accounts, or what touches PII.
            </p>
          </div>
        </div>

        <label className="relative mt-5 block">
          <span className="sr-only">Security search</span>
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-btn border border-line bg-canvas py-3 pr-4 pl-10 text-sm outline-none focus:border-brand"
            placeholder="Which AI has GitHub write access?"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {nlSearchQueries.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuery(q)}
              className={`cursor-pointer rounded-btn px-3 py-1.5 text-xs font-semibold ${
                query === q ? 'bg-forest text-white' : 'bg-muted text-ink hover:bg-line'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {reply ? (
        <section className="rounded-card border border-line bg-card p-5 shadow-soft sm:p-6">
          <p className="text-lg font-semibold text-ink">{reply.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {reply.breakdown.map((b) => (
              <span key={b.label} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${toneClass(b.tone)}`}>
                {b.label}
              </span>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-canvas p-4">
            <p className="text-[11px] font-semibold tracking-wide text-sub uppercase">{reply.highest.title}</p>
            <div className="mt-2 space-y-1 font-mono text-sm text-sub">
              {reply.highest.chain.map((step, i) => (
                <p key={`${step}-${i}`} className="flex items-center gap-1.5">
                  {i > 0 && <ArrowDown size={12} aria-hidden="true" />}
                  <span className={i === 0 ? 'font-sans font-semibold text-ink' : ''}>{step}</span>
                </p>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <p className="rounded-card bg-card px-5 py-8 text-center text-sm text-sub shadow-soft">
          Pick a suggested query to see results.
        </p>
      )}
    </div>
  )
}
