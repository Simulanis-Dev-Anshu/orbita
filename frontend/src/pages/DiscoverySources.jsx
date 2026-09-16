import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Cloud,
  Download,
  GitBranch,
  KeyRound,
  Monitor,
  Network,
  ShieldCheck,
  Upload,
  Workflow,
} from 'lucide-react'
import { endpoints, formatAgo } from '../lib/api.js'
import { useAgents } from '../context/AgentsContext.jsx'
import { localSample } from '../data/discoverySamples.js'
import {
  applyDemoScan,
  enterDemoMode,
  getDemoConnectors,
  isDemoMode,
} from '../lib/demoSession.js'

const SOURCES = [
  {
    id: 'google',
    name: 'Google Workspace',
    blurb: 'Read-only Admin SDK: OAuth apps and scopes. This is the 10-minute scary list.',
    icon: Cloud,
    oauth: true,
    importKind: 'google',
    demo: true,
    sample: ['/discovery/samples/google-tokens.json', 'google-tokens.json'],
  },
  {
    id: 'microsoft',
    name: 'Microsoft 365',
    blurb: 'Graph oauth2PermissionGrants. Same idea as Google, for Entra tenants.',
    icon: Cloud,
    oauth: true,
    importKind: 'microsoft',
    demo: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    blurb: 'Org app installations and Copilot. Needs a GitHub App or OAuth app.',
    icon: GitBranch,
    oauth: true,
    importKind: 'github',
    demo: true,
  },
  {
    id: 'dns',
    name: 'DNS / proxy CSV',
    blurb: 'Upload Cloudflare, Umbrella, or firewall logs. We match known LLM hosts.',
    icon: Network,
    upload: 'dns',
    demo: true,
    sample: ['/discovery/samples/dns-egress.csv', 'dns-egress.csv'],
  },
  {
    id: 'zapier',
    name: 'Zapier export',
    blurb: 'JSON or CSV of zaps. Their Zapier plan, your parser.',
    icon: Workflow,
    upload: 'zapier',
    demo: true,
    sample: ['/discovery/samples/zapier-export.json', 'zapier-export.json'],
  },
  {
    id: 'make',
    name: 'Make export',
    blurb: 'Scenario JSON/CSV. Same ingest path as Zapier.',
    icon: Workflow,
    upload: 'make',
    demo: true,
  },
  {
    id: 'collector',
    name: 'Managed laptop CLI',
    blurb: 'IT-run script on company devices: apps, extensions, MCP, Ollama. Not remote access.',
    icon: Monitor,
    importKind: 'collector',
    demo: true,
    collector: true,
  },
]

function statusFor(connectors, id) {
  const row = connectors.find((c) => c.kind === id) || connectors.find((c) => (c.name || '').toLowerCase().includes(id))
  return row
}

export default function DiscoverySources() {
  const { reload, ingestAgents } = useAgents()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const fileRef = useRef(null)
  const [pendingKind, setPendingKind] = useState('')
  const [oauth, setOauth] = useState({})
  const [connectors, setConnectors] = useState([])
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const googleState = params.get('google')
  const githubState = params.get('github')
  const microsoftState = params.get('microsoft')
  const createdCount = params.get('created')
  const updatedCount = params.get('updated')
  const oauthReason = params.get('reason')
  const flashKind = ['google', 'github', 'microsoft'].find(
    (k) => params.get(k) === 'ok' || params.get(k) === 'error',
  )

  const markConnected = (kind, count) => {
    setConnectors((prev) => {
      const rest = prev.filter((c) => c.kind !== kind && !(c.name || '').toLowerCase().includes(kind))
      return [
        {
          id: kind,
          kind,
          name: kind,
          status: 'connected',
          agents_count: count,
          last_sync_at: new Date().toISOString(),
        },
        ...rest,
      ]
    })
  }

  const applyLocal = (kind) => {
    const sample = isDemoMode() ? applyDemoScan(kind) : localSample(kind, { connected: true })
    if (!sample) return null
    ingestAgents(sample.agents)
    markConnected(kind, sample.created)
    setResult(sample)
    return sample
  }

  useEffect(() => {
    if (isDemoMode()) {
      setOauth({ google: true, github: true, microsoft: true })
      setConnectors(getDemoConnectors())
      return
    }
    endpoints
      .discoveryStatus()
      .then((row) => {
        setOauth(row.oauth || {})
        setConnectors(row.connectors || [])
      })
      .catch(() => {
        setOauth({ google: true, github: true, microsoft: true })
      })
  }, [result])

  useEffect(() => {
    if (googleState === 'ok' || githubState === 'ok' || microsoftState === 'ok') {
      const sample = applyDemoScan(flashKind)
      if (sample?.agents?.length) ingestAgents(sample.agents)
      setConnectors(getDemoConnectors())
      setResult({
        kind: flashKind,
        created: Number(createdCount || sample?.created || 0),
        updated: Number(updatedCount || 0),
        agents: sample?.agents || [],
        note: sample?.note || 'OAuth sync finished. Inventory updated.',
      })
      reload()
    }
    if (googleState === 'error' || githubState === 'error' || microsoftState === 'error') {
      setError(oauthReason || 'OAuth failed. Import JSON or run a sample scan.')
    }
  }, [flashKind, googleState, githubState, microsoftState, createdCount, updatedCount, oauthReason, reload, ingestAgents])

  const run = async (label, fn) => {
    setBusy(label)
    setError('')
    const kind = label.startsWith('demo-')
      ? label.slice(5)
      : label.startsWith('import-')
        ? label.slice(7)
        : label.startsWith('upload-')
          ? label.slice(7)
          : ''
    if (isDemoMode() && kind) {
      applyLocal(kind)
      setBusy('')
      return
    }
    try {
      const row = await fn()
      setResult(row)
      if (row?.agents?.length) ingestAgents(row.agents)
      reload()
    } catch {
      if (kind && applyLocal(kind)) {
        /* local demo filled the gap */
      } else {
        setError('Discovery failed')
      }
    } finally {
      setBusy('')
    }
  }

  const connect = async (kind) => {
    enterDemoMode()
    navigate(`/oauth-demo/${kind}`)
  }

  const onFile = async (event) => {
    const file = event.target.files?.[0]
    const kind = pendingKind
    event.target.value = ''
    setPendingKind('')
    if (!file || !kind) return
    if (kind === 'google' || kind === 'github' || kind === 'microsoft' || kind === 'collector') {
      let payload
      try {
        payload = JSON.parse(await file.text())
      } catch {
        setError('That file is not valid JSON')
        return
      }
      await run(`import-${kind}`, () => endpoints.discoveryImport(kind, payload))
      return
    }
    await run(`upload-${kind}`, () => endpoints.discoveryUpload(kind, file))
  }

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <KeyRound size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">Discovery sources</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Connect the company stack. Do not scan personal PCs.
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Google and Microsoft list OAuth grants. DNS CSV finds LLM egress. Zapier/Make imports
              automations. The laptop CLI is opt-in on managed devices. Findings land in inventory
              and the dashboard.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold">
            <ShieldCheck size={14} aria-hidden="true" />
            Read-only · metadata only
          </span>
        </div>
      </section>

      {error ? (
        <p className="rounded-card border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">{error}</p>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept=".csv,.json,.txt,application/json,text/csv"
        className="sr-only"
        onChange={onFile}
      />

      <ul className="grid gap-3 lg:grid-cols-2">
        {SOURCES.map((source) => {
          const Icon = source.icon
          const row = statusFor(connectors, source.id)
          return (
            <li key={source.id} className="rounded-card border border-line bg-card p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-ink">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold">{source.name}</h3>
                    {row?.status === 'connected' ? (
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-forest">
                        {row.agents_count || 0} in inventory
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-sub">
                        not synced
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-sub">{source.blurb}</p>
                  {row?.last_sync_at ? (
                    <p className="mt-1 text-[11px] text-sub">Last sync {formatAgo(row.last_sync_at)}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {source.oauth ? (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => connect(source.id)}
                    className="ox-btn ox-btn-primary ox-btn-sm cursor-pointer disabled:opacity-50"
                  >
                    {row?.status === 'connected' ? 'Reconnect' : 'Connect'}
                  </button>
                ) : null}
                {source.upload ? (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => {
                      setPendingKind(source.upload)
                      fileRef.current?.click()
                    }}
                    className="ox-btn ox-btn-ghost ox-btn-sm cursor-pointer disabled:opacity-50"
                  >
                    <Upload size={14} aria-hidden="true" />
                    Upload
                  </button>
                ) : null}
                {source.importKind ? (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => {
                      setPendingKind(source.importKind)
                      fileRef.current?.click()
                    }}
                    className="ox-btn ox-btn-ghost ox-btn-sm cursor-pointer disabled:opacity-50"
                  >
                    <Upload size={14} aria-hidden="true" />
                    Import JSON
                  </button>
                ) : null}
                {source.demo ? (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => run(`demo-${source.id}`, () => endpoints.discoveryDemo(source.id))}
                    className="ox-btn ox-btn-ghost ox-btn-sm cursor-pointer disabled:opacity-50"
                  >
                    Sample scan
                  </button>
                ) : null}
                {source.sample ? (
                  <button
                    type="button"
                    onClick={() =>
                      endpoints.downloadDiscovery(source.sample[0], source.sample[1]).catch((err) => setError(err.message))
                    }
                    className="ox-btn ox-btn-ghost ox-btn-sm cursor-pointer"
                  >
                    <Download size={14} aria-hidden="true" />
                    Sample file
                  </button>
                ) : null}
                {source.collector ? (
                  <button
                    type="button"
                    onClick={() =>
                      endpoints
                        .downloadDiscovery('/discovery/collector.py', 'orbita_collect.py')
                        .catch((err) => setError(err.message))
                    }
                    className="ox-btn ox-btn-ghost ox-btn-sm cursor-pointer"
                  >
                    <Download size={14} aria-hidden="true" />
                    Collector
                  </button>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>

      {result ? (
        <section className="rounded-card border border-line bg-card p-5 shadow-soft">
          <h3 className="text-sm font-semibold">Last scan · {result.kind}</h3>
          <p className="mt-1 text-sm text-sub">
            {result.note || `${result.created || 0} new · ${result.updated || 0} updated`}
          </p>
          {result.agents?.length ? (
            <ul className="mt-3 divide-y divide-line">
              {result.agents.slice(0, 12).map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                  <span className="font-medium">{a.name}</span>
                  <span className="text-sub">
                    {a.platform} · {a.owner_name || a.owner} · risk {a.risk}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <Link to="/app" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
            Open dashboard
          </Link>
        </section>
      ) : null}

      <p className="text-xs text-sub">
        Collector example:{' '}
        <code className="rounded bg-muted px-1.5 py-0.5">
          set ORBITA_URL=http://localhost:8000 && set ORBITA_TOKEN=&lt;jwt&gt; && python orbita_collect.py
        </code>
      </p>
    </div>
  )
}
