'use client'

import {
  Background,
  type Edge,
  Handle,
  type Node,
  type NodeTypes,
  Position,
  ReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// Custom Node Components
function PowerSourceNode() {
  return (
    <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-4 min-w-[120px]">
      <div className="text-center">
        <div className="font-semibold text-gray-700 text-sm">Power Source</div>
        <div className="text-xs text-gray-500">(Transformer)</div>
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full" />
          <span className="text-xs font-bold text-red-600">L1</span>
          <Handle
            type="source"
            position={Position.Right}
            id="l1"
            style={{ top: '35%', background: '#dc2626' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded-full" />
          <span className="text-xs font-bold text-green-600">N</span>
          <Handle
            type="source"
            position={Position.Right}
            id="neutral"
            style={{ top: '50%', background: '#059669' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full" />
          <span className="text-xs font-bold text-red-600">L2</span>
          <Handle
            type="source"
            position={Position.Right}
            id="l2"
            style={{ top: '65%', background: '#dc2626' }}
          />
        </div>
      </div>
    </div>
  )
}

function MeterNode({ data }: { data: any }) {
  const { label, measurement, line } = data
  return (
    <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-3 min-w-[130px]">
      <Handle
        type="target"
        position={Position.Left}
        id="power-in"
        style={{ background: '#dc2626' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="neutral-in"
        style={{ top: '60%', background: '#059669' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="power-out"
        style={{ background: '#dc2626' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="neutral-out"
        style={{ top: '60%', background: '#059669' }}
      />

      <div className="text-center">
        <div className="w-6 h-6 border-2 border-blue-500 rounded-full mx-auto mb-1" />
        <div className="font-bold text-blue-800 text-xs">{label}</div>
        <div className="text-blue-600 text-xs">{measurement}</div>
        <div className="text-gray-500 text-xs">({line})</div>
      </div>
    </div>
  )
}

function ApplianceNode({ data }: { data: any }) {
  const { label, examples, voltage, connections, color } = data
  return (
    <div className={`border-2 rounded-lg p-3 min-w-[120px] ${color}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="power1"
        style={{ top: '40%', background: '#dc2626' }}
      />
      {voltage === '220V' && (
        <Handle
          type="target"
          position={Position.Left}
          id="power2"
          style={{ top: '60%', background: '#dc2626' }}
        />
      )}
      {voltage === '110V' && (
        <Handle
          type="target"
          position={Position.Left}
          id="neutral"
          style={{ top: '60%', background: '#059669' }}
        />
      )}

      <div className="text-center">
        <div className="font-bold text-sm">{label}</div>
        <div className="text-xs mt-1">{examples}</div>
        <div className="text-xs text-gray-600 mt-1">{connections}</div>
      </div>
    </div>
  )
}

function InfoBoxNode({ data }: { data: any }) {
  const { title, items, color } = data
  return (
    <div className={`border rounded-lg p-4 min-w-[250px] ${color}`}>
      <div className="font-bold text-sm mb-2">{title}</div>
      <div className="space-y-1">
        {items.map((item: string, index: number) => (
          <div key={index} className="text-xs">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  powerSource: PowerSourceNode,
  meter: MeterNode,
  appliance: ApplianceNode,
  infoBox: InfoBoxNode,
}

const initialNodes: Node[] = [
  {
    id: 'power-source',
    type: 'powerSource',
    position: { x: 50, y: 100 },
    data: {},
  },
  {
    id: 'meter-l1',
    type: 'meter',
    position: { x: 300, y: 30 },
    data: {
      label: 'Meter L1',
      measurement: 'rawWattageL1',
      line: '110V Line',
    },
  },
  {
    id: 'meter-l2',
    type: 'meter',
    position: { x: 300, y: 180 },
    data: {
      label: 'Meter L2',
      measurement: 'rawWattageL2',
      line: '110V Line',
    },
  },
  {
    id: 'appliance-110v',
    type: 'appliance',
    position: { x: 550, y: 30 },
    data: {
      label: '110V Appliance',
      examples: '(Computer, Lights)',
      voltage: '110V',
      connections: 'L1 + N',
      color: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    },
  },
  {
    id: 'appliance-220v',
    type: 'appliance',
    position: { x: 550, y: 180 },
    data: {
      label: '220V Appliance',
      examples: '(Air Conditioner, Water Heaters)',
      voltage: '220V',
      connections: 'L1 + L2',
      color: 'bg-pink-50 border-pink-500 text-pink-800',
    },
  },
  {
    id: 'voltage-info',
    type: 'infoBox',
    position: { x: 50, y: 330 },
    data: {
      title: 'Voltage Relationships:',
      items: ['• L1 to N: 110V', '• L2 to N: 110V', '• L1 to L2: 220V'],
      color: 'bg-slate-50 border-slate-300 text-slate-700',
    },
  },
  {
    id: 'measurement-challenge',
    type: 'infoBox',
    position: { x: 350, y: 330 },
    data: {
      title: 'Measurement Challenge:',
      items: [
        '• 110V appliances: measured by ONE meter (L1+N or L2+N)',
        '• 220V appliances: measured by BOTH meters (L1+L2)',
      ],
      color: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    },
  },
]

const initialEdges: Edge[] = [
  // Power source to meters
  {
    id: 'power-l1-to-meter-l1',
    source: 'power-source',
    target: 'meter-l1',
    sourceHandle: 'l1',
    targetHandle: 'power-in',
    style: { stroke: '#dc2626', strokeWidth: 3 },
    label: 'L1 (110V)',
    labelStyle: { fill: '#dc2626', fontWeight: 'bold', fontSize: '12px' },
  },
  {
    id: 'power-neutral-to-meter-l1',
    source: 'power-source',
    target: 'meter-l1',
    sourceHandle: 'neutral',
    targetHandle: 'neutral-in',
    style: { stroke: '#059669', strokeWidth: 3 },
    label: 'N (0V)',
    labelStyle: { fill: '#059669', fontWeight: 'bold', fontSize: '12px' },
  },
  {
    id: 'power-l2-to-meter-l2',
    source: 'power-source',
    target: 'meter-l2',
    sourceHandle: 'l2',
    targetHandle: 'power-in',
    style: { stroke: '#dc2626', strokeWidth: 3 },
    label: 'L2 (110V)',
    labelStyle: { fill: '#dc2626', fontWeight: 'bold', fontSize: '12px' },
  },
  {
    id: 'power-neutral-to-meter-l2',
    source: 'power-source',
    target: 'meter-l2',
    sourceHandle: 'neutral',
    targetHandle: 'neutral-in',
    style: { stroke: '#059669', strokeWidth: 3 },
  },

  // Meters to appliances
  {
    id: 'meter-l1-to-110v-power',
    source: 'meter-l1',
    target: 'appliance-110v',
    sourceHandle: 'power-out',
    targetHandle: 'power1',
    style: { stroke: '#dc2626', strokeWidth: 3 },
  },
  {
    id: 'meter-l1-to-110v-neutral',
    source: 'meter-l1',
    target: 'appliance-110v',
    sourceHandle: 'neutral-out',
    targetHandle: 'neutral',
    style: { stroke: '#059669', strokeWidth: 3 },
  },
  {
    id: 'meter-l1-to-220v-l1',
    source: 'meter-l1',
    target: 'appliance-220v',
    sourceHandle: 'power-out',
    targetHandle: 'power1',
    style: { stroke: '#dc2626', strokeWidth: 3 },
  },
  {
    id: 'meter-l2-to-220v-l2',
    source: 'meter-l2',
    target: 'appliance-220v',
    sourceHandle: 'power-out',
    targetHandle: 'power2',
    style: { stroke: '#dc2626', strokeWidth: 3 },
  },
]

export function SinglePhaseThreeWireDiagramFlow({ className = '' }: { className?: string }) {
  return (
    <div className={`h-[680px] w-full border border-gray-200 rounded-lg ${className}`}>
      {/* 這邊也幫這個圖加個標題 */}
      <h2 className="text-lg font-semibold text-slate-800 p-4">
        Single Room Electrical Configuration
      </h2>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
        nodesDraggable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
      >
        <Background color="#f1f5f9" gap={20} />
        {/* <Controls /> */}
        {/* <MiniMap
					nodeColor={(node) => {
						switch (node.type) {
							case "powerSource":
								return "#9ca3af";
							case "meter":
								return "#3b82f6";
							case "appliance":
								return node.data?.voltage === "220V"
									? "#ec4899"
									: "#f59e0b";
							case "infoBox":
								return "#e2e8f0";
							default:
								return "#9ca3af";
						}
					}}
					className="bg-white border border-gray-300"
				/> */}
      </ReactFlow>
    </div>
  )
}
