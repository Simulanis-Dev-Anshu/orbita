import { useMemo, useState } from 'react'
import { BellRing, Check } from 'lucide-react'
import { alerts as seed } from '../data/mock.js'

const severities = ['All', 'Critical', 'High', 'Medium', 'Low']

const sevStyles = {
  critical: 'bg-danger-soft text-danger',
  high: 'bg-warn-soft text-warn',
  medium: 'bg-brand-soft text-forest',
  low: 'bg-canvas text-sub',
}

export default function Alerts() {
  const [items, setItems] = useState(seed)
  const [filter, setFilter] = useState('All')
  const [showResolved, setShowResolved] = useState(false)

  const visible = useMemo(
    () =>
      items.filter(
        (a) =>
          (showResolved || !a.resolved) &&
          (filter === 'All' || a.severity === filter.toLowerCase()),
      ),
    [items, filter, showResolved],
  )

  const resolve = (id) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)))

  const openCount = items.filter((a) => !a.resolved).length

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by severity">
          {severities.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === s
                  ? 'bg-forest text-white'
                  : 'bg-card text-sub shadow-soft hover:text-ink'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-sub">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="h-4 w-4 accent-[#170702]"
          />
          Show resolved
        </label>
      </div>

      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6" aria-label="Alert feed">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Alert feed</h2>
          <span className="rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger">
            {openCount} open
          </span>
        </div>

        <ul className="mt-4 space-y-3">
          {visible.map((a) => (
            <li
              key={a.id}
              className={`flex items-start gap-3 rounded-2xl p-4 transition-opacity ${
                a.resolved ? 'bg-canvas/60 opacity-60' : 'bg-canvas'
              }`}
            >
              <span className={`mt-0.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${sevStyles[a.severity]}`}>
                {a.severity}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {a.type} — <span className="text-forest">{a.agent}</span>
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-sub">{a.detail}</p>
                <p className="mt-1 text-[11px] text-sub">{a.time}</p>
              </div>
              {!a.resolved && (
                <button
                  type="button"
                  onClick={() => resolve(a.id)}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-btn border border-line bg-card px-3 py-1.5 text-xs font-semibold transition-colors hover:border-brand"
                >
                  <Check size={14} aria-hidden="true" />
                  Resolve
                </button>
              )}
            </li>
          ))}
          {visible.length === 0 && (
            <li className="flex flex-col items-center gap-2 rounded-2xl bg-canvas p-8 text-center">
              <BellRing size={24} className="text-sub" aria-hidden="true" />
              <p className="text-sm text-sub">No alerts match this filter.</p>
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}
