import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Radar,
  ArrowRight,
  Bot,
  UserX,
  Fingerprint,
  Power,
  ShieldCheck,
  Waypoints,
  BadgeCheck,
  ServerCog,
  Plug,
  ScanSearch,
  Gauge,
  GitPullRequestDraft,
  KeyRound,
  CloudUpload,
  Infinity as InfinityIcon,
  ScrollText,
  EyeOff,
} from 'lucide-react'
import useReveal from '../../hooks/useReveal.js'
import useCountUp from '../../hooks/useCountUp.js'
import RadarLoader from '../../components/RadarLoader.jsx'
import { posts } from '../../data/blog.js'

/* ---------- Live discovery hero animation ---------- */

const sources = ['Google Workspace', 'Slack', 'Zapier', 'MCP Servers']
const tickerItems = [
  { name: 'Zapier Invoice Bot', team: 'Finance', risk: 87 },
  { name: 'Postgres MCP Server', team: 'Engineering', risk: 71 },
  { name: 'Payroll Sync Agent', team: 'Orphaned', risk: 92 },
  { name: 'Sales Outreach GPT', team: 'Sales', risk: 74 },
]

const feedPool = [
  { name: 'Zapier Invoice Bot', platform: 'Zapier', risk: 87 },
  { name: 'Postgres MCP Server', platform: 'MCP', risk: 71 },
  { name: 'Sales Outreach GPT', platform: 'Custom GPT', risk: 74 },
  { name: 'GitHub PR Reviewer', platform: 'GitHub App', risk: 22 },
  { name: 'Payroll Sync Agent', platform: 'Make', risk: 92 },
  { name: 'HR Onboarding Flow', platform: 'n8n', risk: 58 },
  { name: 'Customer Data Enricher', platform: 'n8n', risk: 81 },
]

// Weekly discoveries → smooth SVG path (viewBox 320×120)
const weekly = [12, 19, 15, 27, 22, 31, 26, 38]
const chartPts = weekly.map((v, i) => [
  (i / (weekly.length - 1)) * 320,
  112 - (v / Math.max(...weekly)) * 96,
])

function smoothPath(pts) {
  let d = `M ${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i][0] + pts[i + 1][0]) / 2
    const yc = (pts[i][1] + pts[i + 1][1]) / 2
    d += ` Q ${pts[i][0]},${pts[i][1]} ${xc},${yc}`
  }
  d += ` T ${pts[pts.length - 1][0]},${pts[pts.length - 1][1]}`
  return d
}

const linePath = smoothPath(chartPts)
const areaPath = `${linePath} L 320,120 L 0,120 Z`
const lastPt = chartPts[chartPts.length - 1]

function HeroKpi({ value, label, className }) {
  const count = useCountUp(value, 1600)
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur transition-colors duration-300 hover:border-brand/40">
      <p className={`text-2xl font-bold tracking-tight tabular-nums ${className}`}>{count}</p>
      <p className="mt-0.5 text-[10px] font-medium text-white/50 sm:text-[11px]">{label}</p>
    </div>
  )
}

function HeroStage() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % (tickerItems.length * feedPool.length)), 2600)
    return () => clearInterval(id)
  }, [])

  const item = tickerItems[tick % tickerItems.length]
  const feedRows = Array.from({ length: 4 }, (_, i) => feedPool[(tick + i) % feedPool.length])

  return (
    <div className="rise relative mx-auto mt-14 max-w-5xl sm:mt-16" style={{ animationDelay: '0.45s' }}>
      {/* Glow */}
      <div className="absolute -inset-4 rounded-[40px] bg-brand/20 blur-2xl sm:-inset-8" aria-hidden="true" />

      {/* Main stage */}
      <div className="relative overflow-hidden rounded-3xl border border-forest/15 bg-gradient-to-br from-forest to-forest-2 shadow-lift">
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand/70" />
          </span>
          <span className="rounded-md bg-white/5 px-3 py-1 text-[10px] font-medium text-white/50">
            app.orbita.io — live discovery
          </span>
          <span className="ml-auto hidden items-center gap-1.5 text-[10px] font-semibold text-brand md:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" aria-hidden="true" />
            SCANNING 12 SOURCES
          </span>
        </div>

        <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-[1.25fr_1fr]">
          {/* Left: KPIs + self-drawing discovery chart */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              <HeroKpi value={147} label="Total agents" className="text-brand" />
              <HeroKpi value={8} label="Orphaned" className="text-danger" />
              <HeroKpi value={23} label="High-risk" className="text-warn" />
            </div>

            <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-white/70">Discoveries per week</p>
                <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold text-brand">
                  +38 this week
                </span>
              </div>
              <div className="relative mt-4 h-28 sm:h-32" aria-hidden="true">
                <svg viewBox="0 0 320 120" preserveAspectRatio="none" className="h-full w-full">
                  <defs>
                    <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#86E64A" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#86E64A" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Grid */}
                  {[30, 65, 100].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="320"
                      y1={y}
                      y2={y}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray="4 5"
                    />
                  ))}
                  <path d={areaPath} fill="url(#heroArea)" className="area-fade" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#86E64A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    pathLength="1"
                    className="draw-line"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {/* Pulsing end dot */}
                <span
                  className="live-dot absolute h-2 w-2 rounded-full bg-brand"
                  style={{
                    left: `calc(${(lastPt[0] / 320) * 100}% - 4px)`,
                    top: `calc(${(lastPt[1] / 120) * 100}% - 4px)`,
                  }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[9px] font-medium text-white/30">
                {weekly.map((_, i) => (
                  <span key={i}>W{i + 1}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: radar + cycling discovery feed */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <RadarLoader size={40} label="" dark />
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-white/70">Discovery feed</p>
                <p className="text-[10px] text-white/40">Sweeping 12 connected sources</p>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                LIVE
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {feedRows.map((r, i) => (
                <li
                  key={r.name}
                  className={`relative flex items-center gap-2.5 overflow-hidden rounded-xl bg-white/5 px-3 py-2.5 ${
                    i === 0 ? 'feed-in border border-brand/25' : ''
                  }`}
                >
                  {i === 0 && (
                    <span
                      className="scan-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-brand/15 to-transparent"
                      aria-hidden="true"
                    />
                  )}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-forest-2">
                    <Bot size={13} className="text-brand" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-semibold text-white sm:text-xs">
                      {r.name}
                    </span>
                    <span className="block text-[10px] text-white/40">
                      {i === 0 ? 'just discovered' : r.platform}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      r.risk >= 75
                        ? 'bg-danger text-white'
                        : r.risk >= 50
                          ? 'bg-warn text-forest-2'
                          : 'bg-brand text-forest'
                    }`}
                  >
                    {r.risk}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-center text-[10px] text-white/40">
              {sources.join(' · ')}
            </p>
          </div>
        </div>
      </div>

      {/* Floating: agent-discovered ticker */}
      <div className="float-y absolute -top-8 right-3 sm:right-10">
        <div key={tick} className="ticker-in w-44 rounded-2xl border border-line bg-card p-3.5 shadow-lift sm:w-52">
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-forest uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" aria-hidden="true" />
            Agent discovered
          </p>
          <p className="mt-1.5 truncate text-xs font-semibold sm:text-sm">{item.name}</p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[10px] text-sub">{item.team}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                item.risk >= 75 ? 'bg-danger-soft text-danger' : 'bg-brand-soft text-forest'
              }`}
            >
              Risk {item.risk}
            </span>
          </div>
        </div>
      </div>

      {/* Floating: kill-switch alert */}
      <div className="float-y absolute -bottom-9 left-3 hidden sm:left-12 md:block" style={{ animationDelay: '1.4s' }}>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5 shadow-lift">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-soft text-danger">
            <UserX size={17} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold">Orphaned agent detected</p>
            <p className="text-[10px] text-sub">Owner left Mar 2026 · kill switch armed</p>
          </div>
          <span className="ml-2 rounded-btn bg-forest px-3 py-1.5 text-[10px] font-bold text-white">
            Revoke
          </span>
        </div>
      </div>

      {/* Floating: radar badge */}
      <div className="absolute -top-7 left-8 hidden md:block">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <span className="pulse-ring absolute inset-0 rounded-full border-2 border-brand/50" aria-hidden="true" />
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand shadow-lift">
            <Radar size={22} className="text-forest" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  )
}

/* ---------- Exposure calculator ---------- */

function ExposureCalculator() {
  const ref = useReveal()
  const [employees, setEmployees] = useState(250)
  const [apps, setApps] = useState(40)

  const estAgents = Math.round(employees * 0.18 + apps * 0.9)
  const orphaned = Math.max(1, Math.round(estAgents * 0.06))
  const highRisk = Math.max(1, Math.round(estAgents * 0.15))

  return (
    <section ref={ref} className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-label="Exposure calculator">
      <div className="grid gap-8 rounded-card bg-card p-6 shadow-soft sm:p-10 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-forest">
            <Gauge size={14} aria-hidden="true" />
            Interactive estimate
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            How many shadow agents do you have?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-sub">
            Based on ratios from our discovery scans across Indian mid-market companies. Slide to
            match your company — then find the real number in 24 hours.
          </p>

          <div className="mt-8 space-y-6">
            <label className="block">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Employees</span>
                <span className="font-semibold tabular-nums">{employees}</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="10"
                value={employees}
                onChange={(e) => setEmployees(+e.target.value)}
                className="mt-2 w-full cursor-pointer accent-[#103E2D]"
              />
            </label>
            <label className="block">
              <div className="flex justify-between text-sm">
                <span className="font-medium">SaaS apps in use</span>
                <span className="font-semibold tabular-nums">{apps}</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="1"
                value={apps}
                onChange={(e) => setApps(+e.target.value)}
                className="mt-2 w-full cursor-pointer accent-[#103E2D]"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div className="rounded-card bg-gradient-to-br from-forest to-forest-2 p-6 text-white">
            <p className="text-sm text-white/60">Estimated AI agents operating in your company</p>
            <p className="mt-1 text-5xl font-bold tracking-tight text-brand tabular-nums">
              ~{estAgents}
            </p>
            <div className="mt-4 flex gap-6 text-sm">
              <span>
                <span className="font-bold text-danger">{orphaned}</span>{' '}
                <span className="text-white/60">likely orphaned</span>
              </span>
              <span>
                <span className="font-bold text-warn">{highRisk}</span>{' '}
                <span className="text-white/60">likely high-risk</span>
              </span>
            </div>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-btn bg-brand px-5 py-3 text-sm font-bold text-forest transition-opacity hover:opacity-90"
          >
            Get the real number — free scan
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------- Sections ---------- */

const steps = [
  {
    icon: Plug,
    title: 'Connect',
    text: 'OAuth into Google Workspace, M365, Slack, Zoho, GitHub and your automation tools. Read-only. 15 minutes.',
  },
  {
    icon: ScanSearch,
    title: 'Discover',
    text: 'App grants, audit logs, DNS egress and behavioral fingerprinting surface every agent — including MCP servers.',
  },
  {
    icon: ShieldCheck,
    title: 'Govern',
    text: 'Every agent gets an owner, a risk score and a kill switch. Drift and orphaning alert you in real time.',
  },
]

const features = [
  { icon: UserX, title: 'Orphaned-agent detection', text: 'The moment an owner is deactivated in your IdP, their agents are flagged and one click from revocation.' },
  { icon: Fingerprint, title: 'Behavioral fingerprinting', text: 'A 24/7 activity heatmap separates machine cadence from human rhythm — 98% classifier confidence.' },
  { icon: ServerCog, title: 'Shadow MCP discovery', text: 'MCP servers are the new shadow IT. We map every server, its launcher, and the data it can reach.' },
  { icon: Waypoints, title: 'Identity graph', text: 'Human → agent → credential → data scope. Blast radius and drift become simple graph queries.' },
  { icon: BadgeCheck, title: 'Agent Passport', text: 'A portable, verifiable trust score per agent — shareable with auditors, vendors and customers.' },
  { icon: Power, title: 'Kill switch', text: 'Revoke every grant an agent holds from one button. Stops rogue automations within one sync cycle.' },
]

const marqueeNames = ['Zintellix', 'BharatFin', 'MedSync', 'CloudKart', 'Kirana+', 'NovaPay', 'SkyDesk', 'FinLoop']

const threats = [
  { icon: UserX, title: 'Orphaned agents', text: 'Employees leave; their automations keep running on live credentials no one rotates.' },
  { icon: GitPullRequestDraft, title: 'Permission drift', text: 'Agents quietly accumulate scopes far beyond what they were approved for.' },
  { icon: ServerCog, title: 'Shadow MCP servers', text: 'Unregistered MCP servers wire LLMs straight into Postgres, GitHub and your CRM.' },
  { icon: CloudUpload, title: 'Data exfiltration via LLM APIs', text: 'Customer PII flows to external model endpoints — a DPDP cross-border transfer nobody logged.' },
  { icon: KeyRound, title: 'Credential sprawl', text: 'OAuth grants and service tokens multiply with every workflow an employee builds.' },
  { icon: InfinityIcon, title: 'Ungoverned autonomy', text: 'Agents act 24/7 at machine speed — mistakes compound before a human notices.' },
]

const modules = [
  {
    name: 'Discovery Engine',
    tagline: 'Agent asset discovery',
    icon: ScanSearch,
    features: ['Auto-discovery across OAuth, audit logs & DNS', 'Living inventory — updates as agents appear', 'Agent BOM export for auditors', 'Behavioral agent-vs-human classifier'],
    to: '/app/inventory',
  },
  {
    name: 'Identity Graph',
    tagline: 'Blast radius & ownership',
    icon: Waypoints,
    features: ['Human → agent → credential → data scope', 'Blast-radius queries in one click', 'Orphan detection wired to your IdP', 'Temporal graph — drift over time'],
    to: '/app/graph',
  },
  {
    name: 'MCP Gateway',
    tagline: 'MCP visibility & control',
    icon: ServerCog,
    features: ['Register MCP servers by API link', 'Real-time server monitoring', 'Malicious-server blocking', 'Zero-disruption audit trails'],
    to: '/app/connectors',
  },
  {
    name: 'Compliance Packs',
    tagline: 'Audit-ready evidence',
    icon: ScrollText,
    features: ['DPDP Act 2023 · SOC 2 · ISO 27001 · EU AI Act', '72-hour breach-notice pipeline', 'Auto-generated processor register', 'Read-only auditor workspace'],
    to: '/app/compliance',
  },
]

const stackLogos = ['Zapier', 'Make', 'n8n', 'Custom GPTs', 'Claude', 'MCP', 'Slack', 'Zoho', 'GitHub', 'Google Workspace', 'Microsoft 365']
const frameworks = ['DPDP Act 2023', 'SOC 2', 'ISO 27001', 'EU AI Act', 'OWASP LLM Top 10', 'NIST AI RMF']

const testimonials = [
  {
    quote: "The first scan found 31 agents we didn't know existed — including two still running on a former employee's credentials. That screenshot alone justified the year.",
    who: 'CISO, Indian fintech · 400 employees',
  },
  {
    quote: 'Orbita turned our AI governance from a quarterly spreadsheet exercise into a live control. Our auditor now pulls evidence herself.',
    who: 'Head of Security, healthcare SaaS · 250 employees',
  },
]

/* ---------- Security loop flow diagram ---------- */

const inventoryChips = [
  { icon: Bot, label: 'AI Agents' },
  { icon: ServerCog, label: 'MCP Servers' },
  { icon: KeyRound, label: 'OAuth Grants' },
  { icon: Fingerprint, label: 'Custom GPTs' },
  { icon: Plug, label: 'Workflows' },
  { icon: ScanSearch, label: 'DNS Egress' },
]

function FlowConnectors() {
  return (
    <svg
      viewBox="0 0 1000 620"
      preserveAspectRatio="none"
      className="absolute inset-0 hidden h-full w-full lg:block"
      aria-hidden="true"
    >
      <defs>
        <marker id="flowArrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,0.55)" />
        </marker>
      </defs>

      {/* Solid pipeline: discovery → Orbita → modules */}
      {[
        'M295,310 H385',
        'M615,310 H645 Q662,310 662,293 V172 Q662,155 679,155 H685',
        'M615,310 H645 Q662,310 662,327 V448 Q662,465 679,465 H685',
      ].map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.5"
          markerEnd="url(#flowArrow)"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Dashed feedback loops */}
      {[
        'M855,105 V62',
        'M880,205 V255',
        'M935,345 V560 H928',
        'M815,552 V512',
      ].map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="rgba(134,230,74,0.45)"
          strokeWidth="1.5"
          strokeDasharray="5 6"
          markerEnd="url(#flowArrow)"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Pulses travelling the pipeline */}
      {[
        ['M295,310 H385', '2.4s', '0s'],
        ['M615,310 H645 Q662,310 662,293 V172 Q662,155 679,155 H685', '3s', '0.6s'],
        ['M615,310 H645 Q662,310 662,327 V448 Q662,465 679,465 H685', '3s', '1.8s'],
      ].map(([d, dur, begin]) => (
        <circle key={d + dur + begin} r="4" fill="#86E64A" opacity="0.9">
          <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={d} />
        </circle>
      ))}
    </svg>
  )
}

function LoopChip({ children, className = '', delay }) {
  return (
    <Reveal delay={delay} className={className}>
      <div className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-center text-[11px] font-semibold text-white/80 backdrop-blur">
        {children}
      </div>
    </Reveal>
  )
}

function MobileArrow() {
  return (
    <div className="mx-auto h-7 w-px border-l-2 border-dashed border-brand/40 lg:hidden" aria-hidden="true" />
  )
}

function SecurityLoop() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-label="How Orbita secures agentic AI">
      <Reveal>
        <p className="mx-auto w-fit rounded-full bg-brand-soft px-3 py-1 text-center text-xs font-semibold tracking-wider text-forest uppercase">
          How we secure agentic AI
        </p>
        <h2 className="mt-4 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          One continuous security loop
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-sub">
          Discovery feeds the identity graph, the graph scores every agent's blast radius, and
          enforcement acts in real time — evidence and mitigations flow straight back into the
          loop.
        </p>
      </Reveal>

      <Reveal className="mt-10">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-forest to-forest-2 p-5 shadow-lift sm:p-8 lg:h-[620px] lg:p-0">
          {/* Backdrop */}
          <div className="pixel-grid absolute inset-0" aria-hidden="true" />
          <div className="pixel-twinkle absolute inset-0" aria-hidden="true" />
          <div
            className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-3xl"
            aria-hidden="true"
          />

          <FlowConnectors />

          <div className="relative flex flex-col gap-3 lg:block">
            {/* Phase 1: discovery */}
            <Reveal delay={100} className="lg:absolute lg:top-[150px] lg:left-[3%] lg:w-[26%]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
                  <ScanSearch size={19} className="text-forest" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold text-white">
                  Continuous discovery of AI agents
                </p>
                <p className="mt-2 border-t border-white/10 pt-2 text-[11px] font-semibold tracking-wider text-white/50 uppercase">
                  Unified agent inventory
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {inventoryChips.map((c) => (
                    <span
                      key={c.label}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-[11px] font-medium text-white/80 transition-colors duration-300 hover:border-brand/40"
                    >
                      <c.icon size={12} className="shrink-0 text-brand" aria-hidden="true" />
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <MobileArrow />

            {/* Phase 2: Orbita core */}
            <Reveal delay={250} className="lg:absolute lg:top-[225px] lg:left-[39%] lg:w-[22%]">
              <div className="relative rounded-3xl border border-brand/30 bg-forest-2/90 p-6 text-center shadow-lift backdrop-blur">
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
                  <span className="pulse-ring absolute inset-0 rounded-full border-2 border-brand/50" aria-hidden="true" />
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand">
                    <Radar size={22} className="text-forest" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 text-lg font-semibold tracking-tight text-white">
                  Orb<span className="text-brand">ita</span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/60">
                  Every agent, credential and scope in one live graph
                </p>
              </div>
            </Reveal>

            <MobileArrow />

            {/* Phase 3: modules */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:contents">
              <Reveal delay={400} className="lg:absolute lg:top-[100px] lg:left-[68.5%] lg:w-[23%]">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition-colors duration-300 hover:border-brand/40">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warn-soft text-warn">
                    <Gauge size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">RISK ENGINE</p>
                    <p className="text-xs text-white/50">Blast radius & risk scoring</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={500} className="lg:absolute lg:top-[410px] lg:left-[68.5%] lg:w-[23%]">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition-colors duration-300 hover:border-brand/40">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-soft text-danger">
                    <Power size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">KILL SWITCH</p>
                    <p className="text-xs text-white/50">Runtime control & revocation</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Feedback artifacts */}
            <div className="flex flex-wrap justify-center gap-2 pt-1 lg:contents">
              <LoopChip delay={620} className="lg:absolute lg:top-[22px] lg:left-[71%] lg:w-[21%]">
                Mitigation playbooks
              </LoopChip>
              <LoopChip delay={700} className="lg:absolute lg:top-[258px] lg:left-[74%] lg:w-[23%]">
                Compliance evidence vault
              </LoopChip>
              <LoopChip delay={780} className="lg:absolute lg:top-[556px] lg:left-[68.5%] lg:w-[23%]">
                Auto-revoke orphaned grants
              </LoopChip>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-24 sm:px-6 lg:pt-20">
        {/* Backdrop: grid + glow */}
        <div className="hero-grid-bg absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -top-40 left-1/2 h-[28rem] w-[46rem] -translate-x-1/2 rounded-full bg-brand/25 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="rise inline-flex items-center gap-2 rounded-full border border-forest/15 bg-card/80 px-4 py-2 text-xs font-semibold text-forest shadow-soft backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" aria-hidden="true" />
            Now discovering shadow MCP servers
            <span className="text-sub">·</span>
            <span className="font-accent text-[13px] text-sub not-italic">new</span>
          </p>

          <h1 className="mt-7 text-[2.75rem] leading-[1.04] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            <span className="rise block" style={{ animationDelay: '0.08s' }}>
              <span className="font-accent relative inline-block text-[1.06em] whitespace-nowrap text-forest">
                147 AI agents.
                <svg
                  className="absolute -bottom-2 left-0 w-full sm:-bottom-3"
                  viewBox="0 0 300 14"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10 C 70 3, 230 3, 296 8"
                    stroke="#86E64A"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
            <span className="rise block" style={{ animationDelay: '0.2s' }}>
              Zero approvals.
            </span>
          </h1>

          <p
            className="rise mx-auto mt-7 max-w-xl text-base leading-relaxed text-sub sm:text-lg"
            style={{ animationDelay: '0.28s' }}
          >
            <span className="font-semibold text-ink">You can't secure a workforce you can't see.</span>{' '}
            Zapier bots, custom GPTs, rogue MCP servers — Orbita finds your invisible workforce
            in 24 hours, names an owner, and scores every risk.
          </p>

          <div
            className="rise mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '0.36s' }}
          >
            <Link
              to="/signup"
              className="btn-shine inline-flex items-center gap-2 rounded-btn bg-forest px-7 py-4 text-sm font-bold text-white shadow-lift transition-transform hover:-translate-y-0.5"
            >
              Get your free discovery scan
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-btn border border-line bg-card/80 px-7 py-4 text-sm font-semibold backdrop-blur transition-all hover:-translate-y-0.5 hover:border-forest"
            >
              <Bot size={16} className="text-forest" aria-hidden="true" />
              Explore the live demo
            </Link>
          </div>

          <div
            className="rise mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-3"
            style={{ animationDelay: '0.44s' }}
          >
            <span className="flex -space-x-2.5" aria-hidden="true">
              {[
                ['RS', 'bg-forest text-brand'],
                ['AM', 'bg-brand text-forest'],
                ['PN', 'bg-forest-2 text-white'],
                ['KS', 'bg-brand-soft text-forest'],
              ].map(([ini, cls]) => (
                <span
                  key={ini}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-canvas ${cls}`}
                >
                  {ini}
                </span>
              ))}
            </span>
            <p className="text-xs text-sub sm:text-sm">
              Trusted by <span className="font-semibold text-ink">40+ security teams</span> ·
              read-only connectors · DPDP-aligned, hosted in India
            </p>
          </div>
        </div>

        <HeroStage />
      </section>

      {/* Logo marquee */}
      <section className="border-y border-line bg-card py-6" aria-label="Trusted by">
        <p className="text-center text-xs font-semibold tracking-wider text-sub uppercase">
          Trusted by security teams at
        </p>
        <div className="mt-4 overflow-hidden">
          <div className="marquee-track flex w-max gap-14">
            {[...marqueeNames, ...marqueeNames].map((n, i) => (
              <span key={i} className="text-lg font-semibold whitespace-nowrap text-sub/60">
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Threat landscape */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6" aria-label="AI risks">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Your AI attack surface is growing.{' '}
            <span className="text-forest">Your visibility isn't.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-sub">
            Every employee with a browser can now hire an AI agent. Six ways that goes wrong
            without an inventory:
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {threats.map((t, i) => (
            <Reveal key={t.title} className="h-full" delay={i * 90}>
              <article className="group h-full overflow-hidden rounded-card bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-forest transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <t.icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sub">{t.text}</p>
                <span
                  className="mt-4 block h-0.5 w-full origin-left scale-x-0 rounded-full bg-brand transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden="true"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats */}
      <Reveal>
        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-14 sm:grid-cols-3 sm:px-6" aria-label="Key stats">
          {[
            ['147', 'agents found in our median first scan'],
            ['24 hrs', 'from first connector to full inventory'],
            ['6%', 'of discovered agents are orphaned'],
          ].map(([num, label]) => (
            <div key={label} className="rounded-card bg-card p-6 text-center shadow-soft">
              <p className="text-4xl font-bold tracking-tight text-forest">{num}</p>
              <p className="mt-2 text-sm text-sub">{label}</p>
            </div>
          ))}
        </section>
      </Reveal>

      {/* Security loop flow diagram */}
      <SecurityLoop />

      {/* How it works */}
      <section id="how" className="bg-forest py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold tracking-tight">
              Visible in an afternoon
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-white/60">
              No agents to instrument, no SDKs to ship. Orbita watches the places agents already
              leave footprints.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title}>
                <article className="h-full rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-forest">
                      <s.icon size={20} aria-hidden="true" />
                    </span>
                    <span className="text-xs font-bold text-brand">STEP {i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{s.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Product modules */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-label="Product modules">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            One platform, four modules
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-sub">
            Traditional IAM can't see AI agents. Orbita was built for them.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {modules.map((m) => (
            <Reveal key={m.name}>
              <article className="flex h-full flex-col rounded-card bg-card p-6 shadow-soft transition-shadow hover:shadow-lift sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest">
                    <m.icon size={22} className="text-brand" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{m.name}</h3>
                    <p className="text-xs font-semibold tracking-wide text-forest uppercase">
                      {m.tagline}
                    </p>
                  </div>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {m.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-sub">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={m.to}
                    className="inline-flex items-center gap-1.5 rounded-btn bg-forest px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
                  >
                    See it in the demo
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center rounded-btn border border-line bg-canvas px-4 py-2.5 text-xs font-semibold transition-colors hover:border-forest"
                  >
                    Run a free scan
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Built for the questions your auditor asks
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} className="h-full" delay={i * 90}>
              <article className="h-full rounded-card bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-forest">
                  <f.icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sub">{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <ExposureCalculator />

      {/* Why teams trust Orbita */}
      <section className="border-y border-line bg-card py-16" aria-label="Why teams trust Orbita">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold tracking-tight">
              Why security teams trust Orbita
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Reveal>
              <article className="h-full rounded-card border border-line bg-canvas p-6">
                <h3 className="flex items-center gap-2.5 text-base font-semibold">
                  <Plug size={18} className="text-forest" aria-hidden="true" />
                  Works with your whole AI stack
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sub">
                  Platform-agnostic by design — if it holds a credential, we can see it. Custom MCP
                  servers register with a single API link.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stackLogos.map((l) => (
                    <span key={l} className="rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold text-sub">
                      {l}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
            <Reveal>
              <article className="h-full rounded-card border border-line bg-canvas p-6">
                <h3 className="flex items-center gap-2.5 text-base font-semibold">
                  <ShieldCheck size={18} className="text-forest" aria-hidden="true" />
                  Mapped to the frameworks your auditor knows
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sub">
                  Every finding links to a control. Reports export in the language of the standard,
                  not ours.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {frameworks.map((f) => (
                    <span key={f} className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-forest">
                      {f}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
            <Reveal>
              <article className="h-full rounded-card border border-line bg-canvas p-6">
                <h3 className="flex items-center gap-2.5 text-base font-semibold">
                  <EyeOff size={18} className="text-forest" aria-hidden="true" />
                  Zero-intrusion approach
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sub">
                  Read-only connectors and passive network signals. No SDK in your agents, no proxy
                  in your traffic, nothing for your engineers to maintain.
                </p>
              </article>
            </Reveal>
            <Reveal>
              <article className="h-full rounded-card border border-line bg-canvas p-6">
                <h3 className="flex items-center gap-2.5 text-base font-semibold">
                  <Fingerprint size={18} className="text-forest" aria-hidden="true" />
                  Depth where it matters
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sub">
                  40+ detection signals across OAuth grants, audit logs, DNS egress and behavioral
                  timing — fused into one risk score per agent.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-label="Testimonials">
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <Reveal key={t.who}>
              <figure className="h-full rounded-card bg-card p-7 shadow-soft">
                <blockquote className="text-base leading-relaxed font-medium sm:text-lg">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-4 text-sm text-sub">{t.who}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Blog resources */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-label="From the blog">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Shadow-AI insights</h2>
              <p className="mt-2 text-sm text-sub">
                Research and field notes from the discovery team.
              </p>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
            >
              Browse all articles
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <Reveal key={p.slug}>
              <Link
                to={`/blog/${p.slug}`}
                className="group flex h-full flex-col rounded-card bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
              >
                <p className="text-xs font-semibold text-sub">
                  {p.tag} · {p.readTime} read
                </p>
                <h3 className="mt-3 flex-1 text-base font-semibold tracking-tight transition-colors group-hover:text-forest">
                  {p.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
                  Read article
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <Reveal>
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-forest to-forest-2 p-10 text-center text-white shadow-lift">
            <div className="absolute -top-16 left-1/4 h-48 w-48 rounded-full bg-brand/20 blur-3xl" aria-hidden="true" />
            <h2 className="relative text-3xl font-semibold tracking-tight">
              See every agent by this time tomorrow
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-sm text-white/60">
              Free discovery scan · read-only access · your data never leaves India
            </p>
            <Link
              to="/signup"
              className="relative mt-7 inline-flex items-center gap-2 rounded-btn bg-brand px-7 py-3.5 text-sm font-bold text-forest transition-opacity hover:opacity-90"
            >
              Start the free scan
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  )
}
