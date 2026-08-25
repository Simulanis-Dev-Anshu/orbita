import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { plans } from '../../data/mock.js'
import useReveal from '../../hooks/useReveal.js'
import useSeo from '../../hooks/useSeo.js'
import SeoFaq from '../../components/marketing/SeoFaq.jsx'
import { faqSchema, pricingFaqs, SITE } from '../../data/seo.js'

export default function Pricing() {
  const [currency, setCurrency] = useState('inr')
  const headRef = useReveal()
  useSeo({
    title: 'Orbita pricing — flat, no per-agent tax',
    description:
      'Orbita pricing is per company, not per agent. Free discovery scan, Starter from ₹40,000 / $1,500 a month, Growth ₹80,000 / $3,000, Enterprise custom. India residency included.',
    path: '/pricing',
    jsonLd: [
      faqSchema(pricingFaqs, '/pricing'),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Orbita plans',
        url: `${SITE}/pricing`,
        itemListElement: plans.map((p, i) => ({
          '@type': 'Offer',
          position: i + 1,
          name: p.name,
          price: p.id === 'enterprise' ? undefined : p.priceUsd.replace(/[^0-9.]/g, ''),
          priceCurrency: 'USD',
          url: `${SITE}/signup`,
        })),
      },
    ],
  })

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
      <div ref={headRef} className="reveal text-center">
        <p className="ox-label">Pricing</p>
        <h1 className="font-display mt-3.5 text-[clamp(38px,4.3vw,58px)] tracking-[-0.038em]">
          Flat pricing. <span className="text-brand">No per-agent tax.</span>
        </h1>
        <p className="ox-lead mx-auto mt-[18px] text-center">
          Global platforms charge $50–200K a year for this. We built Orbita for the mid-market.
          Start free, see everything, then pick a plan.{' '}
          <a href="/pricing.md" className="font-medium text-ink underline decoration-[rgba(31,30,28,0.25)] underline-offset-2 hover:decoration-ink">
            Machine-readable pricing
          </a>
          .
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

      <section className="mx-auto mt-20 max-w-4xl">
        <SeoFaq items={pricingFaqs} title="Questions, answered" />
      </section>
    </main>
  )
}
