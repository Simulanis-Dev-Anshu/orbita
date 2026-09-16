import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import BrandMark from '../../components/BrandMark.jsx'
import ThemeToggle from '../../components/ThemeToggle.jsx'
import HeroAsciiBackground from '../../components/hero/HeroAsciiBackground.jsx'
import useSeo from '../../hooks/useSeo.js'
import { endpoints, setTokens } from '../../lib/api.js'
import { DEMO_ACCOUNT, enterDemoMode, matchesDemoAccount } from '../../lib/demoSession.js'
import { isAuthed, setAuthed } from '../../auth.js'

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1 -2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  )
}

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const location = useLocation()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState(isSignup ? '' : DEMO_ACCOUNT.email)
  const [password, setPassword] = useState(isSignup ? '' : DEMO_ACCOUNT.password)
  const panelMouse = useRef({ x: 0, y: 0 })

  const onPanelPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    panelMouse.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
    panelMouse.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  const onPanelPointerLeave = () => {
    panelMouse.current.x = 0
    panelMouse.current.y = 0
  }

  useSeo({
    title: isSignup ? 'Sign up — Orbita' : 'Log in — Orbita',
    description: isSignup
      ? 'Create an Orbita account and run a free read-only discovery scan of the AI agents in your company.'
      : 'Log in to Orbita to view your agent inventory, risk scores and compliance evidence.',
    path: isSignup ? '/signup' : '/login',
    noindex: true,
  })

  useEffect(() => {
    if (isAuthed()) navigate('/app', { replace: true })
  }, [navigate])

  const goApp = () => {
    const from = location.state?.from || '/app'
    navigate(from, { replace: true })
  }

  const enterDemo = () => {
    enterDemoMode()
    setAuthed()
    goApp()
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!isSignup && matchesDemoAccount(email, password)) {
      enterDemo()
      setLoading(false)
      return
    }
    try {
      const pair = isSignup
        ? await endpoints.signup({ email, password, name: name || email.split('@')[0] })
        : await endpoints.login({ email, password })
      setTokens(pair)
      setAuthed()
      goApp()
    } catch (err) {
      if (matchesDemoAccount(email, password) || (!isSignup && password === DEMO_ACCOUNT.password)) {
        enterDemo()
      } else {
        setError(err.message || 'Could not sign in. Use the demo account below to try the product offline.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-2">
      {/* Brand panel */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden bg-[#0a0402] p-10 text-[#fffaf8] lg:flex"
        onPointerMove={onPanelPointerMove}
        onPointerLeave={onPanelPointerLeave}
      >
        <HeroAsciiBackground mouse={panelMouse} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0402]/75 via-[#0a0402]/35 to-[#0a0402]/85"
        />
        <Link to="/" className="relative z-10 flex w-fit items-center gap-2.5">
          <BrandMark size={36} invert />
          <span className="font-display text-lg tracking-tight">Orbita</span>
        </Link>

        <div className="relative z-10">
          <p className="font-display text-3xl leading-snug">
            "The first scan found 31 agents we didn't know existed."
          </p>
          <p className="mt-4 text-[15px] text-white/78">CISO, Indian fintech · 400 employees</p>
        </div>

        <div className="relative z-10 flex gap-8 text-sm">
          {[
            ['24 hrs', 'to full inventory'],
            ['Read-only', 'connectors'],
            ['India', 'data residency'],
          ].map(([a, b]) => (
            <div key={b}>
              <p className="font-bold text-brand">{a}</p>
              <p className="text-white/75">{b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="relative flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="absolute top-4 right-4">
          <ThemeToggle className="rounded-lg p-2" />
        </div>
        <div className="w-full max-w-sm">
          <Link to="/" className="flex w-fit items-center gap-2.5 lg:hidden">
            <BrandMark size={36} />
            <span className="font-display text-lg tracking-tight">Orbita</span>
          </Link>

          <h1 className="font-display mt-8 text-3xl tracking-tight lg:mt-0">
            {isSignup ? 'Start your free discovery scan' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">
            {isSignup
              ? 'No credit card. See every agent in 24 hours.'
              : 'Log in to your agent inventory.'}
          </p>

          <button
            type="button"
            onClick={() => navigate('/oauth-demo/login')}
            className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-btn border border-line bg-card px-4 py-3 text-sm font-semibold shadow-soft transition-colors hover:border-brand"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <p className="mt-3 rounded-btn bg-muted px-3 py-2 text-xs leading-relaxed text-sub">
            Demo workspace (no backend): <span className="font-semibold text-ink">{DEMO_ACCOUNT.email}</span>
            {' · '}
            <span className="font-semibold text-ink">{DEMO_ACCOUNT.password}</span>
          </p>
          {!isSignup ? (
            <button
              type="button"
              onClick={enterDemo}
              className="mt-2 w-full cursor-pointer text-xs font-semibold text-brand hover:underline"
            >
              Skip login · enter demo workspace
            </button>
          ) : null}

          <div className="my-6 flex items-center gap-3 text-xs text-sub">
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
            or with email
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {isSignup && (
              <>
                <label className="block">
                  <span className="text-xs font-semibold text-sub">Full name</span>
                  <input
                    required
                    autoComplete="name"
                    placeholder="Anshu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-btn border border-line bg-card px-3.5 py-3 text-sm shadow-soft outline-none transition-colors placeholder:text-sub/60 focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-sub">Company</span>
                  <input
                    required
                    autoComplete="organization"
                    placeholder="Orbita"
                    className="mt-1.5 w-full rounded-btn border border-line bg-card px-3.5 py-3 text-sm shadow-soft outline-none transition-colors placeholder:text-sub/60 focus:border-brand"
                  />
                </label>
              </>
            )}
            <label className="block">
              <span className="text-xs font-semibold text-sub">Work email</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-btn border border-line bg-card px-3.5 py-3 text-sm shadow-soft outline-none transition-colors placeholder:text-sub/60 focus:border-brand"
              />
            </label>
            <label className="block">
              <div className="flex justify-between">
                <span className="text-xs font-semibold text-sub">Password</span>
                {!isSignup && (
                  <button type="button" className="cursor-pointer text-xs font-semibold text-forest hover:underline">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-btn border border-line bg-card px-3.5 py-3 pr-11 text-sm shadow-soft outline-none transition-colors placeholder:text-sub/60 focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 text-sub hover:text-ink"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {error ? <p className="text-sm text-danger">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="ox-btn ox-btn-primary w-full cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                'Signing in…'
              ) : (
                <>
                  {isSignup ? 'Create account & start scan' : 'Log in'}
                  <ArrowRight size={15} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-sub">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-brand hover:underline">
                  Log in
                </Link>
              </>
            ) : (
              <>
                New to Orbita?{' '}
                <Link to="/signup" className="font-semibold text-brand hover:underline">
                  Start free
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
