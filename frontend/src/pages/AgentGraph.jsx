import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Bot,
  KeyRound,
  Database,
  X,
  Plus,
  Search,
  Maximize2,
  UserX,
  TriangleAlert,
  ShieldOff,
} from 'lucide-react'
import AgentFormModal from '../components/AgentFormModal.jsx'
import { useAgents } from '../context/AgentsContext.jsx'

/* ---------- Custom nodes ---------- */

function BaseNode({ icon: Icon, iconClass, title, sub, badge, badgeClass, selected }) {
  return (
    <div
      className={`w-52 rounded-2xl border bg-card p-3 shadow-soft transition-shadow ${
        selected ? 'border-forest shadow-lift' : 'border-line'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-2 !border-card !bg-sub" />
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-ink">{title}</p>
          <p className="truncate text-[11px] text-sub">{sub}</p>
        </div>
      </div>
      {badge && (
        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass}`}>
          {badge}
        </span>
      )}
      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-2 !border-card !bg-sub" />
    </div>
  )
}

const nodeTypes = {
  human: ({ data, selected }) => (
    <BaseNode
      icon={User}
      iconClass="bg-canvas text-ink"
      title={data.label}
      sub={data.sub}
      selected={selected}
    />
  ),
  agent: ({ data, selected }) => (
    <BaseNode
      icon={Bot}
      iconClass="bg-forest text-brand"
      title={data.label}
      sub={data.sub}
      badge={data.revoked ? 'Access revoked' : data.orphaned ? 'Orphaned' : `Risk ${data.risk}`}
      badgeClass={
        data.revoked
          ? 'bg-canvas text-sub'
          : data.orphaned
            ? 'bg-danger-soft text-danger'
            : data.risk >= 75
              ? 'bg-danger-soft text-danger'
              : data.risk >= 50
                ? 'bg-warn-soft text-warn'
                : 'bg-brand-soft text-forest'
      }
      selected={selected}
    />
  ),
  credential: ({ data, selected }) => (
    <BaseNode
      icon={KeyRound}
      iconClass="bg-warn-soft text-warn"
      title={data.label}
      sub={data.sub}
      selected={selected}
    />
  ),
  scope: ({ data, selected }) => (
    <BaseNode
      icon={Database}
      iconClass={data.sensitive ? 'bg-danger-soft text-danger' : 'bg-brand-soft text-forest'}
      title={data.label}
      sub={data.sub}
      badge={data.sensitive ? 'Sensitive' : undefined}
      badgeClass="bg-danger-soft text-danger"
      selected={selected}
    />
  ),
}

const nodeTypeMeta = {
  human: { icon: User, label: 'Human owner' },
  agent: { icon: Bot, label: 'AI agent' },
  credential: { icon: KeyRound, label: 'Credential' },
  scope: { icon: Database, label: 'Data scope' },
}

/* ---------- Graph data ---------- */

const initialNodes = [
  { id: 'h1', type: 'human', position: { x: 0, y: 40 }, data: { label: 'Riya Sharma', sub: 'Finance Ops', detail: 'Owns 2 agents · last login 3 hrs ago' } },
  { id: 'h2', type: 'human', position: { x: 0, y: 320 }, data: { label: 'Dev Patel', sub: 'Eng Manager', detail: 'Owns 1 agent · last login 20 min ago' } },
  { id: 'h3', type: 'human', position: { x: 0, y: 560 }, data: { label: '(departed employee)', sub: 'Left company Mar 2026', detail: 'Credentials still active, orphaned agents attached' } },

  { id: 'a1', type: 'agent', position: { x: 320, y: 0 }, data: { label: 'Zapier Invoice Bot', sub: 'Zapier', risk: 87, detail: 'Runs every 15 min · touches Gmail, Sheets, Tally' } },
  { id: 'a2', type: 'agent', position: { x: 320, y: 170 }, data: { label: 'Sales Outreach GPT', sub: 'Custom GPT', risk: 74, detail: 'Reads HubSpot contacts, sends email on behalf of owner' } },
  { id: 'a3', type: 'agent', position: { x: 320, y: 340 }, data: { label: 'GitHub PR Reviewer', sub: 'GitHub App', risk: 22, detail: 'Read-only repo access, scoped token' } },
  { id: 'a4', type: 'agent', position: { x: 320, y: 540 }, data: { label: 'Payroll Sync Agent', sub: 'Make', risk: 92, orphaned: true, detail: 'Owner left company, still syncing payroll nightly' } },

  { id: 'c1', type: 'credential', position: { x: 660, y: 80 }, data: { label: 'OAuth Grant · Google', sub: 'gmail.send, sheets.rw', detail: 'Issued Nov 2025 · never rotated' } },
  { id: 'c2', type: 'credential', position: { x: 660, y: 300 }, data: { label: 'Service Token', sub: 'GitHub fine-grained', detail: 'Expires Sep 2026 · repo:read' } },
  { id: 'c3', type: 'credential', position: { x: 660, y: 520 }, data: { label: 'OAuth Grant · Zoho', sub: 'payroll.rw', detail: 'Attached to departed employee account' } },

  { id: 's1', type: 'scope', position: { x: 980, y: 20 }, data: { label: 'Customer PII', sub: 'CRM + Sheets', sensitive: true, detail: '3 agents can reach this scope' } },
  { id: 's2', type: 'scope', position: { x: 980, y: 200 }, data: { label: 'Company Email', sub: 'Gmail', sensitive: true, detail: 'Send-as permission granted' } },
  { id: 's3', type: 'scope', position: { x: 980, y: 380 }, data: { label: 'Source Code', sub: 'GitHub repos', detail: 'Read-only' } },
  { id: 's4', type: 'scope', position: { x: 980, y: 560 }, data: { label: 'Payroll Data', sub: 'Zoho Payroll', sensitive: true, detail: 'Read/write, highest blast radius' } },
]

const edgeStyle = { stroke: '#B9C4BE', strokeWidth: 1.5 }
const dangerStyle = { stroke: '#E5484D', strokeWidth: 2 }

const initialEdges = [
  { id: 'e-h1-a1', source: 'h1', target: 'a1', label: 'OWNS', style: edgeStyle },
  { id: 'e-h1-a2', source: 'h1', target: 'a2', label: 'OWNS', style: edgeStyle },
  { id: 'e-h2-a3', source: 'h2', target: 'a3', label: 'OWNS', style: edgeStyle },
  { id: 'e-h3-a4', source: 'h3', target: 'a4', label: 'OWNED', animated: true, style: dangerStyle },

  { id: 'e-a1-c1', source: 'a1', target: 'c1', label: 'USES', style: edgeStyle },
  { id: 'e-a2-c1', source: 'a2', target: 'c1', label: 'USES', style: edgeStyle },
  { id: 'e-a3-c2', source: 'a3', target: 'c2', label: 'USES', style: edgeStyle },
  { id: 'e-a4-c3', source: 'a4', target: 'c3', label: 'USES', animated: true, style: dangerStyle },

  { id: 'e-c1-s1', source: 'c1', target: 's1', label: 'CAN_ACCESS', animated: true, style: dangerStyle },
  { id: 'e-c1-s2', source: 'c1', target: 's2', label: 'CAN_ACCESS', style: edgeStyle },
  { id: 'e-c2-s3', source: 'c2', target: 's3', label: 'CAN_ACCESS', style: edgeStyle },
  { id: 'e-c3-s4', source: 'c3', target: 's4', label: 'CAN_ACCESS', animated: true, style: dangerStyle },
]

const legend = [
  { label: 'Human owner', className: 'bg-canvas border border-line' },
  { label: 'AI agent', className: 'bg-forest' },
  { label: 'Credential', className: 'bg-warn' },
  { label: 'Data scope', className: 'bg-danger' },
]

const filters = ['All', 'High risk', 'Orphaned', 'Sensitive data']

/* ---------- Graph helpers ---------- */

// Everything reachable downstream of the seeds plus everything upstream,
// i.e. the blast radius of a node: its owners and all data it can touch.
function reachableSet(seeds, edges) {
  const grow = (set, from, to) => {
    let changed = true
    while (changed) {
      changed = false
      for (const e of edges) {
        if (set.has(e[from]) && !set.has(e[to])) {
          set.add(e[to])
          changed = true
        }
      }
    }
    return set
  }
  const down = grow(new Set(seeds), 'source', 'target')
  const up = grow(new Set(seeds), 'target', 'source')
  return new Set([...down, ...up])
}

/* ---------- Page ---------- */

export default function AgentGraph() {
  const navigate = useNavigate()
  const { addAgent } = useAgents()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const rfRef = useRef(null)

  const selected = nodes.find((n) => n.id === selectedId) ?? null

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, label: 'CAN_ACCESS', style: edgeStyle }, eds)),
    [setEdges],
  )

  /* ----- Focus: selection beats filter ----- */

  const focusSet = useMemo(() => {
    if (selectedId) return reachableSet([selectedId], edges)
    if (filter === 'All') return null
    const seeds = nodes
      .filter((n) => {
        if (filter === 'High risk') return n.type === 'agent' && n.data.risk >= 75
        if (filter === 'Orphaned') return n.type === 'agent' && n.data.orphaned
        return n.type === 'scope' && n.data.sensitive
      })
      .map((n) => n.id)
    return seeds.length ? reachableSet(seeds, edges) : null
  }, [selectedId, filter, nodes, edges])

  const displayNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        style: {
          ...n.style,
          opacity: focusSet && !focusSet.has(n.id) ? 0.18 : 1,
          transition: 'opacity 0.3s ease',
        },
      })),
    [nodes, focusSet],
  )

  const displayEdges = useMemo(
    () =>
      edges.map((e) => {
        const on = !focusSet || (focusSet.has(e.source) && focusSet.has(e.target))
        return {
          ...e,
          animated: e.animated && on,
          style: {
            ...e.style,
            strokeWidth: on && focusSet ? (e.style?.strokeWidth ?? 1.5) + 1 : e.style?.strokeWidth,
            opacity: on ? 1 : 0.06,
            transition: 'opacity 0.3s ease',
          },
          labelStyle: { opacity: on ? 1 : 0.08 },
        }
      }),
    [edges, focusSet],
  )

  /* ----- Search ----- */

  const q = query.trim().toLowerCase()
  const hits = q
    ? nodes.filter((n) => n.data.label.toLowerCase().includes(q)).slice(0, 6)
    : []

  const focusNode = (node) => {
    setQuery('')
    setFilter('All')
    setSelectedId(node.id)
    rfRef.current?.setCenter(node.position.x + 104, node.position.y + 40, {
      zoom: 1.1,
      duration: 600,
    })
  }

  const resetView = () => {
    setSelectedId(null)
    setFilter('All')
    setQuery('')
    rfRef.current?.fitView({ padding: 0.15, duration: 500 })
  }

  /* ----- Selected node insights ----- */

  const insight = useMemo(() => {
    if (!selected) return null
    const radius = reachableSet([selected.id], edges)
    const of = (type) => nodes.filter((n) => n.type === type && n.id !== selected.id && radius.has(n.id))
    return {
      owners: of('human'),
      agents: of('agent'),
      credentials: of('credential'),
      scopes: of('scope'),
    }
  }, [selected, nodes, edges])

  /* ----- Actions ----- */

  const revokeAccess = (id) => {
    setEdges((eds) => eds.filter((e) => e.source !== id))
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, revoked: true, orphaned: false } } : n)),
    )
  }

  // Register an agent and draw it (with owner, credential, scopes) onto the graph
  const handleAdd = (payload) => {
    addAgent(payload)

    const stamp = Date.now()
    const y = Math.max(...nodes.map((n) => n.position.y)) + 190
    const orphaned = payload.owner === 'Unassigned'
    const risky = orphaned || payload.risk >= 75
    const linkStyle = risky ? dangerStyle : edgeStyle

    const newNodes = []
    const newEdges = []

    const agentId = `a-${stamp}`
    newNodes.push({
      id: agentId,
      type: 'agent',
      position: { x: 320, y },
      data: {
        label: payload.name,
        sub: payload.platform,
        risk: payload.risk,
        orphaned,
        detail: `Registered manually · status ${payload.status}`,
      },
    })

    // Owner: reuse an existing human node when the name matches
    if (!orphaned) {
      const existing = nodes.find(
        (n) => n.type === 'human' && n.data.label.toLowerCase() === payload.owner.toLowerCase(),
      )
      const ownerId = existing?.id ?? `h-${stamp}`
      if (!existing) {
        newNodes.push({
          id: ownerId,
          type: 'human',
          position: { x: 0, y },
          data: { label: payload.owner, sub: payload.ownerRole, detail: `Owns ${payload.name}` },
        })
      }
      newEdges.push({ id: `e-${ownerId}-${agentId}`, source: ownerId, target: agentId, label: 'OWNS', style: linkStyle, animated: risky })
    }

    // Credential inferred from the platform
    const credId = `c-${stamp}`
    newNodes.push({
      id: credId,
      type: 'credential',
      position: { x: 660, y },
      data: {
        label: `OAuth Grant · ${payload.platform}`,
        sub: payload.scopes.join(', ') || 'no scopes declared',
        detail: 'Issued just now via manual registration',
      },
    })
    newEdges.push({ id: `e-${agentId}-${credId}`, source: agentId, target: credId, label: 'USES', style: linkStyle, animated: risky })

    // Scopes: connect to existing scope nodes, create the rest
    let scopeY = Math.max(...nodes.filter((n) => n.type === 'scope').map((n) => n.position.y), y - 190)
    for (const scope of payload.scopes) {
      const existing = nodes.find(
        (n) => n.type === 'scope' && n.data.label.toLowerCase() === scope.toLowerCase(),
      )
      const scopeId = existing?.id ?? `s-${stamp}-${scope}`
      if (!existing) {
        scopeY += 170
        newNodes.push({
          id: scopeId,
          type: 'scope',
          position: { x: 980, y: scopeY },
          data: { label: scope, sub: payload.platform, detail: `Reached by ${payload.name}` },
        })
      }
      newEdges.push({
        id: `e-${credId}-${scopeId}`,
        source: credId,
        target: scopeId,
        label: 'CAN_ACCESS',
        style: existing?.data.sensitive ? dangerStyle : linkStyle,
        animated: risky || Boolean(existing?.data.sensitive),
      })
    }

    setNodes((nds) => [...nds, ...newNodes])
    setEdges((eds) => [...eds, ...newEdges])
    setSelectedId(agentId)
    // Fly to the freshly drawn agent once state has applied
    setTimeout(() => rfRef.current?.setCenter(424, y + 40, { zoom: 1, duration: 700 }), 60)
  }

  /* ----- Stats ----- */

  const stats = useMemo(() => {
    const agents = nodes.filter((n) => n.type === 'agent')
    return [
      { icon: Bot, label: 'Agents on graph', value: agents.length, cls: 'bg-brand-soft text-forest' },
      { icon: UserX, label: 'Orphaned', value: agents.filter((n) => n.data.orphaned).length, cls: 'bg-danger-soft text-danger' },
      { icon: TriangleAlert, label: 'High-risk paths', value: edges.filter((e) => e.style?.stroke === '#E5484D').length, cls: 'bg-warn-soft text-warn' },
      { icon: Database, label: 'Sensitive scopes', value: nodes.filter((n) => n.type === 'scope' && n.data.sensitive).length, cls: 'bg-danger-soft text-danger' },
    ]
  }, [nodes, edges])

  return (
    <div className="mt-6 space-y-4">
      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="card-in card-hover flex items-center gap-3 rounded-card bg-card p-4 shadow-soft"
            style={{ '--i': i }}
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.cls}`}>
              <s.icon size={20} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-2xl font-semibold tracking-tight tabular-nums">{s.value}</p>
              <p className="truncate text-xs text-sub">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card-in flex flex-wrap items-center gap-2" style={{ '--i': 4 }}>
        {/* Search */}
        <div className="relative min-w-56 flex-1 sm:max-w-72">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sub" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a node…"
            className="w-full rounded-btn border border-line bg-card py-2.5 pr-3 pl-10 text-sm shadow-soft outline-none transition-colors placeholder:text-sub focus:border-brand"
            aria-label="Search graph nodes"
          />
          {hits.length > 0 && (
            <div className="pop-in absolute top-full right-0 left-0 z-40 mt-2 overflow-hidden rounded-card border border-line bg-card p-1.5 shadow-lift">
              {hits.map((n) => {
                const Meta = nodeTypeMeta[n.type]
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => focusNode(n)}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-canvas"
                  >
                    <Meta.icon size={15} className="shrink-0 text-sub" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate font-medium">{n.data.label}</span>
                    <span className="shrink-0 text-[11px] text-sub">{Meta.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter graph">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFilter(f)
                setSelectedId(null)
              }}
              aria-pressed={filter === f && !selectedId}
              className={`cursor-pointer rounded-full border px-3.5 py-2 text-xs font-semibold transition-all ${
                filter === f && !selectedId
                  ? 'border-forest bg-forest text-white'
                  : 'border-line bg-card text-sub shadow-soft hover:border-brand hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={resetView}
            className="inline-flex cursor-pointer items-center gap-2 rounded-btn border border-line bg-card px-3.5 py-2.5 text-sm font-semibold shadow-soft transition-colors hover:border-brand"
          >
            <Maximize2 size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Reset view</span>
          </button>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-btn bg-forest px-4 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
          >
            <Plus size={16} aria-hidden="true" />
            Add agent
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="card-in relative h-[calc(100dvh-330px)] min-h-[480px] overflow-hidden rounded-card border border-line bg-card shadow-soft" style={{ '--i': 5 }}>
        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          nodeTypes={nodeTypes}
          onInit={(inst) => (rfRef.current = inst)}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedId(node.id)}
          onPaneClick={() => setSelectedId(null)}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.3}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#DDE3DF" gap={24} size={1.5} />
          <Controls position="bottom-left" />
          <MiniMap
            className="!hidden md:!block"
            nodeColor={(n) =>
              ({ human: '#CBD5D0', agent: '#170702', credential: '#E8930C', scope: '#E5484D' })[n.type] ?? '#ccc'
            }
            maskColor="rgba(248,249,247,0.7)"
          />

          {/* Legend */}
          <Panel position="top-left">
            <div className="rounded-2xl border border-line bg-card/95 p-3.5 shadow-soft backdrop-blur">
              <p className="text-xs font-semibold tracking-wider text-sub uppercase">Identity graph</p>
              <ul className="mt-2 space-y-1.5">
                {legend.map((l) => (
                  <li key={l.label} className="flex items-center gap-2 text-xs text-ink">
                    <span className={`h-2.5 w-2.5 rounded-full ${l.className}`} aria-hidden="true" />
                    {l.label}
                  </li>
                ))}
                <li className="flex items-center gap-2 pt-1 text-xs text-danger">
                  <span className="h-0.5 w-4 bg-danger" aria-hidden="true" />
                  High-risk path
                </li>
              </ul>
            </div>
          </Panel>

          {/* Detail panel */}
          {selected && insight && (
            <Panel position="top-right">
              <div className="pop-in w-72 rounded-2xl border border-line bg-card/95 p-4 shadow-lift backdrop-blur">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{selected.data.label}</p>
                    <p className="text-xs text-sub">{selected.data.sub}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="cursor-pointer rounded-lg p-1 text-sub hover:bg-canvas hover:text-ink"
                    aria-label="Close details"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-sub">{selected.data.detail}</p>

                {/* Blast radius summary */}
                <div className="mt-3 rounded-xl bg-canvas p-3">
                  <p className="text-[11px] font-semibold tracking-wider text-sub uppercase">
                    Blast radius
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    {[
                      ['Owners', insight.owners],
                      ['Agents', insight.agents],
                      ['Credentials', insight.credentials],
                      ['Data scopes', insight.scopes],
                    ]
                      .filter(([, list]) => list.length > 0)
                      .map(([label, list]) => (
                        <li key={label} className="flex gap-2">
                          <span className="w-20 shrink-0 text-sub">{label}</span>
                          <span className="min-w-0 flex-1 font-medium">
                            {list.map((n) => n.data.label).join(', ')}
                          </span>
                        </li>
                      ))}
                    {insight.scopes.some((s) => s.data.sensitive) && (
                      <li className="flex items-center gap-1.5 pt-1 font-semibold text-danger">
                        <TriangleAlert size={12} aria-hidden="true" />
                        Reaches sensitive data
                      </li>
                    )}
                  </ul>
                </div>

                {selected.type === 'agent' && (
                  <div className="mt-3 space-y-2">
                    {!selected.data.revoked ? (
                      <button
                        type="button"
                        onClick={() => revokeAccess(selected.id)}
                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-btn bg-danger px-3 py-2 text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                      >
                        <ShieldOff size={14} aria-hidden="true" />
                        Revoke access
                      </button>
                    ) : (
                      <p className="rounded-xl bg-brand-soft px-3 py-2 text-center text-xs font-semibold text-forest">
                        Access revoked. Credentials disconnected
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => navigate('/app/inventory', { state: { q: selected.data.label } })}
                      className="w-full cursor-pointer rounded-btn border border-line bg-card px-3 py-2 text-xs font-semibold transition-colors hover:border-brand"
                    >
                      View in inventory
                    </button>
                  </div>
                )}
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>

      <p className="text-xs text-sub">
        Drag to pan, scroll to zoom. Click a node to isolate its blast radius: everything it owns,
        uses or can reach. Red animated edges mark orphaned or PII-reaching paths.
      </p>

      {adding && (
        <AgentFormModal onSave={handleAdd} onClose={() => setAdding(false)} />
      )}
    </div>
  )
}
