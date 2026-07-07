import { useCallback, useState } from 'react'
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
import { User, Bot, KeyRound, Database, X } from 'lucide-react'

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
      badge={data.orphaned ? 'Orphaned' : `Risk ${data.risk}`}
      badgeClass={
        data.orphaned
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

/* ---------- Graph data ---------- */

const initialNodes = [
  { id: 'h1', type: 'human', position: { x: 0, y: 40 }, data: { label: 'Riya Sharma', sub: 'Finance Ops', detail: 'Owns 2 agents · last login 3 hrs ago' } },
  { id: 'h2', type: 'human', position: { x: 0, y: 320 }, data: { label: 'Dev Patel', sub: 'Eng Manager', detail: 'Owns 1 agent · last login 20 min ago' } },
  { id: 'h3', type: 'human', position: { x: 0, y: 560 }, data: { label: '(departed employee)', sub: 'Left company Mar 2026', detail: 'Credentials still active — orphaned agents attached' } },

  { id: 'a1', type: 'agent', position: { x: 320, y: 0 }, data: { label: 'Zapier Invoice Bot', sub: 'Zapier', risk: 87, detail: 'Runs every 15 min · touches Gmail, Sheets, Tally' } },
  { id: 'a2', type: 'agent', position: { x: 320, y: 170 }, data: { label: 'Sales Outreach GPT', sub: 'Custom GPT', risk: 74, detail: 'Reads HubSpot contacts, sends email on behalf of owner' } },
  { id: 'a3', type: 'agent', position: { x: 320, y: 340 }, data: { label: 'GitHub PR Reviewer', sub: 'GitHub App', risk: 22, detail: 'Read-only repo access, scoped token' } },
  { id: 'a4', type: 'agent', position: { x: 320, y: 540 }, data: { label: 'Payroll Sync Agent', sub: 'Make', risk: 92, orphaned: true, detail: 'Owner left company — still syncing payroll nightly' } },

  { id: 'c1', type: 'credential', position: { x: 660, y: 80 }, data: { label: 'OAuth Grant · Google', sub: 'gmail.send, sheets.rw', detail: 'Issued Nov 2025 · never rotated' } },
  { id: 'c2', type: 'credential', position: { x: 660, y: 300 }, data: { label: 'Service Token', sub: 'GitHub fine-grained', detail: 'Expires Sep 2026 · repo:read' } },
  { id: 'c3', type: 'credential', position: { x: 660, y: 520 }, data: { label: 'OAuth Grant · Zoho', sub: 'payroll.rw', detail: 'Attached to departed employee account' } },

  { id: 's1', type: 'scope', position: { x: 980, y: 20 }, data: { label: 'Customer PII', sub: 'CRM + Sheets', sensitive: true, detail: '3 agents can reach this scope' } },
  { id: 's2', type: 'scope', position: { x: 980, y: 200 }, data: { label: 'Company Email', sub: 'Gmail', sensitive: true, detail: 'Send-as permission granted' } },
  { id: 's3', type: 'scope', position: { x: 980, y: 380 }, data: { label: 'Source Code', sub: 'GitHub repos', detail: 'Read-only' } },
  { id: 's4', type: 'scope', position: { x: 980, y: 560 }, data: { label: 'Payroll Data', sub: 'Zoho Payroll', sensitive: true, detail: 'Read/write — highest blast radius' } },
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

/* ---------- Page ---------- */

export default function AgentGraph() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selected, setSelected] = useState(null)

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, label: 'CAN_ACCESS', style: edgeStyle }, eds)),
    [setEdges],
  )

  return (
    <div className="mt-6">
      <div className="relative h-[calc(100dvh-180px)] min-h-[480px] overflow-hidden rounded-card border border-line bg-card shadow-soft">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelected(node)}
          onPaneClick={() => setSelected(null)}
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
              ({ human: '#CBD5D0', agent: '#103E2D', credential: '#E8930C', scope: '#E5484D' })[n.type] ?? '#ccc'
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
          {selected && (
            <Panel position="top-right">
              <div className="w-64 rounded-2xl border border-line bg-card/95 p-4 shadow-lift backdrop-blur">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{selected.data.label}</p>
                    <p className="text-xs text-sub">{selected.data.sub}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="cursor-pointer rounded-lg p-1 text-sub hover:bg-canvas hover:text-ink"
                    aria-label="Close details"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-sub">{selected.data.detail}</p>
                {selected.type === 'agent' && (
                  <button
                    type="button"
                    className="mt-4 w-full cursor-pointer rounded-btn bg-danger px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Revoke access
                  </button>
                )}
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
      <p className="mt-3 text-xs text-sub">
        Drag to pan, scroll to zoom, click a node for details. Red animated edges mark orphaned or
        PII-reaching paths.
      </p>
    </div>
  )
}
