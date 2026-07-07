import KpiSection from '../components/KpiSection.jsx'
import DiscoveryChart from '../components/DiscoveryChart.jsx'
import AiAssistant from '../components/AiAssistant.jsx'
import AgentsTable from '../components/AgentsTable.jsx'
import RiskDonut from '../components/RiskDonut.jsx'
import ApprovalsWidget from '../components/ApprovalsWidget.jsx'
import BenchmarkCard from '../components/BenchmarkCard.jsx'

export default function Dashboard() {
  return (
    <div className="mt-6 space-y-4">
      <KpiSection />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <DiscoveryChart />
        </div>
        <div className="xl:col-span-5">
          <AiAssistant />
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <AgentsTable limit={6} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-5 xl:grid-cols-1">
          <RiskDonut />
          <BenchmarkCard />
          <ApprovalsWidget />
        </div>
      </div>
    </div>
  )
}
