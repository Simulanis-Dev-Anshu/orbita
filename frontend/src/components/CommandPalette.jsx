import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bot,
  LayoutDashboard,
  Waypoints,
  BellRing,
  ShieldCheck,
  Plug,
  Settings,
  Sparkles,
} from 'lucide-react'
import { useAgents } from '../context/AgentsContext.jsx'

const pages = [
  { label: 'Dashboard', to: '/app', icon: LayoutDashboard },
  { label: 'Sentinel Copilot', to: '/app/copilot', icon: Sparkles },
  { label: 'Agent Graph', to: '/app/graph', icon: Waypoints },
  { label: 'Inventory', to: '/app/inventory', icon: Bot },
  { label: 'Alerts', to: '/app/alerts', icon: BellRing },
  { label: 'Compliance', to: '/app/compliance', icon: ShieldCheck },
  { label: 'Connectors', to: '/app/connectors', icon: Plug },
  { label: 'Settings', to: '/app/settings', icon: Settings },
]

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { agents } = useAgents()

  useEffect(() => {
    if (open) {
      setQuery('')
      // focus after mount
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const q = query.trim().toLowerCase()

  const pageHits = useMemo(
    () => (q ? pages.filter((p) => p.label.toLowerCase().includes(q)) : pages),
    [q],
  )
  const agentHits = useMemo(
    () =>
      q
        ? agents.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.owner.toLowerCase().includes(q) ||
              a.platform.toLowerCase().includes(q),
          )
        : agents.slice(0, 4),
    [agents, q],
  )

  if (!open) return null

  const go = (to, state) => {
    onClose()
    navigate(to, state ? { state } : undefined)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-[12dvh]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="w-full max-w-lg overflow-hidden rounded-card bg-card shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={18} className="shrink-0 text-sub" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, owners, pages… "
            className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-sub"
            aria-label="Search agents, owners and pages"
          />
          <kbd className="rounded-md border border-line bg-canvas px-1.5 py-0.5 text-[10px] font-semibold text-sub">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50dvh] overflow-y-auto p-2">
          {agentHits.length > 0 && (
            <>
              <p className="ox-label px-3 pt-2 pb-1 text-sub">
                Agents
              </p>
              {agentHits.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => go('/app/inventory', { q: a.name })}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-canvas"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest">
                    <Bot size={15} className="text-brand" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{a.name}</span>
                    <span className="block truncate text-xs text-sub">
                      {a.platform} · {a.owner}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      a.risk >= 75 ? 'bg-danger-soft text-danger' : 'bg-brand-soft text-forest'
                    }`}
                  >
                    {a.risk}
                  </span>
                </button>
              ))}
            </>
          )}

          {pageHits.length > 0 && (
            <>
              <p className="ox-label px-3 pt-3 pb-1 text-sub">
                Pages
              </p>
              {pageHits.map((p) => (
                <button
                  key={p.to}
                  type="button"
                  onClick={() => go(p.to)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-canvas"
                >
                  <p.icon size={16} className="text-sub" aria-hidden="true" />
                  {p.label}
                </button>
              ))}
            </>
          )}

          {/* Ask Sentinel fallback */}
          <p className="ox-label px-3 pt-3 pb-1 text-sub">
            Stuck?
          </p>
          <button
            type="button"
            onClick={() => go('/app/copilot', { ask: q || 'Help me find a risky agent' })}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-brand-soft/60 px-3 py-3 text-left transition-colors hover:bg-brand-soft"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest">
              <Sparkles size={15} className="text-brand" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium">
              Ask Sentinel Copilot{q ? `: "${query.trim()}"` : ' for help'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
