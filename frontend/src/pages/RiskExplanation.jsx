import { useState } from 'react'
import { MessageCircleWarning } from 'lucide-react'
import { aiRiskScores } from '../data/platform.js'

function toneClass(tone) {
  if (tone === 'critical') return 'bg-danger-soft text-danger'
  if (tone === 'high') return 'bg-warn-soft text-warn'
  if (tone === 'medium') return 'bg-[#fff3dc] text-[#9a6200]'
  return 'bg-brand-soft text-forest'
}

function scoreColor(score) {
  if (score >= 75) return 'text-danger'
  if (score >= 50) return 'text-warn'
  return 'text-forest'
}

export default function RiskExplanation() {
  const [selected, setSelected] = useState(aiRiskScores[0]?.id ?? null)
  const active = aiRiskScores.find((r) => r.id === selected) || aiRiskScores[0]

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <MessageCircleWarning size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">Risk Explanation</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Don’t just show 91/100. Show why
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Adoption dies on unexplained scores. Every number ships with plain-language drivers.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-12">
        <ul className="space-y-2 lg:col-span-4">
          {aiRiskScores.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setSelected(r.id)}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-card border p-4 text-left shadow-soft ${
                  active?.id === r.id
                    ? 'border-forest bg-brand-soft/30'
                    : 'border-line bg-card hover:border-ink/20'
                }`}
              >
                <span className="font-semibold text-ink">{r.name}</span>
                <span className={`text-lg font-bold tabular-nums ${scoreColor(r.score)}`}>{r.score}</span>
              </button>
            </li>
          ))}
        </ul>

        {active && (
          <section className="rounded-card bg-card p-5 shadow-soft sm:p-6 lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3">
              <p className={`text-3xl font-bold tabular-nums ${scoreColor(active.score)}`}>
                {active.score}
                <span className="text-base font-medium text-sub">/100</span>
              </p>
              <p className="text-sm text-sub">{active.name}</p>
            </div>
            <p className="ox-label mt-6 text-sub">Why?</p>
            <ul className="mt-3 space-y-2">
              {active.why.map((w) => (
                <li
                  key={w.text}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${toneClass(w.tone)}`}
                >
                  <span className="mt-0.5 text-sm" aria-hidden="true">
                    {w.tone === 'critical' || w.tone === 'high' ? '●' : '○'}
                  </span>
                  <span className="text-sm font-semibold">{w.text}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
