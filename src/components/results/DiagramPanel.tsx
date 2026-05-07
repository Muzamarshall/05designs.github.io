"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Info } from "lucide-react";
import WorkflowDiagram from "@/components/diagram/WorkflowDiagram";
import type { DiagramNode, DiagramEdge, AutomationOpportunity } from "@/types/analysis";

interface Props {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  opportunities: AutomationOpportunity[];
}

export default function DiagramPanel({ nodes, edges, opportunities }: Props) {
  const automatable = nodes.filter((n) => n.isAutomatable);

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
        <div className="text-sm text-slate-300">
          <span className="font-medium text-cyan-400">Hover</span> over any node to see details.{" "}
          <span className="font-medium text-emerald-400">Pulsing green nodes</span> are AI automation candidates.
          Drag to rearrange, scroll to zoom.
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-cyan-400" />
            Business Workflow Map
            <Badge variant="secondary" className="ml-auto">
              {nodes.length} nodes · {edges.length} connections
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WorkflowDiagram diagramNodes={nodes} diagramEdges={edges} />
        </CardContent>
      </Card>

      {/* Automation highlights */}
      {automatable.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              🤖 Automation Candidates ({automatable.length} nodes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {automatable.map((n) => {
                const opp = opportunities.find((o) => o.processId === n.id);
                return (
                  <div key={n.id} className="rounded-lg border border-emerald-700/30 bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{n.label}</span>
                      <Badge variant="success" className="text-[10px]">
                        {opp?.impactLevel ?? "medium"} impact
                      </Badge>
                    </div>
                    {n.automationNote && (
                      <p className="text-xs text-slate-400">{n.automationNote}</p>
                    )}
                    {opp && (
                      <p className="mt-1 text-xs text-emerald-400">
                        ⏱ ~{opp.estimatedHoursSaved}h/week saved
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
