"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Monitor } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function SystemNode({ data }: NodeProps) {
  const d = data as { label: string; tooltip: string; isAutomatable: boolean };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative min-w-[140px] max-w-[180px] rounded-lg border-2 border-slate-600 bg-slate-700/40 px-4 py-3 text-center shadow-lg cursor-default">
          {d.isAutomatable && (
            <div className="absolute -right-1.5 -top-1.5">
              <Badge className="h-4 px-1 text-[10px] font-bold bg-emerald-500 text-white border-0">AI</Badge>
            </div>
          )}
          <Handle type="target" position={Position.Left} className="!bg-slate-400 !border-slate-600" />
          <Monitor className="mx-auto mb-1.5 h-4 w-4 text-slate-300" />
          <div className="text-sm font-semibold text-white leading-tight">{d.label}</div>
          <Handle type="source" position={Position.Right} className="!bg-slate-400 !border-slate-600" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="max-w-[220px]">{d.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
