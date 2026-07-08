import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useState } from 'react'
import { platformBreakdown } from '../data/mock.js'

export default function PlatformChart() {
  const [activeIndex, setActiveIndex] = useState(null)

  return (
    <section
      aria-label="Agents by platform"
      className="card-hover flex h-full flex-col rounded-card bg-card p-5 shadow-soft sm:p-6"
    >
      <h2 className="text-base font-semibold">Agents by platform</h2>
      <p className="text-sm text-sub">Where your fleet actually lives</p>

      <div className="mt-4 min-h-56 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={platformBreakdown}
            margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
            onMouseMove={(s) => setActiveIndex(s.isTooltipActive ? s.activeTooltipIndex : null)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <CartesianGrid stroke="#ECECEC" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="platform"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ fontSize: 11, fill: '#777777' }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#777777' }} />
            <Tooltip
              cursor={{ fill: 'rgba(16, 62, 45, 0.04)' }}
              contentStyle={{
                borderRadius: 14,
                border: '1px solid #ECECEC',
                boxShadow: '0 4px 20px rgba(0,0,0,.08)',
                fontSize: 13,
                fontFamily: 'inherit',
              }}
            />
            <Bar dataKey="agents" name="Agents" radius={[8, 8, 2, 2]} maxBarSize={34}>
              {platformBreakdown.map((d, i) => (
                <Cell
                  key={d.platform}
                  fill={i === activeIndex ? '#86E64A' : '#103E2D'}
                  style={{ transition: 'fill 0.2s ease' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
