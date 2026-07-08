import { Database } from 'lucide-react'
import { scopeExposure } from '../data/mock.js'

const max = Math.max(...scopeExposure.map((s) => s.agents))

export default function ScopeExposure() {
  return (
    <section
      aria-label="Data scope exposure"
      className="card-hover flex h-full flex-col rounded-card bg-card p-5 shadow-soft sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warn-soft text-warn">
          <Database size={20} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold">Scope exposure</h2>
          <p className="text-sm text-sub">Agents that can reach each system</p>
        </div>
      </div>

      <ul className="mt-5 flex flex-1 flex-col justify-between gap-4">
        {scopeExposure.map((s, i) => (
          <li key={s.scope} className="group">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                {s.scope}
                {s.pii && (
                  <span className="rounded-full bg-danger-soft px-2 py-0.5 text-[10px] font-bold text-danger">
                    PII
                  </span>
                )}
              </span>
              <span className="font-semibold tabular-nums text-sub transition-colors group-hover:text-ink">
                {s.agents}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas">
              <div
                className={`grow-x h-full rounded-full transition-[filter] group-hover:brightness-110 ${
                  s.pii ? 'bg-gradient-to-r from-forest to-warn' : 'bg-forest'
                }`}
                style={{ width: `${(s.agents / max) * 100}%`, '--i': i }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
