import { Hammer } from 'lucide-react'

export default function ComingSoon({ name }) {
  return (
    <div className="mt-6 flex min-h-96 flex-col items-center justify-center rounded-card bg-card p-10 text-center shadow-soft">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft">
        <Hammer size={26} className="text-forest" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-semibold">{name} is on the way</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-sub">
        This module is part of the roadmap. The dashboard, relationship graph and inventory are live. Explore those while we build this out.
      </p>
    </div>
  )
}
