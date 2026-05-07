import { Settings, GitBranch, Zap, ArrowRightLeft, Monitor, User } from "lucide-react";

const items = [
  { icon: Settings, label: "Process", color: "text-blue-400", bg: "border-blue-700 bg-blue-600/20" },
  { icon: GitBranch, label: "Decision", color: "text-amber-400", bg: "border-amber-700 bg-amber-600/20" },
  { icon: Zap, label: "AI Automation Ready", color: "text-emerald-400", bg: "border-emerald-600 bg-emerald-500/20" },
  { icon: ArrowRightLeft, label: "Input / Output", color: "text-violet-400", bg: "border-violet-700 bg-violet-600/20" },
  { icon: Monitor, label: "System / Tool", color: "text-slate-400", bg: "border-slate-600 bg-slate-700/40" },
  { icon: User, label: "Person / Team", color: "text-rose-400", bg: "border-rose-700 bg-rose-600/20" },
];

export default function DiagramLegend() {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {items.map(({ icon: Icon, label, color, bg }) => (
        <div key={label} className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${bg}`}>
          <Icon className={`h-3.5 w-3.5 ${color}`} />
          <span className="text-slate-300">{label}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 rounded-lg border border-emerald-600/50 bg-emerald-500/10 px-3 py-1.5 text-xs">
        <span className="font-bold text-emerald-400 text-[10px]">AI</span>
        <span className="text-slate-300">= Automation candidate</span>
      </div>
    </div>
  );
}
