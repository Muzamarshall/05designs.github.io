"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function AutomationNode({ data }: NodeProps) {
  const d = data as { label: string; tooltip: string; automationNote?: string };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative min-w-[140px] max-w-[180px] rounded-lg border-2 border-emerald-600 bg-emerald-500/20 px-4 py-3 text-center shadow-lg shadow-emerald-900/30 cursor-default animate-[pulse_3s_ease-in-out_infinite] ring-2 ring-emerald-500/30">
          <Handle type="target" position={Position.Left} className="!bg-emerald-400 !border-emerald-600" />
          <Zap className="mx-auto mb-1.5 h-4 w-4 text-emerald-300" />
          <div className="text-sm font-semibold text-white leading-tight">{d.label}</div>
          <div className="mt-1 text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">AI Ready</div>
          <Handle type="source" position={Position.Right} className="!bg-emerald-400 !border-emerald-600" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="max-w-[220px]">{d.tooltip}</p>
        {d.automationNote && (
          <p className="mt-1 text-emerald-400 text-xs">🤖 {d.automationNote}</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
