import { Building2, Users, CreditCard, MapPin, UserPlus, Landmark, Smartphone, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { teamMembers as seedTeam } from '../data/mock.js'
import { endpoints } from '../lib/api.js'

const subscription = {
  plan: 'Growth',
  price: '₹80,000',
  period: '/mo',
  renews: 'Aug 7, 2026',
  seats: 'Unlimited agents',
  billingEmail: 'billing@acme.com',
  nextInvoice: '₹80,000 on Aug 7, 2026',
}

const paymentMethods = [
  {
    id: 'pm-1',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiry: '09/28',
    isDefault: true,
  },
  {
    id: 'pm-2',
    type: 'upi',
    handle: 'acme@okaxis',
    isDefault: false,
  },
  {
    id: 'pm-3',
    type: 'netbanking',
    bank: 'HDFC Bank',
    accountHint: '•••• 8192',
    isDefault: false,
  },
]

function MethodIcon({ type }) {
  if (type === 'upi') return <Smartphone size={18} aria-hidden="true" />
  if (type === 'netbanking') return <Landmark size={18} aria-hidden="true" />
  return <CreditCard size={18} aria-hidden="true" />
}

function methodTitle(m) {
  if (m.type === 'card') return `${m.brand} ···· ${m.last4}`
  if (m.type === 'upi') return `UPI · ${m.handle}`
  return `${m.bank} · ${m.accountHint}`
}

function methodSub(m) {
  if (m.type === 'card') return `Expires ${m.expiry}`
  if (m.type === 'upi') return 'UPI autopay'
  return 'Net banking'
}

export default function Settings() {
  const [teamMembers, setTeamMembers] = useState(seedTeam)
  const [company, setCompany] = useState('Acme Inc.')
  const [residency, setResidency] = useState('India, AWS Mumbai (DPDP-aligned)')

  useEffect(() => {
    endpoints
      .settings()
      .then((row) => {
        if (row?.workspace?.companyName) setCompany(row.workspace.companyName)
        if (row?.workspace?.dataResidency) setResidency(row.workspace.dataResidency)
        if (row?.teamMembers?.length) setTeamMembers(row.teamMembers)
      })
      .catch(() => {})
  }, [])
  return (
    <div className="mt-6 space-y-4">
      {/* Workspace */}
      <section aria-label="Workspace" className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Building2 size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold">Workspace</h2>
            <p className="text-sm text-sub">Organization profile and data residency</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold text-sub">Company name</span>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1.5 w-full rounded-btn border border-line bg-canvas px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sub">Data residency</span>
            <div className="relative mt-1.5">
              <MapPin
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sub"
                aria-hidden="true"
              />
              <select
                value={residency}
                onChange={(e) => setResidency(e.target.value)}
                className="w-full cursor-pointer rounded-btn border border-line bg-canvas py-2.5 pr-3 pl-9 text-sm outline-none focus:border-brand"
              >
                <option>India, AWS Mumbai (DPDP-aligned)</option>
                <option>EU, Frankfurt</option>
                <option>US, Virginia</option>
                <option>Self-hosted (Enterprise)</option>
              </select>
            </div>
          </label>
        </div>
      </section>

      {/* Team */}
      <section aria-label="Team members" className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Users size={20} aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="text-base font-semibold">Team</h2>
            <p className="text-sm text-sub">Who can see and manage the agent inventory</p>
          </div>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-btn bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <UserPlus size={16} aria-hidden="true" />
            Invite member
          </button>
        </div>
        <ul className="mt-5 divide-y divide-line">
          {teamMembers.map((m) => (
            <li key={m.id} className="flex items-center gap-3 py-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-forest">
                {m.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{m.name}</p>
                <p className="truncate text-xs text-sub">{m.email}</p>
              </div>
              <span
                className={`hidden rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize sm:inline ${
                  m.status === 'active' ? 'bg-brand-soft text-forest' : 'bg-warn-soft text-warn'
                }`}
              >
                {m.status}
              </span>
              <select
                defaultValue={m.role}
                className="cursor-pointer rounded-btn border border-line bg-canvas px-2.5 py-1.5 text-xs outline-none focus:border-brand"
                aria-label={`Role for ${m.name}`}
              >
                <option>Owner</option>
                <option>Security Admin</option>
                <option>Viewer</option>
                <option>Auditor (read-only)</option>
              </select>
            </li>
          ))}
        </ul>
      </section>

      {/* Billing: subscribed state (Cursor-style) */}
      <section aria-label="Billing" className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <CreditCard size={20} aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="text-base font-semibold">Billing</h2>
            <p className="text-sm text-sub">Subscription and payment methods</p>
          </div>
        </div>

        {/* Current plan summary */}
        <div className="mt-5 rounded-2xl border border-line bg-canvas p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-ink">{subscription.plan}</p>
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-forest">
                  Active
                </span>
              </div>
              <p className="mt-1 text-sm text-sub">
                {subscription.seats} · Renews {subscription.renews}
              </p>
              <p className="mt-3 text-2xl font-bold tracking-tight text-ink">
                {subscription.price}
                <span className="text-sm font-medium text-sub">{subscription.period}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="cursor-pointer rounded-btn border border-line bg-card px-3.5 py-2 text-sm font-semibold text-ink hover:border-ink/25"
              >
                Change plan
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-btn bg-forest px-3.5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Manage billing
              </button>
            </div>
          </div>
          <dl className="mt-4 grid gap-3 border-t border-line pt-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold text-sub">Billing email</dt>
              <dd className="mt-0.5 font-medium text-ink">{subscription.billingEmail}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-sub">Next invoice</dt>
              <dd className="mt-0.5 font-medium text-ink">{subscription.nextInvoice}</dd>
            </div>
          </dl>
        </div>

        {/* Payment methods */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-ink">Payment methods</h3>
            <p className="text-xs text-sub">Cards, UPI, and net banking on file</p>
          </div>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-btn border border-line bg-card px-3 py-2 text-xs font-semibold text-ink hover:border-ink/25"
          >
            <Plus size={14} aria-hidden="true" />
            Add method
          </button>
        </div>

        <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
          {paymentMethods.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-ink">
                <MethodIcon type={m.type} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{methodTitle(m)}</p>
                <p className="text-xs text-sub">{methodSub(m)}</p>
              </div>
              {m.isDefault && (
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-forest">
                  Default
                </span>
              )}
              <button
                type="button"
                className="cursor-pointer text-xs font-semibold text-sub hover:text-ink"
              >
                Edit
              </button>
              {!m.isDefault && (
                <button
                  type="button"
                  className="cursor-pointer text-xs font-semibold text-sub hover:text-danger"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
