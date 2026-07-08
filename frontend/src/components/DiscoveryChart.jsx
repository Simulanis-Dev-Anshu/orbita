import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { discoveryTrend } from '../data/mock.js'

const ranges = ['8 weeks', '30 days', '7 days']

export default function DiscoveryChart() {
  const [range, setRange] = useState(ranges[0])

  return (
    <section aria-label="Discovery analytics" className="card-hover flex h-full flex-col rounded-card bg-card p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Agent discovery trend</h2>
          <p className="text-sm text-sub">New agents found across connected sources</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="cursor-pointer rounded-btn border border-line bg-canvas px-3 py-2 text-sm outline-none focus:border-forest"
          aria-label="Time range"
        >
          {ranges.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 min-h-64 flex-1 sm:min-h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={discoveryTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="fillDiscovered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86E64A" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#86E64A" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5484D" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#E5484D" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#ECECEC" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#777777' }} />
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
            <Legend wrapperStyle={{ fontSize: 13 }} iconType="circle" iconSize={8} />
            <Area
              type="monotone"
              dataKey="discovered"
              name="Discovered"
              stroke="#103E2D"
              strokeWidth={2}
              fill="url(#fillDiscovered)"
            />
            <Area
              type="monotone"
              dataKey="highRisk"
              name="High risk"
              stroke="#E5484D"
              strokeWidth={2}
              fill="url(#fillRisk)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
