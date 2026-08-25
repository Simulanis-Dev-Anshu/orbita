import { useState } from 'react'
import { ArrowDown, FlaskConical } from 'lucide-react'
import { attackSimulations } from '../data/platform.js'

function impactTone(level) {
  if (level === 'CRITICAL') return 'bg-danger-soft text-danger'
  if (level === 'HIGH') return 'bg-warn-soft text-warn'
  return 'bg-[#fff3dc] text-[#9a6200]'
}

export default function AttackSimulation() {
  const [selected, setSelected] = useState(attackSimulations[0].id)
  const active = attackSimulations.find((s) => s.id === selected) || attackSimulations[0]

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-soft text-danger">
            <FlaskConical size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="ox-label text-sub">AI Attack Simulation</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              “What happens if Cursor gets compromised?”
            </h2>
            <p className="mt-1 text-sm text-sub">
              Simulate compromise paths and quantify systems, databases, and repos at risk.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {attackSimulations.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelected(s.id)}
              className={`cursor-pointer rounded-btn px-3 py-2 text-left text-xs font-semibold ${
                selected === s.id ? 'bg-forest text-white' : 'bg-muted text-ink hover:bg-line'
              }`}
            >
              {s.prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-card border border-line bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-base font-semibold text-ink">Orbita simulation</p>
          <div className="text-right">
            <p className="text-[11px] font-medium text-sub">Potential impact</p>
            <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${impactTone(active.impact)}`}>
              {active.impact}
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-1 font-mono text-sm text-sub">
          {active.chain.map((step, i) => (
            <p key={`${step}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <ArrowDown size={12} aria-hidden="true" />}
              <span className={i === 0 ? 'font-sans font-semibold text-ink' : ''}>{step}</span>
            </p>
          ))}
        </div>

        <p className="ox-label mt-6 text-sub">Affected</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {active.affected.map((a) => (
            <div key={a.label} className="rounded-2xl bg-canvas px-4 py-3">
              <p className="text-2xl font-bold tabular-nums text-ink">{a.value}</p>
              <p className="text-xs text-sub">{a.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
