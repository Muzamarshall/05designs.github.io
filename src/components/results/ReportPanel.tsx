import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, DollarSign, Zap, Map, Wrench } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";

interface Props {
  report: AnalysisResult["report"];
}

const PRIORITY_COLOR: Record<string, "default" | "warning" | "destructive"> = {
  low: "default",
  medium: "warning",
  high: "destructive",
};

export default function ReportPanel({ report }: Props) {
  const est = report.estimatedResults;

  return (
    <div className="space-y-6" id="report-content">
      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Clock, label: "Time Saved / Week", value: `${est.timeSavingsHoursPerWeek}h`, sub: `${est.timeSavingsPercentage}% reduction`, color: "text-cyan-400" },
          { icon: DollarSign, label: "Cost Reduction", value: est.costReductionEstimate, sub: "per month estimate", color: "text-emerald-400" },
          { icon: TrendingUp, label: "Efficiency Gain", value: `${est.efficiencyGainPercentage}%`, sub: "projected improvement", color: "text-violet-400" },
          { icon: Zap, label: "ROI Timeline", value: `${est.roiTimelineMonths} months`, sub: "to full return", color: "text-amber-400" },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="glass rounded-xl p-5">
            <Icon className={`mb-3 h-5 w-5 ${color}`} />
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="mt-1 text-xs font-medium text-white">{label}</div>
            <div className="text-xs text-slate-500">{sub}</div>
          </div>
        ))}
      </div>

      {/* Key Benefits */}
      <Card>
        <CardHeader><CardTitle>Key Benefits</CardTitle></CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {est.keyBenefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-0.5 text-emerald-400">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Current State Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-cyan-400" />
            Current State Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
            {report.currentStateAnalysis}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader><CardTitle>Automation Recommendations</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {report.automationRecommendations.map((rec) => (
            <div key={rec.title} className="rounded-lg border border-slate-800 p-4">
              <div className="flex items-start gap-3 mb-2">
                <Badge variant={PRIORITY_COLOR[rec.priority]} className="shrink-0 mt-0.5">
                  {rec.priority}
                </Badge>
                <span className="font-medium text-white">{rec.title}</span>
              </div>
              <p className="text-sm text-slate-400 ml-14">{rec.description}</p>
              <p className="mt-1 text-xs text-cyan-400 ml-14">Impact: {rec.estimatedImpact}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Roadmap */}
      <Card>
        <CardHeader><CardTitle>Prioritised Implementation Roadmap</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.prioritizedRoadmap.map((item) => (
              <div key={item.phase} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-sm font-bold text-white">
                  {item.phase}
                </div>
                <div className="flex-1 pb-4 border-b border-slate-800 last:border-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-white">{item.title}</span>
                    <div className="flex gap-2 shrink-0">
                      <Badge variant="secondary">{item.duration}</Badge>
                      <Badge variant="outline">{item.estimatedCost}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-amber-400" />
            Recommended Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {report.toolsRecommended.map((tool) => (
              <div key={tool.name} className="rounded-lg border border-slate-800 p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">{tool.name}</span>
                  <Badge variant="secondary">{tool.category}</Badge>
                </div>
                <p className="text-sm text-slate-400">{tool.purpose}</p>
                <p className="mt-1 text-xs text-emerald-400">{tool.estimatedCost}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Summary */}
      <Card className="border-cyan-500/30">
        <CardHeader>
          <CardTitle className="gradient-text">Investment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 leading-relaxed">{report.investmentSummary}</p>
        </CardContent>
      </Card>
    </div>
  );
}
