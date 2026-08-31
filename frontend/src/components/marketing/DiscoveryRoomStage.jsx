import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Plus,
  Search,
} from 'lucide-react'
import BrandMark from '../BrandMark.jsx'
import SentinelReply from '../SentinelReply.jsx'
import {
  SENTINEL_DEMO_AGENTS,
  SENTINEL_DEMO_EVIDENCE,
  SENTINEL_DEMO_PROMPT,
  SENTINEL_DEMO_STEPS,
  SENTINEL_DEMO_SUMMARY,
  SENTINEL_RECENTS,
  SENTINEL_WORKSPACE,
} from '../../data/sentinelDemo.js'

export default function DiscoveryRoomStage() {
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
          <aside className="hidden min-h-0 overflow-hidden border-r border-[rgba(31,30,28,0.11)] bg-[#f3f1ed] p-3 lg:block" aria-hidden="true">
            <div className="mb-3 flex items-center gap-2 px-1">
              <BrandMark size={22} />
              <span className="truncate text-[12.5px] font-medium tracking-[-0.01em] text-ink">Orbita</span>
            </div>

            <div className="mb-4 flex items-center gap-2 border border-[rgba(31,30,28,0.11)] bg-white px-2.5 py-1.5 text-[11px] text-sub">
              <Search size={12} aria-hidden="true" />
              <span className="flex-1">Search</span>
              <kbd className="rounded-[4px] bg-[#f1efeb] px-1 font-mono text-[10px]">⌘K</kbd>
            </div>

            <p className="ox-label mb-1.5 px-1 !text-[10px]">Workspace</p>
            <ul className="mb-4 space-y-0.5 text-[12.5px]">
              {SENTINEL_WORKSPACE.map((item) => (
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
              {SENTINEL_RECENTS.map((r) => (
                <li
                  key={r.title}
                  className={`truncate px-2 py-1.5 ${r.active ? 'bg-white font-medium text-ink' : 'text-ink-2'}`}
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

          <div className="relative flex min-h-0 flex-col bg-white">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[rgba(31,30,28,0.08)] px-4 py-3 sm:px-5">
              <div>
                <h3 className="text-[17px] font-medium tracking-[-0.02em] text-ink">Shadow agents · Orbita</h3>
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
              <div className="flex gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-[10px] font-semibold text-white">
                  You
                </span>
                <p className="max-w-[52ch] pt-1 text-[13.5px] leading-relaxed text-ink">{SENTINEL_DEMO_PROMPT}</p>
              </div>

              <div className="flex min-h-0 gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-brand">
                  <BrandMark size={16} invert />
                </span>
                <SentinelReply
                  steps={SENTINEL_DEMO_STEPS}
                  summary={SENTINEL_DEMO_SUMMARY}
                  agents={SENTINEL_DEMO_AGENTS}
                  evidence={SENTINEL_DEMO_EVIDENCE}
                  loop
                />
              </div>
            </div>

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
                <span className="flex-1 truncate text-[13px] text-sub">Ask Sentinel or @ someone</span>
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

        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center sm:bottom-4">
          <Link to="/app/intelligence?tab=analyst" className="ox-btn ox-btn-primary pointer-events-auto shadow-lift">
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
