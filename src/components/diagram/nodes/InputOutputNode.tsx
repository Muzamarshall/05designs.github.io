"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ArrowRightLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function InputOutputNode({ data }: NodeProps) {
  const d = data as { label: string; tooltip: string; isAutomatable: boolean };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative min-w-[140px] max-w-[180px] rounded-xl border-2 border-violet-700 bg-violet-600/20 px-4 py-3 text-center shadow-lg shadow-violet-900/20 cursor-default"
          style={{ clipPath: "polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%)" }}>
          {d.isAutomatable && (
            <div className="absolute -right-1.5 -top-1.5">
              <Badge className="h-4 px-1 text-[10px] font-bold bg-emerald-500 text-white border-0">AI</Badge>
            </div>
          )}
          <Handle type="target" position={Position.Left} className="!bg-violet-400 !border-violet-600" />
          <ArrowRightLeft className="mx-auto mb-1.5 h-4 w-4 text-violet-300" />
          <div className="text-sm font-semibold text-white leading-tight">{d.label}</div>
          <Handle type="source" position={Position.Right} className="!bg-violet-400 !border-violet-600" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="max-w-[220px]">{d.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
