import { useEffect, useRef, useState } from 'react'

const STEP_START = 700
const STEP_GAP = 780
const TYPE_MS = 16
const TYPE_CHARS = 2
const AFTER_STEPS = 400
const AFTER_TYPE = 500
const LOOP_PAUSE = 5200

export default function useSentinelStream({
  stepCount,
  summaryLength,
  animate = true,
  loop = false,
  runId = 0,
  onDone,
}) {
  const [visibleSteps, setVisibleSteps] = useState(animate ? 0 : stepCount)
  const [summaryLen, setSummaryLen] = useState(animate ? 0 : summaryLength)
  const [showAgents, setShowAgents] = useState(!animate)
  const [thoughtOpen, setThoughtOpen] = useState(true)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!animate || reduced) {
      setVisibleSteps(stepCount)
      setSummaryLen(summaryLength)
      setShowAgents(true)
      onDoneRef.current?.()
      return undefined
    }

    let cancelled = false
    const timers = []
    let typeInterval = null

    const clearType = () => {
      if (typeInterval) {
        clearInterval(typeInterval)
        typeInterval = null
      }
    }

    const run = () => {
      if (cancelled) return
      clearType()
      setVisibleSteps(0)
      setSummaryLen(0)
      setShowAgents(false)
      setThoughtOpen(true)

      for (let i = 0; i < stepCount; i += 1) {
        timers.push(
          setTimeout(() => {
            if (!cancelled) setVisibleSteps(i + 1)
          }, STEP_START + i * STEP_GAP),
        )
      }

      const afterSteps = STEP_START + stepCount * STEP_GAP + AFTER_STEPS
      timers.push(
        setTimeout(() => {
          if (cancelled) return
          let n = 0
          typeInterval = setInterval(() => {
            n += TYPE_CHARS
            if (cancelled) {
              clearType()
              return
            }
            if (n >= summaryLength) {
              setSummaryLen(summaryLength)
              clearType()
              timers.push(
                setTimeout(() => {
                  if (!cancelled) {
                    setShowAgents(true)
                    setThoughtOpen(false)
                    if (!loop) onDoneRef.current?.()
                  }
                }, AFTER_TYPE),
              )
              if (loop) {
                timers.push(
                  setTimeout(() => {
                    if (!cancelled) run()
                  }, LOOP_PAUSE),
                )
              }
            } else {
              setSummaryLen(n)
            }
          }, TYPE_MS)
        }, afterSteps),
      )
    }

    run()
    return () => {
      cancelled = true
      clearType()
      timers.forEach(clearTimeout)
    }
  }, [animate, loop, runId, stepCount, summaryLength])

  return { visibleSteps, summaryLen, showAgents, thoughtOpen, setThoughtOpen }
}
