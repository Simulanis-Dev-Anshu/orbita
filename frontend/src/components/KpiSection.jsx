import { UserX, ShieldAlert, PlugZap, ArrowUpRight, Download } from 'lucide-react'
import { kpis, kpiTrends } from '../data/mock.js'
import useCountUp from '../hooks/useCountUp.js'

// Tiny inline sparkline from an array of numbers
function Sparkline({ data, stroke }) {
  const w = 72
  const h = 24
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - 2 - ((v - min) / range) * (h - 4)}`)
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={w}
        cy={h - 2 - ((data[data.length - 1] - min) / range) * (h - 4)}
        r="2.5"
        fill={stroke}
      />
    </svg>
  )
}

function MiniKpi({ icon: Icon, iconClass, title, value, badge, badgeClass, trend, trendColor, index }) {
  const count = useCountUp(value)

  return (
    <article
      className="card-in card-hover flex flex-col justify-between rounded-card bg-card p-5 shadow-soft"
      style={{ '--i': index }}
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeClass}`}>
          {badge}
        </span>
      </div>
      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <p className="text-sm text-sub">{title}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{count}</p>
        </div>
        <Sparkline data={trend} stroke={trendColor} />
      </div>
    </article>
  )
}

export default function KpiSection() {
  const total = useCountUp(kpis.totalAgents)

  return (
    <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Hero KPI */}
      <article
        className="card-in card-hover relative overflow-hidden rounded-card bg-gradient-to-br from-forest to-forest-2 p-5 text-white shadow-lift"
        style={{ '--i': 0 }}
      >
        {/* Background illustration */}
        <div
          className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand/20 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="float-y absolute -right-6 bottom-4 h-24 w-24 rounded-full border-8 border-brand/30"
          aria-hidden="true"
        />

        <p className="text-sm text-white/70">Total AI Agents</p>
        <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums">{total}</p>
        <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand/15 px-2.5 py-1 text-xs font-semibold text-brand">
          <ArrowUpRight size={14} aria-hidden="true" />
          +{kpis.newThisWeek} this week
        </p>

        <button
          type="button"
          className="relative mt-5 inline-flex cursor-pointer items-center gap-2 rounded-btn bg-brand px-4 py-2.5 text-sm font-semibold text-forest transition-all hover:opacity-90 active:scale-95"
        >
          <Download size={16} aria-hidden="true" />
          Export report
        </button>
      </article>

      <MiniKpi
        index={1}
        icon={UserX}
        iconClass="bg-danger-soft text-danger"
        title="Orphaned agents"
        value={kpis.orphaned}
        badge="Owner left"
        badgeClass="bg-danger-soft text-danger"
        trend={kpiTrends.orphaned}
        trendColor="#E5484D"
      />
      <MiniKpi
        index={2}
        icon={ShieldAlert}
        iconClass="bg-warn-soft text-warn"
        title="High-risk agents"
        value={kpis.highRisk}
        badge="+4 this week"
        badgeClass="bg-warn-soft text-warn"
        trend={kpiTrends.highRisk}
        trendColor="#E8930C"
      />
      <MiniKpi
        index={3}
        icon={PlugZap}
        iconClass="bg-brand-soft text-forest"
        title="Connected sources"
        value={kpis.connectedSources}
        badge="All syncing"
        badgeClass="bg-brand-soft text-forest"
        trend={kpiTrends.connectedSources}
        trendColor="#103E2D"
      />
    </section>
  )
}
