import { useState } from 'react'
import { FileDown, CircleCheck, TriangleAlert, CircleX, FileText } from 'lucide-react'
import { complianceFrameworks, dpdpChecklist } from '../data/mock.js'

const statusIcon = {
  pass: { Icon: CircleCheck, className: 'text-forest' },
  warn: { Icon: TriangleAlert, className: 'text-warn' },
  fail: { Icon: CircleX, className: 'text-danger' },
}

const artifacts = [
  { name: 'Q2 FY27 Agent Inventory Snapshot', date: 'Jul 1, 2026', size: '2.4 MB' },
  { name: 'DPDP Data-Processor Register', date: 'Jun 28, 2026', size: '890 KB' },
  { name: 'Orphaned-Agent Remediation Log', date: 'Jun 15, 2026', size: '410 KB' },
]

function progressTone(p) {
  if (p >= 70) return 'bg-forest'
  if (p >= 50) return 'bg-warn'
  return 'bg-danger'
}

export default function Compliance() {
  const [exported, setExported] = useState(null)

  const exportReport = (id) => {
    setExported(id)
    setTimeout(() => setExported(null), 2000)
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Framework scorecards */}
      <section
        aria-label="Compliance frameworks"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {complianceFrameworks.map((f) => (
          <article key={f.id} className="flex flex-col rounded-card bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">{f.name}</h2>
                <p className="text-xs text-sub">{f.region}</p>
              </div>
              <span className="text-2xl font-bold tabular-nums tracking-tight">{f.progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-canvas">
              <div
                className={`h-full rounded-full ${progressTone(f.progress)}`}
                style={{ width: `${f.progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-sub">
              {f.controls.passed}/{f.controls.total} controls · {f.note}
            </p>
            <button
              type="button"
              onClick={() => exportReport(f.id)}
              className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-btn border border-line bg-canvas px-3 py-2 text-xs font-semibold transition-colors hover:border-forest"
            >
              <FileDown size={14} aria-hidden="true" />
              {exported === f.id ? 'Report queued ✓' : 'Export auditor PDF'}
            </button>
          </article>
        ))}
      </section>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12">
        {/* DPDP checklist */}
        <section
          aria-label="DPDP Act readiness"
          className="rounded-card bg-card p-5 shadow-soft sm:p-6 xl:col-span-7"
        >
          <h2 className="text-base font-semibold">DPDP Act 2023 readiness</h2>
          <p className="text-sm text-sub">
            Agent-specific obligations under India's data protection law
          </p>
          <ul className="mt-4 space-y-3">
            {dpdpChecklist.map((item) => {
              const { Icon, className } = statusIcon[item.status]
              return (
                <li key={item.id} className="flex items-start gap-3 rounded-2xl bg-canvas p-4">
                  <Icon size={18} className={`mt-0.5 shrink-0 ${className}`} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-sub">{item.detail}</p>
                  </div>
                  <span
                    className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${
                      item.status === 'pass'
                        ? 'bg-brand-soft text-forest'
                        : item.status === 'warn'
                          ? 'bg-warn-soft text-warn'
                          : 'bg-danger-soft text-danger'
                    }`}
                  >
                    {item.status}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Audit artifacts */}
        <section
          aria-label="Audit evidence"
          className="rounded-card bg-card p-5 shadow-soft sm:p-6 xl:col-span-5"
        >
          <h2 className="text-base font-semibold">Audit evidence</h2>
          <p className="text-sm text-sub">Quarterly artifacts your auditor can pull directly</p>
          <ul className="mt-4 space-y-3">
            {artifacts.map((a) => (
              <li key={a.name} className="flex items-center gap-3 rounded-2xl bg-canvas p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-forest">
                  <FileText size={16} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-sub">
                    {a.date} · {a.size}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 cursor-pointer rounded-lg p-2 text-sub transition-colors hover:bg-card hover:text-ink"
                  aria-label={`Download ${a.name}`}
                >
                  <FileDown size={16} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-2xl border border-dashed border-line p-4 text-center">
            <p className="text-xs leading-relaxed text-sub">
              <span className="font-semibold text-ink">Auditor workspace</span> — invite your
              auditor with read-only access instead of emailing PDFs.
            </p>
            <button
              type="button"
              className="mt-3 cursor-pointer rounded-btn bg-forest px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              Invite auditor
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
