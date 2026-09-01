import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  FileText,
  Plus,
  Radar,
  ScanSearch,
  Search,
  ShieldAlert,
  UserX,
} from 'lucide-react'
import BrandMark from '../components/BrandMark.jsx'
import SentinelReply from '../components/SentinelReply.jsx'
import { analystReplies, analystSuggested } from '../data/platform.js'
import {
  SENTINEL_DEMO_AGENTS,
  SENTINEL_DEMO_EVIDENCE,
  SENTINEL_DEMO_PROMPT,
  SENTINEL_DEMO_STEPS,
  SENTINEL_DEMO_SUMMARY,
  SENTINEL_RECENTS,
  SENTINEL_WORKSPACE,
} from '../data/sentinelDemo.js'

const FALLBACK_REPLY = {
  summary: 'Matched against live inventory.',
  breakdown: [
    { label: 'Query understood', tone: 'medium' },
    { label: 'Try a suggested prompt for a full demo reply', tone: 'high' },
  ],
  highest: { title: 'Hint', chain: ['Use a suggested question', 'for a scripted analyst answer'] },
}

function toneToRisk(tone) {
  if (tone === 'critical') return 92
  if (tone === 'high') return 78
  return 64
}

function thoughtsFor(reply) {
  const chain = reply.highest?.chain ?? []
  const items = reply.breakdown ?? []
  return [
    { verb: 'Connected', target: 'Identity graph · live inventory', ms: '0.4s', Icon: Check },
    {
      verb: 'Read',
      target: chain[0] ? `${chain[0]} · grants & scopes` : 'Agent catalog · last 30 days',
      ms: '1.1s',
      Icon: FileText,
    },
    {
      verb: 'Scanned',
      target: chain[1] ? `${chain[1]} · downstream edges` : 'Relationship graph',
      ms: '0.8s',
      Icon: Radar,
    },
    {
      verb: 'Found',
      target: items[0]?.label ?? chain.slice(0, 2).join(' · ') ?? 'matching agents',
      ms: '0.6s',
      Icon: ScanSearch,
      risk: items[0] ? toneToRisk(items[0].tone) : undefined,
    },
    {
      verb: 'Flagged',
      target: items[1]?.label ?? items[0]?.label ?? 'Risk concentration',
      ms: '0.5s',
      Icon: UserX,
      risk: items[1] ? toneToRisk(items[1].tone) : undefined,
    },
    {
      verb: 'Compared',
      target: chain.length ? chain.join(' → ') : 'peer mid-market baseline',
      ms: '1.2s',
      Icon: ShieldAlert,
    },
  ]
}

function narrativeFor(reply) {
  const extra = (reply.breakdown ?? []).map((b) => b.label).join(', ')
  const path = reply.highest?.chain?.join(' → ')
  return [reply.summary, extra && `${extra}.`, path && `Highest path: ${path}.`].filter(Boolean).join(' ')
}

function agentsFor(reply) {
  return (reply.breakdown ?? []).slice(0, 4).map((b) => ({
    name: b.label,
    risk: toneToRisk(b.tone),
  }))
}

function packFor(question) {
  if (question === SENTINEL_DEMO_PROMPT) {
    return {
      steps: SENTINEL_DEMO_STEPS,
      summary: SENTINEL_DEMO_SUMMARY,
      agents: SENTINEL_DEMO_AGENTS,
      evidence: SENTINEL_DEMO_EVIDENCE,
      reply: {
        summary: SENTINEL_DEMO_SUMMARY,
        breakdown: SENTINEL_DEMO_AGENTS.map((a) => ({
          label: `${a.name} · ${a.risk}`,
          tone: a.risk >= 85 ? 'critical' : a.risk >= 70 ? 'high' : 'medium',
        })),
        highest: { title: 'Highest risk', chain: ['Zapier Invoice Bot', 'orphaned OAuth', 'payroll data'] },
      },
    }
  }

  const reply = analystReplies[question] || FALLBACK_REPLY
  return {
    steps: thoughtsFor(reply),
    summary: narrativeFor(reply),
    agents: agentsFor(reply),
    evidence: { file: 'analyst-report.pdf', meta: 'Evidence pack · DPDP + SOC 2' },
    reply,
  }
}

function HighestPath({ reply }) {
  if (!reply?.highest) return null
  return (
    <div className="mt-3 max-w-md rounded-2xl border border-line bg-canvas p-3.5">
      <p className="text-[11px] font-semibold tracking-wide text-sub uppercase">{reply.highest.title}</p>
      <div className="mt-2 space-y-1 font-mono text-[13px] text-sub">
        {reply.highest.chain.map((step, i) => (
          <p key={`${step}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ArrowDown size={12} aria-hidden="true" />}
            <span className={i === 0 ? 'font-sans font-semibold text-ink' : ''}>{step}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

let turnSeq = 0
function nextId() {
  turnSeq += 1
  return `turn-${turnSeq}`
}

export default function SecurityAnalyst() {
  const navigate = useNavigate()
  const scroller = useRef(null)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(true)
  const [activeRecent, setActiveRecent] = useState(SENTINEL_RECENTS[0].title)
  const demo = useMemo(() => packFor(SENTINEL_DEMO_PROMPT), [])
  const [thread, setThread] = useState(() => [
    { id: 'user-demo', role: 'user', text: SENTINEL_DEMO_PROMPT },
    {
      id: 'asst-demo',
      role: 'assistant',
      animate: true,
      runId: 1,
      ...demo,
    },
  ])

  const ask = (q) => {
    const question = (q || input).trim()
    if (!question || busy) return
    const pack = packFor(question)
    const recent = SENTINEL_RECENTS.find((r) => r.prompt === question)
    if (recent) setActiveRecent(recent.title)
    setBusy(true)
    setThread((t) => [
      ...t,
      { id: nextId(), role: 'user', text: question },
      { id: nextId(), role: 'assistant', animate: true, runId: Date.now(), ...pack },
    ])
    setInput('')
  }

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [thread, busy])

  const suggested = [SENTINEL_DEMO_PROMPT, ...analystSuggested.filter((q) => q !== SENTINEL_DEMO_PROMPT)].slice(0, 4)
  const lastAssistantId = [...thread].reverse().find((x) => x.role === 'assistant')?.id

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        {suggested.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => ask(q)}
            disabled={busy}
            className="cursor-pointer rounded-btn border border-line bg-card px-3 py-2 text-left text-xs font-medium text-ink hover:border-ink/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      <section className="relative flex h-[640px] flex-col overflow-hidden rounded-card border border-line bg-canvas shadow-soft sm:h-[680px]">
        <div className="flex shrink-0 items-center gap-2 border-b border-line bg-card px-3 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand/70" />
          </span>
          <div className="ml-2 flex min-w-0 items-center gap-1 overflow-hidden">
            <span className="border border-line bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink">
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
          <aside className="hidden min-h-0 overflow-hidden border-r border-line bg-muted p-3 lg:block">
            <div className="mb-3 flex items-center gap-2 px-1">
              <BrandMark size={22} />
              <span className="truncate text-[12.5px] font-medium tracking-[-0.01em] text-ink">Orbita</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/app/intelligence?tab=search')}
              className="mb-4 flex w-full cursor-pointer items-center gap-2 border border-line bg-card px-2.5 py-1.5 text-left text-[11px] text-sub"
            >
              <Search size={12} aria-hidden="true" />
              <span className="flex-1">Search</span>
              <kbd className="rounded-[4px] bg-muted px-1 font-mono text-[10px]">⌘K</kbd>
            </button>

            <p className="ox-label mb-1.5 px-1 !text-[10px]">Workspace</p>
            <ul className="mb-4 space-y-0.5 text-[12.5px]">
              {SENTINEL_WORKSPACE.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-2 px-2 py-1.5 ${
                      item.active
                        ? 'border-l-2 border-brand bg-brand-soft font-medium text-brand'
                        : 'border-l-2 border-transparent text-ink-2 hover:text-ink'
                    }`}
                  >
                    <item.Icon size={13} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="ox-label mb-1.5 px-1 !text-[10px]">Recents</p>
            <ul className="space-y-0.5 text-[12px]">
              {SENTINEL_RECENTS.map((r) => (
                <li key={r.title}>
                  <button
                    type="button"
                    onClick={() => ask(r.prompt)}
                    disabled={busy}
                    className={`w-full cursor-pointer truncate px-2 py-1.5 text-left disabled:cursor-not-allowed ${
                      activeRecent === r.title ? 'bg-card font-medium text-ink' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {activeRecent === r.title && (
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand align-middle" />
                    )}
                    {r.title}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 border border-line bg-card p-2.5">
              <p className="ox-label !text-[10px]">Next run</p>
              <p className="mt-1 text-[12px] font-medium text-ink">Full stack rescan</p>
              <p className="mt-0.5 text-[11px] text-sub">Tomorrow · 07:30 IST</p>
            </div>
          </aside>

          <div className="relative flex min-h-0 flex-col bg-card">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
              <div>
                <h3 className="text-[17px] font-medium tracking-[-0.02em] text-ink">Shadow agents · Orbita</h3>
                <p className="mt-0.5 text-[12px] text-sub">Discovery · first scan</p>
              </div>
              <div className="flex items-center gap-1.5">
                {['AN', 'RS', 'DP'].map((ini, i) => (
                  <span
                    key={ini}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-card bg-muted text-[9px] font-semibold text-ink"
                    style={{ marginLeft: i ? -6 : 0 }}
                  >
                    {ini}
                  </span>
                ))}
              </div>
            </div>

            <div ref={scroller} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-5">
              {thread.map((m) => {
                if (m.role === 'user') {
                  return (
                    <div key={m.id} className="flex gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-[10px] font-semibold text-white">
                        You
                      </span>
                      <p className="max-w-[52ch] pt-1 text-[13.5px] leading-relaxed text-ink">{m.text}</p>
                    </div>
                  )
                }
                return (
                  <div key={m.id} className="flex min-h-0 gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-brand">
                      <BrandMark size={16} invert />
                    </span>
                    <SentinelReply
                      steps={m.steps}
                      summary={m.summary}
                      agents={m.agents}
                      evidence={m.evidence}
                      animate={m.animate}
                      runId={m.runId}
                      onDone={m.id === lastAssistantId ? () => setBusy(false) : undefined}
                    >
                      {m.evidence?.file !== SENTINEL_DEMO_EVIDENCE.file ? <HighestPath reply={m.reply} /> : null}
                    </SentinelReply>
                  </div>
                )
              })}
            </div>

            <form
              className="shrink-0 border-t border-line bg-canvas px-3 py-3 sm:px-4"
              onSubmit={(e) => {
                e.preventDefault()
                ask()
              }}
            >
              <div className="flex items-center gap-2 border border-line bg-card px-2.5 py-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center text-sub" aria-hidden="true">
                  <Plus size={14} />
                </span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Sentinel or @ someone"
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-sub"
                  disabled={busy}
                />
                <span className="hidden items-center gap-1 text-[11px] text-sub sm:inline-flex">
                  Orbita Auto Route
                  <ChevronDown size={11} aria-hidden="true" />
                </span>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink text-white disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send"
                >
                  <ArrowUp size={13} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
