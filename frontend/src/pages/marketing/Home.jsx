import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  Bot,
  Cloud,
  Fingerprint,
  Power,
  ShieldCheck,
  Waypoints,
  ServerCog,
  Plug,
  ScanSearch,
  UserX,
  KeyRound,
  Radar,
  FileText,
} from 'lucide-react'
import useReveal from '../../hooks/useReveal.js'
import { posts } from '../../data/blog.js'

const feedPool = [
  { name: 'Zapier Invoice Bot', platform: 'Zapier', risk: 87 },
  { name: 'Postgres MCP Server', platform: 'MCP', risk: 71 },
  { name: 'Sales Outreach GPT', platform: 'Custom GPT', risk: 74 },
  { name: 'GitHub PR Reviewer', platform: 'GitHub', risk: 22 },
  { name: 'Payroll Sync Agent', platform: 'Make', risk: 92 },
  { name: 'HR Onboarding Flow', platform: 'n8n', risk: 58 },
]

const weekly = [12, 19, 15, 27, 22, 31, 26, 38]
const chartPts = weekly.map((v, i) => [
  (i / (weekly.length - 1)) * 280,
  96 - (v / Math.max(...weekly)) * 78,
])

function smoothPath(pts) {
  let d = `M ${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i][0] + pts[i + 1][0]) / 2
    const yc = (pts[i][1] + pts[i + 1][1]) / 2
    d += ` Q ${pts[i][0]},${pts[i][1]} ${xc},${yc}`
  }
  d += ` T ${pts[pts.length - 1][0]},${pts[pts.length - 1][1]}`
  return d
}

const linePath = smoothPath(chartPts)
const areaPath = `${linePath} L 280,100 L 0,100 Z`

/* ── "Built to pass the security review" bento (timbal.ai-style) ── */

const TB_INK = '#1a1c21'
const TB_SUB = '#86868a'
const TB_FONT =
  '"Helvetica Neue", Helvetica, Arial, -apple-system, "system-ui", "Segoe UI", Roboto, sans-serif'

/* Twinkling pixel-grid canvas with edge fade (timbal pixel-card) */
function PixelField() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf
    const gap = 16 * dpr
    const size = 2.4 * dpr
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      draw(performance.now())
    }
    const draw = (t) => {
      cancelAnimationFrame(raf)
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)
      const cols = Math.ceil(w / gap)
      const rows = Math.ceil(h / gap)
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
          const phase = s - Math.floor(s)
          const tw = reduced ? 0.4 : Math.max(0, Math.sin(t / 1500 + phase * Math.PI * 2))
          ctx.fillStyle = `rgba(26,28,33,${0.04 + 0.16 * tw})`
          ctx.fillRect(i * gap, j * gap, size, size)
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 78%)',
      }}
    />
  )
}

/* Cycling deployment-target tile (blur in/out, timbal cloud cycler) */
const tbClouds = ['AWS', 'Azure', 'GCP', 'On-prem']
function CloudCycler() {
  const [idx, setIdx] = useState(0)
  const [out, setOut] = useState(false)
  useEffect(() => {
    const t = setInterval(() => {
      setOut(true)
      setTimeout(() => {
        setIdx((i) => (i + 1) % tbClouds.length)
        setOut(false)
      }, 320)
    }, 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="relative flex h-full min-h-[260px] items-center justify-center overflow-hidden rounded-xl">
      <PixelField />
      {/* hover radial glow */}
      <div className="tb-pixel-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <p className="sr-only" aria-live="polite">
        Deployment option: {tbClouds[idx]}
      </p>
      <div className="relative z-[2] flex h-[88px] w-[88px] items-center justify-center rounded-2xl border border-[#efefef] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)] sm:h-24 sm:w-24">
        <span
          className="text-[17px] font-semibold tracking-tight"
          style={{
            color: TB_INK,
            filter: out ? 'blur(6px)' : 'blur(0px)',
            opacity: out ? 0 : 1,
            transform: out ? 'scale(0.92)' : 'none',
            transition: 'filter 0.32s ease, opacity 0.32s ease, transform 0.32s ease',
          }}
        >
          {tbClouds[idx]}
        </span>
      </div>
    </div>
  )
}

/* Compliance seals: minimal 1.6-stroke outline SVGs (timbal badges) */
function TbSeal({ variant, label }) {
  const common = {
    className: 'h-20 w-20 sm:h-24 sm:w-24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
    viewBox: '0 0 100 100',
    'aria-hidden': true,
  }
  return (
    <li
      className="flex flex-col items-center gap-2.5 transition-transform duration-300 hover:-translate-y-1"
      style={{ color: TB_INK }}
    >
      {variant === 'soc2' && (
        <svg {...common}>
          <circle cx="50" cy="44" r="26" />
          <circle cx="50" cy="44" r="19" strokeDasharray="2.5 4" />
          <text x="50" y="42" textAnchor="middle" fontSize="11" fontWeight="700" stroke="none" fill="currentColor">SOC 2</text>
          <text x="50" y="53" textAnchor="middle" fontSize="6.5" fontWeight="500" stroke="none" fill="currentColor" letterSpacing="1">TYPE II</text>
          <path d="M42 66l-6 14 8-4 4 8 4-11" />
          <path d="M58 66l6 14-8-4-4 8" />
        </svg>
      )}
      {variant === 'iso' && (
        <svg {...common}>
          <circle cx="50" cy="50" r="30" />
          <g strokeDasharray="1.8 5.2">
            <circle cx="50" cy="50" r="36" />
          </g>
          <text x="50" y="48" textAnchor="middle" fontSize="12" fontWeight="700" stroke="none" fill="currentColor">ISO</text>
          <text x="50" y="60" textAnchor="middle" fontSize="9" fontWeight="500" stroke="none" fill="currentColor">27001</text>
        </svg>
      )}
      {variant === 'gdpr' && (
        <svg {...common}>
          <circle cx="50" cy="50" r="30" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2
            return (
              <circle
                key={i}
                cx={50 + 23 * Math.cos(a)}
                cy={50 + 23 * Math.sin(a)}
                r="1.6"
                fill="currentColor"
                stroke="none"
              />
            )
          })}
          <text x="50" y="54" textAnchor="middle" fontSize="10" fontWeight="700" stroke="none" fill="currentColor">GDPR</text>
        </svg>
      )}
      {variant === 'dpdp' && (
        <svg {...common}>
          <path d="M50 16l26 9v22c0 16-10.5 28-26 35-15.5-7-26-19-26-35V25z" />
          <rect x="41" y="43" width="18" height="15" rx="2.5" />
          <path d="M45 43v-5a5 5 0 0 1 10 0v5" />
          <text x="50" y="72" textAnchor="middle" fontSize="8.5" fontWeight="700" stroke="none" fill="currentColor">DPDP</text>
        </svg>
      )}
      <span className="text-[12px] font-medium" style={{ color: TB_SUB }}>
        {label}
      </span>
    </li>
  )
}

/* Dark card: expanding radar rings + India-region marker */
function IndiaRings() {
  return (
    <div className="relative flex h-full min-h-[260px] items-center justify-center overflow-hidden rounded-xl">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 55%, rgba(255,255,255,0.09), transparent 62%)' }}
      />
      {/* static structure rings */}
      {[110, 190, 270].map((d) => (
        <span
          key={d}
          className="absolute rounded-full border border-white/[0.07]"
          style={{ width: d, height: d }}
        />
      ))}
      {/* expanding pulse rings */}
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="tb-ring absolute rounded-full border border-white/25"
          style={{ width: 290, height: 290, animationDelay: `${i * 1.125}s` }}
        />
      ))}
      <div className="relative z-[2] flex flex-col items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm">
          <Radar size={20} aria-hidden="true" />
        </span>
        <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/85 backdrop-blur-sm">
          ap-south-1 · Mumbai
        </span>
      </div>
    </div>
  )
}

/* 3D slot-machine wheel of agent platforms (timbal model wheel) */
const tbPlatforms = [
  ['Zapier', '#ff4f00'],
  ['Make', '#8a2be2'],
  ['n8n', '#ea4b71'],
  ['Custom GPTs', '#10a37f'],
  ['MCP Servers', '#1a1c21'],
  ['GitHub', '#24292f'],
  ['Slack', '#611f69'],
  ['Copilot Studio', '#0078d4'],
]
function PlatformWheel() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined
    const t = setInterval(() => setActive((a) => a + 1), 2000)
    return () => clearInterval(t)
  }, [])
  const n = tbPlatforms.length
  return (
    <div className="flex h-full min-h-[300px] items-center justify-center" style={{ perspective: '800px' }}>
      <div className="relative h-[280px] w-full overflow-hidden" aria-hidden="true">
        {tbPlatforms.map(([name, color], i) => {
          let d = (((i - active) % n) + n) % n
          if (d > n / 2) d -= n
          const abs = Math.abs(d)
          const clamped = Math.max(-3, Math.min(3, d))
          const opacity = abs >= 3 ? 0 : [1, 0.56, 0.12][abs]
          return (
            <div
              key={name}
              className="absolute inset-x-0 top-0 flex h-14 items-center justify-center gap-2.5"
              style={{
                pointerEvents: 'none',
                transformStyle: 'preserve-3d',
                transform: `translateY(${112 + clamped * 40}px) scale(${1 - abs * 0.14})`,
                opacity,
                transition:
                  'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <span
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[7px] text-[12px] font-bold"
                style={{ backgroundColor: `${color}1a`, color }}
              >
                {name[0]}
              </span>
              <span
                style={{
                  fontFamily: TB_FONT,
                  fontSize: d === 0 ? 28 : 22,
                  fontWeight: 400,
                  letterSpacing: '-0.04em',
                  color: TB_INK,
                  transition: 'font-size 0.4s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {name}
              </span>
            </div>
          )
        })}
      </div>
      <p className="sr-only">
        Discover agents on Zapier, Make, n8n, Custom GPTs, MCP servers, GitHub, Slack, and Copilot Studio.
      </p>
    </div>
  )
}

/* Discovery Engine radar: rotating sweep surfaces agent blips (Orbita original) */
const tbBlips = [
  { deg: 45, r: 62, label: 'Zapier bot' },
  { deg: 110, r: 40, label: 'MCP server' },
  { deg: 170, r: 70, label: 'Custom GPT' },
  { deg: 230, r: 52, label: 'shadow agent', risk: true },
  { deg: 300, r: 66, label: 'n8n flow' },
  { deg: 335, r: 30, label: 'Make flow' },
]
function TbRadarSweep() {
  return (
    <div className="relative aspect-square w-full max-w-[400px]" aria-hidden="true">
      {/* rings + crosshair */}
      <svg viewBox="0 0 400 400" fill="none" className="absolute inset-0 h-full w-full">
        {[60, 110, 160, 196].map((r) => (
          <circle key={r} cx="200" cy="200" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        ))}
        <path d="M 200 4 V 396 M 4 200 H 396" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <circle cx="200" cy="200" r="3" fill="rgba(134,230,74,0.9)" />
        <circle cx="200" cy="200" r="8" stroke="rgba(134,230,74,0.35)" strokeWidth="1" />
      </svg>
      {/* rotating sweep beam */}
      <div
        className="tb-sweep absolute inset-[2%] rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, transparent 290deg, rgba(134,230,74,0.05) 310deg, rgba(134,230,74,0.16) 344deg, rgba(134,230,74,0.5) 358deg, transparent 360deg)',
        }}
      />
      {/* agent blips, timed to the beam */}
      {tbBlips.map(({ deg, r, label, risk }) => {
        const rad = ((deg - 90) * Math.PI) / 180
        const x = 50 + (r / 2) * Math.cos(rad)
        const y = 50 + (r / 2) * Math.sin(rad)
        return (
          <span
            key={label}
            className="tb-blip absolute flex items-center gap-1.5"
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(deg / 360) * 6}s` }}
          >
            <span
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{
                backgroundColor: risk ? '#f87171' : '#86e64a',
                boxShadow: risk ? '0 0 10px rgba(248,113,113,0.7)' : '0 0 10px rgba(134,230,74,0.55)',
              }}
            />
            <span
              className="font-mono text-[9px] leading-none whitespace-nowrap"
              style={{ color: risk ? 'rgba(248,113,113,0.85)' : 'rgba(255,255,255,0.55)' }}
            >
              {label}
            </span>
          </span>
        )
      })}
    </div>
  )
}

/* Drifting dot-wave canvas for the Hybrid DB dev card */
function TbDataCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf
    const draw = (t) => {
      cancelAnimationFrame(raf)
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)
      const cols = 26
      const rows = 8
      const gx = w / (cols - 1)
      const gy = h / (rows + 1)
      for (let i = 0; i < cols; i++) {
        for (let j = 1; j <= rows; j++) {
          const wave = Math.sin(i * 0.55 + j * 0.8 + (reduced ? 0 : t / 900))
          const y = j * gy + wave * gy * 0.28
          const a = 0.1 + 0.24 * (0.5 + wave / 2)
          ctx.fillStyle = `rgba(255,255,255,${a})`
          ctx.beginPath()
          ctx.arc(i * gx, y, 1.1 * dpr, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      draw(performance.now())
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])
  return <canvas ref={ref} aria-hidden="true" className="block h-full w-full" />
}

/* Commit-bar sparkline for the framework release mini-card */
const tbBars = Array.from({ length: 28 }, (_, i) => {
  const s = Math.abs(Math.sin((i + 1) * 12.9898)) * 12 + 4
  return Math.round(s)
})

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

/* ── Product tour: sticky rail + scroll-spy panels (timbal-style) ── */

/* Floating detail card shared chrome */
function TourCard({ icon: Icon, title, sub, dot, children, footerLeft, footerRight }) {
  const dotColor =
    dot === 'red'
      ? 'bg-red-400 shadow-[0_0_16px_rgba(248,113,113,0.85)]'
      : dot === 'amber'
        ? 'bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.85)]'
        : 'bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.85)]'
  return (
    <div className="pointer-events-auto absolute top-1/2 right-5 z-10 w-full max-w-[260px] -translate-y-1/2 rounded-[1.1rem] border border-white/8 bg-black/50 p-3 shadow-[0_18px_55px_rgba(0,0,0,0.38)] backdrop-blur sm:right-6 lg:right-7">
      <div className="flex items-start gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.045] text-white/85">
          <Icon size={18} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] leading-tight font-medium text-white sm:text-[16px]">{title}</p>
          <p className="mt-1 text-[12px] leading-tight text-white/62 sm:text-[13px]">{sub}</p>
        </div>
        <span aria-hidden="true" className={`mt-1 h-3 w-3 rounded-full ${dotColor}`} />
      </div>
      <div className="mt-3 h-px bg-white/8" />
      {children}
      <div className="mt-3 flex items-center justify-between gap-4 text-[11px] sm:text-[12px]">
        <div className="flex items-center gap-2 font-medium text-white/70">{footerLeft}</div>
        <p className="font-mono tabular-nums text-white/58">{footerRight}</p>
      </div>
    </div>
  )
}

function TourStat({ label, value, wide = false, tone }) {
  return (
    <div className={`rounded-lg border border-white/7 bg-white/[0.025] p-2 ${wide ? 'col-span-2' : ''}`}>
      <p className="text-[10px] leading-none font-medium text-white/42 sm:text-[11px]">{label}</p>
      <p
        className={`mt-1.5 font-mono text-[11px] leading-tight font-medium tracking-tight sm:text-[12px] ${
          tone === 'red' ? 'text-red-400' : tone === 'amber' ? 'text-amber-400' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

const tourStops = [
  {
    tab: 'Live agent inventory',
    h3: 'Every agent in one inventory, minutes after connecting.',
    p: 'Connect Slack, GitHub, Zapier, Make, and your cloud accounts. Orbita fingerprints every agent it finds and keeps the inventory live — including the ones nobody registered.',
    bg: (
      <svg viewBox="0 0 400 300" fill="none" className="h-full max-h-[280px] w-auto opacity-70">
        <path
          d="M 80 150 L 170 80 M 80 150 L 160 210 M 80 150 L 200 150 M 200 150 L 290 90 M 200 150 L 300 200 M 170 80 L 290 90"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1"
        />
        {[
          [80, 150],
          [170, 80],
          [160, 210],
          [290, 90],
          [300, 200],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="rgba(255,255,255,0.14)" />
        ))}
        <circle cx="200" cy="150" r="7" fill="rgba(134,230,74,0.85)" className="animate-pulse" />
        <circle cx="200" cy="150" r="16" stroke="rgba(134,230,74,0.3)" strokeWidth="1" />
      </svg>
    ),
    card: (
      <TourCard
        icon={Bot}
        title="Payroll Sync Agent"
        sub="Make · Finance workspace"
        dot="red"
        footerLeft={
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Flagged
          </>
        }
        footerRight="Last seen 2m ago"
      >
        <div className="mt-3 grid grid-cols-2 gap-2">
          <TourStat label="Risk score" value="92 / 100" tone="red" />
          <TourStat label="Owner" value="unassigned" tone="amber" />
          <TourStat label="Platform" value="Make (EU tenant)" wide />
        </div>
      </TourCard>
    ),
  },
  {
    tab: 'Session tracing',
    h3: 'Trace every agent action from trigger to outcome.',
    p: 'Every run is recorded to the audit ledger: prompts, tool calls, permissions touched. Replay any session and see exactly what an agent did — and why.',
    bg: (
      <svg viewBox="0 0 400 300" fill="none" className="h-full max-h-[280px] w-auto opacity-70">
        {[70, 130, 190, 250].map((y, i) => (
          <g key={y}>
            <path d={`M 30 ${y} H 370`} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            {[80, 170, 260, 330].slice(0, 4 - i).map((x) => (
              <circle key={x} cx={x} cy={y} r="4" fill="rgba(255,255,255,0.16)" />
            ))}
          </g>
        ))}
        <circle cx="330" cy="70" r="6" fill="rgba(134,230,74,0.8)" className="animate-pulse" />
      </svg>
    ),
    card: (
      <TourCard
        icon={FileText}
        title="Session #tr-88a2"
        sub="Zapier Invoice Bot"
        dot="emerald"
        footerLeft={
          <>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Recording
          </>
        }
        footerRight="12 events"
      >
        <div className="mt-3 space-y-1.5 font-mono text-[10.5px] leading-tight sm:text-[11px]">
          <p className="flex justify-between gap-2 text-white/58">
            <span>09:41:02 trigger:webhook</span>
            <span className="text-white/35">ok</span>
          </p>
          <p className="flex justify-between gap-2 text-white/58">
            <span>09:41:03 read_invoices</span>
            <span className="text-emerald-400/80">✓</span>
          </p>
          <p className="flex justify-between gap-2 text-white/80">
            <span>09:41:05 grant_oauth</span>
            <span className="text-amber-400">⚠ flagged</span>
          </p>
        </div>
      </TourCard>
    ),
  },
  {
    tab: 'Risk scoring',
    h3: 'Know which agents can hurt you before they do.',
    p: 'Each agent gets a live risk score built from permissions, data access, ownership, and behavioral drift. Orphaned and over-privileged agents rise to the top of the queue.',
    bg: (
      <svg viewBox="0 0 400 300" fill="none" className="h-full max-h-[280px] w-auto opacity-70">
        {[50, 85, 120].map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="150"
            r={r}
            stroke={i === 0 ? 'rgba(134,230,74,0.35)' : 'rgba(255,255,255,0.08)'}
            strokeWidth="1"
            strokeDasharray={i === 2 ? '3 6' : 'none'}
          />
        ))}
        <path d="M 200 150 L 200 30" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <path d="M 200 150 L 316 90" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx="200" cy="65" r="5" fill="rgba(248,113,113,0.8)" />
        <circle cx="258" cy="120" r="5" fill="rgba(251,191,36,0.75)" />
        <circle cx="180" cy="185" r="5" fill="rgba(255,255,255,0.2)" />
      </svg>
    ),
    card: (
      <TourCard
        icon={ShieldCheck}
        title="Risk profile"
        sub="Sales Outreach GPT"
        dot="amber"
        footerLeft={
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Review required
          </>
        }
        footerRight="Score 87 / 100"
      >
        <div className="mt-3 grid grid-cols-2 gap-2">
          <TourStat label="Permissions" value="High" tone="amber" />
          <TourStat label="Data access" value="PII" tone="red" />
          <TourStat label="Blast radius" value="3 connected systems" wide />
        </div>
      </TourCard>
    ),
  },
  {
    tab: 'Compliance reports',
    h3: 'Ship auditor-ready evidence in one click.',
    p: 'Export signed evidence packs mapped to SOC 2, ISO 27001, GDPR, and DPDP. Your auditor gets verifiable JSON and PDFs — not screenshots.',
    bg: (
      <svg viewBox="0 0 400 300" fill="none" className="h-full max-h-[280px] w-auto opacity-70">
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={120 + i * 14}
            y={60 + i * 14}
            width="150"
            height="180"
            rx="10"
            stroke={i === 2 ? 'rgba(134,230,74,0.35)' : 'rgba(255,255,255,0.09)'}
            strokeWidth="1"
            fill={i === 2 ? 'rgba(134,230,74,0.04)' : 'none'}
          />
        ))}
        {[100, 122, 144].map((y) => (
          <path key={y} d={`M 165 ${y} H 255`} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        ))}
      </svg>
    ),
    card: (
      <TourCard
        icon={FileText}
        title="Q3 Evidence Pack"
        sub="SOC 2 · ISO 27001 · DPDP"
        dot="emerald"
        footerLeft={
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Signed
          </>
        }
        footerRight="SHA-256"
      >
        <div className="mt-3 space-y-1.5 text-[11px] sm:text-[12px]">
          {['Access review', 'Agent inventory', 'Session logs'].map((row) => (
            <p key={row} className="flex items-center justify-between gap-2 text-white/62">
              <span>{row}</span>
              <span className="text-emerald-400/80">✓</span>
            </p>
          ))}
        </div>
      </TourCard>
    ),
  },
]

function TbProductTour() {
  const [active, setActive] = useState(0)
  const panelRefs = useRef([])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.idx))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    panelRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])
  const goTo = (i) => {
    setActive(i)
    panelRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  return (
    <div className="mt-12 grid min-w-0 gap-10 sm:mt-14 lg:grid-cols-12 lg:gap-8">
      {/* Sticky tab rail */}
      <aside className="min-w-0 lg:col-span-3">
        <div className="min-w-0 lg:sticky lg:top-24">
          <ul className="scrollbar-none flex w-full gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1.5">
            {tourStops.map((s, i) => (
              <li key={s.tab} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={active === i ? 'true' : undefined}
                  className="group flex w-full items-center gap-2.5 rounded-md px-1 py-1.5 text-left transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full border border-white/28"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-white/90 transition-opacity duration-300"
                      style={{ opacity: active === i ? 1 : 0 }}
                    />
                  </span>
                  <span
                    className={`text-[13px] leading-snug font-medium whitespace-nowrap transition-colors sm:text-[14px] lg:whitespace-normal ${
                      active === i ? 'text-white/88' : 'text-white/42 group-hover:text-white/62'
                    }`}
                  >
                    {s.tab}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {/* Panels */}
      <div className="min-w-0 lg:col-span-8 lg:col-start-5">
        <div className="space-y-10 lg:space-y-20">
          {tourStops.map((s, i) => (
            <article
              key={s.tab}
              data-idx={i}
              ref={(el) => {
                panelRefs.current[i] = el
              }}
              className="relative flex scroll-mt-28 flex-col overflow-hidden rounded-2xl border border-white/16 bg-[#111111] p-5 transition-colors sm:p-6 lg:p-7"
            >
              <div className="max-w-2xl">
                <h3 className="text-[22px] leading-tight font-medium tracking-tight text-white sm:text-[28px]">
                  {s.h3}
                </h3>
                <p className="mt-3 max-w-[54ch] text-[14px] leading-relaxed text-white/62 sm:text-[15px]">
                  {s.p}
                </p>
              </div>
              {/* Full-bleed visual */}
              <div className="-mx-5 mt-6 -mb-5 sm:-mx-6 sm:-mb-6 lg:-mx-7 lg:-mb-7">
                <div className="relative min-h-[340px]">
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-start pl-6 sm:pl-10">
                    {s.bg}
                  </div>
                  {/* top fade */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-24 bg-gradient-to-b from-[#111111] to-transparent" />
                  {s.card}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Timbal-style bento section helpers ---------- */

const TB = {
  ink: '#1a1c21',
  sub: '#86868a',
  tertiary: '#a8a8ac',
  border: '#efefef',
  dark: '#0a0a0a',
  accent: '#0057f3',
  accentSoft: '#6ba8ff',
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
            <p className="text-[26px] leading-none font-medium tracking-tight text-white tabular-nums sm:text-[30px]">{s.value}</p>
            <p className="mt-2 text-[12px] leading-snug font-medium text-white/75">{s.label}</p>
            <p className="mt-1 text-[11px] leading-none text-white/40">{s.sub}</p>
          </div>
          <div aria-hidden="true" className="mt-5 flex w-full max-w-[88px] flex-1 flex-col justify-end overflow-hidden rounded-t-lg bg-white/10">
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
            <p className="text-[13px] font-medium transition-colors duration-200" style={{ color: hot === i ? TB.accent : TB.ink }}>
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
                  background: 'radial-gradient(circle, rgba(0,87,243,0.18) 0%, rgba(0,87,243,0) 70%)',
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
                    ? `0 18px 34px -14px rgba(0,87,243,0.30), 0 4px 10px -2px rgba(15,23,42,0.10), inset 0 0 0 1px ${TB.accent}`
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

function Kpi({ value, label, tone }) {
  return (
    <div className="rounded-2xl bg-muted/80 px-3 py-2.5">
      <p className={`text-lg font-bold tabular-nums tracking-tight ${tone}`}>{value}</p>
      <p className="text-[10px] font-medium text-sub">{label}</p>
    </div>
  )
}

/** Animated mini replica of the Orbita dashboard */
function DashboardStage() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2400)
    return () => clearInterval(id)
  }, [])

  const rows = Array.from({ length: 4 }, (_, i) => feedPool[(tick + i) % feedPool.length])

  return (
    <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16">
      {/* Soft fabric / mist backdrop */}
      <div
        className="pointer-events-none absolute -inset-x-8 -top-10 bottom-8 -z-10 overflow-hidden sm:-inset-x-16"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(134,230,74,0.18),transparent_55%)]" />
        <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(90deg,transparent,transparent_48px,rgba(11,31,24,0.03)_48px,rgba(11,31,24,0.03)_49px)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-line bg-card pb-16 shadow-lift sm:pb-20">
        {/* Chrome */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand/70" />
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-medium text-sub">
            app.orbita.io / dashboard
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-forest">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
            Live scan
          </span>
        </div>

        <div className="grid sm:grid-cols-[72px_1fr]">
          {/* Mini sidebar */}
          <aside className="hidden border-r border-line bg-muted/40 p-3 sm:block" aria-hidden="true">
            <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-xl bg-forest">
              <Radar size={14} className="text-brand" />
            </div>
            {[ScanSearch, Waypoints, ShieldCheck, ServerCog, Bot].map((Icon, i) => (
              <div
                key={i}
                className={`mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl ${
                  i === 0 ? 'bg-forest text-brand' : 'text-sub'
                }`}
              >
                <Icon size={15} />
              </div>
            ))}
          </aside>

          <div className="space-y-3 p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-2.5">
              <Kpi value={147} label="Agents" tone="text-forest" />
              <Kpi value={8} label="Orphaned" tone="text-danger" />
              <Kpi value={23} label="High risk" tone="text-warn" />
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-2xl border border-line bg-canvas p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-ink">Discoveries / week</p>
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold text-forest">
                    +38
                  </span>
                </div>
                <svg viewBox="0 0 280 100" className="mt-2 h-24 w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="stageArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#86E64A" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#86E64A" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#stageArea)" className="area-fade" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#0B1F18"
                    strokeWidth="2"
                    strokeLinecap="round"
                    pathLength="1"
                    className="draw-line"
                  />
                </svg>
              </div>

              <div className="rounded-2xl border border-line bg-canvas p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-semibold">Discovery feed</p>
                  <span className="text-[10px] font-medium text-sub">scanning…</span>
                </div>
                <ul className="space-y-1.5">
                  {rows.map((r, i) => (
                    <li
                      key={`${r.name}-${tick}-${i}`}
                      className={`flex items-center gap-2 rounded-xl bg-card px-2.5 py-2 ${
                        i === 0 ? 'feed-in ring-1 ring-brand/30' : ''
                      }`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Bot size={11} className="text-forest" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[11px] font-semibold">{r.name}</span>
                      <span
                        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                          r.risk >= 75
                            ? 'bg-danger-soft text-danger'
                            : r.risk >= 50
                              ? 'bg-warn-soft text-warn'
                              : 'bg-brand-soft text-forest'
                        }`}
                      >
                        {r.risk}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay CTA — Timbal style */}
        <div className="absolute inset-x-0 bottom-5 flex justify-center sm:bottom-6">
          <Link
            to="/app"
            className="inline-flex items-center gap-3 rounded-btn bg-ink px-6 py-3.5 text-white shadow-lift transition-transform hover:-translate-y-0.5"
          >
            <span className="text-left">
              <span className="block text-sm font-semibold">Experience it now</span>
              <span className="block text-[11px] text-white/55">No credit card · live demo</span>
            </span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}

const modules = [
  {
    name: 'Discovery',
    text: 'OAuth, audit logs, DNS and MCP — every agent surfaced in one living inventory.',
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
    text: 'DPDP, SOC 2, ISO 27001 evidence — auditor-ready on demand.',
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
    text: 'Portable trust score per agent — shareable with auditors and vendors.',
    visual: 'passport',
  },
  {
    name: 'Connectors',
    text: 'Read-only OAuth into Workspace, Slack, GitHub, Zoho and your automation stack.',
    visual: 'connectors',
  },
]

const pill = 'rounded-btn bg-card shadow-[0_10px_28px_rgba(11,31,24,0.09)]'

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
        <div className={`flex items-center gap-2.5 ${pill} px-4 py-3 border border-line/40 transition-all duration-300 group-hover:border-brand/60 group-hover:scale-[1.02] group-hover:shadow-[0_12px_32px_rgba(134,230,74,0.08)]`}>
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
        <span className={`${pill} px-4 py-2 text-[12px] font-semibold border border-line/40 relative transition-all duration-300 group-hover:scale-110 group-hover:border-brand group-hover:shadow-[0_8px_24px_rgba(134,230,74,0.06)]`}>
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
                  val ? 'bg-brand shadow-[0_0_8px_#86e64a] animate-pulse group-hover:scale-105' : 'bg-line/25'
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
                  val ? 'bg-brand shadow-[0_0_8px_#86e64a] animate-pulse group-hover:scale-105' : 'bg-line/25'
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
      <div className={`relative overflow-hidden mt-auto ${pill} p-4 border border-line/40 transition-all duration-300 group-hover:border-brand/40 group-hover:scale-[1.02] group-hover:shadow-[0_12px_32px_rgba(134,230,74,0.08)] text-left`}>
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
                    ? 'bg-brand/80 scale-100 group-hover:scale-y-115 group-hover:bg-brand shadow-[0_0_6px_#86e64a]'
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

const steps = [
  { icon: Plug, title: 'Connect', text: 'OAuth into Workspace, Slack, GitHub, Zoho. Read-only. 15 minutes.' },
  { icon: ScanSearch, title: 'Discover', text: 'Grants, logs, DNS and fingerprints surface every agent and MCP.' },
  { icon: ShieldCheck, title: 'Govern', text: 'Owner, risk score, kill switch. Drift alerts in real time.' },
]

const features = [
  { icon: UserX, title: 'Orphaned agents', text: 'Owner leaves IdP — agents flagged, one click from revocation.' },
  { icon: Fingerprint, title: 'Fingerprinting', text: '24/7 heatmap separates machine cadence from human rhythm.' },
  { icon: ServerCog, title: 'Shadow MCP', text: 'Map every server, launcher, and the data it can reach.' },
  { icon: Waypoints, title: 'Identity graph', text: 'Blast radius and drift become simple graph queries.' },
  { icon: KeyRound, title: 'Credential sprawl', text: 'OAuth grants and tokens tracked as agents multiply.' },
  { icon: Power, title: 'Kill switch', text: 'Revoke every grant from one button. Stops in one sync.' },
]

const marquee = ['Zintellix', 'BharatFin', 'MedSync', 'CloudKart', 'Kirana+', 'NovaPay', 'SkyDesk', 'FinLoop']

const testimonials = [
  {
    quote:
      "First scan found 31 agents we didn't know existed — including two on a former employee's credentials.",
    who: 'CISO, Indian fintech · 400 employees',
  },
  {
    quote: 'AI governance went from a quarterly spreadsheet to a live control. Auditor pulls evidence herself.',
    who: 'Head of Security, healthcare SaaS · 250 employees',
  },
]

export default function Home() {
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

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
      {/* Hero — Timbal rhythm */}
      <section className="relative overflow-hidden px-4 pt-16 pb-6 sm:px-6 sm:pt-20">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(134,230,74,0.22),transparent_70%)] blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-20 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(11,31,24,0.06),transparent_70%)] blur-2xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-accent text-4xl text-forest sm:text-5xl">Orbita</p>

          <Link
            to="/blog"
            className="mt-5 inline-flex items-center gap-2 rounded-btn border border-line bg-card/90 px-4 py-1.5 text-xs font-semibold text-forest shadow-soft backdrop-blur"
          >
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase">
              New
            </span>
            Shadow MCP discovery is live
            <ArrowRight size={12} aria-hidden="true" />
          </Link>

          <h1 className="mt-7 text-[2.4rem] leading-[1.06] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
            See every shadow AI agent in your{' '}
            <span className="font-accent text-[1.08em] text-sub/80">enterprise</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-sub sm:text-lg">
            Zapier bots, custom GPTs, rogue MCP servers — Orbita finds the invisible workforce in 24
            hours, names an owner, and scores every risk.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-btn bg-ink px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start free discovery scan
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-btn border border-line bg-card px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30"
            >
              Open live demo
            </Link>
          </div>
        </div>

        <DashboardStage />
      </section>

      {/* Logo strip */}
      <section className="border-y border-line py-10" aria-label="Trusted by">
        <p className="text-center text-xs font-medium tracking-wide text-sub">
          Trusted by security teams across industries
        </p>
        <div className="mt-5 overflow-hidden">
          <div className="marquee-track flex w-max gap-16">
            {[...marquee, ...marquee].map((n, i) => (
              <span key={i} className="text-lg font-semibold whitespace-nowrap text-sub/45">
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stack modules — Timbal-scale 8-up */}
      <section id="platform" className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-label="Platform">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="text-left max-w-2xl">
              <h2 className="text-[2rem] font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] leading-tight">
                Full agent governance. One platform.
              </h2>
              <p className="mt-4 text-base text-sub sm:text-lg">
                Discovery, ownership, risk, and revocation — built for shadow AI.
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
              <article className="mod-card group flex h-[380px] flex-col rounded-[22px] bg-[#eef0ed] p-7 sm:p-8 cursor-pointer select-none">
                <h3 className="text-[1.35rem] font-bold tracking-tight text-ink sm:text-2xl">{m.name}</h3>
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

      {/* We built the features everybody missed — timbal-style bento */}
      <section
        className="border-t border-line/40 bg-white py-20 sm:py-24"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <header className="mx-auto max-w-3xl text-center">
              <h2 className="text-[28px] leading-tight font-medium tracking-tight text-[#1a1c21] sm:text-[36px]">
                We built the features everybody missed.
              </h2>
              <p className="text-[28px] leading-tight font-medium tracking-tight text-[#86868a] sm:text-[36px]">
                All in one place. Owned by you.
              </p>
            </header>
          </Reveal>

          <Reveal>
            <ul className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* 1. Exportable code — draggable-style code stack */}
              <li className="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white p-6 sm:p-7 lg:col-span-6 lg:min-h-[440px]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:opacity-100"
                  style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(0,87,243,0.05), transparent 60%)' }}
                />
                <div className="relative z-10 flex h-full flex-col">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-[#1a1c21] sm:text-[22px]">
                      Everything you audit is exportable code.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-[#86868a] sm:text-[14px]">
                      No black boxes. No vendor lock-in. Every event, session trace, and compliance
                      checklist compiles down to clean, auditor-ready JSON and signed PDFs you can
                      read, edit, run locally, and self-host.
                    </p>
                  </div>
                  <TbCodeStack />
                </div>
              </li>

              {/* 2. ACE — dark card with rising stat bars */}
              <li className="relative isolate flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-7 lg:col-span-6 lg:min-h-[440px]">
                <div className="relative z-10 flex h-full flex-col">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-white sm:text-[22px]">
                      ACE: Proven reliability, at a fraction of the cost.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-white/60 sm:text-[15px]">
                      The Action Control Engine is a behavioral runtime that keeps agents consistent
                      in production, dropped in as a security proxy in front of any LLM.
                    </p>
                  </div>
                  <TbAceStats />
                </div>
              </li>

              {/* 3. Proprietary tech — scramble text */}
              <li className="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white p-6 sm:p-7 lg:col-span-5 lg:min-h-[320px]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:opacity-100"
                  style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(0,87,243,0.05), transparent 60%)' }}
                />
                <div className="relative z-10 flex h-full flex-col">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-[#1a1c21] sm:text-[22px]">
                      Proprietary technology, not a wrapper.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#86868a] sm:text-[15px]">
                      Our set of developer-first security products enhances the overall building
                      experience. AI Framework, Hybrid DB engine, ACE, CLI, SDK, and MCP, all built
                      in-house, all working together.
                    </p>
                  </div>
                  <div aria-hidden="true" className="relative mt-6 flex w-full flex-1 items-center justify-center overflow-hidden px-2 text-center" style={{ minHeight: 140 }}>
                    <TbScrambleText words={['Hybrid DB', 'ACE', 'AI Framework', 'CLI', 'SDK', 'MCP']} />
                  </div>
                </div>
              </li>

              {/* 4. Three layers — isometric stack */}
              <li className="relative isolate flex flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white p-6 sm:p-7 lg:col-span-7 lg:min-h-[320px]">
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-[#1a1c21] sm:text-[22px]">
                      Three layers. One platform.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#86868a] sm:text-[15px]">
                      Data, intelligence, and interface — a clean separation of security layers that
                      scales from a single agent to enterprise-wide AI infrastructure.
                    </p>
                  </div>
                  <TbIsoStack />
                </div>
              </li>

              {/* 5. Deploy anywhere — cycling tiles */}
              <li className="relative isolate flex flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white p-6 sm:p-7 lg:col-span-6 lg:min-h-[320px]">
                <div className="relative z-10 flex h-full flex-col">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-[#1a1c21] sm:text-[22px]">
                      Deploy anywhere, no compromises.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#86868a] sm:text-[15px]">
                      Our cloud, your VPC, or your own racks. Multi-tenant, dedicated, or fully
                      on-premise. Optimized for portability, scalability and performance.
                    </p>
                  </div>
                  <TbDeployGrid />
                </div>
              </li>

              {/* 6. Integrations — masked logo marquee */}
              <li className="relative isolate flex flex-col overflow-hidden rounded-2xl border border-[#efefef] bg-white p-6 sm:p-7 lg:col-span-6 lg:min-h-[320px]">
                <div className="relative z-10 flex h-full flex-col">
                  <div>
                    <h3 className="text-[20px] leading-snug font-medium tracking-tight text-[#1a1c21] sm:text-[22px]">
                      100+ integrations. Every MCP. Custom tools.
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-[#86868a] sm:text-[15px]">
                      Connect to your existing stack out of the box, securely plug in any MCP
                      server, or build custom tools and integrations in minutes.
                    </p>
                  </div>
                  <TbLogoMarquee />
                </div>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Built to pass the security review (timbal-style bento) */}
      <section className="bg-white" style={{ fontFamily: TB_FONT }}>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <header className="mx-auto max-w-3xl text-center">
              <h2
                className="text-[1.9rem] leading-[1.15] font-medium tracking-[-0.015em] sm:text-[2.25rem]"
                style={{ color: TB_INK }}
              >
                Built to pass the security review.
              </h2>
              <p
                className="mt-1 text-[1.9rem] leading-[1.15] font-medium tracking-[-0.015em] sm:text-[2.25rem]"
                style={{ color: TB_SUB }}
              >
                Evidence your security team can verify.
              </p>
            </header>
          </Reveal>

          <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-3 lg:grid-cols-12">
            {/* Card 1: Cloud, VPC, or on-prem (span 5) */}
            <li className="lg:col-span-5">
              <Reveal className="h-full">
                <article className="group flex h-full flex-col rounded-2xl border border-[#efefef] bg-white p-6 transition-colors duration-200 hover:border-[#e2e2e2] sm:p-7">
                  <h3 className="text-[18px] leading-snug font-medium sm:text-[19px]" style={{ color: TB_INK }}>
                    Cloud, VPC, or on-prem
                  </h3>
                  <p className="mt-2.5 max-w-[56ch] text-[14px] leading-[1.65] sm:text-[15px] sm:leading-[1.6]" style={{ color: TB_SUB }}>
                    Run Orbita on AWS, Azure, GCP, inside your VPC, or fully on-premises. The same
                    API and governance model follow every deployment.
                  </p>
                  <div className="mt-6 flex-1">
                    <CloudCycler />
                  </div>
                </article>
              </Reveal>
            </li>

            {/* Card 2: Governance and compliance (span 7) */}
            <li className="lg:col-span-7">
              <Reveal className="h-full" delay={70}>
                <article className="group flex h-full flex-col rounded-2xl border border-[#efefef] bg-white p-6 transition-colors duration-200 hover:border-[#e2e2e2] sm:p-7">
                  <h3 className="text-[18px] leading-snug font-medium sm:text-[19px]" style={{ color: TB_INK }}>
                    Governance and compliance
                  </h3>
                  <p className="mt-2.5 max-w-[56ch] text-[14px] leading-[1.65] sm:text-[15px] sm:leading-[1.6]" style={{ color: TB_SUB }}>
                    Security evidence, encryption at rest and in transit, audit logs, and compliance
                    documentation are ready for review without slowing the rollout.
                  </p>
                  <div className="mt-6 flex flex-1 flex-col items-center justify-center py-2">
                    <ul className="flex w-full flex-wrap items-start justify-center gap-4 sm:gap-5 lg:justify-around">
                      <TbSeal variant="soc2" label="SOC 2 Type II*" />
                      <TbSeal variant="iso" label="ISO 27001" />
                      <TbSeal variant="gdpr" label="GDPR" />
                      <TbSeal variant="dpdp" label="DPDP Act" />
                    </ul>
                    <p className="mt-5 max-w-[42ch] text-center text-[9px] leading-snug sm:text-[10px]" style={{ color: '#a8a8ac' }}>
                      * SOC 2 Type II audit in progress.
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>

            {/* Card 3: India data hosting (span 7, dark) */}
            <li className="lg:col-span-7">
              <Reveal className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-7">
                  <h3 className="text-[18px] leading-snug font-medium text-white sm:text-[19px]">
                    India data hosting
                  </h3>
                  <p className="mt-2.5 max-w-[56ch] text-[14px] leading-[1.65] text-white/65 sm:text-[15px] sm:leading-[1.6]">
                    Choose India region deployments for storage and processing. Keep data residency
                    aligned with DPDP requirements and your contractual controls.
                  </p>
                  <div className="mt-6 flex-1">
                    <IndiaRings />
                  </div>
                </article>
              </Reveal>
            </li>

            {/* Card 4: Platform agnostic (span 5) */}
            <li className="lg:col-span-5">
              <Reveal className="h-full" delay={70}>
                <article className="group flex h-full flex-col rounded-2xl border border-[#efefef] bg-white p-6 transition-colors duration-200 hover:border-[#e2e2e2] sm:p-7">
                  <h3 className="text-[18px] leading-snug font-medium sm:text-[19px]" style={{ color: TB_INK }}>
                    Platform agnostic
                  </h3>
                  <p className="mt-2.5 max-w-[56ch] text-[14px] leading-[1.65] sm:text-[15px] sm:leading-[1.6]" style={{ color: TB_SUB }}>
                    Discover agents wherever they run: Zapier, Make, n8n, Custom GPTs, MCP servers,
                    or any platform that leaves an audit trail. Add sources without re-instrumenting
                    a thing.
                  </p>
                  <div className="mt-6 flex-1">
                    <PlatformWheel />
                  </div>
                </article>
              </Reveal>
            </li>
          </ul>
        </div>
      </section>

      {/* Built for Developers (timbal-style dark bento) */}
      <section id="developers" className="bg-[#0a0a0a]" style={{ fontFamily: TB_FONT }}>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[14px] leading-none font-medium text-white/55">Built for Developers</p>
                <h2 className="mt-4 text-[28px] leading-tight font-medium tracking-tight text-white sm:text-[36px]">
                  Built by developers, for developers.
                </h2>
              </div>
              <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
                {/* TODO: point at the real repo / docs once public */}
                <a
                  href="https://github.com/orbita-ai"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/10"
                >
                  View on GitHub
                </a>
                <a
                  href="#developers"
                  className="inline-flex h-9 items-center justify-center rounded-full bg-white px-4 text-[13px] font-medium text-[#1a1c21] transition-opacity hover:opacity-90"
                >
                  Read the docs
                </a>
              </div>
            </header>
          </Reveal>

          <ul className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-flow-dense lg:grid-cols-12">
            {/* ACE: big card, span 7 × 2 rows */}
            <li className="col-span-1 h-full min-h-0 md:col-span-2 lg:col-span-7 lg:row-span-2">
              <Reveal className="h-full">
                <article className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-[border-color,background-color] duration-200 hover:border-white/20 hover:bg-white/[0.04] sm:p-6">
                  <div className="flex min-h-[300px] flex-shrink-0 items-center justify-center overflow-hidden sm:min-h-[380px]">
                    <TbRadarSweep />
                  </div>
                  <div className="mt-5 flex flex-1 flex-col justify-end">
                    <h3 className="text-[15px] leading-snug font-medium text-white sm:text-[16px]">Discovery Engine</h3>
                    <p className="mt-2 text-[13px] leading-[1.55] text-white/55 sm:text-[14px]">
                      Point Orbita at your stack and every agent surfaces — fingerprinted,
                      risk-scored, and written to the audit ledger. Shadow agents included.
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>

            {/* Python framework: span 5 */}
            <li className="col-span-1 h-full min-h-0 lg:col-span-5">
              <Reveal className="h-full" delay={60}>
                <article className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-[border-color,background-color] duration-200 hover:border-white/20 hover:bg-white/[0.04] sm:p-6">
                  <div className="flex min-h-[150px] flex-shrink-0 items-center justify-center overflow-hidden lg:min-h-[180px]">
                    <div className="flex w-full max-w-[260px] flex-col gap-3 rounded-xl border border-white/10 bg-black/60 p-4 font-mono">
                      <div className="flex items-center gap-2 text-[12px]">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#3b82f6]" />
                        <span className="text-[#93c5fd]">v0.7.0</span>
                      </div>
                      <div className="text-[10px] tracking-[0.08em] text-white/45">PYTHON · TYPESCRIPT</div>
                      <div className="flex h-5 items-end justify-between gap-[3px]" aria-hidden="true">
                        {tbBars.map((bh, i) => (
                          <span
                            key={i}
                            className="rounded-[1px]"
                            style={{
                              width: 1,
                              height: bh,
                              background:
                                i === tbBars.length - 1
                                  ? '#3b82f6'
                                  : i === tbBars.length - 2
                                    ? 'rgba(59,130,246,0.55)'
                                    : 'rgba(255,255,255,0.12)',
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-[10px] text-white/45">Released Jun 2026</div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-1 flex-col justify-end">
                    <h3 className="text-[15px] leading-snug font-medium text-white sm:text-[16px]">Python framework</h3>
                    <p className="mt-2 text-[13px] leading-[1.55] text-white/55 sm:text-[14px]">
                      The fastest Python stack for discovery and audit workflows. Open source,
                      stream-native, tracing and MCP included.
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>

            {/* Hybrid DB: span 5 */}
            <li className="col-span-1 h-full min-h-0 lg:col-span-5">
              <Reveal className="h-full" delay={120}>
                <article className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-[border-color,background-color] duration-200 hover:border-white/20 hover:bg-white/[0.04] sm:p-6">
                  <div className="flex min-h-[150px] flex-shrink-0 items-center justify-center overflow-hidden lg:min-h-[180px]">
                    <div className="relative h-[150px] w-full overflow-hidden rounded-xl lg:h-[180px]">
                      <TbDataCanvas />
                    </div>
                  </div>
                  <div className="mt-5 flex flex-1 flex-col justify-end">
                    <h3 className="text-[15px] leading-snug font-medium text-white sm:text-[16px]">Hybrid DB</h3>
                    <p className="mt-2 text-[13px] leading-[1.55] text-white/55 sm:text-[14px]">
                      Vectors, full-text, and SQL together. Agent fingerprints, session traces, and
                      rollups in one query plan.
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>

            {/* TypeScript SDK: span 4 */}
            <li className="col-span-1 h-full min-h-0 lg:col-span-4">
              <Reveal className="h-full">
                <article className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-[border-color,background-color] duration-200 hover:border-white/20 hover:bg-white/[0.04] sm:p-6">
                  <div className="flex min-h-[132px] flex-shrink-0 items-center justify-center overflow-hidden lg:min-h-[156px]">
                    <div className="relative h-full min-h-[132px] w-full lg:min-h-[156px]">
                      <div className="absolute inset-x-0 top-0 overflow-hidden rounded-xl border border-white/10 bg-black/70">
                        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-4 py-2">
                          <div className="flex items-center gap-1.5" aria-hidden="true">
                            <span className="h-2 w-2 rounded-full bg-white/15" />
                            <span className="h-2 w-2 rounded-full bg-white/15" />
                            <span className="h-2 w-2 rounded-full bg-white/15" />
                          </div>
                          <span className="ml-1 truncate text-[11px] font-medium text-white/55">audit.ts</span>
                        </div>
                        <div className="flex px-4 py-3 font-mono">
                          <div
                            className="flex shrink-0 select-none flex-col items-end pr-2.5 text-[10.5px] text-white/25"
                            style={{ lineHeight: '19.8px' }}
                            aria-hidden="true"
                          >
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                              <span key={n}>{n}</span>
                            ))}
                          </div>
                          <pre className="m-0 min-w-0 flex-1 overflow-hidden whitespace-pre text-[12px] leading-[1.65]">
                            <span className="text-[#c792ea]">import</span>
                            <span className="text-white"> Orbita </span>
                            <span className="text-[#c792ea]">from</span>
                            <span className="text-[#a8d4a2]"> "@orbita/sdk"</span>
                            <span className="text-[#a3a3a3]">;</span>
                            {'\n\n'}
                            <span className="text-[#c792ea]">const</span>
                            <span className="text-[#e4e4e4]"> res </span>
                            <span className="text-[#a3a3a3]">= </span>
                            <span className="text-[#c792ea]">await</span>
                            <span className="text-[#e4e4e4]"> orbita.scan(</span>
                            <span className="text-[#a8d4a2]">"workspace"</span>
                            <span className="text-[#e4e4e4]">, {'{'}</span>
                            {'\n'}
                            <span className="text-[#e4e4e4]">  target: </span>
                            <span className="text-[#a8d4a2]">"zapier-prod"</span>
                            <span className="text-[#a3a3a3]">,</span>
                            {'\n'}
                            <span className="text-[#e4e4e4]">{'}'});</span>
                          </pre>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#111111] to-transparent" />
                    </div>
                  </div>
                  <div className="mt-5 flex flex-1 flex-col justify-end">
                    <h3 className="text-[15px] leading-snug font-medium text-white sm:text-[16px]">TypeScript SDK</h3>
                    <p className="mt-2 text-[13px] leading-[1.55] text-white/55 sm:text-[14px]">
                      Your inventory and risk scores from React, Node, or Bun. One client
                      everywhere.
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>

            {/* MCP: span 4 */}
            <li className="col-span-1 h-full min-h-0 lg:col-span-4">
              <Reveal className="h-full" delay={60}>
                <article className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-[border-color,background-color] duration-200 hover:border-white/20 hover:bg-white/[0.04] sm:p-6">
                  <div className="flex min-h-[132px] flex-shrink-0 items-center justify-center overflow-hidden lg:min-h-[156px]">
                    <div className="flex h-full w-full items-center justify-center px-3">
                      <div className="flex w-full max-w-[300px] items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.035] px-3 py-2">
                        <span className="relative flex h-2 w-2 flex-shrink-0" aria-hidden="true">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-white/85" />
                        </span>
                        <span className="flex-1 truncate font-mono text-[12px] leading-none tracking-tight">
                          <span className="text-white/35">https://</span>
                          <span className="text-white/95">api.orbita.dev</span>
                          <span className="text-white/65">/mcp</span>
                        </span>
                        <span className="font-mono text-[9px] tracking-tight text-white/45">MCP</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-1 flex-col justify-end">
                    <h3 className="text-[15px] leading-snug font-medium text-white sm:text-[16px]">MCP</h3>
                    <p className="mt-2 text-[13px] leading-[1.55] text-white/55 sm:text-[14px]">
                      Point tools at api.orbita.dev/mcp. Your inventory and audit ledger, no glue
                      code.
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>

            {/* CLI: span 4 */}
            <li className="col-span-1 h-full min-h-0 md:col-span-2 lg:col-span-4">
              <Reveal className="h-full" delay={120}>
                <article className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-[border-color,background-color] duration-200 hover:border-white/20 hover:bg-white/[0.04] sm:p-6">
                  <div className="flex min-h-[132px] flex-shrink-0 items-center justify-center overflow-hidden lg:min-h-[156px]">
                    <pre className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-black/60 px-4 py-3 font-mono text-[12px] leading-[1.8]">
                      <code>
                        <span className="block text-white/55">$ orbita connect slack</span>
                        <span className="block text-white/55">$ orbita scan --all</span>
                        <span className="block text-white/80">→ discovered: 147 agents</span>
                        <span className="block text-white/80">→ report: orbita.dev/r/scan-4471</span>
                      </code>
                    </pre>
                  </div>
                  <div className="mt-5 flex flex-1 flex-col justify-end">
                    <h3 className="text-[15px] leading-snug font-medium text-white sm:text-[16px]">CLI</h3>
                    <p className="mt-2 text-[13px] leading-[1.55] text-white/55 sm:text-[14px]">
                      Auth, connect, scan locally, push reports to the cloud. One binary, no Docker
                      or Python.
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          </ul>
        </div>
      </section>

      {/* Product tour (timbal-style scroll-spy) */}
      <section id="tour" className="bg-[#0a0a0a]" style={{ fontFamily: TB_FONT }}>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal>
            <header className="max-w-3xl">
              <p className="text-[14px] leading-none font-medium text-[#86e64a]">Product tour</p>
              <h2 className="mt-4 text-[28px] leading-tight font-medium tracking-tight text-white sm:text-[36px]">
                Everything you need to see and govern agents in production.
              </h2>
            </header>
          </Reveal>
          <TbProductTour />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-muted/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center text-3xl font-extrabold tracking-tight">Visible in an afternoon</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-sub">
              No SDKs. No agent instrumentation. Orbita watches where agents already leave footprints.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <article className="h-full rounded-[22px] bg-card p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest text-brand">
                      <s.icon size={18} aria-hidden="true" />
                    </span>
                    <span className="text-[11px] font-bold tracking-wider text-sub uppercase">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sub">{s.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight">
            Built for questions your auditor asks
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <article className="h-full rounded-[22px] border border-line bg-card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-forest">
                  <f.icon size={18} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sub">{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <Reveal>
        <section className="border-y border-line bg-card py-14" aria-label="Key stats">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 text-center sm:grid-cols-3 sm:px-6">
            {[
              ['147', 'agents in median first scan'],
              ['24 hrs', 'connector → full inventory'],
              ['6%', 'discovered agents orphaned'],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="text-4xl font-extrabold tracking-tight">{num}</p>
                <p className="mt-2 text-sm text-sub">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" aria-label="Testimonials">
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <Reveal key={t.who}>
              <figure className="h-full rounded-[22px] bg-muted p-8">
                <blockquote className="text-lg leading-relaxed font-medium tracking-tight">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 text-sm text-sub">{t.who}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-label="From the blog">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">From the ledger</h2>
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
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-[28px] bg-forest px-8 py-14 text-center text-white">
            <div
              className="absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
              aria-hidden="true"
            />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
              See every agent by tomorrow
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-sm text-white/55">
              Free discovery scan · read-only access · data stays in India
            </p>
            <Link
              to="/signup"
              className="relative mt-8 inline-flex items-center gap-2 rounded-btn bg-brand px-7 py-3.5 text-sm font-bold text-forest transition-opacity hover:opacity-90"
            >
              Start the free scan
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  )
}
