"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function DecisionNode({ data }: NodeProps) {
  const d = data as { label: string; tooltip: string; isAutomatable: boolean };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative flex h-[100px] w-[100px] items-center justify-center rotate-45 rounded-lg border-2 border-amber-700 bg-amber-600/20 shadow-lg shadow-amber-900/20 cursor-default">
          {d.isAutomatable && (
            <div className="absolute -right-1.5 -top-1.5 -rotate-45">
              <Badge className="h-4 px-1 text-[10px] font-bold bg-emerald-500 text-white border-0">AI</Badge>
            </div>
          )}
          <Handle type="target" position={Position.Left} className="!bg-amber-400 !border-amber-600 !-left-3 !rotate-[-45deg]" />
          <div className="-rotate-45 text-center px-1">
            <GitBranch className="mx-auto mb-1 h-3 w-3 text-amber-300" />
            <div className="text-xs font-semibold text-white leading-tight">{d.label}</div>
          </div>
          <Handle type="source" position={Position.Right} className="!bg-amber-400 !border-amber-600 !-right-3 !rotate-[-45deg]" />
          <Handle type="source" id="bottom" position={Position.Bottom} className="!bg-amber-400 !border-amber-600 !-bottom-3 !rotate-[-45deg]" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="max-w-[220px]">{d.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
