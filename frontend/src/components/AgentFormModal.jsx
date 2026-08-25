import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { ASSET_TYPES, inferType, asAsset } from '../data/asset.js'

const platforms = ['Zapier', 'Make', 'n8n', 'Custom GPT', 'Claude', 'GitHub App', 'MCP', 'Other']
const statuses = ['active', 'pending', 'orphaned']

const empty = {
  name: '',
  platform: 'Zapier',
  type: 'AI_AGENT',
  owner: '',
  ownerRole: '',
  scopes: '',
  risk: 50,
  status: 'pending',
}

export default function AgentFormModal({ agent, onSave, onClose }) {
  const isEdit = Boolean(agent)
  const [form, setForm] = useState(empty)

  useEffect(() => {
    setForm(
      agent
        ? { ...agent, scopes: agent.scopes.join(', ') }
        : empty,
    )
  }, [agent])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    onSave(
      asAsset({
        ...form,
        owner: form.owner.trim() || 'Unassigned',
        ownerRole: form.ownerRole.trim() || '-',
        risk: Number(form.risk),
        scopes: form.scopes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    )
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? `Edit ${agent.name}` : 'Register agent'}
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-y-auto rounded-card bg-card p-6 shadow-lift"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">
            {isEdit ? 'Edit agent' : 'Register an agent'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-sub transition-colors hover:bg-canvas hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {!isEdit && (
          <p className="mt-1 text-xs text-sub">
            Manually register an agent the scanners haven't picked up yet.
          </p>
        )}

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-sub">Agent name *</span>
            <input
              required
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Invoice Reconciliation Bot"
              className="mt-1.5 w-full rounded-btn border border-line bg-canvas px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-sub/60 focus:border-brand"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-sub">Platform</span>
              <select
                value={form.platform}
                onChange={(e) => {
                  const platform = e.target.value
                  setForm((f) => ({ ...f, platform, type: inferType(platform) }))
                }}
                className="mt-1.5 w-full cursor-pointer rounded-btn border border-line bg-canvas px-3 py-2.5 text-sm outline-none focus:border-brand"
              >
                {platforms.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-sub">Status</span>
              <select
                value={form.status}
                onChange={set('status')}
                className="mt-1.5 w-full cursor-pointer rounded-btn border border-line bg-canvas px-3 py-2.5 text-sm capitalize outline-none focus:border-brand"
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-sub">Asset type</span>
            <select
              value={form.type}
              onChange={set('type')}
              className="mt-1.5 w-full cursor-pointer rounded-btn border border-line bg-canvas px-3 py-2.5 text-sm outline-none focus:border-brand"
            >
              {ASSET_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-sub">Owner</span>
              <input
                value={form.owner}
                onChange={set('owner')}
                placeholder="Unassigned"
                className="mt-1.5 w-full rounded-btn border border-line bg-canvas px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-sub/60 focus:border-brand"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-sub">Owner role</span>
              <input
                value={form.ownerRole}
                onChange={set('ownerRole')}
                placeholder="e.g. Finance Ops"
                className="mt-1.5 w-full rounded-btn border border-line bg-canvas px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-sub/60 focus:border-brand"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-sub">Access scopes</span>
            <input
              value={form.scopes}
              onChange={set('scopes')}
              placeholder="Comma-separated, e.g. Gmail, Sheets"
              className="mt-1.5 w-full rounded-btn border border-line bg-canvas px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-sub/60 focus:border-brand"
            />
            <span className="mt-1 block text-[11px] text-sub">
              Separate multiple scopes with commas
            </span>
          </label>

          <label className="block">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-sub">Initial risk score</span>
              <span className="font-bold tabular-nums">{form.risk}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={form.risk}
              onChange={set('risk')}
              className="mt-2 w-full cursor-pointer accent-[#170702]"
            />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="flex-1 cursor-pointer rounded-btn bg-forest px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {isEdit ? 'Save changes' : 'Register agent'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-btn border border-line bg-canvas px-4 py-2.5 text-sm font-semibold transition-colors hover:border-brand"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
