import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  FileText,
  Plus,
  Radar,
  ScanSearch,
  Search,
  ShieldAlert,
  Sparkles,
  UserX,
} from 'lucide-react'
import BrandMark from '../BrandMark.jsx'

const STEPS = [
  { verb: 'Connected', target: 'Google Workspace · OAuth grants', ms: '0.4s', Icon: Check },
  { verb: 'Read', target: 'Slack audit log · last 30 days', ms: '1.1s', Icon: FileText },
  { verb: 'Scanned', target: 'DNS egress · LLM endpoints', ms: '0.8s', Icon: Radar },
  { verb: 'Found', target: 'Zapier Invoice Bot · risk 87', ms: '0.6s', Icon: ScanSearch, risk: 87 },
  { verb: 'Flagged', target: 'Payroll Sync Agent · orphaned', ms: '0.5s', Icon: UserX, risk: 92 },
  { verb: 'Compared', target: 'peer mid-market · 200–500 emp', ms: '1.2s', Icon: ShieldAlert },
]

const SUMMARY =
  'First pass found 147 agents across 12 sources. 8 are orphaned and 23 score high risk. Two still run on credentials of people who left.'

const RECENT = [
  { title: 'Shadow agents · Orbita', active: true },
  { title: 'Orphaned OAuth grants' },
  { title: 'DPDP transfer inventory' },
]

function useStreamingRoom() {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [summaryLen, setSummaryLen] = useState(0)
  const [showAgents, setShowAgents] = useState(false)
  const [thoughtOpen, setThoughtOpen] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisibleSteps(STEPS.length)
      setSummaryLen(SUMMARY.length)
      setShowAgents(true)
      return undefined
    }

    let cancelled = false
    const timers = []
    let typeInterval = null

    const clearType = () => {
      if (typeInterval) {
        clearInterval(typeInterval)
        typeInterval = null
      }
    }

    const run = () => {
      if (cancelled) return
      clearType()
      setVisibleSteps(0)
      setSummaryLen(0)
      setShowAgents(false)
      setThoughtOpen(true)

      STEPS.forEach((_, i) => {
        timers.push(
          setTimeout(() => {
            if (!cancelled) setVisibleSteps(i + 1)
          }, 700 + i * 780),
        )
      })

      const afterSteps = 700 + STEPS.length * 780 + 400
      timers.push(
        setTimeout(() => {
          if (cancelled) return
          let n = 0
          typeInterval = setInterval(() => {
            n += 2
            if (cancelled) {
              clearType()
              return
            }
            if (n >= SUMMARY.length) {
              setSummaryLen(SUMMARY.length)
              clearType()
              timers.push(
                setTimeout(() => {
                  if (!cancelled) {
                    setShowAgents(true)
                    setThoughtOpen(false)
                  }
                }, 500),
              )
              timers.push(
                setTimeout(() => {
                  if (!cancelled) run()
                }, 5200),
              )
            } else {
              setSummaryLen(n)
            }
          }, 16)
        }, afterSteps),
      )
    }

    run()
    return () => {
      cancelled = true
      clearType()
      timers.forEach(clearTimeout)
    }
  }, [])

  return { visibleSteps, summaryLen, showAgents, thoughtOpen, setThoughtOpen }
}

function ThoughtRow({ step, index, visible }) {
  const Icon = step.Icon
  return (
    <li
      className={`flex h-7 items-center gap-2.5 text-[12.5px] leading-none transition-[opacity,filter,transform] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? 'translate-y-0 opacity-100 blur-0'
          : 'translate-y-1 opacity-0 blur-[3px]'
      }`}
      style={{ transitionDelay: visible ? `${index * 30}ms` : '0ms' }}
      aria-hidden={!visible}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sub">
        <Icon size={13} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="text-ink-2">{step.verb}</span>
      <span className="truncate rounded-[5px] bg-[#f1efeb] px-1.5 py-0.5 font-medium text-ink">
        {step.target}
      </span>
      {step.risk != null && (
        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
            step.risk >= 85
              ? 'bg-danger-soft text-danger'
              : step.risk >= 70
                ? 'bg-warn-soft text-warn'
                : 'bg-brand-soft text-forest'
          }`}
        >
          {step.risk}
        </span>
      )}
      <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-sub">{step.ms}</span>
    </li>
  )
}

function AgentChip({ name, risk, delay, visible }) {
  return (
    <div
      className={`flex items-center gap-2 border border-[rgba(31,30,28,0.11)] bg-white px-2.5 py-2 transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-1 scale-[0.98] opacity-0'
      }`}
      style={{ transitionDelay: visible ? `${delay}s` : '0s' }}
    >
      <span className="flex h-6 w-6 items-center justify-center bg-muted">
        <Sparkles size={12} className="text-brand" aria-hidden="true" />
      </span>
      <span className="text-[12px] font-medium text-ink">{name}</span>
      <span
        className={`ml-auto text-[11px] font-semibold tabular-nums ${
          risk >= 85 ? 'text-danger' : risk >= 70 ? 'text-warn' : 'text-forest'
        }`}
      >
        {risk}
      </span>
    </div>
  )
}

export default function DiscoveryRoomStage() {
  const { visibleSteps, summaryLen, showAgents, thoughtOpen, setThoughtOpen } = useStreamingRoom()
  const thinking = visibleSteps < STEPS.length && summaryLen === 0

  return (
    <div className="relative mx-auto mt-14 max-w-[1100px] sm:mt-16">
      <div
        className="pointer-events-none absolute -inset-x-6 -top-8 bottom-10 -z-10 sm:-inset-x-12"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,77,0,0.14),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      <div className="relative flex h-[640px] flex-col overflow-hidden border border-[rgba(31,30,28,0.11)] bg-[#faf9f6] shadow-lift sm:h-[660px]">
        {/* Top chrome */}
        <div className="flex shrink-0 items-center gap-2 border-b border-[rgba(31,30,28,0.11)] bg-white px-3 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e8e4df]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e8e4df]" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand/70" />
          </span>
          <div className="ml-2 flex min-w-0 items-center gap-1 overflow-hidden">
            <span className="border border-[rgba(31,30,28,0.11)] bg-[#faf9f6] px-2.5 py-1 text-[11px] font-medium text-ink">
              Shadow agents · Orbita
            </span>
            <span className="hidden px-2.5 py-1 text-[11px] text-sub sm:inline">Orphaned grants</span>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-forest">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
            Live discovery
          </span>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="hidden min-h-0 overflow-hidden border-r border-[rgba(31,30,28,0.11)] bg-[#f3f1ed] p-3 lg:block" aria-hidden="true">
            <div className="mb-3 flex items-center gap-2 px-1">
              <BrandMark size={22} />
              <span className="truncate text-[12.5px] font-medium tracking-[-0.01em] text-ink">
                Orbita
              </span>
            </div>

            <div className="mb-4 flex items-center gap-2 border border-[rgba(31,30,28,0.11)] bg-white px-2.5 py-1.5 text-[11px] text-sub">
              <Search size={12} aria-hidden="true" />
              <span className="flex-1">Search</span>
              <kbd className="rounded-[4px] bg-[#f1efeb] px-1 font-mono text-[10px]">⌘K</kbd>
            </div>

            <p className="ox-label mb-1.5 px-1 !text-[10px]">Workspace</p>
            <ul className="mb-4 space-y-0.5 text-[12.5px]">
              {[
                { label: 'Inventory', Icon: ScanSearch, active: true },
                { label: 'Identity graph', Icon: Sparkles },
                { label: 'Compliance', Icon: ShieldAlert },
              ].map((item) => (
                <li
                  key={item.label}
                  className={`flex items-center gap-2 px-2 py-1.5 ${
                    item.active
                      ? 'border-l-2 border-brand bg-[#fff0e8] font-medium text-brand'
                      : 'border-l-2 border-transparent text-ink-2'
                  }`}
                >
                  <item.Icon size={13} aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>

            <p className="ox-label mb-1.5 px-1 !text-[10px]">Recents</p>
            <ul className="space-y-0.5 text-[12px]">
              {RECENT.map((r) => (
                <li
                  key={r.title}
                  className={`truncate px-2 py-1.5 ${
                    r.active ? 'bg-white font-medium text-ink' : 'text-ink-2'
                  }`}
                >
                  {r.active && (
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand align-middle" />
                  )}
                  {r.title}
                </li>
              ))}
            </ul>

            <div className="mt-6 border border-[rgba(31,30,28,0.11)] bg-white p-2.5">
              <p className="ox-label !text-[10px]">Next run</p>
              <p className="mt-1 text-[12px] font-medium text-ink">Full stack rescan</p>
              <p className="mt-0.5 text-[11px] text-sub">Tomorrow · 07:30 IST</p>
            </div>
          </aside>

          {/* Thread */}
          <div className="relative flex min-h-0 flex-col bg-white">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[rgba(31,30,28,0.08)] px-4 py-3 sm:px-5">
              <div>
                <h3 className="text-[17px] font-medium tracking-[-0.02em] text-ink">
                  Shadow agents · Orbita
                </h3>
                <p className="mt-0.5 text-[12px] text-sub">Discovery · first scan</p>
              </div>
              <div className="flex items-center gap-1.5">
                {['AN', 'RS', 'DP'].map((ini, i) => (
                  <span
                    key={ini}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#efe8e1] text-[9px] font-semibold text-ink"
                    style={{ marginLeft: i ? -6 : 0 }}
                  >
                    {ini}
                  </span>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-hidden px-4 py-4 sm:px-5">
              {/* User prompt */}
              <div className="flex gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-[10px] font-semibold text-white">
                  You
                </span>
                <p className="max-w-[52ch] pt-1 text-[13.5px] leading-relaxed text-ink">
                  Scan our stack and show every AI agent we don&apos;t already know about.
                </p>
              </div>

              {/* Sentinel response */}
              <div className="flex min-h-0 gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-brand text-white">
                  <Sparkles size={13} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex h-5 items-center gap-2">
                    <span className="text-[13px] font-medium text-ink">Sentinel</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] text-sub transition-opacity ${
                        thinking ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span className="live-dot h-1 w-1 rounded-full bg-brand" />
                      scanning
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setThoughtOpen((v) => !v)}
                    className="mb-2 inline-flex h-5 cursor-pointer items-center gap-1 text-[12px] text-sub transition-colors hover:text-ink"
                  >
                    Thought for {Math.max(1, visibleSteps)}s
                    <ChevronDown
                      size={12}
                      className={`transition-transform ${thoughtOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Fixed thought rail — always reserves full step list height */}
                  <div
                    className={`mb-3 overflow-hidden border-l border-[rgba(31,30,28,0.12)] pl-3 transition-opacity duration-200 ${
                      thoughtOpen ? 'opacity-100' : 'opacity-40'
                    }`}
                    style={{ height: `${STEPS.length * 28 + 28}px` }}
                  >
                    <ul>
                      {STEPS.map((step, i) => (
                        <ThoughtRow
                          key={`${step.verb}-${step.target}`}
                          step={step}
                          index={i}
                          visible={thoughtOpen && i < visibleSteps}
                        />
                      ))}
                    </ul>
                    <div
                      className={`flex h-7 items-center gap-2 text-[12px] text-sub transition-opacity ${
                        thinking && thoughtOpen ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span className="stream-caret h-3.5 w-1.5 bg-brand" aria-hidden="true" />
                      rendering…
                    </div>
                  </div>

                  {/* Fixed summary block */}
                  <p className="min-h-[63px] max-w-[58ch] text-[13.5px] leading-relaxed text-ink">
                    {summaryLen > 0 ? SUMMARY.slice(0, summaryLen) : '\u00A0'}
                    {summaryLen > 0 && summaryLen < SUMMARY.length && (
                      <span className="stream-caret ml-0.5 inline-block h-[13px] w-[2px] bg-brand align-[-2px]" />
                    )}
                  </p>

                  {/* Fixed agent + file slots */}
                  <div className="mt-3 grid h-[84px] max-w-md grid-rows-2 gap-1.5 sm:grid-cols-2">
                    <AgentChip name="Zapier Invoice Bot" risk={87} delay={0.05} visible={showAgents} />
                    <AgentChip name="Payroll Sync Agent" risk={92} delay={0.15} visible={showAgents} />
                    <AgentChip name="Postgres MCP Server" risk={71} delay={0.25} visible={showAgents} />
                    <AgentChip name="Sales Outreach GPT" risk={74} delay={0.35} visible={showAgents} />
                  </div>

                  <div
                    className={`mt-3 flex h-[52px] max-w-xs items-center gap-2.5 border border-[rgba(31,30,28,0.11)] bg-[#faf9f6] px-3 transition-opacity duration-400 ${
                      showAgents ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ transitionDelay: showAgents ? '0.45s' : '0s' }}
                  >
                    <span className="flex h-8 w-8 items-center justify-center bg-danger-soft text-danger">
                      <FileText size={14} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-ink">
                        shadow-agents-report.pdf
                      </p>
                      <p className="text-[11px] text-sub">Evidence pack · DPDP + SOC 2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Composer + CTA spacer */}
            <div className="shrink-0 border-t border-[rgba(31,30,28,0.08)] bg-[#faf9f6] px-3 pb-14 pt-3 sm:px-4 sm:pb-16">
              <div className="flex items-center gap-2 border border-[rgba(31,30,28,0.14)] bg-white px-2.5 py-2">
                <button
                  type="button"
                  className="flex h-7 w-7 shrink-0 items-center justify-center text-sub"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <Plus size={14} />
                </button>
                <span className="flex-1 truncate text-[13px] text-sub">
                  Ask Sentinel or @ someone
                </span>
                <span className="hidden items-center gap-1 text-[11px] text-sub sm:inline-flex">
                  Orbita Auto Route
                  <ChevronDown size={11} aria-hidden="true" />
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                  <ArrowUp size={13} aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay CTA */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center sm:bottom-4">
          <Link to="/app" className="ox-btn ox-btn-primary pointer-events-auto shadow-lift">
            <span className="text-left">
              <span className="block text-[13.5px] font-medium">Experience it now</span>
              <span className="block text-[11px] text-white/55">No credit card · live demo</span>
            </span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
