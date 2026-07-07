import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sparkles, Paperclip, Mic, SendHorizonal } from 'lucide-react'
import { aiSuggestions } from '../data/mock.js'

const cannedReply =
  '3 agents can currently reach customer PII: Payroll Sync Agent (92), Customer Data Enricher (81) and Zapier Invoice Bot (87). Two of them are orphaned — I recommend revoking their OAuth grants first.'

export default function AiAssistant() {
  const location = useLocation()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const askedRef = useRef(false)

  // Question handed over from the command palette ("Ask Sentinel")
  useEffect(() => {
    const ask = location.state?.ask
    if (ask && !askedRef.current) {
      askedRef.current = true
      setMessages([
        { role: 'user', text: ask },
        { role: 'assistant', text: cannedReply },
      ])
    }
  }, [location.state])

  const send = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      { role: 'assistant', text: cannedReply },
    ])
    setInput('')
  }

  return (
    <section
      aria-label="AI security copilot"
      className="flex flex-col rounded-card bg-card p-5 shadow-soft sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest">
          <Sparkles size={20} className="text-brand" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold">Sentinel Copilot</h2>
          <p className="text-sm text-sub">Ask anything about your agent fleet</p>
        </div>
      </div>

      {/* Conversation */}
      <div className="mt-4 flex-1 space-y-3 overflow-y-auto" aria-live="polite">
        {messages.length === 0 ? (
          <div className="rounded-2xl bg-canvas p-4 text-sm leading-relaxed text-sub">
            Hi Prabhhav — I watch your identity graph continuously. Try one of the prompts below,
            or ask about any agent, owner or data scope.
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[90%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'ml-auto bg-forest text-white'
                  : 'bg-canvas text-ink'
              }`}
            >
              {m.text}
            </div>
          ))
        )}
      </div>

      {/* Prompt suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {aiSuggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="cursor-pointer rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-forest hover:bg-brand-soft"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        className="mt-4 flex items-center gap-2 rounded-btn border border-line bg-canvas p-2"
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
          className="cursor-pointer rounded-xl bg-brand p-2.5 text-forest transition-opacity hover:opacity-90"
          aria-label="Send message"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </section>
  )
}
