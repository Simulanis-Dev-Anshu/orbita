import { ArrowDown, Wrench } from 'lucide-react'
import { recommendedFixes } from '../data/platform.js'

export default function RecommendedFixes() {
  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Wrench size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="ox-label text-sub">Recommended Fixes</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Risk → Why → Recommended fix
            </h2>
            <p className="mt-1 text-sm text-sub">
              Every finding ships with steps and an expected risk drop (e.g. 91 → 32).
            </p>
          </div>
        </div>
      </section>

      <ul className="space-y-3">
        {recommendedFixes.map((f) => (
          <li key={f.id} className="rounded-card border border-line bg-card p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-ink">{f.risk}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {f.why.map((w) => (
                    <span key={w} className="rounded-full bg-danger-soft px-2.5 py-1 text-[11px] font-semibold text-danger">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm font-semibold tabular-nums">
                <span className="text-danger">{f.scoreFrom}</span>
                <span className="mx-1 text-sub">→</span>
                <span className="text-forest">{f.scoreTo}</span>
              </p>
            </div>

            <p className="ox-label mt-5 text-sub">Recommended</p>
            <ol className="mt-2 space-y-2">
              {f.steps.map((s, i) => (
                <li key={s} className="flex items-start gap-2 text-sm text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-center gap-1 text-xs text-sub">
              Expected risk
              <ArrowDown size={12} className="text-forest" aria-hidden="true" />
              {f.scoreFrom} → {f.scoreTo}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
