import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BarChart3, GitBranch } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgb(34 211 238 / 0.1) 1px, transparent 1px), linear-gradient(90deg, rgb(34 211 238 / 0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
          <Zap className="h-3.5 w-3.5" />
          <span>AI-Powered Business Workflow Analysis</span>
        </div>

        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          Turn Your Business Into a{" "}
          <span className="gradient-text">Smart Workflow</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Describe your business operations. Our AI maps your entire workflow visually,
          identifies every process that can be automated, and delivers a personalised
          ROI report showing exactly how much time and money you can save.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/analyze">
            <Button size="lg" className="gap-2 px-8 text-base">
              Analyze My Business
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/#how-it-works">
            <Button size="lg" variant="outline" className="text-base">
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { icon: GitBranch, value: "8–15", label: "Workflow nodes mapped per analysis" },
            { icon: BarChart3, value: "30–60%", label: "Average efficiency gain identified" },
            { icon: Zap, value: "< 2 min", label: "Time to get your full AI report" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="glass rounded-xl p-6">
              <Icon className="mx-auto mb-3 h-6 w-6 text-cyan-400" />
              <div className="text-3xl font-bold gradient-text">{value}</div>
              <div className="mt-1 text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
