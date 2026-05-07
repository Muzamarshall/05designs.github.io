"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function ProcessNode({ data }: NodeProps) {
  const d = data as { label: string; tooltip: string; isAutomatable: boolean };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative min-w-[140px] max-w-[180px] rounded-lg border-2 border-blue-700 bg-blue-600/20 px-4 py-3 text-center shadow-lg shadow-blue-900/20 cursor-default">
          {d.isAutomatable && (
            <div className="absolute -right-1.5 -top-1.5">
              <Badge className="h-4 px-1 text-[10px] font-bold bg-emerald-500 text-white border-0">AI</Badge>
            </div>
          )}
          <Handle type="target" position={Position.Left} className="!bg-blue-400 !border-blue-600" />
          <Settings className="mx-auto mb-1.5 h-4 w-4 text-blue-300" />
          <div className="text-sm font-semibold text-white leading-tight">{d.label}</div>
          <Handle type="source" position={Position.Right} className="!bg-blue-400 !border-blue-600" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="max-w-[220px]">{d.tooltip}</p>
        {d.isAutomatable && (
          <p className="mt-1 text-emerald-400 text-xs">✨ AI automation candidate</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
