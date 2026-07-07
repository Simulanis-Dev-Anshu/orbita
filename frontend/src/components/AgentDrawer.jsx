import { useEffect, useState } from 'react'
import { X, Bot, Power, Link2, BadgeCheck, Waypoints, Pencil, Trash2 } from 'lucide-react'
import FingerprintHeatmap from './FingerprintHeatmap.jsx'

const riskFactors = (agent) => [
  { label: 'Data sensitivity', value: Math.min(100, agent.risk + 5) },
  { label: 'Permission breadth', value: Math.max(10, agent.risk - 8) },
  { label: 'Ownership health', value: agent.status === 'orphaned' ? 96 : 30 },
  { label: 'Credential hygiene', value: Math.max(15, agent.risk - 20) },
]

function factorTone(v) {
  if (v >= 75) return 'bg-danger'
  if (v >= 50) return 'bg-warn'
  return 'bg-forest'
}

export default function AgentDrawer({ agent, onClose, onEdit, onDelete }) {
  const [killState, setKillState] = useState('idle') // idle | confirm | revoked
  const [deleteState, setDeleteState] = useState('idle') // idle | confirm
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setKillState('idle')
    setDeleteState('idle')
    setCopied(false)
  }, [agent])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!agent) return null

  const trustScore = Math.max(0, 1000 - agent.risk * 10 - (agent.status === 'orphaned' ? 120 : 0))
  const blastRadius = agent.scopes.length * 3 + Math.round(agent.risk / 10)

  const copyPassport = () => {
    navigator.clipboard?.writeText(`https://app.agentlens.io/passport/${agent.id}`).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${agent.name} details`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-card shadow-lift"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-start gap-3 border-b border-line bg-card p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest">
            <Bot size={22} className="text-brand" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold">{agent.name}</h2>
            <p className="text-sm text-sub">
              {agent.platform} · owned by{' '}
              <span className={agent.owner === 'Unassigned' ? 'font-semibold text-danger' : ''}>
                {agent.owner}
              </span>
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(agent)}
                className="cursor-pointer rounded-lg p-2 text-sub transition-colors hover:bg-canvas hover:text-ink"
                aria-label={`Edit ${agent.name}`}
              >
                <Pencil size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg p-2 text-sub transition-colors hover:bg-canvas hover:text-ink"
              aria-label="Close details"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          {/* Trust passport */}
          <section className="rounded-card bg-gradient-to-br from-forest to-forest-2 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BadgeCheck size={18} className="text-brand" aria-hidden="true" />
                <p className="text-sm font-semibold">Agent Passport</p>
              </div>
              <span className="rounded-full bg-brand/15 px-2.5 py-1 text-xs font-semibold text-brand">
                Trust {trustScore}/1000
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Portable, verifiable record of this agent's identity, permissions and behavior —
              shareable with auditors and vendors.
            </p>
            <button
              type="button"
              onClick={copyPassport}
              className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-btn bg-brand px-3 py-2 text-xs font-semibold text-forest transition-opacity hover:opacity-90"
            >
              <Link2 size={14} aria-hidden="true" />
              {copied ? 'Link copied' : 'Copy passport link'}
            </button>
          </section>

          {/* Risk breakdown */}
          <section>
            <h3 className="text-sm font-semibold">Risk breakdown — {agent.risk}/100</h3>
            <ul className="mt-3 space-y-2.5">
              {riskFactors(agent).map((f) => (
                <li key={f.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-sub">{f.label}</span>
                    <span className="font-semibold tabular-nums">{f.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-canvas">
                    <div
                      className={`h-full rounded-full ${factorTone(f.value)}`}
                      style={{ width: `${f.value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Blast radius */}
          <section className="flex items-center gap-3 rounded-card bg-canvas p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-soft text-danger">
              <Waypoints size={20} aria-hidden="true" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">Blast radius: {blastRadius} resources</p>
              <p className="text-xs text-sub">
                If compromised, reachable via {agent.scopes.join(', ')}
              </p>
            </div>
          </section>

          {/* Behavioral fingerprint */}
          <section>
            <h3 className="text-sm font-semibold">Behavioral fingerprint</h3>
            <p className="mb-3 text-xs text-sub">Activity by hour (last 7 days, IST)</p>
            <FingerprintHeatmap agentId={agent.id} />
          </section>

          {/* Kill switch */}
          <section className="rounded-card border border-danger/30 bg-danger-soft/40 p-4">
            <p className="text-sm font-semibold text-danger">Kill switch</p>
            <p className="mt-1 text-xs leading-relaxed text-sub">
              Revokes every OAuth grant and token this agent uses. The agent stops within one sync
              cycle (~5 min).
            </p>
            {killState === 'idle' && (
              <button
                type="button"
                onClick={() => setKillState('confirm')}
                className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-btn bg-danger px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Power size={14} aria-hidden="true" />
                Revoke all access
              </button>
            )}
            {killState === 'confirm' && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setKillState('revoked')}
                  className="cursor-pointer rounded-btn bg-danger px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Confirm revoke
                </button>
                <button
                  type="button"
                  onClick={() => setKillState('idle')}
                  className="cursor-pointer rounded-btn border border-line bg-card px-4 py-2 text-xs font-semibold transition-colors hover:border-forest"
                >
                  Cancel
                </button>
              </div>
            )}
            {killState === 'revoked' && (
              <p className="mt-3 rounded-btn bg-card px-3 py-2 text-xs font-semibold text-forest">
                ✓ Revocation queued — grants will be removed on next sync (demo)
              </p>
            )}
          </section>

          {/* Remove from inventory */}
          {onDelete && (
            <section className="flex items-center justify-between gap-3 rounded-card bg-canvas p-4">
              <div>
                <p className="text-sm font-semibold">Remove from inventory</p>
                <p className="text-xs text-sub">
                  Deletes the record only — access grants stay untouched.
                </p>
              </div>
              {deleteState === 'idle' ? (
                <button
                  type="button"
                  onClick={() => setDeleteState('confirm')}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-btn border border-line bg-card px-3 py-2 text-xs font-semibold text-sub transition-colors hover:border-danger hover:text-danger"
                >
                  <Trash2 size={13} aria-hidden="true" />
                  Delete
                </button>
              ) : (
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDelete(agent)}
                    className="cursor-pointer rounded-btn bg-danger px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteState('idle')}
                    className="cursor-pointer rounded-btn border border-line bg-card px-3 py-2 text-xs font-semibold transition-colors hover:border-forest"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </aside>
    </>
  )
}
