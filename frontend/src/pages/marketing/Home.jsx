import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  Cloud,
  ShieldCheck,
  ServerCog,
  Radar,
  FileText,
  Link2,
  ScanSearch,
  Ban,
  ChevronDown,
} from 'lucide-react'
import gsap from 'gsap'
import Reveal from '../../components/motion/Reveal.jsx'
import useSeo from '../../hooks/useSeo.js'
import { posts } from '../../data/blog.js'
import HeroAsciiBackground from '../../components/hero/HeroAsciiBackground.jsx'
import DiscoveryRoomStage from '../../components/marketing/DiscoveryRoomStage.jsx'
import SeoFaq from '../../components/marketing/SeoFaq.jsx'
import { comparison, faqSchema, homeFaqs, softwareApp } from '../../data/seo.js'

const TB = {
  ink: 'var(--color-ink)',
  sub: 'var(--color-ink-2)',
  tertiary: 'var(--color-sub)',
  border: 'var(--color-line)',
  dark: 'var(--color-forest)',
  accent: 'var(--color-brand)',
  accentSoft: '#ffb199',
  forest: 'var(--color-forest)',
}

function TbCodeCard({ filename, lines, className = '', style }) {
  return (
    <div
      className={className}
      style={{
        background: '#f5f5f5',
        borderRadius: 12,
        border: '1px solid #e5e5e5',
        boxShadow: 'rgba(0,0,0,0.07) 0px 4px 14px',
        padding: '10px 0 12px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 12,
        lineHeight: 1.55,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px 8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 10, letterSpacing: 0.2, color: '#999', fontWeight: 500 }}>
          {filename}
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex', padding: '0 12px', minHeight: 18 }}>
            <span style={{ width: 20, textAlign: 'right', marginRight: 10, color: '#bbb', fontSize: 10, userSelect: 'none', flexShrink: 0 }}>
              {i + 1}
            </span>
            <span style={{ whiteSpace: 'pre', overflow: 'hidden' }}>
              {line.map((seg, j) => (
                <span key={j} style={{ color: seg.c }}>{seg.t}</span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const TB_CODE_FRONT = [
  [{ t: '{', c: '#000' }],
  [{ t: '  "trace_id"', c: '#0451a5' }, { t: ': ', c: '#000' }, { t: '"tr-88a2-99f1"', c: '#a31515' }, { t: ',', c: '#000' }],
  [{ t: '  "agent"', c: '#0451a5' }, { t: ': ', c: '#000' }, { t: '"Zapier Invoice Bot"', c: '#a31515' }, { t: ',', c: '#000' }],
  [{ t: '  "actions"', c: '#0451a5' }, { t: ': [', c: '#000' }, { t: '"read_invoices"', c: '#a31515' }, { t: '],', c: '#000' }],
  [{ t: '  "drift_detected"', c: '#0451a5' }, { t: ': ', c: '#000' }, { t: 'false', c: '#0000ff' }, { t: ',', c: '#000' }],
  [{ t: '  "verification"', c: '#0451a5' }, { t: ': ', c: '#000' }, { t: '"SHA-256 (Signed)"', c: '#a31515' }],
  [{ t: '}', c: '#000' }],
]

const TB_CODE_BACK = [
  [{ t: 'from', c: '#af00db' }, { t: ' orbita ', c: '#000' }, { t: 'import', c: '#af00db' }, { t: ' Auditor', c: '#267f99' }],
  [{ t: '', c: '#000' }],
  [{ t: 'audit', c: '#001080' }, { t: ' = ', c: '#000' }, { t: 'Auditor', c: '#267f99' }, { t: '(', c: '#000' }],
  [{ t: '    scope', c: '#001080' }, { t: '=', c: '#000' }, { t: '"all-agents"', c: '#a31515' }, { t: ',', c: '#000' }],
  [{ t: '    export', c: '#001080' }, { t: '=[', c: '#000' }, { t: '"json"', c: '#a31515' }, { t: ', ', c: '#000' }, { t: '"pdf"', c: '#a31515' }, { t: '],', c: '#000' }],
  [{ t: ')', c: '#000' }],
]

function TbCodeStack() {
  return (
    <div className="mt-8 w-full flex-1 sm:mt-10" aria-hidden="true">
      <div className="group/stack relative mx-auto h-[220px] w-full max-w-[420px]">
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out group-hover/stack:rotate-[11deg] group-hover/stack:scale-[0.8]"
          style={{ transformOrigin: '90% 90%', transform: 'scale(0.82) rotateZ(8deg)' }}
        >
          <TbCodeCard filename="verify_agents.py" lines={TB_CODE_BACK} />
        </div>
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover/stack:-translate-y-1.5">
          <TbCodeCard filename="audit_ledger.json" lines={TB_CODE_FRONT} />
        </div>
      </div>
    </div>
  )
}

function TbAceStats() {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setOn(true),
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const stats = [
    { value: '+99.9%', label: 'Threat blocking', sub: 'vs. baseline', h: 95 },
    { value: '<2ms', label: 'Proxy latency', sub: 'vs. baseline', h: 10 },
  ]
  return (
    <div
      ref={ref}
      role="group"
      aria-label="Bar chart comparing ACE metrics: threat blocking and proxy latency."
      className="mt-auto -mb-6 flex flex-1 flex-row items-stretch justify-around gap-6 pt-8 sm:-mb-7"
    >
      {stats.map((s) => (
        <div key={s.label} className="flex flex-1 flex-col items-center">
          <div className="text-center">
            <p className="text-[26px] leading-none font-medium tracking-tight text-ink tabular-nums sm:text-[30px]">{s.value}</p>
            <p className="mt-2 text-[12px] leading-snug font-medium text-ink-2">{s.label}</p>
            <p className="mt-1 text-[11px] leading-none text-sub">{s.sub}</p>
          </div>
          <div aria-hidden="true" className="mt-5 flex w-full max-w-[88px] flex-1 flex-col justify-end overflow-hidden rounded-t-lg bg-muted">
            <div
              className="w-full rounded-t-lg transition-[height] duration-1000 ease-[cubic-bezier(0.33,1,0.68,1)]"
              style={{ height: on ? `${s.h}%` : '0%', background: `linear-gradient(180deg, ${TB.accentSoft} 0%, ${TB.accent} 100%)` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const TB_SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function TbScrambleText({ words, interval = 2600 }) {
  const [display, setDisplay] = useState(() =>
    words[0].split('').map((ch) => ({ ch, settled: true }))
  )
  const idxRef = useRef(0)
  useEffect(() => {
    let frame = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cycle = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % words.length
      const target = words[idxRef.current]
      if (reduced) {
        setDisplay(target.split('').map((ch) => ({ ch, settled: true })))
        return
      }
      const start = performance.now()
      const dur = 700
      const step = (now) => {
        const t = Math.min((now - start) / dur, 1)
        const settledCount = Math.floor(t * target.length)
        setDisplay(
          target.split('').map((ch, i) =>
            i < settledCount || ch === ' ' || t === 1
              ? { ch, settled: true }
              : { ch: TB_SCRAMBLE_CHARS[(Math.random() * TB_SCRAMBLE_CHARS.length) | 0], settled: false }
          )
        )
        if (t < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }, interval)
    return () => {
      clearInterval(cycle)
      cancelAnimationFrame(frame)
    }
  }, [words, interval])
  return (
    <span className="inline-block text-[40px] leading-[1.05] font-medium tracking-tight whitespace-pre sm:text-[52px]">
      {display.map((c, i) => (
        <span
          key={i}
          style={c.settled ? { color: TB.ink } : { color: TB.tertiary, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
        >
          {c.ch}
        </span>
      ))}
    </span>
  )
}

const TB_LAYERS = [
  { name: 'Interface', items: ['Audit Ledger', 'Dashboard APIs'] },
  { name: 'Intelligence', items: ['ACE Guardrails', 'Identity Graph'] },
  { name: 'Data', items: ['Hybrid DB', 'DNS Sentinels'] },
]

function TbIsoStack() {
  const [hot, setHot] = useState(-1)
  return (
    <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row sm:gap-14">
      <div aria-hidden="true" className="relative h-[210px] w-[210px] shrink-0" style={{ perspective: '1200px' }}>
        <div
          className="absolute bottom-3 left-1/2 h-9 w-3/4 -translate-x-1/2"
          style={{ background: 'radial-gradient(rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(3px)' }}
        />
        {TB_LAYERS.map((l, i) => (
          <div
            key={l.name}
            className="absolute top-1/2 left-1/2 h-[140px] w-[140px] rounded-[4px] border transition-all duration-300"
            style={{
              transform: `translate(-50%, -50%) translateY(${(i - 1) * 36}px) rotateX(58deg) rotateZ(-45deg)`,
              background:
                hot === i
                  ? `linear-gradient(135deg, ${TB.accentSoft} 0%, ${TB.accent} 100%)`
                  : 'linear-gradient(135deg, #ffffff 0%, #f8f9fb 55%, #eef0f4 100%)',
              borderColor: hot === i ? TB.accent : 'rgba(0,0,0,0.08)',
              boxShadow: 'rgba(0,0,0,0.14) 0 16px 26px -14px, inset 0 1px 0 rgba(255,255,255,0.35)',
              zIndex: 3 - i,
            }}
          />
        ))}
      </div>
      <div className="flex w-full max-w-[240px] flex-col divide-y divide-[#efefef]">
        {TB_LAYERS.map((l, i) => (
          <div
            key={l.name}
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(-1)}
            className="cursor-default py-3 first:pt-0 last:pb-0"
          >
            <p className="text-[13px] font-medium transition-colors duration-200" style={{ color: hot === i ? TB.forest : TB.ink }}>
              {l.name}
            </p>
            <p className="mt-0.5 text-[12px]" style={{ color: TB.sub }}>{l.items.join(' · ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const TB_DEPLOY = [
  { label: 'Multi-tenant SaaS', icon: Cloud },
  { label: 'Dedicated VPC', icon: ShieldCheck },
  { label: 'On-premise', icon: ServerCog },
  { label: 'AWS', text: 'AWS' },
  { label: 'Azure', text: 'Az' },
  { label: 'GCP', text: 'GCP' },
]

function TbDeployGrid() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((a) => (a + 1) % TB_DEPLOY.length), 1600)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="mt-6 flex min-h-0 flex-1 items-center justify-center max-sm:mt-8">
      <div aria-hidden="true" className="grid w-full max-w-[420px] grid-cols-3 gap-3">
        {TB_DEPLOY.map((d, i) => {
          const on = i === active
          return (
            <div key={d.label} className="relative">
              <span
                className="pointer-events-none absolute -inset-2 rounded-2xl transition-all duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(255,77,0,0.35) 0%, rgba(255,77,0,0) 70%)',
                  filter: 'blur(2px)',
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'scale(0.9)',
                }}
              />
              <div
                className="relative flex flex-col items-center justify-center gap-2 rounded-xl border bg-white px-2.5 py-4 transition-all duration-300"
                style={{
                  borderColor: on ? TB.accent : TB.border,
                  boxShadow: on
                    ? `0 18px 34px -14px rgba(255,77,0,0.5), 0 4px 10px -2px rgba(15,23,42,0.10), inset 0 0 0 1px ${TB.accent}`
                    : '0 1px 2px rgba(15,23,42,0.04)',
                  transform: on ? 'translateY(-4px) scale(1.04)' : 'none',
                }}
              >
                <div className="flex h-7 w-7 items-center justify-center" style={{ color: TB.ink }}>
                  {d.icon ? <d.icon size={20} strokeWidth={1.75} aria-hidden="true" /> : (
                    <span className="text-[12px] font-bold tracking-tight">{d.text}</span>
                  )}
                </div>
                <span className="text-center text-[11px] leading-tight font-medium" style={{ color: on ? TB.ink : TB.sub }}>
                  {d.label}
                </span>
                <span
                  className="pointer-events-none absolute top-2 right-2 h-1.5 w-1.5 rounded-full transition-opacity duration-300"
                  style={{ backgroundColor: TB.accent, opacity: on ? 1 : 0 }}
                >
                  <span className="absolute inset-0 animate-ping rounded-full" style={{ backgroundColor: TB.accent }} />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const TB_LOGOS_A = ['Slack', 'GitHub', 'Zapier', 'Make', 'n8n', 'Notion', 'Jira', 'Linear', 'Salesforce', 'HubSpot', 'Okta', 'Auth0']
const TB_LOGOS_B = ['AWS', 'GCP', 'Azure', 'Snowflake', 'Postgres', 'MongoDB', 'Stripe', 'OpenAI', 'Anthropic', 'Datadog', 'Segment', 'Gmail']

function TbLogoRow({ names, reverse, duration = 44 }) {
  const doubled = [...names, ...names]
  return (
    <div className="overflow-hidden">
      <ul
        role="list"
        className="tb-marquee flex w-max gap-2.5"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {doubled.map((n, i) => (
          <li
            key={`${n}-${i}`}
            title={n}
            className="flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border border-[#efefef] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <span className="text-[13px] leading-none font-bold" style={{ color: TB.ink }}>{n.slice(0, 2)}</span>
            <span className="max-w-[52px] truncate px-1 text-[7px] leading-none font-medium" style={{ color: TB.tertiary }}>{n}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TbLogoMarquee() {
  return (
    <div className="mt-5 -mr-6 -mb-6 flex min-h-0 flex-1 flex-col justify-end overflow-hidden sm:-mr-7 sm:-mb-7">
      <div
        aria-hidden="true"
        className="flex flex-col gap-2.5 pb-6 sm:pb-7"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <TbLogoRow names={TB_LOGOS_A} />
        <TbLogoRow names={TB_LOGOS_B} reverse />
      </div>
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
    text: 'Connect Slack, Google, GitHub, and Zapier. Orbita lists every bot and AI app it finds, with no install on the agents themselves.',
    visual: 'scan',
    to: '/app/discovery',
  },
  {
    name: 'Identity graph',
    text: 'See who owns each agent, which keys it holds, and what data it can reach. One click shows the blast radius.',
    visual: 'graph',
  },
  {
    name: 'Kill switch',
    text: 'If someone leaves and their bot stays, revoke every grant in one action. The agent stops on the next sync.',
    visual: 'kill',
  },
  {
    name: 'Compliance',
    text: 'Export DPDP, SOC 2, and ISO 27001 evidence when an auditor asks, not after a week of screenshots.',
    visual: 'comp',
  },
  {
    name: 'Fingerprinting',
    text: 'A 24-hour heatmap shows whether an account acts like a person or a machine. Auditors get it in seconds.',
    visual: 'finger',
    to: '/app/risk',
  },
  {
    name: 'Shadow MCP',
    text: 'Find Model Context Protocol servers on laptops and in the cloud, who launched them, and which databases they can query.',
    visual: 'mcp',
  },
  {
    name: 'Agent Passport',
    text: 'A portable trust score per agent you can share with auditors and vendors without opening the whole inventory.',
    visual: 'passport',
  },
  {
    name: 'Connectors',
    text: 'Read-only OAuth into Workspace, Slack, GitHub, Zoho, and your automation stack. Nothing writes back.',
    visual: 'connectors',
  },
]

const pill = 'rounded-btn bg-card shadow-[0_10px_28px_rgba(23,7,2,0.09)]'

function ModuleCard({ name, text, visual }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const target = { x: 0.5, y: 0.5, on: 0 }
    const cur = { x: 0.5, y: 0.5, on: 0 }
    let raf = 0
    let running = false

    const apply = () => {
      const k = 0.16
      cur.x += (target.x - cur.x) * k
      cur.y += (target.y - cur.y) * k
      cur.on += (target.on - cur.on) * k
      el.style.setProperty('--mx', `${(cur.x * 100).toFixed(2)}%`)
      el.style.setProperty('--my', `${(cur.y * 100).toFixed(2)}%`)
      el.style.setProperty('--on', cur.on.toFixed(3))
      const rx = (0.5 - cur.y) * 4.5 * cur.on
      const ry = (cur.x - 0.5) * 6.5 * cur.on
      el.style.transform = `perspective(920px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`
      const settled =
        Math.abs(cur.on - target.on) < 0.008 &&
        Math.abs(cur.x - target.x) < 0.004 &&
        Math.abs(cur.y - target.y) < 0.004
      if (!settled || target.on > 0) raf = requestAnimationFrame(apply)
      else running = false
    }

    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(apply)
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      target.x = (e.clientX - r.left) / r.width
      target.y = (e.clientY - r.top) / r.height
      target.on = 1
      start()
    }
    const onLeave = () => {
      target.x = 0.5
      target.y = 0.5
      target.on = 0
      start()
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <article
      ref={ref}
      className="mod-card group flex h-[380px] flex-col rounded-[22px] bg-muted p-7 sm:p-8 select-none"
    >
      <h3 className="relative z-[1] font-display text-[1.35rem] tracking-tight text-ink sm:text-2xl">{name}</h3>
      <p className="relative z-[1] mt-3 text-[14px] leading-relaxed text-sub line-clamp-3">{text}</p>
      <div className="relative z-[1] mt-10 flex flex-1 flex-col justify-end">
        <ModuleVisual kind={visual} />
      </div>
    </article>
  )
}

function ModuleVisual({ kind }) {
  if (kind === 'scan') {
    const blips = [
      { t: 'Zapier', x: '78%', y: '28%', d: '0.4s' },
      { t: 'MCP', x: '18%', y: '38%', d: '2.6s' },
      { t: 'GPT', x: '72%', y: '68%', d: '4.8s' },
    ]
    return (
      <div className="mt-auto w-full space-y-3.5 text-center">
        <div className="flex justify-center gap-1.5">
          {['Zapier', 'Slack', 'MCP', 'GitHub'].map((s, i) => (
            <span
              key={s}
              className="mod-wave rounded-full border border-line bg-card/90 px-2 py-0.5 text-[9px] font-semibold text-sub shadow-soft"
              style={{ animationDelay: `${i * 180}ms` }}
            >
              {s}
            </span>
          ))}
        </div>
        <div className={`relative overflow-hidden ${pill} flex items-center gap-2.5 border border-line/40 px-4 py-3`}>
          <span className="mod-scan-x pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-transparent via-brand/25 to-transparent opacity-0 group-hover:opacity-100" />
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest">
            <Radar size={13} className="text-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[40deg]" />
          </span>
          <span className="relative text-[13px] font-semibold text-sub/70 transition-colors duration-500 group-hover:text-ink">
            Scan agents
          </span>
          <span className="mod-caret relative ml-0.5 inline-block h-4 w-[2px] bg-forest" />
        </div>
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
      <div className="relative mt-auto flex w-full flex-col items-center gap-2.5 py-1 text-center">
        <span className={`${pill} border border-line/40 px-4 py-2 text-[12px] font-semibold`}>Owner · IdP</span>
        <svg className="h-5 w-8 text-sub/35" viewBox="0 0 32 20" fill="none">
          <path d="M16 0 V20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
          <path className="mod-flow text-brand opacity-0 group-hover:opacity-100" d="M16 0 V20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" />
        </svg>
        <span className={`${pill} relative border border-line/40 px-4 py-2 text-[12px] font-semibold`}>
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-brand align-middle" />
          Agent
        </span>
        <svg className="h-5 w-8 text-sub/35" viewBox="0 0 32 20" fill="none">
          <path d="M16 0 V20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
          <path className="mod-flow text-brand opacity-0 group-hover:opacity-100" d="M16 0 V20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" />
        </svg>
        <span className={`${pill} border border-line/40 px-4 py-2 text-[12px] font-semibold`}>Scope · PII</span>
      </div>
    )
  }

  if (kind === 'kill') {
    return (
      <div className="mt-auto w-full space-y-3 text-center">
        <div className="flex h-[56px] items-center justify-between rounded-btn border border-line bg-card/60 p-2.5 transition-colors duration-500 group-hover:border-danger/25">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-[10px] font-bold text-brand transition-colors duration-500 group-hover:bg-danger/15 group-hover:text-danger">
              ZB
            </span>
            <div className="text-left">
              <p className="text-[11px] font-bold text-ink transition-colors duration-500 group-hover:text-danger">Zapier Invoice</p>
              <p className="text-[9px] text-sub/70">Last active 2m ago</p>
            </div>
          </div>
          <span className="relative h-[18px] w-[34px] overflow-hidden rounded-full bg-forest/15 text-center text-[9px] font-semibold leading-[18px] text-forest">
            <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">Active</span>
            <span className="absolute inset-0 translate-y-full text-danger transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">Orphan</span>
          </span>
        </div>
        <div className={`flex items-center justify-between ${pill} border border-line/40 px-3.5 py-2.5`}>
          <span className="text-[12px] font-semibold text-sub transition-colors duration-500 group-hover:text-danger">
            Orphan · revoke
          </span>
          <span className="relative h-6 w-11 rounded-full bg-line/80 transition-colors duration-500 group-hover:bg-danger">
            <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-5" />
          </span>
        </div>
      </div>
    )
  }

  if (kind === 'comp') {
    const items = ['DPDP register', 'SOC 2 pack', 'ISO 27001']
    return (
      <div className="mt-auto w-full space-y-3.5 text-center">
        <div className={`${pill} mx-auto flex w-fit items-center gap-1.5 border border-line/40 px-3.5 py-2 text-[11px] font-semibold`}>
          <FileText size={12} className="text-sub transition-colors duration-500 group-hover:text-forest" />
          evidence-pack.pdf
        </div>
        <div className={`relative overflow-hidden ${pill} flex items-center gap-2.5 border border-line/40 px-4 py-3`}>
          <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft">
            <ShieldCheck size={13} className="text-forest" />
          </span>
          <span className="text-[13px] font-semibold text-sub/70 transition-colors duration-500 group-hover:text-ink">Ask evidence</span>
          <span className="mod-caret ml-0.5 inline-block h-4 w-[2px] bg-forest" />
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
    const rowMachine = [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0]
    const rowHuman = [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0]

    return (
      <div className={`${pill} w-full border border-line/40 p-3.5 text-center`}>
        <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-sub uppercase">
          <span className="text-brand">Machine</span>
          <span className="text-sub/50">vs</span>
          <span className="text-forest">Human</span>
        </div>
        <div className="my-2.5 grid grid-cols-12 gap-1">
          {rowMachine.map((val, i) => (
            <span
              key={`m1-${i}`}
              className={`aspect-square w-full rounded-sm ${val ? 'mod-heat-on bg-brand' : 'bg-line/25'}`}
              style={{ animationDelay: `${i * 90}ms` }}
            />
          ))}
          {rowHuman.map((val, i) => (
            <span
              key={`h1-${i}`}
              className={`aspect-square w-full rounded-sm ${val ? 'bg-forest/80' : 'bg-line/25'}`}
            />
          ))}
          {rowMachine.map((val, i) => (
            <span
              key={`m2-${i}`}
              className={`aspect-square w-full rounded-sm ${val ? 'mod-heat-on bg-brand' : 'bg-line/25'}`}
              style={{ animationDelay: `${(i + 4) * 90}ms` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-sub">
          <span className="flex items-center gap-1.5">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-brand" />
            Cadence · 98%
          </span>
          <span className="text-[10px] text-sub/50">24h telemetry</span>
        </div>
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
      <div className="relative mt-auto flex h-28 w-full items-center justify-center text-center">
        <span className={`${pill} absolute top-1 left-3 border border-line/30 px-2.5 py-1.5 text-[10px] font-semibold`}>
          Claude
        </span>
        <span className={`${pill} absolute top-2 right-4 border border-line/30 px-2.5 py-1.5 text-[10px] font-semibold`}>
          Cursor
        </span>
        <span className="relative z-[1] flex h-12 w-12 items-center justify-center rounded-2xl bg-forest shadow-lift">
          <ServerCog size={20} className="mod-spin-hover text-brand" />
        </span>
        <span className={`${pill} absolute bottom-1 left-6 border border-line/30 px-2.5 py-1.5 text-[10px] font-semibold`}>
          Postgres
        </span>
        <span className="absolute right-5 bottom-0 rounded-btn border border-line/30 bg-card/80 px-2.5 py-1.5 text-[10px] font-semibold text-sub transition-colors duration-500 group-hover:border-danger/40 group-hover:text-danger">
          Unregistered
        </span>
      </div>
    )
  }

  if (kind === 'passport') {
    return (
      <div className={`relative mt-auto overflow-hidden ${pill} border border-line/40 p-4 text-left`}>
        <div className="mod-sweep-idle pointer-events-none absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-brand to-transparent" />
        <div className="flex items-center justify-between border-b border-line/35 pb-2 mb-2 text-[10px] font-bold tracking-widest text-sub/55 uppercase">
          <span>Orbita Secure ID</span>
          <span className="flex items-center gap-1 font-extrabold text-brand">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-brand" />
            Verified
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-11 flex-col justify-between overflow-hidden rounded-md border border-line/40 bg-sub/10 p-1">
              <div className="flex h-full w-full gap-0.5">
                <span className="flex-1 rounded-sm bg-sub/20 transition-colors duration-500 group-hover:bg-brand/35" />
                <span className="flex-1 rounded-sm bg-sub/20 transition-colors delay-75 duration-500 group-hover:bg-brand/35" />
                <span className="flex-1 rounded-sm bg-sub/20 transition-colors delay-150 duration-500 group-hover:bg-brand/35" />
              </div>
            </div>
            <div className="text-left">
              <p className="text-[12px] font-extrabold text-ink">TIER · EXCELLENT</p>
              <p className="text-[9px] text-sub/70">ID: #ORB-882-01</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((idx) => (
              <span
                key={idx}
                className={`h-4.5 w-2 rounded-sm ${idx <= 4 ? 'bg-brand/80' : 'bg-line/30'}`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-auto w-full text-center">
      <div className="flex flex-wrap justify-center gap-2">
        {['Workspace', 'Slack', 'GitHub', 'Zapier', 'Zoho', 'n8n'].map((n, i) => (
          <span
            key={n}
            className="rounded-btn border border-line/40 bg-card px-2.5 py-1.5 text-[10.5px] font-semibold text-sub transition-colors duration-500 hover:border-brand/40 hover:text-ink"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            {n}
          </span>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] font-bold tracking-wide text-sub/60 uppercase">
        Read-only · 15 min
      </p>
    </div>
  )
}

const MARQUEE_LOGOS = ['Slack', 'GitHub', 'Zapier', 'Google Workspace', 'Okta', 'Salesforce', 'n8n', 'Make']

function LogoMarquee() {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const halfWidthRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

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

const HOW_STEPS = [
  {
    n: '01',
    Icon: Link2,
    title: 'Connect what you already use',
    text: 'Read-only OAuth into Google, Slack, GitHub, and Zapier. About 15 minutes. Nothing is installed on the agents themselves.',
  },
  {
    n: '02',
    Icon: ScanSearch,
    title: 'See every agent, with an owner',
    text: 'Orbita lists bots, custom GPTs, and MCP servers, names who owns them, and scores risk. Typical first scan finishes in under 24 hours.',
  },
  {
    n: '03',
    Icon: Ban,
    title: 'Shut down what should not run',
    text: 'Revoke grants for orphaned bots, export auditor evidence, and keep a live inventory so new shadow AI cannot hide.',
  },
]

const HOME_FAQS = [
  {
    q: 'What is an AI agent in this context?',
    a: 'Anything acting on your systems without a person clicking each time: Zapier workflows, custom GPTs with tools, IDE agents, MCP servers, and similar automations.',
  },
  {
    q: 'Do we have to install software on those agents?',
    a: 'No. Orbita reads OAuth grants, audit logs, and DNS traffic the agents already leave. There is no SDK and nothing to deploy onto the bots.',
  },
  {
    q: 'How long until we see results?',
    a: 'A first inventory is typically live within 24 hours of connecting sources. Many teams see the first agents within the first hour.',
  },
  {
    q: 'Is the connection read-only?',
    a: 'Yes. Discovery uses read-only access. The kill switch is a separate, explicit action you choose. It is never on by default.',
  },
  {
    q: 'Where is data stored?',
    a: 'India (AWS Mumbai) by default, aligned with DPDP residency. EU and US regions are available, and Enterprise can self-host.',
  },
]

const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Orbita',
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Web',
      url: 'https://www.orbita.io/',
      description:
        'AI agent discovery platform that inventories Zapier bots, custom GPTs, and shadow MCP servers, scores risk, and revokes orphaned grants.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free discovery scan',
      },
    },
    {
      '@type': 'Organization',
      name: 'Orbita',
      url: 'https://www.orbita.io/',
      description: 'AI agent discovery and governance for mid-market security teams.',
    },
    {
      '@type': 'FAQPage',
      mainEntity: HOME_FAQS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
}

export default function Home() {
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const heroMouse = useRef({ x: 0, y: 0 })

  const heroIntro = useRef(null)

  useSeo({
    title: 'Orbita | Discover every AI agent your company already runs',
    description:
      'Orbita finds Zapier bots, custom GPTs, and shadow MCP servers in 24 hours. Inventory, risk-score, name an owner, and shut orphaned agents down. No SDK.',
    path: '/',
    jsonLd: HOME_JSON_LD,
  })

  useEffect(() => {
    const go = () => {
      if (window.location.hash === '#how-it-works') {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    go()
    window.addEventListener('hashchange', go)
    return () => window.removeEventListener('hashchange', go)
  }, [])

  useLayoutEffect(() => {
    const root = heroIntro.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let booted = false
    try {
      booted = sessionStorage.getItem('orbita-booted') === '1'
    } catch {
      /* ignore */
    }
    const ctx = gsap.context(() => {
      gsap.from(root.children, {
        y: 26,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        delay: booted ? 0.08 : 1.45,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const strideOf = (el) => {
    const card = el?.querySelector('[data-module-card]')
    return (card?.getBoundingClientRect().width || 340) + 20
  }

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
    const el = scrollRef.current
    if (!el) return
    const stride = strideOf(el)
    const next = direction === 'left' ? el.scrollLeft - stride * 2 : el.scrollLeft + stride * 2
    el.scrollTo({ left: next, behavior: 'smooth' })
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const stride = strideOf(el)
      const index = Math.round(el.scrollLeft / stride)
      setActiveIndex(Math.min(Math.max(index, 0), modules.length - 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
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
        <div ref={heroIntro} className="relative z-10 mx-auto max-w-[1200px]">
          <p className="ox-label !text-white/72">AI agent discovery</p>
          <h1 className="font-display mt-3.5 max-w-[18ch] text-[clamp(40px,4.8vw,64px)] font-normal leading-[1.06] tracking-[-0.03em] text-balance text-[#fff6ee]">
            Find every AI agent your company <em className="font-accent text-[#ffb799]">already runs</em>.
          </h1>
          <p className="mt-[18px] max-w-[52ch] text-[16px] leading-[1.7] text-white/[0.9]">
            Zapier bots, custom GPTs, and shadow MCP servers keep working after people leave.
            Orbita lists them in 24 hours, names an owner, and scores the risk, with no SDK to install.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link to="/signup" className="ox-btn ox-btn-primary">
              Start a free scan
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link to="/app/intelligence?tab=analyst" className="ox-btn ox-btn-ghost">
              Watch a live demo
            </Link>
          </div>
          <p className="mt-4 text-[13px] text-white/68">
            Read-only access · no credit card · data hosted in India by default
          </p>
        </div>
      </section>

      {/* Ledger */}
      <section className="border-b border-line bg-canvas" aria-label="Orbita in numbers">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 sm:grid-cols-3 sm:px-8 sm:py-12">
          {[
            ['147', 'agents on a typical first scan'],
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

      <section className="border-b border-line" aria-label="What Orbita is">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8 sm:py-20">
          <p className="ox-label">Definition</p>
          <h2 className="font-display mt-3.5 text-[clamp(28px,3vw,40px)] text-ink">What is Orbita?</h2>
          <p className="mt-5 max-w-[62ch] text-[16.5px] leading-[1.75] text-ink-2">
            Orbita is an AI agent discovery and governance platform that finds, inventories and
            risk-scores every AI agent, automation, custom GPT and MCP server running in a company.
            Security teams use it to assign a human owner, revoke orphaned agents, and export DPDP,
            SOC 2 and ISO 27001 evidence — without installing an SDK.
          </p>
        </div>
      </section>

      {/* Thesis */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-8 sm:py-20 md:grid-cols-2 md:gap-16">
          <div>
            <p className="ox-label">The problem</p>
            <h2 className="font-display mt-3.5 text-[clamp(28px,3vw,40px)] text-ink">
              Shadow AI is already inside your company.
            </h2>
          </div>
          <div className="space-y-4 text-[16px] leading-[1.75] text-ink-2">
            <p>
              Employees connect ChatGPT, Cursor, Zapier, and MCP servers to real systems: payroll,
              GitHub, customer data, without telling security. When someone leaves, the bot often stays.
            </p>
            <p>
              Orbita gives you one inventory: every agent, its owner, its risk, and a way to turn it
              off. You keep the map. You are not a tenant in your own stack.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-line" aria-labelledby="how-heading">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="ox-label">How it works</p>
            <h2 id="how-heading" className="font-display mt-3.5 max-w-[20ch] text-[clamp(28px,3vw,40px)] text-ink">
              Three steps. No agents to install.
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {HOW_STEPS.map((step) => (
              <li key={step.n}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-forest">
                  <step.Icon size={18} aria-hidden="true" />
                </span>
                <p className="ox-label mt-4">{step.n}</p>
                <h3 className="mt-2 text-[18px] font-medium tracking-tight text-ink">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 pb-6 sm:px-6" aria-labelledby="sentinel-heading">
        <div className="mx-auto max-w-[1100px] px-0 pt-16 sm:pt-20">
          <p className="ox-label">See it run</p>
          <h2 id="sentinel-heading" className="font-display mt-3.5 text-[clamp(28px,3vw,40px)] text-ink">
            Watch a first scan, as it happens.
          </h2>
          <p className="ox-lead mt-3">
            Same Sentinel view you get in the product: connect sources, watch findings land, then open
            the live inventory.
          </p>
        </div>
        <DiscoveryRoomStage />
      </section>

      {/* Logo strip */}
      <section className="border-y border-line py-10" aria-label="Trusted by">
        <p className="ox-label text-center text-sub">Works with the tools your agents already use</p>
        <LogoMarquee />
      </section>

      {/* Stack modules: Timbal-scale 8-up */}
      <section id="platform" className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-label="Platform">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl text-left">
              <p className="ox-label text-sub">Platform</p>
              <h2 className="font-display mt-3 text-3xl leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
                See it. Own it. Shut it down.
              </h2>
              <p className="mt-4 text-base text-sub sm:text-lg">
                One inventory for discovery, ownership, risk, and revocation, built for shadow AI.
              </p>
            </div>
            {/* Carousel navigation controls */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-ink shadow-soft hover:bg-muted transition-colors"
                aria-label="Previous slide"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
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
            <div key={m.name} data-module-card className="w-[280px] sm:w-[340px] shrink-0 snap-start">
              <ModuleCard name={m.name} text={m.text} visual={m.visual} />
            </div>
          ))}
        </div>

        {/* Carousel Indicators / Dots */}
        <div className="mt-2 flex justify-center gap-2">
          {modules.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                const el = scrollRef.current
                if (!el) return
                el.scrollTo({ left: idx * strideOf(el), behavior: 'smooth' })
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-6 bg-forest' : 'w-1.5 bg-line'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-canvas py-20" aria-label="Orbita compared">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <Reveal>
            <header className="mx-auto max-w-3xl text-center">
              <p className="ox-label text-sub">Capabilities</p>
              <h2 className="font-display mt-3 text-3xl leading-tight text-ink sm:text-4xl">
                What you get in one place
              </h2>
              <p className="font-display mt-2 text-3xl leading-tight text-sub sm:text-4xl">
                All in one place. Owned by you.
              </p>
            </header>
          </Reveal>

          <Reveal>
            <ul className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* 1. Exportable code: draggable-style code stack */}
              <li className="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white p-6 sm:p-7 lg:col-span-6 lg:min-h-[440px]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:opacity-100"
                  style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(255,77,0,0.12), transparent 60%)' }}
                />
                <div className="relative z-10 flex h-full flex-col">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-[#1f1e1c] sm:text-[22px]">
                      Exports you can read, not a black box.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-[#7d756d] sm:text-[14px]">
                      Every finding ships as JSON and signed PDFs. Your auditors can open them. You
                      can self-host. Nothing is locked inside Orbita.
                    </p>
                  </div>
                  <TbCodeStack />
                </div>
              </li>

              {/* 2. ACE: rising stat bars */}
              <li className="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white p-6 sm:p-7 lg:col-span-6 lg:min-h-[440px]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:opacity-100"
                  style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(255,77,0,0.12), transparent 60%)' }}
                />
                <div className="relative z-10 flex h-full flex-col">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-[#1f1e1c] sm:text-[22px]">
                      Stop bad agent actions in real time.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#7d756d] sm:text-[15px]">
                      The Action Control Engine (ACE) sits in front of any LLM and blocks moves that
                      break policy, without adding noticeable delay.
                    </p>
                  </div>
                  <TbAceStats />
                </div>
              </li>

              {/* 3. Proprietary tech: scramble text */}
              <li className="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white p-6 sm:p-7 lg:col-span-5 lg:min-h-[320px]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:opacity-100"
                  style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(255,77,0,0.12), transparent 60%)' }}
                />
                <div className="relative z-10 flex h-full flex-col">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-[#1f1e1c] sm:text-[22px]">
                      Built for agents, not bolted onto chat.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#7d756d] sm:text-[15px]">
                      Discovery, identity graph, ACE, and evidence export are one product. Not a
                      chatbot wrapper around someone else’s logs.
                    </p>
                  </div>
                  <div aria-hidden="true" className="relative mt-6 flex w-full flex-1 items-center justify-center overflow-hidden px-2 text-center" style={{ minHeight: 140 }}>
                    <TbScrambleText words={['Discovery', 'Identity Graph', 'ACE', 'Hybrid DB', 'CLI', 'SDK', 'MCP']} />
                  </div>
                </div>
              </li>

              {/* 4. Three layers: isometric stack */}
              <li className="relative isolate flex flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white p-6 sm:p-7 lg:col-span-7 lg:min-h-[320px]">
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-[#1f1e1c] sm:text-[22px]">
                      Three layers. One platform.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#7d756d] sm:text-[15px]">
                      Data, intelligence, and interface stay separate so you can start with one
                      team and grow to company-wide AI without ripping out the stack.
                    </p>
                  </div>
                  <TbIsoStack />
                </div>
              </li>

              {/* 5. Deploy anywhere: cycling tiles */}
              <li className="relative isolate flex flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white p-6 sm:p-7 lg:col-span-6 lg:min-h-[320px]">
                <div className="relative z-10 flex h-full flex-col">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-[#1f1e1c] sm:text-[22px]">
                      Run it in our cloud or yours.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#7d756d] sm:text-[15px]">
                      Multi-tenant SaaS, a dedicated VPC, or fully on-premise. Same product, same
                      kill switch, wherever your data has to live.
                    </p>
                  </div>
                  <TbDeployGrid />
                </div>
              </li>

              {/* 6. Integrations: masked logo marquee */}
              <li className="relative isolate flex flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white p-6 sm:p-7 lg:col-span-6 lg:min-h-[320px]">
                <div className="relative z-10 flex h-full flex-col">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-[#1f1e1c] sm:text-[22px]">
                      Slack, GitHub, Zapier, and MCP, out of the box.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#7d756d] sm:text-[15px]">
                      Each connector is also a discovery surface. Plug in the stack you have, add
                      any MCP server, or ship a custom tool without a long integration project.
                    </p>
                  </div>
                  <TbLogoMarquee />
                </div>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Blog */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-label="From the blog">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="ox-label text-sub">Resources</p>
              <h2 className="font-display mt-3 text-3xl leading-tight text-ink sm:text-4xl">Guides for security teams</h2>
              <p className="mt-2 text-sm text-sub">Shadow MCP, DPDP, and orphaned agents, in plain language.</p>
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
                  {p.tag} · {p.readTime} read
                </p>
                <h3 className="mt-3 flex-1 text-base font-bold tracking-tight group-hover:underline">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-sub">{p.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[800px] px-4 pb-16 sm:px-8" aria-labelledby="faq-heading">
        <Reveal>
          <p className="ox-label text-center">FAQ</p>
          <h2 id="faq-heading" className="font-display mt-3 text-center text-3xl leading-tight text-ink sm:text-4xl">
            Questions teams ask before the first scan
          </h2>
        </Reveal>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {HOME_FAQS.map((item, i) => {
            const open = openFaq === i
            return (
              <div key={item.q}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-[16px] font-medium tracking-tight text-ink">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-sub transition-transform ${open ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {open && (
                  <p className="pb-4 text-[15px] leading-relaxed text-ink-2">{item.a}</p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Final CTA */}
      <Reveal>
        <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-8">
          <div className="ox-plate relative overflow-hidden px-8 py-16 text-center sm:px-12 sm:py-20">
            <h2 className="font-display relative text-[clamp(28px,3vw,40px)] leading-[1.05] tracking-[-0.03em]">
              Get a live inventory of every AI agent you already run.
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-[15px] text-white/[0.84]">
              Free discovery scan · read-only access · data stays in India
            </p>
            <div className="relative mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <Link to="/signup" className="ox-btn ox-btn-primary">
                Start a free scan
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link to="/pricing" className="ox-btn ox-btn-ghost">
                See pricing
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  )
}
