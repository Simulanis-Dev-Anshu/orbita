import { useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  User,
  Laptop,
  AppWindow,
  Bot,
  Server,
  Wrench,
  Database,
  Waypoints,
} from 'lucide-react'
import { relationshipGraph, RELATIONSHIP_LAYERS } from '../data/platform.js'

const LAYER_META = {
  USER: { icon: User, tone: 'bg-forest text-brand' },
  DEVICE: { icon: Laptop, tone: 'bg-muted text-ink' },
  'AI APP': { icon: AppWindow, tone: 'bg-brand-soft text-forest' },
  AGENT: { icon: Bot, tone: 'bg-[#fff3dc] text-[#9a6200]' },
  MCP: { icon: Server, tone: 'bg-[#e8f1ff] text-[#1a4d9c]' },
  TOOL: { icon: Wrench, tone: 'bg-[#f3f0ff] text-[#4b3f8a]' },
  DATA: { icon: Database, tone: 'bg-danger-soft text-danger' },
}

const COL_X = {
  USER: 40,
  DEVICE: 240,
  'AI APP': 440,
  AGENT: 640,
  MCP: 840,
  TOOL: 1040,
  DATA: 1240,
}

function RelNode({ data, selected }) {
  const meta = LAYER_META[data.layer] || LAYER_META.USER
  const Icon = meta.icon
  return (
    <div
      className={`w-[168px] rounded-2xl border bg-card p-3 shadow-soft ${
        selected ? 'border-forest shadow-lift' : 'border-line'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-2 !border-card !bg-sub" />
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.tone}`}>
          <Icon size={15} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-ink">{data.label}</p>
          <p className="truncate text-[10px] text-sub">{data.sub}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-2 !border-card !bg-sub" />
    </div>
  )
}

const nodeTypes = { rel: RelNode }

export default function RelationshipGraph() {
  const [focusLayer, setFocusLayer] = useState('ALL')

  const { nodes, edges } = useMemo(() => {
    const layerCounts = Object.fromEntries(RELATIONSHIP_LAYERS.map((l) => [l, 0]))
    const builtNodes = relationshipGraph.nodes
      .filter((n) => focusLayer === 'ALL' || n.layer === focusLayer)
      .map((n) => {
        const row = layerCounts[n.layer]++
        return {
          id: n.id,
          type: 'rel',
          position: { x: COL_X[n.layer], y: 40 + row * 100 },
          data: { label: n.label, sub: n.sub, layer: n.layer },
        }
      })

    const visible = new Set(builtNodes.map((n) => n.id))
    const builtEdges = relationshipGraph.edges
      .filter((e) => visible.has(e.source) && visible.has(e.target))
      .map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        type: 'smoothstep',
        animated: Boolean(e.label),
        style: { stroke: e.label ? '#ff4d00' : '#cfc6bc', strokeWidth: e.label ? 2 : 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: e.label ? '#ff4d00' : '#cfc6bc', width: 16, height: 16 },
        labelStyle: { fill: '#7d756d', fontSize: 10, fontWeight: 600 },
      }))

    return { nodes: builtNodes, edges: builtEdges }
  }, [focusLayer])

  return (
    <div className="mt-6 space-y-4">
      <section className="rounded-card bg-card p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-forest">
            <Waypoints size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="ox-label text-sub">AI Relationship Graph</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              USER → DEVICE → AI APP → AGENT → MCP → TOOL → DATA
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-sub">
              Connection intelligence beyond inventory — how people, endpoints, agents, and data bind
              together.
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFocusLayer('ALL')}
            className={`shrink-0 cursor-pointer rounded-btn px-3 py-2 text-xs font-semibold ${
              focusLayer === 'ALL' ? 'bg-forest text-white' : 'bg-muted text-ink hover:bg-line'
            }`}
          >
            Full graph
          </button>
          {RELATIONSHIP_LAYERS.map((layer) => (
            <button
              key={layer}
              type="button"
              onClick={() => setFocusLayer(layer)}
              className={`shrink-0 cursor-pointer rounded-btn px-3 py-2 text-xs font-semibold ${
                focusLayer === layer ? 'bg-forest text-white' : 'bg-muted text-ink hover:bg-line'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-card border border-line bg-card shadow-soft">
        <div className="h-[min(70dvh,640px)] w-full">
          <ReactFlow
            key={focusLayer}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.18 }}
            minZoom={0.35}
            maxZoom={1.4}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={18} size={1} color="#efe8e1" />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              nodeColor={() => '#170702'}
              maskColor="rgba(255,250,248,0.7)"
            />
          </ReactFlow>
        </div>
      </section>

      <p className="text-center text-xs text-sub">
        Orange edges flag orphaned or high-risk links. Pan and zoom to explore blast radius.
      </p>
    </div>
  )
}
