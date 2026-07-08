import { TrendingUp } from 'lucide-react'
import { benchmark } from '../data/mock.js'

export default function BenchmarkCard() {
  return (
    <section
      aria-label="Peer benchmark"
      className="card-hover rounded-card bg-card p-5 shadow-soft sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-forest">
          <TrendingUp size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold">Peer benchmark</h2>
          <p className="text-xs text-sub">{benchmark.peerGroup}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-canvas p-4">
          <p className="text-2xl font-bold tracking-tight text-danger">
            {benchmark.orphanedVsPeers}×
          </p>
          <p className="text-xs leading-relaxed text-sub">
            more orphaned agents than similar companies — revoking 3 grants moves you to median
          </p>
        </div>
        <div className="rounded-2xl bg-canvas p-4">
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold tracking-tight">{benchmark.riskPercentile}th</p>
            <p className="pb-1 text-xs text-sub">risk percentile</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-warn"
              style={{ width: `${benchmark.riskPercentile}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
