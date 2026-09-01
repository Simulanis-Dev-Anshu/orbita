import { Bot, ChevronDown, FileText } from 'lucide-react'
import useSentinelStream from '../hooks/useSentinelStream.js'

export function riskTone(risk) {
  if (risk >= 85) return 'bg-danger-soft text-danger'
  if (risk >= 70) return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

function riskText(risk) {
  if (risk >= 85) return 'text-danger'
  if (risk >= 70) return 'text-warn'
  return 'text-forest'
}

export function ThoughtRow({ step, index, visible }) {
  const Icon = step.Icon
  return (
    <li
      className={`flex h-7 items-center gap-2.5 text-[12.5px] leading-none transition-[opacity,filter,transform] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-1 opacity-0 blur-[3px]'
      }`}
      style={{ transitionDelay: visible ? `${index * 30}ms` : '0ms' }}
      aria-hidden={!visible}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sub">
        <Icon size={13} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="text-ink-2">{step.verb}</span>
      <span className="truncate rounded-[5px] bg-muted px-1.5 py-0.5 font-medium text-ink">{step.target}</span>
      {step.risk != null && (
        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${riskTone(step.risk)}`}>
          {step.risk}
        </span>
      )}
      <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-sub">{step.ms}</span>
    </li>
  )
}

export function AgentChip({ name, risk, delay, visible }) {
  return (
    <div
      className={`flex items-center gap-2 border border-line bg-card px-2.5 py-2 transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-1 scale-[0.98] opacity-0'
      }`}
      style={{ transitionDelay: visible ? `${delay}s` : '0s' }}
    >
      <span className="flex h-6 w-6 items-center justify-center bg-muted">
        <Bot size={12} className="text-brand" aria-hidden="true" />
      </span>
      <span className="text-[12px] font-medium text-ink">{name}</span>
      <span className={`ml-auto text-[11px] font-semibold tabular-nums ${riskText(risk)}`}>
        {risk}
      </span>
    </div>
  )
}

export default function SentinelReply({
  steps,
  summary,
  agents = [],
  evidence,
  animate = true,
  loop = false,
  runId = 0,
  onDone,
  children,
}) {
  const { visibleSteps, summaryLen, showAgents, thoughtOpen, setThoughtOpen } = useSentinelStream({
    stepCount: steps.length,
    summaryLength: summary.length,
    animate,
    loop,
    runId,
    onDone,
  })
  const thinking = visibleSteps < steps.length && summaryLen === 0

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1.5 flex h-5 items-center gap-2">
        <span className="text-[13px] font-medium text-ink">Sentinel</span>
        <span
          className={`inline-flex items-center gap-1 text-[11px] text-sub transition-opacity ${
            thinking ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="live-dot h-1 w-1 rounded-full bg-brand" />
          scanning
        </span>
      </div>

      <button
        type="button"
        onClick={() => setThoughtOpen((v) => !v)}
        className="mb-2 inline-flex h-5 cursor-pointer items-center gap-1 text-[12px] text-sub transition-colors hover:text-ink"
      >
        Thought for {Math.max(1, visibleSteps)}s
        <ChevronDown
          size={12}
          className={`transition-transform ${thoughtOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        className={`mb-3 overflow-hidden border-l border-line pl-3 transition-opacity duration-200 ${
          thoughtOpen ? 'opacity-100' : 'opacity-40'
        }`}
        style={{ height: `${steps.length * 28 + 28}px` }}
      >
        <ul>
          {steps.map((step, i) => (
            <ThoughtRow
              key={`${step.verb}-${step.target}`}
              step={step}
              index={i}
              visible={thoughtOpen && i < visibleSteps}
            />
          ))}
        </ul>
        <div
          className={`flex h-7 items-center gap-2 text-[12px] text-sub transition-opacity ${
            thinking && thoughtOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="stream-caret h-3.5 w-1.5 bg-brand" aria-hidden="true" />
          rendering…
        </div>
      </div>

      <p className="min-h-[63px] max-w-[58ch] text-[13.5px] leading-relaxed text-ink">
        {summaryLen > 0 ? summary.slice(0, summaryLen) : '\u00A0'}
        {summaryLen > 0 && summaryLen < summary.length && (
          <span className="stream-caret ml-0.5 inline-block h-[13px] w-[2px] bg-brand align-[-2px]" />
        )}
      </p>

      {agents.length > 0 && (
        <div className="mt-3 grid max-w-md grid-cols-1 gap-1.5 sm:grid-cols-2">
          {agents.map((a, i) => (
            <AgentChip key={a.name} name={a.name} risk={a.risk} delay={0.05 + i * 0.1} visible={showAgents} />
          ))}
        </div>
      )}

      {evidence && (
        <div
          className={`mt-3 flex h-[52px] max-w-xs items-center gap-2.5 border border-line bg-canvas px-3 transition-opacity duration-400 ${
            showAgents ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: showAgents ? '0.45s' : '0s' }}
        >
          <span className="flex h-8 w-8 items-center justify-center bg-danger-soft text-danger">
            <FileText size={14} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-ink">{evidence.file}</p>
            <p className="text-[11px] text-sub">{evidence.meta}</p>
          </div>
        </div>
      )}

      {children && showAgents ? <div className="mt-3">{children}</div> : null}
    </div>
  )
}
