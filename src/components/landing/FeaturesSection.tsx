import { GitBranch, Bot, FileText, Mail, Database, Shield } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Interactive Workflow Diagram",
    description:
      "Get a colour-coded visual map of your entire business — every process, decision, person, and system, with hover tooltips for each node.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Bot,
    title: "AI Automation Opportunities",
    description:
      "Our AI highlights every process that can be automated, suggests the right tools, and estimates hours saved and cost reduction.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: FileText,
    title: "Detailed ROI Report",
    description:
      "Receive a professional report with current state analysis, roadmap, tool recommendations, and concrete ROI estimates.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Mail,
    title: "PDF Download & Email Delivery",
    description:
      "Download your full report as a polished PDF or have it sent directly to your inbox for easy sharing with your team.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Database,
    title: "CRM Lead Capture",
    description:
      "Every analysis is stored in a structured Airtable CRM — pain points, suggested workflows, tools, and best practices, all organised.",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
  {
    icon: Shield,
    title: "Owner Approval Workflow",
    description:
      "Before any follow-up is sent to the client, you review and approve the personalised proposal — keeping you in full control.",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white">
            Everything You Need to{" "}
            <span className="gradient-text">Modernise Your Business</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            From workflow mapping to AI recommendations to client proposals — the entire process in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900"
            >
              <div className={`mb-4 inline-flex rounded-lg border p-2.5 ${f.bg}`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
