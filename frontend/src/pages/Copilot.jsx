import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Paperclip,
  Mic,
  SendHorizonal,
  Activity,
  ShieldAlert,
  FileText,
  UserX,
  ArrowUpRight,
} from 'lucide-react'
import { aiSuggestions, copilotSignals } from '../data/mock.js'

// Keyword-matched canned replies until the FastAPI backend lands.
const replies = [
  {
    match: ['pii', 'customer data', 'personal'],
    text: '3 agents can currently reach customer PII: Payroll Sync Agent (92), Customer Data Enricher (81) and Zapier Invoice Bot (87). Two of them are orphaned — I recommend revoking their OAuth grants first.',
  },
  {
    match: ['orphan', 'owner left', 'unassigned'],
    text: 'I found 8 orphaned agents. The riskiest are Payroll Sync Agent (92) and Customer Data Enricher (81) — both still executing on credentials of deactivated accounts. Want me to draft revocation requests for their OAuth grants?',
  },
  {
    match: ['dpdp', 'compliance', 'audit', 'report'],
    text: 'Your DPDP readiness is at 78% (25 of 32 controls passing). The two gaps: cross-border transfer inventory (2 agents send PII to US LLM endpoints) and consent-purpose mapping (4 agents). I can generate the auditor-ready summary as a PDF.',
  },
  {
    match: ['risk', 'score', 'dangerous', 'critical'],
    text: 'Your fleet average risk score is 62. 9 agents are critical (score ≥ 85). The top driver is stale OAuth grants combined with write access to financial systems — Payroll Sync Agent is the single biggest exposure.',
  },
]

const fallback =
  'I scanned the identity graph: 147 agents across 12 sources, 8 orphaned, 23 high-risk. Ask me about PII exposure, orphaned agents, risk scores or compliance readiness — or pick a quick action on the right.'

function replyFor(text) {
  const q = text.toLowerCase()
  return replies.find((r) => r.match.some((m) => q.includes(m)))?.text ?? fallback
}

const quickActions = [
  {
    icon: UserX,
    label: 'Triage orphaned agents',
    prompt: 'Show orphaned agents from the last 30 days',
  },
  {
    icon: ShieldAlert,
    label: 'Explain my riskiest agent',
    prompt: 'Why is Payroll Sync Agent scored 92?',
  },
  {
    icon: FileText,
    label: 'Draft DPDP summary',
    prompt: 'Draft the DPDP compliance summary',
  },
]

export default function Copilot() {
  const location = useLocation()
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const askedRef = useRef(false)
  const scrollRef = useRef(null)
  const timerRef = useRef(null)

  const send = (text) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    setTyping(true)
    timerRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', text: replyFor(trimmed) }])
      setTyping(false)
    }, 900)
  }

  // Question handed over from the command palette ("Ask Sentinel")
  useEffect(() => {
    const ask = location.state?.ask
    if (ask && !askedRef.current) {
      askedRef.current = true
      send(ask)
      // Clear state so a refresh doesn't re-ask
      navigate(location.pathname, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // Keep the newest message in view
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
      {/* Chat */}
      <section
        aria-label="Sentinel Copilot chat"
        className="card-in flex min-h-[calc(100dvh-14rem)] flex-col rounded-card bg-card shadow-soft xl:col-span-8"
      >
        <div className="flex items-center gap-3 border-b border-line p-5 sm:px-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest">
            <Sparkles size={22} className="text-brand" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="text-base font-semibold">Sentinel Copilot</h2>
            <p className="text-sm text-sub">Grounded in your live identity graph</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-forest">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
            Watching 147 agents
          </span>
        </div>

        {/* Conversation */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5 sm:p-6" aria-live="polite">
          {messages.length === 0 && (
            <div className="msg-in rounded-2xl bg-canvas p-4 text-sm leading-relaxed text-sub">
              Hi Prabhhav — I watch your identity graph continuously. Ask about any agent, owner or
              data scope, or start from a quick action on the right.
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`msg-in max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user' ? 'ml-auto bg-forest text-white' : 'bg-canvas text-ink'
              }`}
            >
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="msg-in flex w-16 items-center justify-center gap-1 rounded-2xl bg-canvas p-4">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-sub" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-sub" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-sub" />
            </div>
          )}
        </div>

        {/* Prompt suggestions + input */}
        <div className="border-t border-line p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {aiSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="cursor-pointer rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-forest hover:bg-brand-soft"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="flex items-center gap-2 rounded-btn border border-line bg-canvas p-2 transition-colors focus-within:border-forest"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <button
              type="button"
              className="cursor-pointer rounded-lg p-2 text-sub transition-colors hover:text-ink"
              aria-label="Attach file"
            >
              <Paperclip size={18} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sentinel…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-sub"
              aria-label="Message Sentinel Copilot"
            />
            <button
              type="button"
              className="cursor-pointer rounded-lg p-2 text-sub transition-colors hover:text-ink"
              aria-label="Voice input"
            >
              <Mic size={18} />
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-brand p-2.5 text-forest transition-all hover:opacity-90 active:scale-95"
              aria-label="Send message"
            >
              <SendHorizonal size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* Side panel */}
      <div className="flex h-full flex-col gap-4 xl:col-span-4">
        <section
          aria-label="Live signals"
          className="card-in card-hover flex flex-1 flex-col rounded-card bg-card p-5 shadow-soft sm:p-6"
          style={{ '--i': 1 }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-forest">
              <Activity size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-semibold">Live signals</h2>
              <p className="text-xs text-sub">What Sentinel is watching right now</p>
            </div>
          </div>
          <ul className="mt-4 flex flex-1 flex-col justify-between gap-2.5">
            {copilotSignals.map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-2xl bg-canvas p-3.5">
                <span className="min-w-0 flex-1">
                  <span className="block text-xl font-bold tracking-tight">{s.value}</span>
                  <span className="block text-xs text-sub">{s.label}</span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    s.trend.includes('flagged') || s.trend.includes('failed')
                      ? 'bg-warn-soft text-warn'
                      : 'bg-brand-soft text-forest'
                  }`}
                >
                  {s.trend}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-label="Quick actions"
          className="card-in card-hover rounded-card bg-card p-5 shadow-soft sm:p-6"
          style={{ '--i': 2 }}
        >
          <h2 className="text-base font-semibold">Quick actions</h2>
          <p className="text-xs text-sub">One click, Sentinel does the digging</p>
          <ul className="mt-4 space-y-2">
            {quickActions.map(({ icon: Icon, label, prompt }) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => send(prompt)}
                  className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-canvas p-3.5 text-left text-sm font-medium transition-all hover:-translate-y-0.5 hover:bg-brand-soft"
                >
                  <Icon size={18} className="shrink-0 text-forest" aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-sub transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-forest"
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
