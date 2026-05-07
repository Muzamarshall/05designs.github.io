import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Clock, DollarSign, Wrench, ChevronRight } from "lucide-react";
import type { AutomationOpportunity } from "@/types/analysis";

const COMPLEXITY_COLOR: Record<string, "default" | "warning" | "destructive"> = {
  low: "default",
  medium: "warning",
  high: "destructive",
};

const IMPACT_COLOR: Record<string, "default" | "success" | "warning"> = {
  low: "default",
  medium: "warning",
  high: "success",
};

interface Props {
  opportunities: AutomationOpportunity[];
}

export default function RecommendationsPanel({ opportunities }: Props) {
  const sorted = [...opportunities].sort((a, b) => {
    const imp = { high: 3, medium: 2, low: 1 };
    return imp[b.impactLevel] - imp[a.impactLevel];
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-xl p-5 text-center">
          <div className="text-3xl font-bold gradient-text">
            {opportunities.reduce((s, o) => s + o.estimatedHoursSaved, 0)}h
          </div>
          <div className="mt-1 text-sm text-slate-400">Total hours saved/week</div>
        </div>
        <div className="glass rounded-xl p-5 text-center">
          <div className="text-3xl font-bold gradient-text">{opportunities.length}</div>
          <div className="mt-1 text-sm text-slate-400">Automation opportunities</div>
        </div>
        <div className="glass rounded-xl p-5 text-center">
          <div className="text-3xl font-bold gradient-text">
            {opportunities.filter((o) => o.complexityLevel === "low").length}
          </div>
          <div className="mt-1 text-sm text-slate-400">Quick wins (low complexity)</div>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map((opp, i) => (
          <Card key={opp.processId}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm border border-emerald-700/30">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                    <Bot className="h-4 w-4 text-emerald-400" />
                    {opp.processName}
                    <div className="flex gap-2 ml-auto">
                      <Badge variant={COMPLEXITY_COLOR[opp.complexityLevel]}>
                        {opp.complexityLevel} complexity
                      </Badge>
                      <Badge variant={IMPACT_COLOR[opp.impactLevel]}>
                        {opp.impactLevel} impact
                      </Badge>
                    </div>
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Current Method</p>
                  <p className="text-sm text-slate-300">{opp.currentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Proposed Automation</p>
                  <p className="text-sm text-slate-300">{opp.proposedAutomation}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 rounded-lg bg-slate-800/50 p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm text-white font-medium">{opp.estimatedHoursSaved}h/week saved</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-white font-medium">{opp.estimatedMonthlyCost}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                  <Wrench className="h-3 w-3" /> Suggested Tools
                </p>
                <div className="flex flex-wrap gap-2">
                  {opp.toolSuggestions.map((t) => (
                    <Badge key={t} variant="outline">{t}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">Implementation Steps</p>
                <ol className="space-y-1">
                  {opp.implementationSteps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                      <ChevronRight className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
