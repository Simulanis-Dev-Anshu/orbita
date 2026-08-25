import { Bomb } from 'lucide-react'
import { blastRadii } from '../data/platform.js'

function levelTone(level) {
  if (level === 'CRITICAL') return 'bg-danger text-white'
  if (level === 'HIGH') return 'bg-danger-soft text-danger'
  if (level === 'MEDIUM') return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

export default function BlastRadius() {
  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-soft text-danger">
            <Bomb size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">Blast Radius</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              If this AI account is compromised, what can it reach?
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Actionable reach counts — repos, DBs, Drive files, Slack channels — not just a map.
            </p>
          </div>
        </div>
      </section>

      <ul className="grid gap-3 lg:grid-cols-2">
        {blastRadii.map((b) => (
          <li key={b.id} className="rounded-card border border-line bg-card p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold tracking-tight text-ink">{b.subject}</p>
                <p className="text-xs text-sub">{b.identity}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-sub">Potential blast radius</p>
                <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${levelTone(b.level)}`}>
                  {b.level}
                </span>
              </div>
            </div>

            <p className="ox-label mt-5 text-sub">Can reach</p>
            <ul className="mt-2 space-y-1.5">
              {b.reaches.map((r) => (
                <li
                  key={r.system}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-canvas px-3.5 py-2.5 text-sm"
                >
                  <span className="font-medium text-ink">{r.system}</span>
                  <span className="tabular-nums text-sub">
                    <span className="font-semibold text-ink">{r.count}</span> {r.unit}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
