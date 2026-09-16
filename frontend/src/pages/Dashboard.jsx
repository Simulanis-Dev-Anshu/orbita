import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  Bell,
  CalendarDays,
  MoreHorizontal,
  Radio,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  UserX,
} from 'lucide-react'
import {
  activityHeatmap as mockHeatmap,
  dashKpis as mockKpis,
  discoveryFunnel as mockFunnel,
  heatmapDays as mockHeatmapDays,
  heatmapHours as mockHeatmapHours,
  hourlyActions as mockHourly,
  inventoryTrend as mockTrend,
  kpis as mockLegacyKpis,
  peakHourBars as mockPeak,
  riskDistribution as mockRisk,
  sourceMix as mockSources,
} from '../data/mock.js'
import { Link } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard.js'
import { motion, useReducedMotion } from 'framer-motion'
import { easeOut } from '../lib/motion.js'

const tipStyle = {
  background: '#1a1a1e',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  fontSize: 12,
  color: '#f5f5f5',
  boxShadow: 'none',
}

const kpiIcons = {
  active: Activity,
  published: Radio,
  reach: Bell,
  risk: ShieldAlert,
}

function Delta({ up, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] ${up ? 'dash-dot-up' : 'dash-dot-down'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}

function IconBtn({ label }) {
  return (
    <button
      type="button"
      className="grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-sub transition-colors hover:bg-white/6 hover:text-ink"
      aria-label={label}
    >
      <MoreHorizontal size={16} />
    </button>
  )
}

function KpiRow({ items }) {
  const reduce = useReducedMotion()
  return (
    <section aria-label="Key metrics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {(items || mockKpis).map((k, i) => {
        const Icon = kpiIcons[k.id] ?? Activity
        return (
          <motion.article
            key={k.id}
            className="dash-kpi p-4"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: easeOut }}
          >
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[13px] text-ink-2">
                <Icon size={13} strokeWidth={1.8} aria-hidden="true" />
                {k.label}
              </p>
              <IconBtn label={`${k.label} menu`} />
            </div>
            <p className="mt-5 font-display text-[34px] leading-none tracking-tight tabular-nums">{k.value}</p>
            <p className="mt-3">
              <Delta up={k.up}>
                {k.delta} {k.hint}
              </Delta>
            </p>
          </motion.article>
        )
      })}
    </section>
  )
}

function ActionsChart({ series, totals }) {
  const rows = series?.length ? series : mockHourly
  const today = totals?.today ?? 668
  const yesterday = totals?.yesterday ?? 471
  const delta = totals?.delta ?? '17.0%'
  const up = totals?.up ?? true
  return (
    <section className="dash-card flex h-full min-h-[340px] flex-col p-5" aria-label="Agent actions today">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-[12px] text-sub">
            <Activity size={13} aria-hidden="true" />
            Agent actions
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-8">
            <div>
              <p className="text-[11px] text-sub">Today</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums">{today.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[11px] text-sub">Yesterday</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums">{yesterday.toLocaleString()}</p>
            </div>
            <Delta up={up}>{delta}</Delta>
          </div>
        </div>
        <IconBtn label="Chart options" />
      </div>

      <div className="mt-2 flex items-center gap-4 text-[11px] text-sub">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#6b6b72]" aria-hidden="true" />
          Today
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#2e2e33]" aria-hidden="true" />
          Yesterday
        </span>
      </div>

      <div className="mt-4 min-h-52 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 4, left: -28, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="t" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a7a80' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a7a80' }} domain={[0, 180]} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={tipStyle}
              formatter={(v, name) => [v, name === 'today' ? 'Today' : 'Yesterday']}
            />
            <Bar dataKey="yesterday" stackId="a" fill="#2e2e33" radius={[0, 0, 3, 3]} maxBarSize={28} />
            <Bar dataKey="today" stackId="a" fill="#6b6b72" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function CoverageMeter({ coverage }) {
  const used = coverage?.scored ?? 96
  const allow = coverage?.fleet ?? 147
  const pct = coverage?.pct ?? Math.round((used / allow) * 100)

  return (
    <section className="dash-card p-5" aria-label="Scoring coverage">
      <div className="flex items-start justify-between">
        <p className="flex items-center gap-1.5 text-[12px] text-sub">
          <Radio size={13} aria-hidden="true" />
          Scoring coverage
        </p>
        <IconBtn label="Coverage options" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] text-sub">Scored</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{used}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-sub">Fleet size</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{allow}</p>
        </div>
      </div>
      <div className="relative mt-6 h-16 overflow-hidden rounded-md bg-white/[0.04]">
        <div className="h-full bg-white/15" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-sm text-sub">{pct}% covered</p>
    </section>
  )
}

function PeakHours({ peak }) {
  const bars = peak?.bars?.length ? peak.bars : mockPeak
  const max = Math.max(...bars, 1)
  return (
    <section className="dash-card p-5" aria-label="Peak activity hours">
      <div className="flex items-start justify-between">
        <p className="flex items-center gap-1.5 text-[12px] text-sub">Peak hours</p>
        <IconBtn label="Peak hours options" />
      </div>
      <p className="mt-4 text-xl font-semibold tracking-tight">{peak?.label || '11 AM – 1 PM'}</p>
      <p className="mt-1 text-[12px] text-sub">{peak?.share || '~18% of agent actions in the busiest hour'}</p>
      <div className="mt-5 flex h-16 items-end gap-[3px]">
        {bars.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-[3px] bg-white/18"
            style={{ height: `${Math.max(12, (v / max) * 100)}%`, opacity: 0.35 + (v / max) * 0.65 }}
          />
        ))}
      </div>
    </section>
  )
}

function Funnel({ stages, kpis }) {
  const rows = stages?.length ? stages : mockFunnel
  const action = rows[3]?.pct || '16%'
  const high = kpis?.highRisk ?? mockLegacyKpis.highRisk
  const total = kpis?.totalAgents ?? mockLegacyKpis.totalAgents
  return (
    <section className="dash-card relative overflow-hidden p-5" aria-label="Discovery funnel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-[28px] leading-none tracking-tight">{action}</p>
          <p className="mt-2 text-[13px] text-sub">
            Need action · {high} of {total} agents · Last 30 days
          </p>
        </div>
        <Delta up>0.4% vs prior 30 days</Delta>
      </div>

      <div className="relative mt-6 h-44">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 180" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 18 C140 10 180 28 200 48 L200 132 C180 152 140 168 0 162 Z" fill="rgba(255,255,255,0.14)" />
          <path d="M200 48 C280 62 340 70 400 78 L400 102 C340 110 280 118 200 132 Z" fill="rgba(255,255,255,0.10)" />
          <path d="M400 78 C470 84 530 88 600 92 L600 88 C530 92 470 96 400 102 Z" fill="rgba(255,255,255,0.07)" />
          <path d="M600 88 C680 90 740 90 800 90 L800 90 C740 92 680 94 600 92 Z" fill="rgba(255,255,255,0.04)" />
        </svg>
        <div className="relative z-10 grid h-full grid-cols-4">
          {rows.map((s, i) => (
            <div
              key={s.key}
              className={`flex flex-col items-center justify-between py-1 ${i < 3 ? 'border-r border-white/8' : ''}`}
            >
              <p className="text-[15px] font-semibold tabular-nums">{s.display}</p>
              <span className="rounded-full border border-white/12 bg-[#141416] px-2.5 py-0.5 text-[11px] font-medium">
                {s.pct}
              </span>
              <p className="text-[12px] text-ink-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RiskShare({ distribution }) {
  const rows = distribution?.length ? distribution : mockRisk
  const total = rows.reduce((s, d) => s + d.value, 0)
  const palette = ['#f4f4f5', '#9a9aa0', '#5c5c62', '#2e2e33']

  return (
    <section className="dash-card flex h-full flex-col p-5" aria-label="Risk mix">
      <p className="font-display text-[28px] leading-none tracking-tight tabular-nums">{total}</p>
      <p className="mt-2 text-[13px] text-sub">Agents in the last 30 days</p>
      <div className="mx-auto my-4 h-40 w-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rows}
              dataKey="value"
              nameKey="name"
              innerRadius={0}
              outerRadius={78}
              stroke="#0c0c0e"
              strokeWidth={2}
            >
              {rows.map((d, i) => (
                <Cell key={d.name} fill={palette[i]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]">
        {rows.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2 text-sub">
            <span className="h-2 w-2 rounded-full" style={{ background: palette[i] }} aria-hidden="true" />
            {d.name}
            <span className="ml-auto tabular-nums text-ink">{d.value}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SourceList({ sources }) {
  const rows = sources?.length ? sources : mockSources
  const max = Math.max(...rows.map((s) => s.value), 1)
  return (
    <section className="dash-card p-5" aria-label="Discovery sources">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-sub">Traffic sources</p>
        <span className="text-[11px] text-sub">{rows.length} sources</span>
      </div>
      <ul className="mt-5 space-y-4">
        {rows.map((s) => (
          <li key={s.name}>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span>{s.name}</span>
              <span className="tabular-nums text-sub">{s.value}</span>
            </div>
            <div className="flex h-[3px] gap-[3px]">
              {Array.from({ length: 28 }, (_, i) => (
                <span
                  key={i}
                  className="h-full flex-1 rounded-full"
                  style={{
                    background: i < Math.round((s.value / max) * 28) ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function HourHeatmap({ grid, hours, days, actions24h, avgPerHour, peakLabel }) {
  const cells = grid?.length ? grid : mockHeatmap
  const hourLabels = hours?.length ? hours : mockHeatmapHours
  const dayLabels = days?.length ? days : mockHeatmapDays
  return (
    <section className="dash-card p-5" aria-label="Actions by hour">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-sub">Actions by hour</p>
          <p className="mt-3 font-display text-[28px] leading-none tracking-tight">
            {actions24h >= 1000 ? `${(actions24h / 1000).toFixed(1).replace(/\.0$/, '')}k` : actions24h || '6.4k'}
          </p>
          <p className="mt-1 text-[12px] text-sub">Peak · {peakLabel || 'weekday 11a–1p'}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-sub">Last 7 days</p>
          <p className="mt-3 text-lg font-semibold tabular-nums">{avgPerHour || 268}</p>
          <p className="text-[12px] text-sub">Avg / hour</p>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <div className="grid grid-cols-[28px_repeat(12,minmax(0,1fr))] gap-1">
          <span />
          {hourLabels.map((h) => (
            <span key={h} className="text-center text-[9px] text-sub">
              {h}
            </span>
          ))}
          {dayLabels.map((day, r) => (
            <div key={day} className="contents">
              <span className="self-center text-[10px] text-sub">{day}</span>
              {(cells[r] || []).map((v, c) => (
                <span
                  key={`${day}-${c}`}
                  title={`${day} ${hourLabels[c]}: ${v}`}
                  className="aspect-square rounded-[3px]"
                  style={{ background: `rgba(255,255,255,${0.04 + v * 0.08})` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FleetTrend({ series, total }) {
  const rows = series?.length ? series : mockTrend
  const current = total ?? rows[rows.length - 1]?.agents ?? 147
  const first = rows[0]?.agents || current
  const growth = first ? (((current - first) / first) * 100).toFixed(1) : '27.4'
  const minY = Math.max(0, Math.min(...rows.map((r) => r.agents)) - 10)
  const maxY = Math.max(...rows.map((r) => r.agents)) + 10
  return (
    <section className="dash-card min-h-[300px] p-5" aria-label="Inventory trend">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-[32px] leading-none tracking-tight">{current}</p>
          <p className="mt-1 text-[13px] text-sub">Agents in inventory</p>
        </div>
        <Delta up={current >= first}>{growth}% over last 30 days</Delta>
      </div>
      <div className="mt-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="invFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8c8cc" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#c8c8cc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a7a80' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a7a80' }} domain={[minY, maxY]} />
            <Tooltip contentStyle={tipStyle} />
            <Area
              type="monotone"
              dataKey="agents"
              name="Agents"
              stroke="#d4d4d8"
              strokeWidth={2}
              fill="url(#invFill)"
              dot={false}
              activeDot={{ r: 5, fill: '#fff', stroke: '#0c0c0e', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function Insights({ insight }) {
  const headline = insight?.headline || 'Unused high-risk runway improved by 3.5% this month vs. trailing burn.'
  const orphaned = insight?.orphaned ?? mockLegacyKpis.orphaned
  const owned = insight?.ownedShare ?? 55
  const note = insight?.note || `${orphaned} agents still running after the owner left.`
  return (
    <section className="dash-card flex h-full flex-col p-5" aria-label="Insights">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[13px] font-medium">
          <Sparkles size={14} className="text-brand" aria-hidden="true" />
          AI Insights
        </p>
        <button type="button" className="dash-chip cursor-pointer text-[11px]">
          Ask Sentinel
        </button>
      </div>
      <p className="mt-5 text-[17px] leading-snug tracking-tight">{headline}</p>
      <div className="mt-6">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-sub">Orphaned agents</span>
          <span className="font-semibold tabular-nums">{orphaned}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
          <div className="h-full bg-white/25" style={{ width: `${owned}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-sub">
          <span>Owned</span>
          <span>Orphaned</span>
          <span>Pending</span>
        </div>
      </div>
      <div className="mt-auto flex items-center gap-3 pt-6 text-[12px] text-sub">
        <UserX size={14} aria-hidden="true" />
        {note}
      </div>
    </section>
  )
}

export default function Dashboard() {
  const { data, error } = useDashboard()
  const d = data

  return (
    <div className="mt-5 space-y-4 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[22px] font-semibold tracking-tight">Today</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/app/discovery?tab=sources" className="dash-chip cursor-pointer hover:border-brand">
            Connect sources
          </Link>
          {error ? (
            <span className="dash-chip dash-dot-down">Using local demo data · {error}</span>
          ) : null}
          <span className="dash-chip">
            <CalendarDays size={13} aria-hidden="true" />
            Sep 1 – Sep 14, 2026
          </span>
          <button type="button" className="dash-chip cursor-pointer">
            <SlidersHorizontal size={13} aria-hidden="true" />
            Customize
          </button>
          <IconBtn label="More dashboard actions" />
        </div>
      </div>

      <KpiRow items={d?.dashKpis} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="card-in lg:col-span-8" style={{ '--i': 4 }}>
          <ActionsChart series={d?.hourlyActions} totals={d?.hourlyTotals} />
        </div>
        <div className="flex flex-col gap-3 lg:col-span-4">
          <div className="card-in" style={{ '--i': 5 }}>
            <CoverageMeter coverage={d?.coverage} />
          </div>
          <div className="card-in" style={{ '--i': 6 }}>
            <PeakHours peak={d?.peakHours} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="card-in lg:col-span-8" style={{ '--i': 7 }}>
          <Funnel stages={d?.discoveryFunnel} kpis={d?.kpis} />
        </div>
        <div className="card-in lg:col-span-4" style={{ '--i': 8 }}>
          <RiskShare distribution={d?.riskDistribution} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <div className="card-in" style={{ '--i': 9 }}>
          <SourceList sources={d?.sourceMix} />
        </div>
        <div className="card-in" style={{ '--i': 10 }}>
          <HourHeatmap
            grid={d?.activityHeatmap}
            hours={d?.heatmapHours}
            days={d?.heatmapDays}
            actions24h={d?.actions24h}
            avgPerHour={d?.avgPerHour}
            peakLabel={d?.peakHours?.label}
          />
        </div>
        <div className="card-in lg:col-span-2 xl:col-span-1" style={{ '--i': 11 }}>
          <Insights insight={d?.insight} />
        </div>
      </div>

      <div className="card-in" style={{ '--i': 12 }}>
        <FleetTrend series={d?.inventoryTrend} total={d?.kpis?.totalAgents} />
      </div>
    </div>
  )
}
