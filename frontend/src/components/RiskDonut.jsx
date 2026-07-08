import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { riskDistribution, kpis } from '../data/mock.js'

export default function RiskDonut() {
  const total = riskDistribution.reduce((sum, d) => sum + d.value, 0)

  return (
    <section aria-label="Risk distribution" className="card-hover flex h-full flex-col rounded-card bg-card p-5 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold">Risk distribution</h2>
      <p className="text-sm text-sub">Across {total} discovered agents</p>

      <div className="relative mx-auto my-auto h-44 w-44 py-0.5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={3}
              cornerRadius={6}
              strokeWidth={0}
            >
              {riskDistribution.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 14,
                border: '1px solid #ECECEC',
                boxShadow: '0 4px 20px rgba(0,0,0,.08)',
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight">{kpis.avgRiskScore}</span>
          <span className="text-xs text-sub">avg score</span>
        </div>
      </div>

      <ul className="mt-auto grid grid-cols-2 gap-2 pt-3">
        {riskDistribution.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} aria-hidden="true" />
            <span className="flex-1 text-sub">{d.name}</span>
            <span className="font-semibold tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
