import { ArrowDown, Swords } from 'lucide-react'
import { attackPaths } from '../data/platform.js'

function sevTone(sev) {
  if (sev === 'CRITICAL') return 'bg-danger-soft text-danger'
  if (sev === 'HIGH') return 'bg-warn-soft text-warn'
  return 'bg-[#fff3dc] text-[#9a6200]'
}

export default function AttackPaths() {
  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-soft text-danger">
            <Swords size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">AI Attack Paths</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Attacker → Employee → Agent → MCP → cloud → data
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Potential attack paths Orbita can surface before they become incidents.
            </p>
          </div>
        </div>
      </section>

      <ul className="space-y-3">
        {attackPaths.map((p) => (
          <li key={p.id} className="rounded-card border border-line bg-card p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-ink">{p.title}</p>
                <p className="mt-1 text-sm text-sub">{p.summary}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${sevTone(p.severity)}`}>
                {p.severity}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {p.steps.map((step, i) => (
                <span key={`${step}-${i}`} className="inline-flex items-center gap-1.5">
                  <span className="rounded-btn bg-canvas px-2.5 py-1.5 text-xs font-semibold text-ink">
                    {step}
                  </span>
                  {i < p.steps.length - 1 && (
                    <ArrowDown size={12} className="rotate-[-90deg] text-sub" aria-hidden="true" />
                  )}
                </span>
              ))}
            </div>
            <p className="mt-3 font-mono text-[12px] text-sub">{p.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
