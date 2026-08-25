import { Download, Package } from 'lucide-react'
import { aiBom } from '../data/platform.js'

export default function AiBom() {
  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
              <Package size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="ox-label text-sub">AI Bill of Materials</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">{aiBom.title}</h2>
              <p className="mt-1 text-sm text-sub">Generated {aiBom.generatedAt}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiBom.exports.map((fmt) => (
              <button
                key={fmt}
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-btn border border-line bg-card px-3 py-2 text-xs font-semibold text-ink hover:border-ink/25"
              >
                <Download size={14} aria-hidden="true" />
                Export {fmt}
              </button>
            ))}
          </div>
        </div>
      </section>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {aiBom.counts.map((c) => (
          <li key={c.label} className="rounded-card border border-line bg-card p-5 shadow-soft">
            <p className="text-3xl font-bold tabular-nums text-ink">{c.value}</p>
            <p className="mt-1 text-sm text-sub">{c.label}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
