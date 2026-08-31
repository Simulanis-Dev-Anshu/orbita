// Behavioral fingerprint: 7 days x 24 hours activity intensity (0-3).
// Agents show flat machine-like patterns; humans cluster in business hours.

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Deterministic pseudo-random from agent id so the pattern is stable per agent.
function seeded(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

function buildMatrix(id, kind) {
  const rand = seeded(id + kind)
  return DAYS.map((_, day) =>
    Array.from({ length: 24 }, (_, hour) => {
      if (kind === 'agent') {
        // Machine: constant cadence day and night, tiny jitter
        return rand() > 0.12 ? 3 : 2
      }
      // Human: weekday business hours, quiet nights/weekends
      const weekend = day >= 5
      const working = hour >= 9 && hour <= 19
      if (weekend) return rand() > 0.85 ? 1 : 0
      if (working) return rand() > 0.3 ? (rand() > 0.5 ? 3 : 2) : 1
      return rand() > 0.9 ? 1 : 0
    }),
  )
}

const levelClass = ['bg-canvas', 'bg-brand/30', 'bg-brand/60', 'bg-brand']

function Grid({ matrix, label }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold text-sub">{label}</p>
      <div className="flex gap-1">
        <div className="grid grid-rows-7 gap-0.5 pr-1 text-[9px] leading-none text-sub">
          {DAYS.map((d, i) => (
            <span key={i} className="flex h-2 items-center">{d}</span>
          ))}
        </div>
        <div
          className="grid flex-1 grid-cols-24 gap-0.5"
          role="img"
          aria-label={`${label} activity heatmap over 7 days`}
        >
          {matrix.flatMap((row, d) =>
            row.map((v, h) => (
              <span key={`${d}-${h}`} className={`h-2 rounded-[2px] ${levelClass[v]}`} />
            )),
          )}
        </div>
      </div>
    </div>
  )
}

export default function FingerprintHeatmap({ agentId }) {
  return (
    <div className="space-y-3">
      <Grid matrix={buildMatrix(agentId, 'agent')} label="This identity" />
      <Grid matrix={buildMatrix(agentId, 'human')} label="Typical human baseline" />
      <p className="text-[11px] leading-relaxed text-sub">
        Flat 24/7 cadence with no weekend drop-off. Classifier confidence:{' '}
        <span className="font-semibold text-danger">98% machine</span>
      </p>
    </div>
  )
}
