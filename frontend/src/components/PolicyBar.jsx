import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie } from 'lucide-react'

const STORAGE_KEY = 'orbita-cookie-consent'
export const COOKIE_PREFS_EVENT = 'orbita:cookie-prefs'

// Cookie-consent banner. Named PolicyBar because ad blockers block any
// resource whose URL contains "cookieconsent" (Vite serves modules by path).
export default function PolicyBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    // "Cookie preferences" footer link re-opens the banner
    const reopen = () => setVisible(true)
    window.addEventListener(COOKIE_PREFS_EVENT, reopen)
    return () => window.removeEventListener(COOKIE_PREFS_EVENT, reopen)
  }, [])

  const choose = (value) => {
    localStorage.setItem(STORAGE_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="card-in fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-xl rounded-card border border-line bg-card p-5 shadow-lift"
    >
      <div className="flex items-start gap-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-forest">
          <Cookie size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">We keep cookies minimal</p>
          <p className="mt-1 text-xs leading-relaxed text-sub">
            Essential cookies keep you signed in securely. Optional analytics cookies help us
            improve the product — nothing is used for advertising or cross-site tracking. Details
            in our{' '}
            <Link to="/privacy#cookies" className="font-semibold text-forest hover:underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => choose('essential')}
          className="cursor-pointer rounded-btn border border-line bg-canvas px-4 py-2 text-xs font-semibold transition-colors hover:border-brand"
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => choose('all')}
          className="cursor-pointer rounded-btn bg-forest px-4 py-2 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
        >
          Accept all
        </button>
      </div>
    </div>
  )
}
