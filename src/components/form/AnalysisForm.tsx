"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import Step1CompanyInfo from "./steps/Step1CompanyInfo";
import Step2Operations from "./steps/Step2Operations";
import Step3PainPoints from "./steps/Step3PainPoints";
import Step4Goals from "./steps/Step4Goals";
import type { FormData } from "@/types/analysis";

const STEPS = ["Company Info", "Operations", "Pain Points", "Goals & Budget"];

const emptyForm: FormData = {
  companyName: "",
  industry: "",
  companySize: "",
  website: "",
  contactName: "",
  contactEmail: "",
  operationsDescription: "",
  departments: [],
  currentTools: [],
  employeeCount: "",
  painPointsDescription: "",
  bottlenecks: [],
  timeWastedHours: "",
  goalsDescription: "",
  priorityAreas: [],
  budgetRange: "",
  timeline: "",
};

export default function AnalysisForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const update = (partial: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...partial }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setLoadingMessage("Starting analysis...");
    setLoadingProgress(5);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });

      // Simulate streaming progress while waiting for the response
      const progressSteps = [
        { msg: "Analysing your business structure...", pct: 20 },
        { msg: "Mapping workflow processes...", pct: 40 },
        { msg: "Identifying AI automation opportunities...", pct: 60 },
        { msg: "Calculating ROI estimates...", pct: 75 },
        { msg: "Generating your blueprint...", pct: 85 },
        { msg: "Finalising your report...", pct: 95 },
      ];

      let pIdx = 0;
      const interval = setInterval(() => {
        if (pIdx < progressSteps.length) {
          setLoadingMessage(progressSteps[pIdx].msg);
          setLoadingProgress(progressSteps[pIdx].pct);
          pIdx++;
        }
      }, 4000);

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setLoadingProgress(100);
      setLoadingMessage("Complete! Redirecting...");
      await new Promise((r) => setTimeout(r, 600));
      router.push(`/results/${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="mb-8 text-6xl">🤖</div>
        <h2 className="mb-2 text-2xl font-bold text-white">
          AI is Analysing Your Business
        </h2>
        <p className="mb-8 text-slate-400">{loadingMessage}</p>
        <Progress value={loadingProgress} className="mx-auto max-w-md" />
        <p className="mt-4 text-sm text-slate-500">{loadingProgress}% complete</p>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  i < step
                    ? "bg-cyan-500 text-slate-900"
                    : i === step
                    ? "border-2 border-cyan-500 text-cyan-400"
                    : "border border-slate-700 text-slate-600"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`hidden text-xs sm:block ${
                  i === step ? "text-white font-medium" : "text-slate-500"
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`ml-2 h-px w-8 sm:w-16 ${
                    i < step ? "bg-cyan-500" : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <Progress value={((step) / (STEPS.length - 1)) * 100} />
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="glass rounded-2xl p-8">
        {step === 0 && (
          <Step1CompanyInfo data={formData} update={update} onNext={next} />
        )}
        {step === 1 && (
          <Step2Operations data={formData} update={update} onNext={next} onBack={back} />
        )}
        {step === 2 && (
          <Step3PainPoints data={formData} update={update} onNext={next} onBack={back} />
        )}
        {step === 3 && (
          <Step4Goals
            data={formData}
            update={update}
            onBack={back}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
