import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { plans } from '../../data/mock.js'
import useReveal from '../../hooks/useReveal.js'

const faqs = [
  {
    q: 'What does the free discovery scan include?',
    a: 'We connect read-only to up to 3 sources and give you the full "scary list": every agent found, its owner, and its risk score. No credit card, and you keep the report.',
  },
  {
    q: 'Do you need to install anything on our agents?',
    a: 'No. Orbita watches OAuth grants, audit logs, DNS egress and behavioral signals: the footprints agents already leave. Nothing to instrument, no SDK.',
  },
  {
    q: 'Where is our data stored?',
    a: 'India (AWS Mumbai) by default, aligned with DPDP data-residency expectations. EU and US regions are available, and Enterprise can self-host entirely.',
  },
  {
    q: 'How is pricing counted?',
    a: 'Per company, flat. We deliberately do not charge per discovered agent, so you should never be penalized for finding more shadow AI.',
  },
  {
    q: 'Can our auditor use it?',
    a: 'Yes. Growth and Enterprise include a read-only Auditor role and exportable evidence packs for DPDP, SOC 2, ISO 27001 and the EU AI Act.',
  },
]

export default function Pricing() {
  const [currency, setCurrency] = useState('inr')
  const [openFaq, setOpenFaq] = useState(0)
  const headRef = useReveal()

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
      <div ref={headRef} className="reveal text-center">
        <p className="ox-label">Pricing</p>
        <h1 className="font-display mt-3.5 text-[clamp(38px,4.3vw,58px)] tracking-[-0.038em]">
          Flat pricing. <span className="text-brand">No per-agent tax.</span>
        </h1>
        <p className="ox-lead mx-auto mt-[18px] text-center">
          Global platforms charge $50-200K a year for this. We built Orbita for the mid-market.
          Start free, see everything, then pick a plan.
        </p>

        <div
          className="mx-auto mt-8 flex w-fit border border-[rgba(31,30,28,0.18)] bg-card p-1 text-[13.5px] font-medium"
          role="group"
          aria-label="Currency"
        >
          {[
            { id: 'inr', label: '₹ INR' },
            { id: 'usd', label: '$ USD' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCurrency(c.id)}
              className={`cursor-pointer px-4 py-2 transition-colors ${
                currency === c.id ? 'bg-ink text-white' : 'text-ink-2 hover:text-ink'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.id}
            className={`flex flex-col rounded-card p-7 ${
              p.current
                ? 'relative bg-gradient-to-br from-forest to-forest-2 text-white shadow-lift md:-mt-3 md:mb-3'
                : 'border border-line bg-card shadow-soft'
            }`}
          >
            {p.current && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white">
                MOST POPULAR
              </span>
            )}
            <h2 className="text-base font-semibold">{p.name}</h2>
            <p className="mt-3 text-4xl font-bold tracking-tight">
              {currency === 'inr' ? p.priceInr : p.priceUsd}
              <span className={`text-sm font-medium ${p.current ? 'text-white/60' : 'text-sub'}`}>
                {p.period}
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <Check size={16} className={`mt-0.5 shrink-0 ${p.current ? 'text-brand' : 'text-forest'}`} aria-hidden="true" />
                  <span className={p.current ? 'text-white/80' : 'text-sub'}>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/signup"
              className={`ox-btn mt-7 w-full ${
                p.current ? 'ox-btn-brand' : 'ox-btn-ghost'
              }`}
            >
              {p.id === 'enterprise' ? 'Contact sales' : 'Start with free scan'}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>

      {/* FAQ */}
      <section className="mx-auto mt-20 max-w-2xl" aria-label="Frequently asked questions">
        <h2 className="font-display text-center text-[clamp(28px,3vw,40px)]">Questions, answered</h2>
        <div className="mt-8 space-y-0 border-t border-[rgba(31,30,28,0.11)]">
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-[rgba(31,30,28,0.11)]">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                aria-expanded={openFaq === i}
                className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[15px] font-medium text-ink transition-colors hover:text-brand"
              >
                {f.q}
                <span className={`text-sub transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`} aria-hidden="true">
                  +
                </span>
              </button>
              {openFaq === i && (
                <p className="pb-5 text-[15px] leading-relaxed text-ink-2">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
