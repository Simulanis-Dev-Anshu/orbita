import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  LayoutDashboard,
  BellRing,
  Settings,
  Fingerprint,
  Boxes,
  Radar,
  ScanSearch,
  Share2,
  ShieldAlert,
  Wrench,
  Landmark,
} from 'lucide-react'
import { useAgents } from '../context/AgentsContext.jsx'

const pages = [
  { label: 'Dashboard', to: '/app', icon: LayoutDashboard },
  { label: 'Identity', to: '/app/identity', icon: Fingerprint },
  { label: 'Discovery', to: '/app/discovery', icon: Radar },
  { label: 'Assets', to: '/app/assets', icon: Boxes },
  { label: 'Relationships', to: '/app/relationships', icon: Share2 },
  { label: 'Risk', to: '/app/risk', icon: ShieldAlert },
  { label: 'Intelligence', to: '/app/intelligence', icon: ScanSearch },
  { label: 'Remediation', to: '/app/remediation', icon: Wrench },
  { label: 'Governance', to: '/app/governance', icon: Landmark },
  { label: 'Alerts', to: '/app/alerts', icon: BellRing },
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
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const q = query.trim().toLowerCase()

  const pageHits = useMemo(() => {
    if (!q) return pages
    return pages.filter((p) => p.label.toLowerCase().includes(q))
  }, [q])

  const agentHits = useMemo(() => {
    if (!q) return []
    return agents
      .filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.owner.toLowerCase().includes(q) ||
          a.platform.toLowerCase().includes(q),
      )
      .slice(0, 6)
  }, [agents, q])

  if (!open) return null

  const go = (to) => {
    navigate(to)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/40 px-4 pt-[12vh]" onClick={onClose}>
      <div
        className="w-full max-w-xl overflow-hidden rounded-card border border-line bg-card shadow-lift"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Command palette"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={18} className="text-sub" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a page or search agents…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-sub"
          />
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-sub">ESC</kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {pageHits.length > 0 && (
            <div className="mb-2">
              <p className="px-2 py-1.5 text-[11px] font-semibold tracking-wide text-sub uppercase">Pages</p>
              <ul>
                {pageHits.map((p) => (
                  <li key={p.to}>
                    <button
                      type="button"
                      onClick={() => go(p.to)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-btn px-3 py-2.5 text-left text-sm hover:bg-muted"
                    >
                      <p.icon size={16} className="text-sub" aria-hidden="true" />
                      {p.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {agentHits.length > 0 && (
            <div>
              <p className="px-2 py-1.5 text-[11px] font-semibold tracking-wide text-sub uppercase">Agents</p>
              <ul>
                {agentHits.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => go(`/app/assets?tab=inventory`)}
                      className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-btn px-3 py-2.5 text-left text-sm hover:bg-muted"
                    >
                      <span className="truncate font-medium">{a.name}</span>
                      <span className="truncate text-xs text-sub">{a.platform}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pageHits.length === 0 && agentHits.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-sub">No matches.</p>
          )}
        </div>
      </div>
    </div>
  )
}
