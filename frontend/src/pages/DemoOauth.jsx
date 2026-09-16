import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { applyDemoScan, enterDemoMode, OAUTH_CONSENT } from '../lib/demoSession.js'

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  )
}

export default function DemoOauth() {
  const { kind = 'google' } = useParams()
  const navigate = useNavigate()
  const meta = OAUTH_CONSENT[kind] || OAUTH_CONSENT.google
  const [step, setStep] = useState(kind === 'login' ? 'account' : 'account')
  const [busy, setBusy] = useState(false)

  const cancelTo = kind === 'login' ? '/login' : '/app/discovery?tab=sources'

  const finish = async () => {
    setBusy(true)
    setStep('working')
    await new Promise((r) => setTimeout(r, 1100))
    enterDemoMode()
    if (kind === 'login') {
      navigate('/app', { replace: true })
      return
    }
    const sample = applyDemoScan(kind)
    const created = sample?.created || 0
    navigate(`/app/discovery?tab=sources&${kind}=ok&created=${created}&updated=0`, { replace: true })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#f0f4f8] text-[#202124]">
      <p className="bg-[#1a1a1e] px-4 py-2 text-center text-[11px] font-semibold tracking-wide text-white/80">
        Orbita demo sandbox · simulated {meta.provider} consent · nothing is sent to {meta.provider}
      </p>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px] rounded-2xl border border-black/8 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2.5">
            {meta.provider === 'Google' ? <GoogleMark /> : null}
            <p className="text-lg font-medium">{meta.provider}</p>
          </div>

          {step === 'account' ? (
            <>
              <h1 className="mt-6 text-2xl font-normal tracking-tight">Choose an account</h1>
              <p className="mt-1 text-sm text-[#5f6368]">to continue to {meta.product}</p>
              <button
                type="button"
                onClick={() => setStep('consent')}
                className="mt-6 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-black/10 px-3 py-3 text-left hover:bg-[#f8f9fa]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1a73e8] text-sm font-semibold text-white">
                  A
                </span>
                <span>
                  <span className="block text-sm font-medium">{meta.account}</span>
                  <span className="block text-xs text-[#5f6368]">{meta.email}</span>
                </span>
              </button>
              <p className="mt-4 text-xs text-[#5f6368]">Acme Inc. · demo tenant</p>
            </>
          ) : null}

          {step === 'consent' ? (
            <>
              <h1 className="mt-6 text-2xl font-normal tracking-tight">
                {meta.product} wants to access your {meta.provider} Account
              </h1>
              <p className="mt-2 text-sm text-[#5f6368]">
                {meta.email}
              </p>
              <ul className="mt-5 space-y-3">
                {meta.scopes.map((scope) => (
                  <li key={scope} className="flex gap-2 text-sm">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#1a73e8]" aria-hidden="true" />
                    {scope}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-[#5f6368]">
                This is a local Orbita walkthrough. No tokens are issued and no Admin SDK or Graph
                call is made.
              </p>
              <div className="mt-8 flex justify-end gap-2">
                <Link
                  to={cancelTo}
                  className="rounded-full px-5 py-2 text-sm font-medium text-[#1a73e8] hover:bg-[#e8f0fe]"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  disabled={busy}
                  onClick={finish}
                  className="cursor-pointer rounded-full bg-[#1a73e8] px-6 py-2 text-sm font-medium text-white hover:bg-[#1557b0] disabled:opacity-60"
                >
                  {meta.allowLabel}
                </button>
              </div>
            </>
          ) : null}

          {step === 'working' ? (
            <div className="mt-8 text-center">
              <p className="text-lg font-medium">Connecting {meta.provider}…</p>
              <p className="mt-2 text-sm text-[#5f6368]">
                {kind === 'login' ? 'Opening your Acme demo workspace.' : 'Reading grants and writing them into inventory.'}
              </p>
              <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-black/5">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-[#1a73e8]" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
