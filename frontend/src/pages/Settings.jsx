import { useState } from 'react'
import { Building2, Users, CreditCard, MapPin, Check, UserPlus } from 'lucide-react'
import { plans, teamMembers } from '../data/mock.js'

export default function Settings() {
  const [currency, setCurrency] = useState('inr')

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
              defaultValue="Zintellix"
              className="mt-1.5 w-full rounded-btn border border-line bg-canvas px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-sub">Data residency</span>
            <div className="relative mt-1.5">
              <MapPin size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sub" aria-hidden="true" />
              <select className="w-full cursor-pointer rounded-btn border border-line bg-canvas py-2.5 pr-3 pl-9 text-sm outline-none focus:border-brand">
                <option>India — AWS Mumbai (DPDP-aligned)</option>
                <option>EU — Frankfurt</option>
                <option>US — Virginia</option>
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

      {/* Billing */}
      <section aria-label="Billing" className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <CreditCard size={20} aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="text-base font-semibold">Plan & billing</h2>
            <p className="text-sm text-sub">You're on Growth — renews Aug 7, 2026</p>
          </div>
          <div className="flex rounded-btn border border-line bg-canvas p-1 text-xs font-semibold" role="group" aria-label="Currency">
            {[
              { id: 'inr', label: '₹ INR' },
              { id: 'usd', label: '$ USD' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCurrency(c.id)}
                className={`cursor-pointer rounded-[10px] px-3 py-1.5 transition-colors ${
                  currency === c.id ? 'bg-forest text-white' : 'text-sub hover:text-ink'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.id}
              className={`flex flex-col rounded-card p-5 ${
                p.current
                  ? 'bg-gradient-to-br from-forest to-forest-2 text-white shadow-lift'
                  : 'border border-line bg-canvas'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{p.name}</h3>
                {p.current && (
                  <span className="rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-semibold text-brand">
                    Current
                  </span>
                )}
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight">
                {currency === 'inr' ? p.priceInr : p.priceUsd}
                <span className={`text-sm font-medium ${p.current ? 'text-white/60' : 'text-sub'}`}>
                  {p.period}
                </span>
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs leading-relaxed">
                    <Check
                      size={14}
                      className={`mt-0.5 shrink-0 ${p.current ? 'text-brand' : 'text-forest'}`}
                      aria-hidden="true"
                    />
                    <span className={p.current ? 'text-white/80' : 'text-sub'}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`mt-5 cursor-pointer rounded-btn px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 ${
                  p.current
                    ? 'bg-brand text-white'
                    : 'border border-line bg-card text-ink hover:border-brand'
                }`}
              >
                {p.current ? 'Manage plan' : p.id === 'enterprise' ? 'Contact sales' : 'Switch plan'}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
