import { ArrowDown, ShieldCheck } from 'lucide-react'
import { complianceCenter as c } from '../data/platform.js'

export default function ComplianceCenter() {
  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <ShieldCheck size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">Compliance Center</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">AI Governance</h2>
            <p className="mt-1 text-sm text-sub">
              Requirement → policy → asset → activity → violation → remediation → evidence
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between gap-3">
            <p className="text-sm font-semibold text-ink">Compliance</p>
            <p className="text-2xl font-bold tabular-nums text-ink">{c.score}%</p>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-forest" style={{ width: `${c.score}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-canvas px-3 py-3">
              <p className="text-lg font-bold text-ink">
                {c.policies.pass}/{c.policies.total}
              </p>
              <p className="text-xs text-sub">Policies</p>
            </div>
            <div className="rounded-2xl bg-canvas px-3 py-3">
              <p className="text-lg font-bold text-ink">{c.evidence}</p>
              <p className="text-xs text-sub">Evidence</p>
            </div>
            <div className="rounded-2xl bg-canvas px-3 py-3">
              <p className="text-lg font-bold text-danger">{c.violations}</p>
              <p className="text-xs text-sub">Violations</p>
            </div>
            <div className="rounded-2xl bg-canvas px-3 py-3">
              <p className="text-lg font-bold text-forest">{c.resolved}</p>
              <p className="text-xs text-sub">Resolved</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {c.chain.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-1.5">
              <span className="rounded-btn bg-muted px-2.5 py-1 text-[11px] font-semibold text-ink">{step}</span>
              {i < c.chain.length - 1 && (
                <ArrowDown size={12} className="rotate-[-90deg] text-sub" aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-card bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-line bg-muted/60 text-xs font-semibold tracking-wide text-sub uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold sm:px-5">Requirement</th>
                <th className="px-4 py-3 font-semibold">Policy</th>
                <th className="px-4 py-3 font-semibold">AI asset</th>
                <th className="px-4 py-3 font-semibold">Activity</th>
                <th className="px-4 py-3 font-semibold">Violation</th>
                <th className="px-4 py-3 font-semibold">Remediation</th>
                <th className="px-4 py-3 font-semibold">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.id} className="border-b border-line/70 last:border-0 align-top">
                  <td className="px-4 py-3.5 font-medium text-ink sm:px-5">{r.requirement}</td>
                  <td className="px-4 py-3.5 text-sub">{r.policy}</td>
                  <td className="px-4 py-3.5 text-sub">{r.asset}</td>
                  <td className="px-4 py-3.5 text-sub">{r.activity}</td>
                  <td className="px-4 py-3.5 font-semibold text-danger">{r.violation}</td>
                  <td className="px-4 py-3.5 text-sub">{r.remediation}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-ink">{r.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
