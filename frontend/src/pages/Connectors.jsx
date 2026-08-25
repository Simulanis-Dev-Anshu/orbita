import { useMemo, useState } from 'react'
import { Plug, RefreshCw, Sparkles, ServerCog, Link2, Trash2 } from 'lucide-react'
import { connectors as seed } from '../data/mock.js'

const CUSTOM_CATEGORY = 'Custom (MCP / API)'

export default function Connectors() {
  const [items, setItems] = useState(seed)
  const [mcpUrl, setMcpUrl] = useState('')
  const [mcpName, setMcpName] = useState('')
  const [mcpError, setMcpError] = useState('')

  const addMcpLink = (e) => {
    e.preventDefault()
    const url = mcpUrl.trim()
    if (!/^(https?|mcp):\/\/.+\..+/.test(url)) {
      setMcpError('Enter a valid link, e.g. https://mcp.internal.company.com/sse or mcp://...')
      return
    }
    setMcpError('')
    setItems((prev) => [
      ...prev,
      {
        id: `cn-${Date.now()}`,
        name: mcpName.trim() || new URL(url.replace('mcp://', 'https://')).hostname,
        category: CUSTOM_CATEGORY,
        status: 'connected',
        agents: 0,
        lastSync: 'registering…',
        url,
        custom: true,
      },
    ])
    setMcpUrl('')
    setMcpName('')
  }

  const removeCustom = (id) => setItems((prev) => prev.filter((c) => c.id !== id))

  const categories = useMemo(
    () => [...new Set(items.map((c) => c.category))],
    [items],
  )

  const toggle = (id) =>
    setItems((prev) =>
      prev.map((c) =>
        c.id === id
          ? c.status === 'connected'
            ? { ...c, status: 'available', agents: undefined, lastSync: undefined }
            : { ...c, status: 'connected', agents: 0, lastSync: 'just now' }
          : c,
      ),
    )

  const connected = items.filter((c) => c.status === 'connected').length

  return (
    <div className="mt-6 space-y-6">
      {/* Free scan banner: top-of-funnel CTA */}
      <section className="relative overflow-hidden rounded-card bg-gradient-to-br from-forest to-forest-2 p-6 text-white shadow-lift">
        <div className="absolute -top-12 -right-8 h-44 w-44 rounded-full bg-brand/20 blur-2xl" aria-hidden="true" />
        <div className="relative flex flex-wrap items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15">
            <Sparkles size={24} className="text-brand" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold">Every agent in your company, in 24 hours</h2>
            <p className="mt-0.5 text-sm text-white/60">
              {connected} of {items.length} sources connected. More sources = fewer blind spots.
            </p>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-btn bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Run full discovery scan
          </button>
        </div>
      </section>

      {/* Register MCP server / API endpoint by link */}
      <section aria-label="Register MCP server or API endpoint" className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest">
            <ServerCog size={20} className="text-brand" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold">Register an MCP server or API endpoint</h2>
            <p className="text-sm text-sub">
              Paste a link and Orbita will monitor it: tools exposed, agents calling it, data
              it can reach.
            </p>
          </div>
        </div>

        <form onSubmit={addMcpLink} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="block sm:w-56">
            <span className="sr-only">Display name (optional)</span>
            <input
              value={mcpName}
              onChange={(e) => setMcpName(e.target.value)}
              placeholder="Name (optional)"
              className="w-full rounded-btn border border-line bg-canvas px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-sub/60 focus:border-brand"
            />
          </label>
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">MCP server or API URL</span>
            <Link2
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub"
              aria-hidden="true"
            />
            <input
              value={mcpUrl}
              onChange={(e) => setMcpUrl(e.target.value)}
              placeholder="https://mcp.internal.company.com/sse  ·  mcp://…  ·  https://api.vendor.com/v1"
              className={`w-full rounded-btn border bg-canvas py-2.5 pr-4 pl-10 text-sm outline-none transition-colors placeholder:text-sub/60 focus:border-brand ${
                mcpError ? 'border-danger' : 'border-line'
              }`}
              aria-invalid={Boolean(mcpError)}
              aria-describedby={mcpError ? 'mcp-url-error' : undefined}
            />
          </label>
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-btn bg-forest px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Register link
          </button>
        </form>
        {mcpError && (
          <p id="mcp-url-error" role="alert" className="mt-2 text-xs font-medium text-danger">
            {mcpError}
          </p>
        )}
        <p className="mt-3 text-xs text-sub">
          Supports MCP endpoints (SSE / streamable HTTP), REST API base URLs and webhook receivers.
          Registered links appear below under "{CUSTOM_CATEGORY}".
        </p>
      </section>

      {categories.map((cat) => (
        <section key={cat} aria-label={cat}>
          <h2 className="text-sm font-semibold tracking-wider text-sub uppercase">{cat}</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items
              .filter((c) => c.category === cat)
              .map((c) => (
                <article key={c.id} className="flex items-center gap-3 rounded-card bg-card p-4 shadow-soft">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-canvas text-sm font-semibold text-forest">
                    {c.name.slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    {c.custom ? (
                      <p className="truncate text-xs text-sub" title={c.url}>
                        {c.url}
                      </p>
                    ) : c.status === 'connected' ? (
                      <p className="flex items-center gap-1.5 text-xs text-sub">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                        {c.agents} agents · {c.lastSync}
                      </p>
                    ) : (
                      <p className="text-xs text-sub">Not connected</p>
                    )}
                  </div>
                  {c.custom && (
                    <button
                      type="button"
                      onClick={() => removeCustom(c.id)}
                      className="shrink-0 cursor-pointer rounded-lg p-2 text-sub transition-colors hover:bg-danger-soft hover:text-danger"
                      aria-label={`Remove ${c.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => toggle(c.id)}
                    className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-btn px-3 py-2 text-xs font-semibold transition-colors ${
                      c.status === 'connected'
                        ? 'border border-line bg-canvas text-sub hover:border-danger hover:text-danger'
                        : 'bg-forest text-white hover:opacity-90'
                    }`}
                  >
                    {c.status === 'connected' ? (
                      <>
                        <RefreshCw size={13} aria-hidden="true" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <Plug size={13} aria-hidden="true" />
                        Connect
                      </>
                    )}
                  </button>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
