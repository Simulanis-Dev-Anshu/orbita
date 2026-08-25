import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  Cloud,
  ShieldCheck,
  ServerCog,
  Radar,
  FileText,
} from 'lucide-react'
import useReveal from '../../hooks/useReveal.js'
import { posts } from '../../data/blog.js'
import HeroAsciiBackground from '../../components/hero/HeroAsciiBackground.jsx'
import DiscoveryRoomStage from '../../components/marketing/DiscoveryRoomStage.jsx'

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

/* ---------- Timbal-style bento section helpers ---------- */

const TB = {
  ink: '#1f1e1c',
  sub: '#7d756d',
  tertiary: '#a89f96',
  border: '#efe8e1',
  dark: '#170702',
  accent: '#ff4d00',
  accentSoft: '#ffb199',
  forest: '#170702',
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
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setOn(true),
      { threshold: 0.3 }
    )
    if (ref.current) io.observe(ref.current)
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
            <p className="text-[26px] leading-none font-medium tracking-tight text-[#1f1e1c] tabular-nums sm:text-[30px]">{s.value}</p>
            <p className="mt-2 text-[12px] leading-snug font-medium text-[#4a4d52]">{s.label}</p>
            <p className="mt-1 text-[11px] leading-none text-[#a8a8ac]">{s.sub}</p>
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
    let frame
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
    name: 'Discovery',
    text: 'OAuth, audit logs, DNS and MCP. Every agent surfaced in one living inventory.',
    visual: 'scan',
  },
  {
    name: 'Identity graph',
    text: 'Human to agent to credential to data. Blast radius in one click.',
    visual: 'graph',
  },
  {
    name: 'Kill switch',
    text: 'Revoke every grant an orphaned agent holds. Stops in one sync cycle.',
    visual: 'kill',
  },
  {
    name: 'Compliance',
    text: 'DPDP, SOC 2, ISO 27001 evidence, auditor-ready on demand.',
    visual: 'comp',
  },
  {
    name: 'Fingerprinting',
    text: '24/7 activity heatmap separates machine cadence from human rhythm.',
    visual: 'finger',
  },
  {
    name: 'Shadow MCP',
    text: 'Map every MCP server, its launcher, and the data scopes it can reach.',
    visual: 'mcp',
  },
  {
    name: 'Agent Passport',
    text: 'Portable trust score per agent, shareable with auditors and vendors.',
    visual: 'passport',
  },
  {
    name: 'Connectors',
    text: 'Read-only OAuth into Workspace, Slack, GitHub, Zoho and your automation stack.',
    visual: 'connectors',
  },
]

const pill = 'rounded-btn bg-card shadow-[0_10px_28px_rgba(23,7,2,0.09)]'

function ModuleVisual({ kind }) {
  if (kind === 'scan') {
    return (
      <div className="mt-auto space-y-4 w-full text-center">
        {/* Chips fade in and drop on hover */}
        <div className="flex justify-center gap-1.5 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          {['Zapier', 'Slack', 'MCP', 'GitHub'].map((s, i) => (
            <span
              key={s}
              className="rounded-full bg-card/90 px-2 py-0.5 text-[9px] font-semibold text-sub shadow-soft border border-line transition-all duration-300 hover:scale-105"
              style={{ transitionDelay: `${i * 65}ms` }}
            >
              {s}
            </span>
          ))}
        </div>
        {/* Scan Agents Input */}
        <div className={`flex items-center gap-2.5 ${pill} px-4 py-3 border border-line/40 transition-all duration-300 group-hover:border-brand/60 group-hover:scale-[1.02] group-hover:shadow-[0_12px_32px_rgba(255,77,0,0.08)]`}>
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest transition-colors duration-300 group-hover:bg-forest/80">
            <span className="absolute inset-0 rounded-full bg-brand/40 opacity-0 group-hover:opacity-100 group-hover:mod-ping" />
            <Radar size={13} className="relative text-brand group-hover:rotate-12 transition-transform duration-300" />
          </span>
          <span className="text-[13px] text-sub/70 font-semibold group-hover:text-ink transition-colors">Scan agents</span>
          <span className="mod-caret ml-0.5 inline-block h-4 w-[2px] bg-forest group-hover:animate-pulse" />
        </div>
      </div>
    )
  }

  if (kind === 'graph') {
    return (
      <div className="relative mt-auto flex flex-col items-center gap-3.5 py-1 w-full text-center">
        <span className={`${pill} px-4 py-2 text-[12px] font-semibold border border-line/40 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-brand/20 group-hover:scale-105`}>
          Owner · IdP
        </span>
        <svg className="h-5 w-8 text-sub/30" viewBox="0 0 32 20" fill="none">
          <path className="transition-colors duration-300 group-hover:text-brand group-hover:mod-dash" d="M16 0 V20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
        </svg>
        <span className={`${pill} px-4 py-2 text-[12px] font-semibold border border-line/40 relative transition-all duration-300 group-hover:scale-110 group-hover:border-brand group-hover:shadow-[0_8px_24px_rgba(255,77,0,0.06)]`}>
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-brand align-middle group-hover:animate-ping" />
          Agent
        </span>
        <svg className="h-5 w-8 text-sub/30" viewBox="0 0 32 20" fill="none">
          <path className="transition-colors duration-300 group-hover:text-brand group-hover:mod-dash" d="M16 0 V20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
        </svg>
        <span className={`${pill} px-4 py-2 text-[12px] font-semibold border border-line/40 transition-all duration-300 group-hover:translate-y-2 group-hover:border-brand/20 group-hover:scale-105`}>
          Scope · PII
        </span>
      </div>
    )
  }

  if (kind === 'kill') {
    return (
      <div className="mt-auto space-y-3 w-full text-center">
        {/* Mock agent listing */}
        <div className="rounded-btn border border-line bg-card/60 p-2.5 h-[56px] flex items-center justify-between transition-all duration-300 group-hover:border-danger/30 group-hover:bg-card">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-full bg-forest flex items-center justify-center text-[10px] font-bold text-brand transition-all duration-300 group-hover:bg-danger/10 group-hover:text-danger group-hover:scale-105">
              ZB
            </span>
            <div className="text-left">
              <p className="text-[11px] font-bold text-ink transition-colors group-hover:text-danger">Zapier Invoice</p>
              <p className="text-[9px] text-sub/70">Last active 2m ago</p>
            </div>
          </div>
          <span className="rounded-full bg-forest/20 px-2 py-0.5 text-[9px] font-semibold text-forest group-hover:hidden transition-all duration-300">
            Active
          </span>
          <span className="hidden rounded-full bg-danger-soft px-2 py-0.5 text-[9px] font-semibold text-danger group-hover:inline-block transition-all duration-300 animate-pulse">
            Orphaned
          </span>
        </div>

        {/* Action switch */}
        <div className={`flex items-center justify-between ${pill} px-3.5 py-2.5 border border-line/40 transition-all duration-300 group-hover:border-danger/40 group-hover:scale-[1.01]`}>
          <span className="text-[12px] font-semibold text-sub transition-colors duration-300 group-hover:text-danger">
            Orphan · revoke
          </span>
          <span className="rounded-full bg-line/80 px-3 py-1 text-[10px] font-bold text-sub transition-all duration-300 group-hover:bg-danger group-hover:text-white group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(239,68,68,0.22)] active:scale-95">
            Kill
          </span>
        </div>
      </div>
    )
  }

  if (kind === 'comp') {
    return (
      <div className="mt-auto space-y-3.5 w-full text-center">
        <div className={`mx-auto flex w-fit items-center gap-1.5 ${pill} px-3.5 py-2 text-[11px] font-semibold border border-line/40 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-brand/40 group-hover:scale-105`}>
          <FileText size={12} className="text-sub transition-colors group-hover:text-forest" />
          evidence-pack.pdf
        </div>
        <div className={`flex items-center gap-2.5 ${pill} px-4 py-3 border border-line/40 transition-all duration-300 group-hover:border-brand/40 group-hover:scale-[1.02]`}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft transition-all duration-300 group-hover:scale-115">
            <ShieldCheck size={13} className="text-forest group-hover:rotate-12 transition-transform duration-300" />
          </span>
          <span className="text-[13px] text-sub/70 font-semibold group-hover:text-ink transition-colors">Ask evidence</span>
          <span className="mod-caret ml-0.5 inline-block h-4 w-[2px] bg-forest" />
        </div>
      </div>
    )
  }

  if (kind === 'finger') {
    const rowMachine = [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0]
    const rowHuman = [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0]
    
    return (
      <div className="relative w-full h-[142px] flex flex-col justify-end overflow-hidden text-center">
        {/* Skeleton Shimmer */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-btn border border-line bg-card/60 p-3.5 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none animate-pulse">
          <div className="flex items-center justify-between text-[10px] text-sub/40 font-semibold">
            <span className="h-3 w-16 rounded bg-line/50" />
            <span className="h-3 w-20 rounded bg-line/50" />
          </div>
          {/* Gray Grid */}
          <div className="grid grid-cols-12 gap-1 my-1.5">
            {Array.from({ length: 36 }).map((_, i) => (
              <span
                key={i}
                className="w-full aspect-square rounded-sm bg-line/40"
              />
            ))}
          </div>
          <div className="flex justify-between items-center h-3">
            <span className="h-2.5 w-24 rounded bg-line/40" />
          </div>
        </div>

        {/* Active Heat-Matrix Cadence Classifier */}
        <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${pill} p-3.5 border border-line/40 w-full group-hover:scale-[1.02] group-hover:border-brand/30 transition-all`}>
          <div className="flex items-center justify-between text-[10px] text-sub font-bold uppercase tracking-wider">
            <span className="text-brand">Machine Cadence</span>
            <span className="text-sub/50">vs</span>
            <span className="text-forest">Human Rhythm</span>
          </div>

          {/* Grid Layout of Cadence Matrices */}
          <div className="grid grid-cols-12 gap-1 my-2.5">
            {rowMachine.map((val, i) => (
              <span
                key={`m1-${i}`}
                className={`w-full aspect-square rounded-sm transition-all duration-300 ${
                  val ? 'bg-brand shadow-[0_0_8px_#ff4d00] animate-pulse group-hover:scale-105' : 'bg-line/25'
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
            {rowHuman.map((val, i) => (
              <span
                key={`h1-${i}`}
                className={`w-full aspect-square rounded-sm transition-all duration-500 ${
                  val ? 'bg-forest/80 scale-95 group-hover:scale-105 group-hover:bg-forest' : 'bg-line/25'
                }`}
              />
            ))}
            {rowMachine.map((val, i) => (
              <span
                key={`m2-${i}`}
                className={`w-full aspect-square rounded-sm transition-all duration-300 ${
                  val ? 'bg-brand shadow-[0_0_8px_#ff4d00] animate-pulse group-hover:scale-105' : 'bg-line/25'
                }`}
                style={{ animationDelay: `${(i + 3) * 120}ms` }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-sub">
            <span className="flex items-center gap-1.5">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-brand" />
              Machine cadence · 98%
            </span>
            <span className="text-[10px] text-sub/50">24h telemetry</span>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'mcp') {
    return (
      <div className="relative mt-auto flex h-28 items-center justify-center w-full text-center">
        <span className={`${pill} absolute top-1 left-3 px-2.5 py-1.5 text-[10px] font-semibold border border-line/30 transition-transform duration-300 group-hover:-translate-x-2.5 group-hover:-translate-y-1.5 group-hover:border-brand/35`}>
          Claude
        </span>
        <span
          className={`${pill} absolute top-2 right-4 px-2.5 py-1.5 text-[10px] font-semibold border border-line/30 transition-transform duration-300 group-hover:translate-x-2.5 group-hover:-translate-y-1.5 group-hover:border-brand/35`}
        >
          Cursor
        </span>
        <span className="relative z-[1] flex h-12 w-12 items-center justify-center rounded-2xl bg-forest shadow-lift transition-transform duration-300 group-hover:scale-115">
          <span className="absolute inset-0 rounded-2xl bg-brand/30 opacity-0 group-hover:opacity-100 group-hover:mod-ping" />
          <ServerCog size={20} className="relative text-brand group-hover:rotate-45 transition-transform duration-500" />
        </span>
        <span
          className={`${pill} absolute bottom-1 left-6 px-2.5 py-1.5 text-[10px] font-semibold border border-line/30 transition-transform duration-300 group-hover:-translate-x-2.5 group-hover:translate-y-1.5 group-hover:border-brand/35`}
        >
          Postgres
        </span>
        <span
          className={`absolute right-5 bottom-0 px-2.5 py-1.5 text-[10px] font-semibold text-sub rounded-btn bg-card/60 border border-line/20 scale-95 opacity-40 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 group-hover:bg-card group-hover:border-danger/40 group-hover:text-danger group-hover:shadow-[0_12px_32px_rgba(239,68,68,0.1)]`}
        >
          Unregistered
        </span>
      </div>
    )
  }

  if (kind === 'passport') {
    return (
      <div className={`relative overflow-hidden mt-auto ${pill} p-4 border border-line/40 transition-all duration-300 group-hover:border-brand/40 group-hover:scale-[1.02] group-hover:shadow-[0_12px_32px_rgba(255,77,0,0.08)] text-left`}>
        {/* Glowing sweep scanner line on hover */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-0 group-hover:animate-scan-sweep pointer-events-none" />
        
        {/* Passport header */}
        <div className="flex items-center justify-between border-b border-line/35 pb-2 mb-2 text-[10px] font-bold text-sub/55 tracking-widest uppercase">
          <span>Orbita Secure ID</span>
          <span className="text-brand flex items-center gap-1 font-extrabold">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-brand" />
            Verified
          </span>
        </div>

        {/* Chip & Tier */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Security Chip Sim */}
            <div className="h-8 w-11 rounded-md bg-sub/10 border border-line/40 relative overflow-hidden flex flex-col justify-between p-1 transition-all duration-500 group-hover:bg-brand/10 group-hover:border-brand/35">
              <div className="h-full w-full flex gap-0.5">
                <span className="flex-1 bg-sub/20 rounded-sm group-hover:bg-brand/30 transition-colors duration-300" />
                <span className="flex-1 bg-sub/20 rounded-sm group-hover:bg-brand/30 transition-colors duration-300 delay-75" />
                <span className="flex-1 bg-sub/20 rounded-sm group-hover:bg-brand/30 transition-colors duration-300 delay-150" />
              </div>
            </div>
            <div className="text-left">
              <p className="text-[12px] font-extrabold text-ink group-hover:text-forest transition-colors duration-300">TIER · EXCELLENT</p>
              <p className="text-[9px] text-sub/70">ID: #ORB-882-01</p>
            </div>
          </div>

          {/* Segmented rating display */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((idx) => (
              <span
                key={idx}
                className={`h-4.5 w-2 rounded-sm transition-all duration-500 ${
                  idx <= 4
                    ? 'bg-brand/80 scale-100 group-hover:scale-y-115 group-hover:bg-brand shadow-[0_0_6px_#ff4d00]'
                    : 'bg-line/30 scale-95'
                }`}
                style={{ transitionDelay: `${idx * 45}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // connectors (default fallback)
  return (
    <div className="mt-auto w-full text-center">
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { n: 'Workspace', hover: 'group-hover:bg-[#4a154b]/10 group-hover:text-[#4a154b] group-hover:border-[#4a154b]/30' },
          { n: 'Slack', hover: 'group-hover:bg-[#4a154b]/10 group-hover:text-[#4a154b] group-hover:border-[#4a154b]/30 group-hover:scale-105' },
          { n: 'GitHub', hover: 'group-hover:bg-[#24292e] group-hover:text-white group-hover:scale-105' },
          { n: 'Zapier', hover: 'group-hover:bg-[#ff4f00]/10 group-hover:text-[#ff4f00] group-hover:border-[#ff4f00]/30 group-hover:scale-105' },
          { n: 'Zoho', hover: 'group-hover:bg-[#e21a22]/10 group-hover:text-[#e21a22] group-hover:border-[#e21a22]/30' },
          { n: 'n8n', hover: 'group-hover:bg-[#ff6d5a]/10 group-hover:text-[#ff6d5a] group-hover:border-[#ff6d5a]/30 group-hover:scale-105' }
        ].map((item, i) => (
          <span
            key={item.n}
            className={`rounded-btn bg-card px-2.5 py-1.5 text-[10.5px] font-semibold text-sub border border-line/40 transition-all duration-300 cursor-default hover:scale-105 ${item.hover}`}
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            {item.n}
          </span>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] font-bold tracking-wide text-sub/60 uppercase transition-colors duration-300 group-hover:text-forest">
        Read-only · 15 min
      </p>
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
          {modules.map((m, i) => (
            <div key={m.name} className="w-[280px] sm:w-[340px] shrink-0 snap-start">
              <article className="mod-card group flex h-[380px] flex-col rounded-[22px] bg-muted p-7 sm:p-8 cursor-pointer select-none">
                <h3 className="font-display text-[1.35rem] tracking-tight text-ink sm:text-2xl">{m.name}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-sub line-clamp-2">{m.text}</p>
                <div className="mt-10 flex flex-1 flex-col justify-end">
                  <ModuleVisual kind={m.visual} />
                </div>
              </article>
            </div>
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

      {/* We built the features everybody missed: timbal-style bento */}
      <section
        className="border-t border-line/40 bg-white py-20 sm:py-24"
        style={{ fontFamily: "'Inter Tight', ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <header className="mx-auto max-w-3xl text-center">
              <p className="ox-label text-sub">Platform</p>
              <h2 className="font-display mt-3 text-3xl leading-tight text-ink sm:text-4xl">
                We built the features everybody missed.
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
                      Everything you audit is exportable code.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-[#7d756d] sm:text-[14px]">
                      No black boxes. No vendor lock-in. Every event, session trace, and compliance
                      checklist compiles down to clean, auditor-ready JSON and signed PDFs you can
                      read, edit, run locally, and self-host.
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
                      ACE: Proven protection, at a fraction of the cost.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#7d756d] sm:text-[15px]">
                      The Action Control Engine is a behavioral runtime that keeps every agent
                      inside policy in production, dropped in as a security proxy in front of any
                      LLM.
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
                      Proprietary technology, not a wrapper.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#7d756d] sm:text-[15px]">
                      Our set of developer-first security products covers the full agent
                      lifecycle. Discovery Engine, Identity Graph, ACE, Hybrid DB, CLI, SDK, and
                      MCP, all built in-house, all working together.
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
                      Data, intelligence, and interface: a clean separation of security layers that
                      scales from a single agent to enterprise-wide AI infrastructure.
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
                      Deploy anywhere, no compromises.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#7d756d] sm:text-[15px]">
                      Our cloud, your VPC, or your own racks. Multi-tenant, dedicated, or fully
                      on-premise. Optimized for portability, scalability and performance.
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
                      100+ integrations. Every MCP. Custom tools.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#7d756d] sm:text-[15px]">
                      Every connector doubles as a discovery surface. Connect your existing stack
                      out of the box, securely plug in any MCP server, or build custom tools and
                      integrations in minutes.
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
