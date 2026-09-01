import { Check, X, ScrollText } from 'lucide-react'
import { aiPolicies } from '../data/platform.js'

export default function PolicyEngine() {
  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <ScrollText size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="ox-label text-sub">AI Policy Engine</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Encode who may use what, then evaluate every asset
            </h2>
            <p className="mt-1 text-sm text-sub">
              Engineering allowlists, ban personal accounts, block prod access, require MCP write approval.
            </p>
          </div>
        </div>
      </section>

      <ul className="grid gap-3 lg:grid-cols-2">
        {aiPolicies.map((p) => (
          <li key={p.id} className="rounded-card border border-line bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{p.name}</p>
                <p className="mt-1 text-sm text-sub">{p.rule}</p>
              </div>
              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-forest capitalize">
                {p.status}
              </span>
            </div>

            {p.allow.length > 0 && (
              <ul className="mt-4 space-y-1">
                {p.allow.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-ink">
                    <Check size={14} className="text-forest" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            )}
            {p.deny.length > 0 && (
              <ul className="mt-3 space-y-1">
                {p.deny.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-ink">
                    <X size={14} className="text-danger" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs font-semibold text-danger">{p.violations} open violations</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
