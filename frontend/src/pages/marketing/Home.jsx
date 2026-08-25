import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import useReveal from '../../hooks/useReveal.js'
import { posts } from '../../data/blog.js'
import HeroAsciiBackground from '../../components/hero/HeroAsciiBackground.jsx'
import DiscoveryRoomStage from '../../components/marketing/DiscoveryRoomStage.jsx'
import useSeo from '../../hooks/useSeo.js'
import SeoFaq from '../../components/marketing/SeoFaq.jsx'
import { comparison, faqSchema, homeFaqs, softwareApp } from '../../data/seo.js'

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

const modules = [
  {
    name: 'Identity',
    text: 'Organization, OAuth grants, AI accounts and correlation. Every non-human identity tied to a person.',
    visual: 'graph',
    to: '/app/identity',
  },
  {
    name: 'Discovery',
    text: 'AI apps, browser extensions, local runtimes and MCP servers, found without an SDK.',
    visual: 'scan',
    to: '/app/discovery',
  },
  {
    name: 'Assets',
    text: 'Asset database, agent inventory, MCP tools and the data each one can reach.',
    visual: 'connectors',
    to: '/app/assets',
  },
  {
    name: 'Relationships',
    text: 'USER → DEVICE → APP → AGENT → MCP → TOOL → DATA. Blast radius as a graph.',
    visual: 'mcp',
    to: '/app/relationships',
  },
  {
    name: 'Risk',
    text: 'Scores, explanations, attack paths and blast radius — why an agent is dangerous.',
    visual: 'finger',
    to: '/app/risk',
  },
  {
    name: 'Intelligence',
    text: 'Security analyst, natural-language search and attack simulation on your graph.',
    visual: 'passport',
    to: '/app/intelligence',
  },
  {
    name: 'Remediation',
    text: 'Recommended fixes and one-click revoke. Admin approves, then execute.',
    visual: 'kill',
    to: '/app/remediation',
  },
  {
    name: 'Governance',
    text: 'Policies, AI-BOM and DPDP, SOC 2, ISO 27001 evidence packs.',
    visual: 'comp',
    to: '/app/governance',
  },
]

const pill = 'rounded-btn bg-card border border-line/40'

function ModuleVisual({ kind }) {
  if (kind === 'scan') {
    const blips = [
      { t: 'Zapier', x: '78%', y: '28%', d: '0.4s' },
      { t: 'MCP', x: '18%', y: '38%', d: '2.6s' },
      { t: 'GPT', x: '72%', y: '68%', d: '4.8s' },
    ]
    return (
      <div className="mt-auto w-full">
        <div className="relative mx-auto h-[108px] w-[108px]" aria-hidden="true">
          <svg viewBox="0 0 108 108" className="absolute inset-0 h-full w-full">
            <circle cx="54" cy="54" r="48" fill="none" stroke="rgba(23,7,2,0.08)" />
            <circle cx="54" cy="54" r="32" fill="none" stroke="rgba(23,7,2,0.08)" />
            <circle cx="54" cy="54" r="16" fill="none" stroke="rgba(23,7,2,0.08)" />
            <circle cx="54" cy="54" r="2.5" fill="#ff4d00" />
          </svg>
          <div className="hub-spin absolute inset-[4px] origin-center rounded-full">
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(255,77,0,0.08) 330deg, rgba(255,77,0,0.45) 358deg, transparent 360deg)',
              }}
            />
          </div>
          {blips.map((b) => (
            <span
              key={b.t}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: b.x, top: b.y }}
            >
              <span
                className="hub-ping pointer-events-none absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand"
                style={{ animationDelay: b.d }}
              />
              <span className="relative rounded-full bg-card px-1.5 py-0.5 font-mono text-[8px] font-semibold text-ink shadow-soft">
                {b.t}
              </span>
            </span>
          ))}
        </div>
        <p className="mt-3 text-center font-mono text-[11px] text-sub">
          3 found<span className="mod-caret ml-0.5 inline-block h-3 w-[1.5px] align-middle bg-brand" />
        </p>
      </div>
    )
  }

  if (kind === 'graph') {
    const nodes = [
      ['Anshu · IdP', 'owner'],
      ['Payroll bot', 'agent'],
      ['Gmail · PII', 'scope'],
    ]
    return (
      <div className="relative mt-auto w-full py-1 pl-4" aria-hidden="true">
        <span className="pointer-events-none absolute top-3 bottom-3 left-[7px] w-px bg-[repeating-linear-gradient(to_bottom,rgba(23,7,2,0.22)_0_3px,transparent_3px_7px)]" />
        <span className="hub-fall pointer-events-none absolute left-[3px] h-2 w-2 rounded-full bg-brand" />
        <div className="space-y-2">
          {nodes.map(([label, role], i) => (
            <div
              key={role}
              className={`hub-lock ${pill} flex items-center justify-between px-3 py-1.5`}
              style={{ animationDelay: `${i * 0.85}s` }}
            >
              <span className="text-[11px] font-semibold">
                {role === 'agent' && (
                  <span className="live-dot mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand align-middle" />
                )}
                {label}
              </span>
              <span className="font-mono text-[8px] tracking-wide text-sub uppercase">{role}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (kind === 'kill') {
    return (
      <div className="mt-auto w-full space-y-3" aria-hidden="true">
        <div className={`${pill} flex items-center justify-between px-3 py-2.5`}>
          <div className="text-left">
            <p className="text-[12px] font-semibold text-ink">Zapier Invoice</p>
            <p className="font-mono text-[9px] text-sub">oauth · slack+drive</p>
          </div>
          <span className="hub-switch relative h-[18px] w-[34px] rounded-full bg-line">
            <span className="hub-knob absolute top-[2px] left-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-soft" />
          </span>
        </div>
        <ol className="relative flex items-start justify-between px-1">
          <span className="absolute top-[5px] right-6 left-6 h-px bg-line" />
          <span className="hub-bar absolute top-[5px] right-6 left-6 h-px origin-left bg-brand" />
          {['Recommend', 'Approve', 'Execute'].map((s, i) => (
            <li
              key={s}
              className="hub-step relative z-[1] flex flex-col items-center gap-1.5"
              style={{ animationDelay: `${i * 1.2}s` }}
            >
              <span className="hub-dot h-2.5 w-2.5 rounded-full bg-line" style={{ animationDelay: `${i * 1.2}s` }} />
              <span className="font-mono text-[9px] tracking-wide uppercase">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  if (kind === 'comp') {
    const items = ['DPDP register', 'SOC 2 pack', 'ISO 27001']
    return (
      <div className="mt-auto w-full space-y-2" aria-hidden="true">
        <div className="mb-1 flex items-end justify-between px-0.5">
          <span className="font-mono text-[9px] tracking-wide text-sub uppercase">evidence pack</span>
          <span className="text-[13px] font-semibold tabular-nums text-ink">87%</span>
        </div>
        <div className="mb-2 h-1 overflow-hidden rounded-full bg-line">
          <span className="hub-fill block h-full w-[87%] origin-left rounded-full bg-brand" />
        </div>
        {items.map((label, i) => (
          <div key={label} className={`${pill} flex items-center gap-2.5 px-3 py-2`}>
            <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none">
              <rect x="1.5" y="1.5" width="13" height="13" rx="3" stroke="rgba(23,7,2,0.2)" />
              <path
                className="hub-check"
                style={{ animationDelay: `${i * 0.7}s` }}
                d="M4 8.2l2.4 2.4L12 5.2"
                stroke="#ff4d00"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="12"
                strokeDashoffset="12"
              />
            </svg>
            <span className="text-[12px] font-medium text-ink">{label}</span>
          </div>
        ))}
      </div>
    )
  }

  if (kind === 'finger') {
    const factors = [
      ['Permission', '82%'],
      ['Sensitivity', '61%'],
      ['Exposure', '90%'],
    ]
    return (
      <div className={`${pill} mt-auto w-full p-3.5`} aria-hidden="true">
        <div className="mb-3 flex items-end justify-between">
          <span className="font-mono text-[9px] tracking-wide text-sub uppercase">payroll bot</span>
          <span className="font-display text-[22px] leading-none tabular-nums text-ink">
            74<span className="text-[11px] font-sans font-medium text-sub">/100</span>
          </span>
        </div>
        <ul className="space-y-2">
          {factors.map(([label, w], i) => (
            <li key={label}>
              <div className="mb-1 flex justify-between font-mono text-[8px] tracking-wide text-sub uppercase">
                <span>{label}</span>
                <span>{w}</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-line">
                <span
                  className="hub-fill block h-full origin-left rounded-full bg-brand"
                  style={{ width: w, animationDelay: `${i * 0.18}s` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (kind === 'mcp') {
    const nodes = [
      [40, 'User'],
      [107, 'App'],
      [174, 'Agent'],
      [240, 'Data'],
    ]
    return (
      <div className="relative mt-auto h-[120px] w-full" aria-hidden="true">
        <svg viewBox="0 0 280 120" className="h-full w-full">
          <path
            d="M40 60 H240"
            stroke="rgba(23,7,2,0.16)"
            strokeWidth="1.25"
            strokeDasharray="3 4"
            className="hub-dash"
            fill="none"
          />
          {nodes.map(([x, label], i) => (
            <g key={label}>
              <circle
                cx={x}
                cy="60"
                r="11"
                fill="#fffaf8"
                stroke="rgba(23,7,2,0.18)"
                className="hub-node"
                style={{ animationDelay: `${i * 0.7}s` }}
              />
              <text x={x} y="88" textAnchor="middle" fontSize="9" fill="#7d756d" fontFamily="inherit">
                {label}
              </text>
            </g>
          ))}
          <circle cx="40" cy="60" r="3.5" fill="#ff4d00" className="hub-packet" />
        </svg>
      </div>
    )
  }

  if (kind === 'passport') {
    return (
      <div className={`${pill} mt-auto w-full p-3.5 text-left`} aria-hidden="true">
        <p className="font-mono text-[9px] tracking-wide text-sub uppercase">Analyst</p>
        <p className="hub-type mt-2 block overflow-hidden whitespace-nowrap font-mono text-[12px] text-ink">
          who owns payroll bot?
        </p>
        <p className="mt-2 border-t border-line/60 pt-2 text-[12px] leading-snug text-sub">
          Anshu · IdP · 3 grants · risk 74
        </p>
      </div>
    )
  }

  const rows = [
    ['Zapier Invoice', 'agent'],
    ['Postgres MCP', 'mcp'],
    ['Drive scope', 'data'],
  ]
  return (
    <div className={`${pill} relative mt-auto w-full overflow-hidden`} aria-hidden="true">
      {rows.map(([name, kindLabel]) => (
        <div
          key={name}
          className="relative flex items-center justify-between border-b border-line/50 px-3 py-2.5 last:border-0"
        >
          <span className="text-[12px] font-medium text-ink">{name}</span>
          <span className="font-mono text-[9px] tracking-wide text-sub uppercase">{kindLabel}</span>
        </div>
      ))}
      <span className="hub-scan-row pointer-events-none absolute top-0 left-0 h-1/3 w-full border-l-2 border-brand bg-brand/[0.07]" />
    </div>
  )
}

const MARQUEE_LOGOS = ['Orbita', 'BharatFin', 'MedSync', 'CloudKart', 'Kirana+', 'NovaPay', 'SkyDesk', 'FinLoop']

function LogoMarquee() {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const halfWidthRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      halfWidthRef.current = track.scrollWidth / 2
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(track)

    let raf = 0
    let last = performance.now()
    const SPEED = 40 // px per second

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const half = halfWidthRef.current
      if (half > 0) {
        offsetRef.current = (offsetRef.current + SPEED * dt) % half
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  const copies = [0, 1]

  return (
    <div className="logo-marquee mt-5 overflow-hidden" aria-hidden="true">
      <div ref={trackRef} className="logo-marquee__track flex w-max will-change-transform">
        {copies.map((copy) => (
          <div key={copy} className="logo-marquee__group flex shrink-0 items-center gap-16 pr-16">
            {MARQUEE_LOGOS.map((n) => (
              <span
                key={`${copy}-${n}`}
                className="shrink-0 text-lg font-semibold whitespace-nowrap text-sub/45"
              >
                {n}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const heroMouse = useRef({ x: 0, y: 0 })
  useSeo({
    title: 'Orbita — see every AI agent your company already runs',
    description:
      'Orbita is an AI agent discovery platform. It finds Zapier bots, custom GPTs and MCP servers, names an owner and scores the risk in 24 hours. No SDK. India data residency.',
    path: '/',
    jsonLd: [
      softwareApp,
      faqSchema(homeFaqs, '/'),
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to discover shadow AI agents with Orbita',
        totalTime: 'P1D',
        step: [
          { '@type': 'HowToStep', name: 'Connect', text: 'OAuth into Workspace, Slack, GitHub or Zoho. Read-only. About 15 minutes.' },
          { '@type': 'HowToStep', name: 'Discover', text: 'Grants, logs, DNS and fingerprints surface every agent and MCP server.' },
          { '@type': 'HowToStep', name: 'Govern', text: 'Assign an owner, score risk, and revoke with a kill switch. Drift alerts in real time.' },
        ],
      },
    ],
  })

  const onHeroPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    heroMouse.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
    heroMouse.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  const onHeroPointerLeave = () => {
    heroMouse.current.x = 0
    heroMouse.current.y = 0
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const cardWidth = 340 + 20 // width + gap
      const scrollTo = direction === 'left' ? scrollLeft - cardWidth * 2 : scrollLeft + cardWidth * 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const cardWidth = 340 + 20
      const index = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(Math.max(index, 0), modules.length - 1))
    }
  }

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true })
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <main>
      <section
        className="on-dark relative overflow-hidden bg-[#170702] px-4 pt-[66px] pb-[70px] text-[#fffaf8] sm:px-8"
        onPointerMove={onHeroPointerMove}
        onPointerLeave={onHeroPointerLeave}
      >
        <HeroAsciiBackground mouse={heroMouse} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#170702] via-[#170702]/55 to-transparent"
        />
        <div className="ox-hero-in relative z-10 mx-auto max-w-[1200px]">
          <p className="ox-label !text-white/55">Shadow agent discovery</p>
          <h1 className="mt-3.5 max-w-[17ch] text-[clamp(38px,4.3vw,58px)] font-normal leading-[1.03] tracking-[-0.038em] text-balance text-white">
            See every AI agent your company already runs.
          </h1>
          <p className="mt-[18px] max-w-[48ch] text-[15px] leading-[1.65] text-white/[0.84]">
            Zapier bots, custom GPTs, rogue MCP servers. Orbita finds the invisible workforce in 24
            hours, names an owner, and scores every risk.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link to="/signup" className="ox-btn ox-btn-primary">
              Get started
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link to="/app" className="ox-btn ox-btn-ghost">
              Get a demo
            </Link>
          </div>
        </div>
      </section>

      {/* Ledger */}
      <section className="border-b border-[rgba(31,30,28,0.11)] bg-canvas" aria-label="Orbita in numbers">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 sm:grid-cols-3 sm:px-8 sm:py-12">
          {[
            ['31+', 'agents found on first scan'],
            ['under 24 hours', 'to a live inventory'],
            ['0', 'SDKs to install'],
          ].map(([stat, label]) => (
            <div key={label}>
              <p className="font-display text-[clamp(28px,3vw,40px)] text-ink">{stat}</p>
              <p className="ox-label mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-[rgba(31,30,28,0.11)]" aria-label="What Orbita is">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8 sm:py-20">
          <p className="ox-label">Definition</p>
          <h2 className="font-display mt-3.5 text-[clamp(28px,3vw,40px)] text-ink">What is Orbita?</h2>
          <p className="mt-5 max-w-[62ch] text-[15px] leading-[1.65] text-ink-2">
            Orbita is an AI agent discovery and governance platform that finds, inventories and
            risk-scores every AI agent, automation, custom GPT and MCP server running in a company.
            Security teams use it to assign a human owner, revoke orphaned agents, and export DPDP,
            SOC 2 and ISO 27001 evidence — without installing an SDK.
          </p>
        </div>
      </section>

      {/* Thesis */}
      <section className="border-b border-[rgba(31,30,28,0.11)]">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-16">
          <div>
            <p className="ox-label">The shift</p>
            <h2 className="font-display mt-3.5 text-[clamp(28px,3vw,40px)] text-ink">
              Frontier agents. Without becoming a tenant.
            </h2>
          </div>
          <div className="space-y-4 text-[15px] leading-[1.65] text-ink-2">
            <p>
              Every technology shift fragments, then consolidates. AI is consolidating now, and the
              agents nobody registered are already doing work on your stack.
            </p>
            <p>
              When you cannot see the map, you are a tenant in your own estate. Keeping inventory,
              ownership, and revocation yours is what keeps that from happening.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6 sm:px-6">
        <DiscoveryRoomStage />
      </section>

      {/* Logo strip */}
      <section className="border-y border-line py-10" aria-label="Trusted by">
        <p className="ox-label text-center text-sub">
          Trusted by security teams across industries
        </p>
        <LogoMarquee />
      </section>

      {/* Stack modules: Timbal-scale 8-up */}
      <section id="platform" className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-label="Platform">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl text-left">
              <p className="ox-label text-sub">Three products</p>
              <h2 className="font-display mt-3 text-3xl leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
                See it. Own it. Shut it down.
              </h2>
              <p className="mt-4 text-base text-sub sm:text-lg">
                Discovery, ownership, risk, and revocation, built for shadow AI.
              </p>
            </div>
            {/* Carousel navigation controls */}
            <div className="flex gap-2.5">
              <button
                onClick={() => scroll('left')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-ink shadow-soft hover:bg-muted transition-colors"
                aria-label="Previous slide"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-ink shadow-soft hover:bg-muted transition-colors"
                aria-label="Next slide"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Horizontal Carousel Container */}
        <div
          ref={scrollRef}
          className="mt-14 flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-8 px-1"
        >
          {modules.map((m) => (
            <Link key={m.name} to={m.to} className="w-[280px] sm:w-[340px] shrink-0 snap-start">
              <article className="mod-card flex h-[380px] flex-col rounded-[22px] bg-muted p-7 sm:p-8">
                <h3 className="font-display text-[1.35rem] tracking-tight text-ink sm:text-2xl">{m.name}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-sub line-clamp-3">{m.text}</p>
                <div className="mt-10 flex flex-1 flex-col justify-end">
                  <ModuleVisual kind={m.visual} />
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Carousel Indicators / Dots */}
        <div className="mt-2 flex justify-center gap-2">
          {modules.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollRef.current) {
                  const cardWidth = 340 + 20
                  scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' })
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-6 bg-forest' : 'w-1.5 bg-line'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-[rgba(31,30,28,0.11)] bg-canvas py-20" aria-label="Orbita compared">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <Reveal>
            <p className="ox-label">Compared</p>
            <h2 className="font-display mt-3.5 text-[clamp(28px,3vw,40px)] text-ink">
              Orbita vs CASB vs CSPM
            </h2>
            <p className="ox-lead mt-3 max-w-[54ch]">
              CASBs inspect SaaS traffic. CSPMs audit cloud misconfiguration. Neither inventories
              non-human identities. Orbita is built for that gap and sits alongside those tools.
            </p>
          </Reveal>
          <div className="mt-8 overflow-x-auto border border-[rgba(31,30,28,0.11)] bg-card">
            <table className="w-full min-w-[720px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-[rgba(31,30,28,0.11)]">
                  {['', 'Orbita', 'CASB', 'CSPM', 'Spreadsheet'].map((h) => (
                    <th key={h || 'criteria'} scope="col" className="ox-label px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row[0]} className="border-b border-[rgba(31,30,28,0.11)] last:border-0">
                    {row.map((cell, i) => (
                      <td
                        key={`${row[0]}-${i}`}
                        className={`px-4 py-3 leading-relaxed ${i === 0 || i === 1 ? 'text-ink' : 'text-ink-2'} ${i === 0 ? 'font-medium' : ''}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">
            Bottom line: buy a CASB for SaaS data leakage, a CSPM for cloud posture, and Orbita
            when you need a live map of AI agents, custom GPTs and MCP servers.
          </p>
        </div>
      </section>

      <section
        className="border-t border-[rgba(31,30,28,0.11)] py-20 sm:py-24"
        aria-label="Frequently asked questions"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <SeoFaq items={homeFaqs} title="Questions buyers actually ask" />
        </div>
      </section>

      {/* Blog */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-label="From the blog">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="ox-label text-sub">Resources</p>
              <h2 className="font-display mt-3 text-3xl leading-tight text-ink sm:text-4xl">From the ledger</h2>
              <p className="mt-2 text-sm text-sub">Field notes from the discovery team.</p>
            </div>
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
              All articles
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <Reveal key={p.slug}>
              <Link
                to={`/blog/${p.slug}`}
                className="group flex h-full flex-col rounded-[22px] border border-line bg-card p-6 transition-colors hover:border-ink/20"
              >
                <p className="text-xs font-medium text-sub">
                  {p.tag} · {p.readTime}
                </p>
                <h3 className="mt-3 flex-1 text-base font-bold tracking-tight group-hover:underline">
                  {p.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <Reveal>
        <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-8">
          <div className="ox-plate relative overflow-hidden px-8 py-16 text-center sm:px-12 sm:py-20">
            <h2 className="font-display relative text-[clamp(28px,3vw,40px)] leading-[1.05] tracking-[-0.03em]">
              Take command of the agents your company already runs.
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-[15px] text-white/[0.84]">
              Free discovery scan · read-only access · data stays in India
            </p>
            <div className="relative mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <Link to="/signup" className="ox-btn ox-btn-primary">
                Get started
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link to="/app" className="ox-btn ox-btn-ghost">
                Get a demo
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  )
}
