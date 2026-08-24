import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import BrandMark from '../../components/BrandMark.jsx'

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  )
}

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => navigate('/app'), 700) // mock auth
  }

  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-2">
      {/* Brand panel */}
      <div className="ox-plate relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-brand/15 blur-3xl" aria-hidden="true" />
        <Link to="/" className="relative flex w-fit items-center gap-2.5">
          <BrandMark size={36} invert />
          <span className="text-lg font-semibold">Orbita</span>
        </Link>

        <div className="relative">
          <p className="font-display text-3xl leading-snug">
            "The first scan found 31 agents we didn't know existed."
          </p>
          <p className="mt-4 text-sm text-white/60">CISO, Indian fintech · 400 employees</p>
        </div>

        <div className="relative flex gap-8 text-sm">
          {[
            ['24 hrs', 'to full inventory'],
            ['Read-only', 'connectors'],
            ['India', 'data residency'],
          ].map(([a, b]) => (
            <div key={b}>
              <p className="font-bold text-brand">{a}</p>
              <p className="text-white/60">{b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex w-fit items-center gap-2.5 lg:hidden">
            <BrandMark size={36} />
            <span className="text-lg font-semibold">Orbita</span>
          </Link>

          <h1 className="font-display mt-8 text-3xl tracking-tight lg:mt-0">
            {isSignup ? 'Start your free discovery scan' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-sub">
            {isSignup
              ? 'No credit card. See every agent in 24 hours.'
              : 'Log in to your agent inventory.'}
          </p>

          <button
            type="button"
            onClick={submit}
            className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-btn border border-line bg-card px-4 py-3 text-sm font-semibold shadow-soft transition-colors hover:border-brand"
          >
            <GoogleIcon />
            Continue with Google
          </button>

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
                    placeholder="Prabhhav"
                    className="mt-1.5 w-full rounded-btn border border-line bg-card px-3.5 py-3 text-sm shadow-soft outline-none transition-colors placeholder:text-sub/60 focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-sub">Company</span>
                  <input
                    required
                    autoComplete="organization"
                    placeholder="Zintellix"
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
