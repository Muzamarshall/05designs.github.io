import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Workflow, Database, Layers } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface Props {
  blueprint: AnalysisResult["blueprint"];
}

export default function BlueprintPanel({ blueprint }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 leading-relaxed">{blueprint.summary}</p>
          <div className="mt-4">
            <p className="text-sm text-slate-500 mb-2">Team Structure</p>
            <p className="text-sm text-slate-300">{blueprint.teamStructure}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Departments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-4 w-4 text-violet-400" />
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {blueprint.departments.map((dept) => (
              <div key={dept.name} className="rounded-lg bg-slate-800/50 p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">{dept.name}</span>
                  {dept.headcount && (
                    <Badge variant="secondary">{dept.headcount}</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-400">{dept.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Systems Used */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-4 w-4 text-amber-400" />
              Systems & Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {blueprint.systemsUsed.map((s) => (
                <Badge key={s} variant="outline">{s}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Processes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-cyan-400" />
            Key Processes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {blueprint.keyProcesses.map((p) => (
              <div key={p.name} className="rounded-lg border border-slate-800 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-medium text-white text-sm">{p.name}</span>
                  <Badge variant={p.isManual ? "warning" : "success"} className="shrink-0 text-[10px]">
                    {p.isManual ? "Manual" : "Automated"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mb-2">{p.description}</p>
                <p className="text-xs text-slate-500">Dept: {p.department}</p>
                {p.currentTools.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.currentTools.map((t) => (
                      <span key={t} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
