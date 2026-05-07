"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { DiagramNode, DiagramEdge } from "@/types/analysis";
import ProcessNode from "./nodes/ProcessNode";
import DecisionNode from "./nodes/DecisionNode";
import AutomationNode from "./nodes/AutomationNode";
import InputOutputNode from "./nodes/InputOutputNode";
import SystemNode from "./nodes/SystemNode";
import PersonNode from "./nodes/PersonNode";
import DiagramLegend from "./DiagramLegend";

const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  automation: AutomationNode,
  inputOutput: InputOutputNode,
  system: SystemNode,
  person: PersonNode,
};

const NODE_COLORS: Record<string, string> = {
  process: "#3B82F6",
  decision: "#F59E0B",
  automation: "#10B981",
  inputOutput: "#8B5CF6",
  system: "#64748B",
  person: "#F43F5E",
};

function applyDagreLayout(
  rawNodes: DiagramNode[],
  rawEdges: DiagramEdge[]
): { nodes: Node[]; edges: Edge[] } {
  // Simple grid layout fallback (dagre requires Node.js canvas in edge runtime)
  // Space nodes evenly in a left-to-right grid based on their relative x positions
  const sorted = [...rawNodes].sort((a, b) => a.position.x - b.position.x);
  const cols = Math.ceil(Math.sqrt(sorted.length));
  const W = 220;
  const H = 130;

  const nodes: Node[] = sorted.map((n, i) => ({
    id: n.id,
    type: n.type,
    position: {
      x: (i % cols) * W + 40,
      y: Math.floor(i / cols) * H + 40,
    },
    data: {
      label: n.label,
      tooltip: n.tooltip,
      isAutomatable: n.isAutomatable,
      automationNote: n.automationNote,
    },
  }));

  const edges: Edge[] = rawEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: e.animated,
    style: { stroke: "#4B5563", strokeWidth: 2 },
    labelStyle: { fill: "#9CA3AF", fontSize: 11 },
    labelBgStyle: { fill: "#1E293B" },
  }));

  return { nodes, edges };
}

interface Props {
  diagramNodes: DiagramNode[];
  diagramEdges: DiagramEdge[];
}

export default function WorkflowDiagram({ diagramNodes, diagramEdges }: Props) {
  const { nodes, edges } = useMemo(
    () => applyDagreLayout(diagramNodes, diagramEdges),
    [diagramNodes, diagramEdges]
  );

  const miniMapNodeColor = useCallback((node: Node) => {
    return NODE_COLORS[node.type as string] ?? "#64748B";
  }, []);

  return (
    <div>
      <div className="h-[500px] w-full overflow-hidden rounded-xl border border-slate-800">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#1E293B"
          />
          <Controls />
          <MiniMap
            nodeColor={miniMapNodeColor}
            maskColor="rgb(15 23 42 / 0.8)"
            style={{ background: "#0F172A" }}
          />
        </ReactFlow>
      </div>
      <DiagramLegend />
    </div>
  );
}
