import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AsciiRenderer } from '@react-three/drei'
import { MathUtils } from 'three'

const ORANGE = '#ff4d00'
const INK = '#170702'

function AsciiScene({ mouse, interactive }) {
  const core = useRef(null)
  const ring = useRef(null)
  const light = useRef(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const mx = interactive ? mouse.current.x : 0
    const my = interactive ? mouse.current.y : 0

    if (core.current) {
      core.current.rotation.y += delta * 0.28
      core.current.rotation.x = MathUtils.lerp(core.current.rotation.x, my * 0.55, 0.07)
      core.current.position.x = MathUtils.lerp(core.current.position.x, mx * 0.55, 0.06)
      core.current.position.y = MathUtils.lerp(core.current.position.y, my * 0.28, 0.06)
    }

    if (ring.current) {
      ring.current.rotation.x = t * 0.18 + my * 0.2
      ring.current.rotation.y = t * 0.32 + mx * 0.25
      ring.current.rotation.z = MathUtils.lerp(ring.current.rotation.z, mx * 0.4, 0.05)
    }

    if (light.current) {
      light.current.position.x = MathUtils.lerp(light.current.position.x, mx * 3.2, 0.12)
      light.current.position.y = MathUtils.lerp(light.current.position.y, my * 2.2, 0.12)
    }
  })

  return (
    <>
      <color attach="background" args={[INK]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[2.4, 1.6, 3]} intensity={1.4} color="#fff3ea" />
      <pointLight ref={light} position={[1.4, 0.6, 2.2]} intensity={2.6} color={ORANGE} distance={8} />

      <mesh ref={core}>
        <icosahedronGeometry args={[1.28, 1]} />
        <meshStandardMaterial color={ORANGE} roughness={0.28} metalness={0.35} />
      </mesh>

      <mesh ref={ring} scale={1.05}>
        <torusGeometry args={[1.85, 0.055, 8, 64]} />
        <meshStandardMaterial color="#ff8a4c" roughness={0.4} metalness={0.1} />
      </mesh>

      <mesh rotation={[Math.PI / 2.4, 0.4, 0.2]}>
        <torusGeometry args={[2.15, 0.03, 6, 48]} />
        <meshBasicMaterial color="#ff4d00" />
      </mesh>
    </>
  )
}

export default function HeroAsciiBackground({ mouse }) {
  const interactive = useMemo(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (window.matchMedia('(pointer: coarse)').matches) return false
    return true
  }, [])

  const reduced = useMemo(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  return (
    <div className="hero-ascii" aria-hidden="true">
      <Canvas
        dpr={1}
        camera={{ position: [0, 0, 4.1], fov: 42 }}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        frameloop={reduced ? 'demand' : 'always'}
        style={{ pointerEvents: 'none' }}
      >
        <AsciiScene mouse={mouse} interactive={interactive} />
        <AsciiRenderer
          fgColor={ORANGE}
          bgColor={INK}
          characters=" .:-=+*#%@"
          invert
          resolution={0.22}
        />
      </Canvas>
    </div>
  )
}
