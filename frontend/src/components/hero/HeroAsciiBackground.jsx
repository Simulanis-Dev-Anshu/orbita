import { useEffect, useRef } from 'react'

const ORANGE = '#ff4d00'
const INK = '#0a0402'
const FLARE = '#fff1e6'

const CHARSET = '01#%&+*/<>[]{}=~^$'.split('')
const WORDS = [
  'SYS', 'ROOT', 'NODE', 'AUTH', 'SCAN', 'PORT', 'EXEC', 'LINK',
  'HASH', 'PROC', 'CORE', 'NET', 'KEY', 'SYNC', 'PING', 'LOAD',
]

const rand = (n) => Math.random() * n
const randInt = (n) => (Math.random() * n) | 0
const randChar = () => CHARSET[randInt(CHARSET.length)]

function randHex(len) {
  const h = '0123456789ABCDEF'
  let s = '0x'
  for (let i = 0; i < len; i++) s += h[randInt(16)]
  return s
}

function randToken() {
  return Math.random() < 0.5 ? WORDS[randInt(WORDS.length)] : randHex(4 + randInt(4))
}

/**
 * Hacking-terminal hero background.
 * A flat 2D character grid (no 3D geometry) that behaves like a live console:
 * ambient char flicker, tokens that "decrypt" line by line, occasional
 * horizontal glitch-slice bursts, and a mouse-driven disruption field.
 *
 * `mouse` is an optional ref of shape { current: { x, y } } with x/y in [-1, 1],
 * e.g. updated from a pointermove listener in the parent.
 */
export default function HeroAsciiBackground({ mouse }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d', { alpha: false })

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse =
      typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    const interactive = !reduced && !coarse

    let width = 0
    let height = 0
    let cellW = 0
    let cellH = 0
    let cols = 0
    let rows = 0
    let cells = []
    let fontSize = 15
    let raf = 0
    let lastDraw = 0
    const FRAME_INTERVAL = reduced ? 1000 / 12 : 1000 / 24

    let decrypts = []
    let nextDecryptAt = 0
    let nextGlitchAt = 0

    function buildGrid() {
      const rect = wrap.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      canvas.width = width
      canvas.height = height

      fontSize = width < 640 ? 12 : width < 1100 ? 14 : 16
      cellW = Math.round(fontSize * 0.62)
      cellH = Math.round(fontSize * 1.15)
      cols = Math.ceil(width / cellW) + 1
      rows = Math.ceil(height / cellH) + 1

      cells = new Array(cols * rows)
      for (let i = 0; i < cells.length; i++) {
        cells[i] = {
          char: randChar(),
          nextFlip: rand(2000),
          bright: Math.random() < 0.06,
        }
      }
      ctx.textBaseline = 'top'
      ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", ui-monospace, Menlo, monospace`
    }

    buildGrid()
    const ro = new ResizeObserver(buildGrid)
    ro.observe(wrap)

    function spawnDecrypt(t) {
      const row = randInt(rows)
      const token = randToken()
      const maxStart = Math.max(1, cols - token.length - 1)
      const col = randInt(maxStart)
      decrypts.push({ row, col, token, revealed: 0, born: t, speed: 40 + rand(60) })
    }

    function draw(t) {
      raf = requestAnimationFrame(draw)
      if (t - lastDraw < FRAME_INTERVAL) return
      lastDraw = t

      if (t > nextDecryptAt) {
        if (decrypts.length < 5) spawnDecrypt(t)
        nextDecryptAt = t + 220 + rand(500)
      }
      decrypts = decrypts.filter((d) => {
        if (t - d.born > d.speed) {
          d.revealed++
          d.born = t
        }
        return d.revealed <= d.token.length + 8
      })

      const mx = interactive ? mouse?.current?.x ?? 0 : 0
      const my = interactive ? mouse?.current?.y ?? 0 : 0
      const mouseCol = ((mx + 1) / 2) * cols
      const mouseRow = ((my + 1) / 2) * rows
      const mouseRadius = 6

      ctx.fillStyle = INK
      ctx.fillRect(0, 0, width, height)

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          const cell = cells[idx]

          if (t > cell.nextFlip) {
            cell.char = randChar()
            cell.nextFlip = t + 900 + rand(2600)
            cell.bright = Math.random() < 0.05
          }

          let char = cell.char
          let color = Math.random() < 0.5 ? 'rgba(255,77,0,0.35)' : 'rgba(255,138,76,0.18)'

          const d = Math.hypot(c - mouseCol, r - mouseRow)
          if (d < mouseRadius) {
            const f = 1 - d / mouseRadius
            if (Math.random() < f * 0.5) char = randChar()
            color = `rgba(255,77,0,${0.35 + f * 0.65})`
          }
          if (cell.bright) color = 'rgba(255,77,0,0.35)'

          ctx.fillStyle = color
          ctx.fillText(char, c * cellW, r * cellH)
        }
      }

      for (const d of decrypts) {
        for (let i = 0; i < d.token.length; i++) {
          const idx = d.row * cols + (d.col + i)
          if (idx < 0 || idx >= cells.length) continue
          const revealed = i < d.revealed
          ctx.fillStyle = revealed ? FLARE : ORANGE
          ctx.fillText(revealed ? d.token[i] : randChar(), (d.col + i) * cellW, d.row * cellH)
        }
      }

      if (t > nextGlitchAt) {
        nextGlitchAt = t + 1800 + rand(3200)
        const bandH = 6 + randInt(18)
        const y = randInt(Math.max(1, height - bandH))
        const shift = (Math.random() < 0.5 ? -1 : 1) * (6 + randInt(24))
        try {
          const strip = ctx.getImageData(0, y, width, bandH)
          ctx.putImageData(strip, shift, y)
          ctx.fillStyle = 'rgba(255,138,76,0.12)'
          ctx.fillRect(0, y, width, bandH)
        } catch {
          // getImageData can throw on tainted canvases
        }
      }
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [mouse])

  return (
    <div className="hero-ascii" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} className="hero-ascii__canvas" />
      <div className="hero-ascii__scanlines" />
      <div className="hero-ascii__vignette" />
      <svg className="hero-ascii__hud" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M2 10 V2 H10" />
        <path d="M90 2 H98 V10" />
        <path d="M98 90 V98 H90" />
        <path d="M10 98 H2 V90" />
      </svg>
    </div>
  )
}
