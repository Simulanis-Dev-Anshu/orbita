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

const AgentGraph = lazy(() => import('./pages/AgentGraph.jsx'))
const Inventory = lazy(() => import('./pages/Inventory.jsx'))
const Alerts = lazy(() => import('./pages/Alerts.jsx'))
const Compliance = lazy(() => import('./pages/Compliance.jsx'))
const Connectors = lazy(() => import('./pages/Connectors.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const Pricing = lazy(() => import('./pages/marketing/Pricing.jsx'))
const Blog = lazy(() => import('./pages/marketing/Blog.jsx'))
const BlogPost = lazy(() => import('./pages/marketing/BlogPost.jsx'))
const AuthPage = lazy(() => import('./pages/marketing/AuthPage.jsx'))

function PageLoader() {
  return (
    <div className="mt-6 h-96 animate-pulse rounded-card bg-card shadow-soft" aria-label="Loading page" />
  )
}

const pageMeta = {
  '/app': { title: 'Dashboard', subtitle: 'Every AI agent in your company, at a glance' },
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
  const meta = pageMeta[pathname] ?? { title: 'AgentLens', subtitle: '' }

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
      <Suspense fallback={<div className="min-h-dvh bg-canvas" />}>
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Route>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/app/*" element={<AppShell />} />
        </Routes>
      </Suspense>
    </AgentsProvider>
  )
}

export default App
