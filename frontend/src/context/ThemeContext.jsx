import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

const ThemeContext = createContext(null)

const KEYS = { app: 'orbita-theme-app', site: 'orbita-theme-site' }
const DEFAULTS = { app: 'dark', site: 'light' }

function readStored(surface) {
  try {
    const value = localStorage.getItem(KEYS[surface])
    if (value === 'dark' || value === 'light') return value
  } catch {
    /* ignore */
  }
  return DEFAULTS[surface]
}

function applyTheme(theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

export function ThemeProvider({ children }) {
  const { pathname } = useLocation()
  const surface = pathname.startsWith('/app') ? 'app' : 'site'
  const [prefs, setPrefs] = useState(() => ({
    app: readStored('app'),
    site: readStored('site'),
  }))

  const theme = prefs[surface] ?? DEFAULTS[surface]

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      surface,
      toggle() {
        const next = theme === 'dark' ? 'light' : 'dark'
        setPrefs((prev) => ({ ...prev, [surface]: next }))
        try {
          localStorage.setItem(KEYS[surface], next)
        } catch {
          /* ignore */
        }
        applyTheme(next)
      },
    }),
    [theme, surface],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
