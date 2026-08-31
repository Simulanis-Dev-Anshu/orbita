import { Link } from 'react-router-dom'
import { ArrowUpRight, Share2 } from 'lucide-react'
import KpiSection from '../components/KpiSection.jsx'
import DiscoveryChart from '../components/DiscoveryChart.jsx'
import AgentsTable from '../components/AgentsTable.jsx'
import RiskDonut from '../components/RiskDonut.jsx'
import ApprovalsWidget from '../components/ApprovalsWidget.jsx'
import BenchmarkCard from '../components/BenchmarkCard.jsx'
import PlatformChart from '../components/PlatformChart.jsx'
import ActivityPulse from '../components/ActivityPulse.jsx'
import ScopeExposure from '../components/ScopeExposure.jsx'

function GraphTeaser() {
  return (
    <Link
      to="/app/relationships"
      className="card-hover ox-plate group relative block h-full overflow-hidden rounded-card p-5 shadow-lift"
      aria-label="Open relationship graph"
    >
      <div
        className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-brand/20 blur-2xl"
        aria-hidden="true"
      />
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
          <Share2 size={20} className="text-white" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="text-base font-semibold">Relationship Graph</p>
          <p className="text-xs text-white/60">USER → DEVICE → APP → AGENT → DATA</p>
        </div>
        <ArrowUpRight
          size={20}
          className="text-brand transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          aria-hidden="true"
        />
      </div>
      <p className="relative mt-3 rounded-2xl bg-white/10 p-3 text-xs leading-relaxed text-white/80">
        See how Anshu, Cursor, GitHub, and production data connect, beyond a flat inventory.
      </p>
    </Link>
  )
}

export default function Dashboard() {
  return (
    <div className="mt-6 space-y-4">
      <KpiSection />

      {/* Discovery trend + risk distribution */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="card-in xl:col-span-8" style={{ '--i': 2 }}>
          <DiscoveryChart />
        </div>
        <div className="card-in xl:col-span-4" style={{ '--i': 3 }}>
          <RiskDonut />
        </div>
      </div>

      {/* Fleet analytics */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <div className="card-in" style={{ '--i': 4 }}>
          <PlatformChart />
        </div>
        <div className="card-in" style={{ '--i': 5 }}>
          <ActivityPulse />
        </div>
        <div className="card-in lg:col-span-2 xl:col-span-1" style={{ '--i': 6 }}>
          <ScopeExposure />
        </div>
      </div>

      {/* Inventory preview + action rail */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="card-in xl:col-span-7" style={{ '--i': 7 }}>
          <AgentsTable limit={8} />
        </div>
        <div className="flex h-full flex-col gap-4 xl:col-span-5">
          <div className="card-in" style={{ '--i': 8 }}>
            <GraphTeaser />
          </div>
          <div className="card-in min-h-0 flex-1" style={{ '--i': 9 }}>
            <ApprovalsWidget />
          </div>
        </div>
      </div>

      {/* Peer benchmark: full-width closer */}
      <div className="card-in" style={{ '--i': 10 }}>
        <BenchmarkCard />
      </div>
    </div>
  )
}
