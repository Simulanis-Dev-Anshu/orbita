import { useState } from 'react'
import { Wrench } from 'lucide-react'
import { mcpToolInventories } from '../data/platform.js'

function severityTone(sev) {
  if (sev === 'CRITICAL') return 'bg-danger-soft text-danger'
  if (sev === 'MEDIUM') return 'bg-warn-soft text-warn'
  return 'bg-brand-soft text-forest'
}

export default function McpTools() {
  const [selected, setSelected] = useState(mcpToolInventories[0]?.id ?? null)
  const active = mcpToolInventories.find((m) => m.id === selected) || mcpToolInventories[0]

  return (
    <div className="mt-4 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Wrench size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">MCP Tool Inventory</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              Not just “GitHub MCP exists”
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Enumerate tools, then classify: read → LOW, write → MEDIUM, delete → CRITICAL.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-12">
        <ul className="space-y-2 lg:col-span-4">
          {mcpToolInventories.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setSelected(m.id)}
                className={`w-full cursor-pointer rounded-card border p-4 text-left shadow-soft ${
                  active?.id === m.id
                    ? 'border-forest bg-brand-soft/30'
                    : 'border-line bg-card hover:border-ink/20'
                }`}
              >
                <p className="font-semibold text-ink">{m.name}</p>
                <p className="mt-0.5 text-xs text-sub">
                  via {m.hostApp} · {m.owner} · {m.tools.length} tools
                </p>
              </button>
            </li>
          ))}
        </ul>

        <section className="rounded-card bg-card p-5 shadow-soft sm:p-6 lg:col-span-8">
          {active && (
            <>
              <h3 className="text-lg font-semibold tracking-tight text-ink">{active.name}</h3>
              <p className="mt-1 text-sm text-sub">
                Hosted by {active.hostApp} · owner {active.owner}
              </p>
              <p className="ox-label mt-5 text-sub">Tools</p>
              <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-canvas">
                {active.tools.map((t) => (
                  <li key={t.name} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-ink">{t.name}</p>
                      <p className="text-[11px] text-sub capitalize">{t.class}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${severityTone(t.severity)}`}>
                      {t.severity}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold">
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-forest">read → LOW</span>
                <span className="rounded-full bg-warn-soft px-2.5 py-1 text-warn">write → MEDIUM</span>
                <span className="rounded-full bg-danger-soft px-2.5 py-1 text-danger">delete → CRITICAL</span>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
