import { useState } from 'react'
import { Check, X, ShieldQuestion } from 'lucide-react'
import { approvals, sourceHealth } from '../data/mock.js'

const riskDot = {
  critical: 'bg-danger',
  high: 'bg-warn',
  medium: 'bg-brand',
}

export default function ApprovalsWidget() {
  const [items, setItems] = useState(approvals)

  const resolve = (id) => setItems((prev) => prev.filter((i) => i.id !== id))

  return (
    <section aria-label="Pending approvals" className="rounded-card bg-card p-5 shadow-soft sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Pending approvals</h2>
        <span className="rounded-full bg-warn-soft px-2.5 py-1 text-xs font-semibold text-warn">
          {items.length} open
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 rounded-2xl bg-canvas p-3.5">
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${riskDot[item.risk]}`} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="text-xs leading-relaxed text-sub">{item.detail}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => resolve(item.id)}
                className="cursor-pointer rounded-lg bg-brand-soft p-2 text-forest transition-opacity hover:opacity-80"
                aria-label={`Approve ${item.title}`}
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                onClick={() => resolve(item.id)}
                className="cursor-pointer rounded-lg bg-danger-soft p-2 text-danger transition-opacity hover:opacity-80"
                aria-label={`Reject ${item.title}`}
              >
                <X size={16} />
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="flex flex-col items-center gap-2 rounded-2xl bg-canvas p-6 text-center">
            <ShieldQuestion size={24} className="text-sub" aria-hidden="true" />
            <p className="text-sm text-sub">All caught up — no approvals waiting.</p>
          </li>
        )}
      </ul>

      <h3 className="mt-6 text-xs font-semibold tracking-wider text-sub uppercase">Source health</h3>
      <ul className="mt-3 space-y-2.5">
        {sourceHealth.map((s) => (
          <li key={s.name} className="flex items-center gap-2.5 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${s.status === 'healthy' ? 'bg-brand' : 'bg-warn'}`}
              aria-hidden="true"
            />
            <span className="flex-1">{s.name}</span>
            <span className="text-xs text-sub">{s.lastSync}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
