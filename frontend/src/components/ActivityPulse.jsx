import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fleetActivity } from '../data/mock.js'

export default function ActivityPulse() {
  const totalActions = fleetActivity.reduce((sum, d) => sum + d.actions, 0)
  const totalAnomalies = fleetActivity.reduce((sum, d) => sum + d.anomalies, 0)

  return (
    <section
      aria-label="Fleet activity over the last 24 hours"
      className="card-hover flex h-full flex-col rounded-card bg-card p-5 shadow-soft sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Fleet activity</h2>
          <p className="text-sm text-sub">
            {(totalActions / 1000).toFixed(1)}k actions · {totalAnomalies} anomalies in 24h
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-forest">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
          Live
        </span>
      </div>

      <div className="mt-4 min-h-56 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={fleetActivity} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="fillActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#170702" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#170702" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#ECECEC" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#777777' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#777777' }} />
            <Tooltip
              contentStyle={{
                borderRadius: 14,
                border: '1px solid #ECECEC',
                boxShadow: '0 4px 20px rgba(0,0,0,.08)',
                fontSize: 13,
                fontFamily: 'inherit',
              }}
            />
            <Area
              type="monotone"
              dataKey="actions"
              name="Actions"
              stroke="#170702"
              strokeWidth={2}
              fill="url(#fillActivity)"
            />
            <Line
              type="monotone"
              dataKey="anomalies"
              name="Anomalies"
              stroke="#E5484D"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#E5484D', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
