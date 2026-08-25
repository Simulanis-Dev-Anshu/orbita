import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  FileDown,
  CircleCheck,
  TriangleAlert,
  CircleX,
  FileText,
  CalendarClock,
  ShieldCheck,
} from 'lucide-react'
import { complianceFrameworks, dpdpChecklist, complianceTrend, auditCalendar } from '../data/mock.js'
import useCountUp from '../hooks/useCountUp.js'

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

const trendSeries = [
  { key: 'dpdp', name: 'DPDP', color: '#FF4D00' },
  { key: 'soc2', name: 'SOC 2', color: '#E8930C' },
  { key: 'iso', name: 'ISO 27001', color: '#170702' },
  { key: 'euai', name: 'EU AI Act', color: '#E5484D' },
]

function progressTone(p) {
  if (p >= 70) return 'bg-forest'
  if (p >= 50) return 'bg-warn'
  return 'bg-danger'
}

function deadlineTone(days) {
  if (days <= 30) return 'bg-danger-soft text-danger'
  if (days <= 60) return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

/* Animated readiness ring: strokeDashoffset transitions in after mount */
function ReadinessRing({ value }) {
  const r = 52
  const circumference = 2 * Math.PI * r
  const [offset, setOffset] = useState(circumference)
  const count = useCountUp(value, 1200)

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setOffset(circumference * (1 - value / 100)),
    )
    return () => cancelAnimationFrame(id)
  }, [value, circumference])

  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="#FF4D00"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.2, 0.7, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight tabular-nums">{count}%</span>
        <span className="text-[11px] text-white/60">overall ready</span>
      </div>
    </div>
  )
}

export default function Compliance() {
  const [exported, setExported] = useState(null)

  const exportReport = (id) => {
    setExported(id)
    setTimeout(() => setExported(null), 2000)
  }

  const overall = Math.round(
    complianceFrameworks.reduce((sum, f) => sum + f.progress, 0) / complianceFrameworks.length,
  )
  const totalControls = complianceFrameworks.reduce((s, f) => s + f.controls.total, 0)
  const passedControls = complianceFrameworks.reduce((s, f) => s + f.controls.passed, 0)
  const checkCounts = {
    pass: dpdpChecklist.filter((i) => i.status === 'pass').length,
    warn: dpdpChecklist.filter((i) => i.status === 'warn').length,
    fail: dpdpChecklist.filter((i) => i.status === 'fail').length,
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Overall readiness + framework scorecards */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <article
          className="card-in card-hover relative flex flex-col items-center gap-4 overflow-hidden rounded-card bg-gradient-to-br from-forest to-forest-2 p-6 text-white shadow-lift sm:flex-row xl:col-span-4 xl:flex-col xl:justify-center"
          style={{ '--i': 0 }}
        >
          <div
            className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand/20 blur-2xl"
            aria-hidden="true"
          />
          <ReadinessRing value={overall} />
          <div className="relative text-center sm:text-left xl:text-center">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <ShieldCheck size={16} className="text-brand" aria-hidden="true" />
              Compliance posture
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">
              {passedControls} of {totalControls} controls passing across {complianceFrameworks.length}{' '}
              frameworks. Evidence is generated automatically from your agent inventory.
            </p>
          </div>
        </article>

        <section
          aria-label="Compliance frameworks"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-8"
        >
          {complianceFrameworks.map((f, i) => (
            <article
              key={f.id}
              className="card-in card-hover flex h-full flex-col rounded-card bg-card p-5 shadow-soft"
              style={{ '--i': i + 1 }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold">{f.name}</h2>
                  <p className="text-xs text-sub">{f.region}</p>
                </div>
                <span className="text-2xl font-bold tabular-nums tracking-tight">{f.progress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-canvas">
                <div
                  className={`grow-x h-full rounded-full ${progressTone(f.progress)}`}
                  style={{ width: `${f.progress}%`, '--i': i }}
                />
              </div>
              <p className="mt-2 text-xs text-sub">
                {f.controls.passed}/{f.controls.total} controls · {f.note}
              </p>
              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={() => exportReport(f.id)}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-btn border border-line bg-canvas px-3 py-2 text-xs font-semibold transition-all hover:border-brand active:scale-95"
                >
                  <FileDown size={14} aria-hidden="true" />
                  {exported === f.id ? 'Report queued ✓' : 'Export auditor PDF'}
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* Readiness trend + audit calendar */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <section
          aria-label="Readiness trend"
          className="card-in card-hover flex h-full flex-col rounded-card bg-card p-5 shadow-soft sm:p-6 xl:col-span-8"
          style={{ '--i': 5 }}
        >
          <h2 className="text-base font-semibold">Readiness trend</h2>
          <p className="text-sm text-sub">Control coverage per framework, last 6 months</p>
          <div className="mt-4 min-h-56 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#ECECEC" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#777777' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: '#777777' }}
                />
                <Tooltip
                  formatter={(v) => `${v}%`}
                  contentStyle={{
                    borderRadius: 14,
                    border: '1px solid #ECECEC',
                    boxShadow: '0 4px 20px rgba(0,0,0,.08)',
                    fontSize: 13,
                    fontFamily: 'inherit',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 13 }} iconType="circle" iconSize={8} />
                {trendSeries.map((s) => (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section
          aria-label="Upcoming audit deadlines"
          className="card-in card-hover flex h-full flex-col rounded-card bg-card p-5 shadow-soft sm:p-6 xl:col-span-4"
          style={{ '--i': 6 }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-forest">
              <CalendarClock size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-semibold">Audit calendar</h2>
              <p className="text-xs text-sub">Deadlines Sentinel is tracking</p>
            </div>
          </div>
          <ul className="mt-4 flex flex-1 flex-col justify-between gap-3">
            {auditCalendar.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-2xl bg-canvas p-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-sub">{a.date}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums ${deadlineTone(a.days)}`}>
                  {a.days}d
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* DPDP checklist + audit evidence */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <section
          aria-label="DPDP Act readiness"
          className="card-in card-hover flex h-full flex-col rounded-card bg-card p-5 shadow-soft sm:p-6 xl:col-span-7"
          style={{ '--i': 7 }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">DPDP Act 2023 readiness</h2>
              <p className="text-sm text-sub">
                Agent-specific obligations under India's data protection law
              </p>
            </div>
            <div className="flex gap-1.5">
              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-forest">
                {checkCounts.pass} pass
              </span>
              <span className="rounded-full bg-warn-soft px-2.5 py-1 text-[11px] font-semibold text-warn">
                {checkCounts.warn} warn
              </span>
              <span className="rounded-full bg-danger-soft px-2.5 py-1 text-[11px] font-semibold text-danger">
                {checkCounts.fail} fail
              </span>
            </div>
          </div>
          <ul className="mt-4 flex flex-1 flex-col justify-between gap-3">
            {dpdpChecklist.map((item) => {
              const { Icon, className } = statusIcon[item.status]
              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-2xl bg-canvas p-4 transition-transform duration-200 hover:translate-x-1"
                >
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
          className="card-in card-hover flex h-full flex-col rounded-card bg-card p-5 shadow-soft sm:p-6 xl:col-span-5"
          style={{ '--i': 8 }}
        >
          <h2 className="text-base font-semibold">Audit evidence</h2>
          <p className="text-sm text-sub">Quarterly artifacts your auditor can pull directly</p>
          <ul className="mt-4 flex-1 space-y-3">
            {artifacts.map((a) => (
              <li key={a.name} className="group flex items-center gap-3 rounded-2xl bg-canvas p-4">
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
                  className="shrink-0 cursor-pointer rounded-lg p-2 text-sub transition-all hover:bg-card hover:text-ink group-hover:translate-y-0.5"
                  aria-label={`Download ${a.name}`}
                >
                  <FileDown size={16} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-2xl border border-dashed border-line p-4 text-center">
            <p className="text-xs leading-relaxed text-sub">
              <span className="font-semibold text-ink">Auditor workspace</span>: invite your
              auditor with read-only access instead of emailing PDFs.
            </p>
            <button
              type="button"
              className="mt-3 cursor-pointer rounded-btn bg-forest px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            >
              Invite auditor
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
