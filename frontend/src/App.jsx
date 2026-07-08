import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import { AgentsProvider } from './context/AgentsContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import MarketingLayout from './components/marketing/MarketingLayout.jsx'
import Home from './pages/marketing/Home.jsx'
import RadarLoader from './components/RadarLoader.jsx'
import PolicyBar from './components/PolicyBar.jsx'

const AgentGraph = lazy(() => import('./pages/AgentGraph.jsx'))
const Copilot = lazy(() => import('./pages/Copilot.jsx'))
const Inventory = lazy(() => import('./pages/Inventory.jsx'))
const Alerts = lazy(() => import('./pages/Alerts.jsx'))
const Compliance = lazy(() => import('./pages/Compliance.jsx'))
const Connectors = lazy(() => import('./pages/Connectors.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const Pricing = lazy(() => import('./pages/marketing/Pricing.jsx'))
const Blog = lazy(() => import('./pages/marketing/Blog.jsx'))
const BlogPost = lazy(() => import('./pages/marketing/BlogPost.jsx'))
const AuthPage = lazy(() => import('./pages/marketing/AuthPage.jsx'))
const About = lazy(() => import('./pages/marketing/About.jsx'))
const Privacy = lazy(() => import('./pages/marketing/Privacy.jsx'))
const Terms = lazy(() => import('./pages/marketing/Terms.jsx'))

function PageLoader() {
  return (
    <div className="mt-6 flex h-[60dvh] items-center justify-center rounded-card">
      <RadarLoader />
    </div>
  )
}

const pageMeta = {
  '/app': { title: 'Dashboard', subtitle: 'Every AI agent in your company, at a glance' },
  '/app/copilot': { title: 'Sentinel Copilot', subtitle: 'AI security analyst grounded in your identity graph' },
  '/app/graph': { title: 'Agent Graph', subtitle: 'Who owns what, and what it can touch' },
  '/app/inventory': { title: 'Agent Inventory', subtitle: 'Full registry of discovered agents' },
  '/app/alerts': { title: 'Alerts', subtitle: 'Permission drift and new-agent notifications' },
  '/app/compliance': { title: 'Compliance', subtitle: 'DPDP, SOC 2, ISO 27001 and EU AI Act readiness' },
  '/app/connectors': { title: 'Connectors', subtitle: 'Data sources feeding the discovery engine' },
  '/app/settings': { title: 'Settings', subtitle: 'Workspace, team and billing' },
  '/app/help': { title: 'Help Center', subtitle: 'Guides, docs and support' },
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] ?? { title: 'Orbita', subtitle: '' }

  // Global ⌘K / Ctrl+K shortcut
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
    <div className="flex min-h-dvh bg-canvas">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onSearchClick={() => setPaletteOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-10 sm:px-6 lg:px-8">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/graph" element={<AgentGraph />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/connectors" element={<Connectors />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<ComingSoon name="Help Center" />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}

function App() {
  return (
    <AgentsProvider>
      <Suspense
        fallback={
          <div className="flex min-h-dvh items-center justify-center bg-canvas">
            <RadarLoader />
          </div>
        }
      >
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/app/*" element={<AppShell />} />
        </Routes>
      </Suspense>
      <PolicyBar />
    </AgentsProvider>
  )
}

export default App
