import { useState } from 'react'
import { ArrowDown, ArrowUp, Sparkles } from 'lucide-react'
import { analystReplies, analystSuggested } from '../data/platform.js'

function toneClass(tone) {
  if (tone === 'critical') return 'bg-danger-soft text-danger'
  if (tone === 'high') return 'bg-warn-soft text-warn'
  return 'bg-[#fff3dc] text-[#9a6200]'
}

function ReplyCard({ reply }) {
  if (!reply) return null
  return (
    <div className="rounded-2xl border border-line bg-canvas p-4">
      <p className="text-base font-semibold text-ink">{reply.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {reply.breakdown.map((b) => (
          <span key={b.label} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${toneClass(b.tone)}`}>
            {b.label}
          </span>
        ))}
      </div>
      {reply.highest && (
        <div className="mt-4 rounded-2xl border border-line bg-card p-3.5">
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
      )}
    </div>
  )
}

export default function SecurityAnalyst() {
  const [input, setInput] = useState('')
  const [thread, setThread] = useState([
    {
      role: 'assistant',
      text: 'Ask about AI that can touch customer data, personal accounts, unapproved MCP, or production paths.',
      reply: null,
    },
  ])

  const ask = (q) => {
    const question = (q || input).trim()
    if (!question) return
    const reply = analystReplies[question] || {
      summary: 'Matched against live inventory.',
      breakdown: [
        { label: 'Query understood', tone: 'medium' },
        { label: 'Try a suggested prompt for a full demo reply', tone: 'high' },
      ],
      highest: { title: 'Hint', chain: ['Use a suggested question', 'for a scripted analyst answer'] },
    }
    setThread((t) => [
      ...t,
      { role: 'user', text: question, reply: null },
      { role: 'assistant', text: null, reply },
    ])
    setInput('')
  }

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Sparkles size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="ox-label text-sub">AI Security Analyst</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Ask Orbita in natural language
            </h2>
            <p className="mt-1 text-sm text-sub">
              Example: “Show me every AI that can access customer data.”
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {analystSuggested.slice(0, 4).map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => ask(q)}
            className="cursor-pointer rounded-btn border border-line bg-card px-3 py-2 text-left text-xs font-medium text-ink hover:border-ink/25"
          >
            {q}
          </button>
        ))}
      </div>

      <section className="flex min-h-[420px] flex-col rounded-card border border-line bg-card shadow-soft">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {thread.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'user' ? (
                <div className="max-w-[85%] rounded-2xl bg-forest px-4 py-2.5 text-sm text-white">{m.text}</div>
              ) : m.reply ? (
                <div className="w-full max-w-xl">
                  <ReplyCard reply={m.reply} />
                </div>
              ) : (
                <div className="max-w-[85%] rounded-2xl bg-canvas px-4 py-2.5 text-sm text-ink">{m.text}</div>
              )}
            </div>
          ))}
        </div>
        <form
          className="flex items-center gap-2 border-t border-line p-3"
          onSubmit={(e) => {
            e.preventDefault()
            ask()
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the security analyst…"
            className="min-w-0 flex-1 rounded-btn border border-line bg-canvas px-3.5 py-2.5 text-sm outline-none focus:border-brand"
          />
          <button
            type="submit"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-forest text-white hover:opacity-90"
            aria-label="Send"
          >
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </form>
      </section>
    </div>
  )
}
