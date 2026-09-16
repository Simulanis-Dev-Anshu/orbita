import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import { AgentsProvider } from './context/AgentsContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import MarketingLayout from './components/marketing/MarketingLayout.jsx'
import Home from './pages/marketing/Home.jsx'
import RadarLoader from './components/RadarLoader.jsx'
import PolicyBar from './components/PolicyBar.jsx'
import BootScreen from './components/motion/BootScreen.jsx'
import RouteFade from './components/motion/RouteFade.jsx'
import useSeo from './hooks/useSeo.js'
import { isDemoMode } from './lib/demoSession.js'

const DemoOauth = lazy(() => import('./pages/DemoOauth.jsx'))
const Identity = lazy(() => import('./pages/Identity.jsx'))
const Assets = lazy(() => import('./pages/Assets.jsx'))
const Discovery = lazy(() => import('./pages/Discovery.jsx'))
const RelationshipGraph = lazy(() => import('./pages/RelationshipGraph.jsx'))
const Risk = lazy(() => import('./pages/Risk.jsx'))
const Intelligence = lazy(() => import('./pages/Intelligence.jsx'))
const Remediation = lazy(() => import('./pages/Remediation.jsx'))
const Governance = lazy(() => import('./pages/Governance.jsx'))
const Alerts = lazy(() => import('./pages/Alerts.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const Pricing = lazy(() => import('./pages/marketing/Pricing.jsx'))
const Blog = lazy(() => import('./pages/marketing/Blog.jsx'))
const BlogPost = lazy(() => import('./pages/marketing/BlogPost.jsx'))
const AuthPage = lazy(() => import('./pages/marketing/AuthPage.jsx'))
const About = lazy(() => import('./pages/marketing/About.jsx'))
const Privacy = lazy(() => import('./pages/marketing/Privacy.jsx'))
const Terms = lazy(() => import('./pages/marketing/Terms.jsx'))
const Cookies = lazy(() => import('./pages/marketing/Cookies.jsx'))
const Security = lazy(() => import('./pages/marketing/Security.jsx'))
const Contact = lazy(() => import('./pages/marketing/Contact.jsx'))
const NotFound = lazy(() => import('./pages/marketing/NotFound.jsx'))

function PageLoader() {
  return (
    <div className="mt-6 flex h-[60dvh] items-center justify-center rounded-card">
      <RadarLoader />
    </div>
  )
}

const pageMeta = {
  '/app': { title: 'Dashboard', subtitle: 'Every AI agent in your company, at a glance' },
  '/app/identity': {
    title: 'Identity',
    subtitle: 'Organization, OAuth, accounts and correlation',
  },
  '/app/discovery': {
    title: 'Discovery',
    subtitle: 'Connect sources, then inventory AI apps, extensions, local runtimes and MCP',
  },
  '/app/assets': {
    title: 'Assets',
    subtitle: 'Asset DB, inventory, MCP tools and data access',
  },
  '/app/relationships': {
    title: 'Relationship Graph',
    subtitle: 'USER → DEVICE → APP → AGENT → MCP → TOOL → DATA',
  },
  '/app/risk': {
    title: 'Risk Engine',
    subtitle: 'Scores, explanations, attack paths and blast radius',
  },
  '/app/intelligence': {
    title: 'Intelligence',
    subtitle: 'Security analyst, NL search and attack simulation',
  },
  '/app/remediation': {
    title: 'Remediation',
    subtitle: 'Recommended fixes and admin-approved actions',
  },
  '/app/governance': {
    title: 'Governance',
    subtitle: 'Policies, AI-BOM and compliance evidence',
  },
  '/app/alerts': { title: 'Alerts', subtitle: 'Permission drift and new-agent notifications' },
  '/app/settings': { title: 'Settings', subtitle: 'Workspace, team and billing' },
  '/app/help': { title: 'Help Center', subtitle: 'Guides, docs and support' },
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] ?? { title: 'Orbita', subtitle: '' }
  useSeo({
    title: `${meta.title} — Orbita`,
    description: meta.subtitle,
    path: pathname.startsWith('/app') ? pathname : `/app${pathname === '/' ? '' : pathname}`,
    noindex: true,
  })

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex min-h-dvh bg-canvas text-ink">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onSearchClick={() => setPaletteOpen(true)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onSearchClick={() => setPaletteOpen(true)}
        />

        {isDemoMode() ? (
          <p className="border-b border-line bg-muted px-4 py-1.5 text-center text-[11px] font-semibold text-sub sm:px-5 lg:px-6">
            Demo workspace · Acme Inc. · Connect Google/Microsoft/GitHub without a backend
          </p>
        ) : null}

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-10 sm:px-5 lg:px-6">
          <Suspense fallback={<PageLoader />}>
            <RouteFade>
              <Outlet />
            </RouteFade>
          </Suspense>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AgentsProvider>
        <BootScreen />
        <Suspense
          fallback={
            <div className="flex min-h-dvh items-center justify-center bg-canvas">
              <RadarLoader />
            </div>
          }
        >
          <Routes>
            <Route path="app" element={<AppShell />}>
              <Route index element={<Dashboard />} />
              <Route path="identity" element={<Identity />} />
              <Route path="discovery" element={<Discovery />} />
              <Route path="assets" element={<Assets />} />
              <Route path="relationships" element={<RelationshipGraph />} />
              <Route path="risk" element={<Risk />} />
              <Route path="intelligence" element={<Intelligence />} />
              <Route path="remediation" element={<Remediation />} />
              <Route path="governance" element={<Governance />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<ComingSoon name="Help Center" />} />
              <Route path="organization" element={<Navigate to="/app/identity?tab=organization" replace />} />
              <Route path="oauth" element={<Navigate to="/app/identity?tab=oauth" replace />} />
              <Route path="accounts" element={<Navigate to="/app/identity?tab=accounts" replace />} />
              <Route path="correlation" element={<Navigate to="/app/identity?tab=correlation" replace />} />
              <Route path="extensions" element={<Navigate to="/app/discovery?tab=extensions" replace />} />
              <Route path="local-ai" element={<Navigate to="/app/discovery?tab=local" replace />} />
              <Route path="inventory" element={<Navigate to="/app/assets?tab=inventory" replace />} />
              <Route path="connectors" element={<Navigate to="/app/discovery?tab=sources" replace />} />
              <Route path="copilot" element={<Navigate to="/app/intelligence?tab=analyst" replace />} />
              <Route path="compliance" element={<Navigate to="/app/governance?tab=compliance" replace />} />
              <Route path="graph" element={<Navigate to="/app/relationships" replace />} />
            </Route>
            <Route path="login" element={<AuthPage mode="login" />} />
            <Route path="signup" element={<AuthPage mode="signup" />} />
            <Route path="oauth-demo/:kind" element={<DemoOauth />} />
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route element={<MarketingLayout />}>
              <Route index element={<Home />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="about" element={<About />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="cookies" element={<Cookies />} />
              <Route path="security" element={<Security />} />
              <Route path="contact" element={<Contact />} />
            </Route>
            <Route element={<MarketingLayout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
        <PolicyBar />
      </AgentsProvider>
    </ThemeProvider>
  )
}

export default App
