import { Link } from 'react-router-dom'
import { Eye, ShieldCheck, Handshake, MapPin, ArrowRight } from 'lucide-react'
import BrandMark from '../../components/BrandMark.jsx'
import Reveal from '../../components/motion/Reveal.jsx'
import useSeo from '../../hooks/useSeo.js'
import { organization } from '../../data/seo.js'

const values = [
  {
    icon: Eye,
    title: 'Visibility before control',
    text: "You can't govern what you can't see. Every Orbita feature starts with an honest, complete inventory. Controls come second.",
  },
  {
    icon: ShieldCheck,
    title: 'Security without friction',
    text: 'Read-only connectors, no SDKs, no agents to install. We watch the footprints AI agents already leave instead of slowing builders down.',
  },
  {
    icon: Handshake,
    title: 'Built for the mid-market',
    text: 'Enterprise-grade agent governance at a price Indian and global mid-market teams can actually justify, not a $200K platform.',
  },
]

const milestones = [
  ['2025', 'Founded in India after watching mid-market security teams discover orphaned AI agents the hard way, in incident reviews.'],
  ['Early 2026', 'First discovery engine ships: OAuth grants, audit logs and DNS egress stitched into a single agent inventory.'],
  ['Mid 2026', 'Identity graph, Sentinel Copilot and DPDP compliance packs launch. 40+ security teams run weekly scans on Orbita.'],
]

const stats = [
  ['147', 'agents found in our median first scan'],
  ['40+', 'security teams scanning weekly'],
  ['24 hrs', 'from first connector to full inventory'],
  ['100%', 'data residency in India for Indian customers'],
]

function Section({ children, className = '' }) {
  return (
    <section className={className}>
      <Reveal y={32}>{children}</Reveal>
    </section>
  )
}

export default function About() {
  useSeo({
    title: 'About Orbita, the AI agent discovery company',
    description:
      'Orbita discovers, inventories and risk-scores every AI agent in your company. Learn about our mission, values and the team building agent governance from India.',
    path: '/about',
    jsonLd: [
      organization,
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        url: 'https://www.orbita.io/about',
        name: 'About Orbita',
        mainEntity: organization,
      },
    ],
  })

  return (
    <main>
      {/* Hero */}
      <Section className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-8">
        <p className="ox-label">About Orbita</p>
          <h1 className="font-display mt-3.5 text-[clamp(40px,4.8vw,64px)] tracking-[-0.03em]">
          Every company just hired an{' '}
          <em className="font-accent text-brand">invisible workforce.</em>
          <br />
          We make it visible.
        </h1>
        <p className="ox-lead mx-auto mt-[18px] text-center">
          Orbita is the discovery and governance layer for AI agents. We find every agent,
          automation, custom GPT and MCP server running in your company, map who owns it and what
          it can touch, and keep that inventory alive so security teams can say yes to AI
          without losing sleep.
        </p>
      </Section>

      {/* Mission strip */}
      <Section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="ox-plate relative overflow-hidden rounded-card p-8 shadow-lift sm:p-12">
          <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-brand/20 blur-2xl" aria-hidden="true" />
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center">
              <BrandMark size={56} invert />
            </span>
            <div>
              <p className="ox-label text-brand">Our mission</p>
              <p className="mt-2 text-xl leading-relaxed font-medium sm:text-2xl">
                Give every security team a live, trustworthy answer to one question:{' '}
                <span className="text-brand">"What are the AI agents in my company doing right now?"</span>
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-12 sm:px-6 lg:grid-cols-4">
        {stats.map(([num, label]) => (
          <div key={label} className="rounded-card bg-card p-6 text-center shadow-soft">
            <p className="font-display text-3xl text-ink">{num}</p>
            <p className="mt-2 text-sm text-sub">{label}</p>
          </div>
        ))}
      </Section>

      {/* Values */}
      <Section className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <h2 className="font-display text-center text-3xl">What we believe</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {values.map((v) => (
            <article
              key={v.title}
              className="group h-full rounded-card bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-forest transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <v.icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sub">{v.text}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Story / milestones */}
      <Section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-3xl font-semibold tracking-tight">The story so far</h2>
        <ol className="mt-8 space-y-6 border-l-2 border-brand-soft pl-6">
          {milestones.map(([when, what]) => (
            <li key={when} className="relative">
              <span className="absolute top-1.5 -left-[31px] h-3 w-3 rounded-full border-2 border-brand bg-card" aria-hidden="true" />
              <p className="text-xs font-bold tracking-wider text-forest uppercase">{when}</p>
              <p className="mt-1 text-sm leading-relaxed text-sub">{what}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-sub">
          <MapPin size={15} className="text-forest" aria-hidden="true" />
          Headquartered in India · serving security teams worldwide
        </p>
      </Section>

      {/* CTA */}
      <Section className="mx-auto max-w-4xl px-4 pb-20 text-center sm:px-8">
        <div className="border border-line bg-card p-8 sm:p-12">
          <h2 className="font-display text-[clamp(28px,3vw,40px)]">
            See your invisible workforce in 24 hours
          </h2>
          <p className="ox-lead mx-auto mt-3.5 text-center">
            Connect one read-only source and get your first agent inventory tomorrow. No SDKs, no
            sales call required.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <Link to="/signup" className="ox-btn ox-btn-primary">
              Get your free scan
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/pricing" className="ox-btn ox-btn-ghost">
              View pricing
            </Link>
          </div>
        </div>
      </Section>
    </main>
  )
}
