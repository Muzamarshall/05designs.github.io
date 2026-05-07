"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function PersonNode({ data }: NodeProps) {
  const d = data as { label: string; tooltip: string };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative min-w-[140px] max-w-[180px] rounded-full border-2 border-rose-700 bg-rose-600/20 px-4 py-3 text-center shadow-lg shadow-rose-900/20 cursor-default">
          <Handle type="target" position={Position.Left} className="!bg-rose-400 !border-rose-600" />
          <User className="mx-auto mb-1.5 h-4 w-4 text-rose-300" />
          <div className="text-sm font-semibold text-white leading-tight">{d.label}</div>
          <Handle type="source" position={Position.Right} className="!bg-rose-400 !border-rose-600" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="max-w-[220px]">{d.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
