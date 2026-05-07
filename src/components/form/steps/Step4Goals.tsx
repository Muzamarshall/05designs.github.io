"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Sparkles } from "lucide-react";
import type { FormData } from "@/types/analysis";

const BUDGET_OPTIONS = [
  "Under $1,000", "$1,000 – $5,000", "$5,000 – $20,000", "$20,000+", "Not sure yet",
];

const TIMELINE_OPTIONS = [
  "As soon as possible", "Within 1–3 months", "3–6 months", "6+ months",
];

const PRIORITY_SUGGESTIONS = [
  "Reduce manual data entry", "Speed up customer onboarding", "Automate reporting",
  "Improve team communication", "Streamline invoicing", "Automate lead follow-up",
  "Better inventory management", "Automate customer support",
];

interface Props {
  data: FormData;
  update: (partial: Partial<FormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function Step4Goals({ data, update, onBack, onSubmit }: Props) {
  const [area, setArea] = useState("");
  const canSubmit =
    data.goalsDescription.length > 20 && data.budgetRange && data.timeline;

  const addArea = (v: string) => {
    if (!data.priorityAreas.includes(v)) {
      update({ priorityAreas: [...data.priorityAreas, v] });
    }
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-white">Goals & Budget</h2>
      <p className="mb-8 text-slate-400">
        What outcomes do you want? This shapes our AI automation roadmap for your business.
      </p>

      <div className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            What are your main business goals? <span className="text-red-400">*</span>
          </label>
          <Textarea
            value={data.goalsDescription}
            onChange={(e) => update({ goalsDescription: e.target.value })}
            placeholder="What does success look like? Do you want to scale without hiring? Cut costs? Improve customer experience? Free up time for strategic work? Be specific about what you want to achieve..."
            className="min-h-[120px]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Priority Areas for Automation
          </label>
          <div className="mb-3 flex flex-wrap gap-2">
            {PRIORITY_SUGGESTIONS.filter((s) => !data.priorityAreas.includes(s)).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addArea(s)}
                className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (area.trim()) { addArea(area.trim()); setArea(""); }
                }
              }}
              placeholder="Or type a custom priority..."
              className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => {
                if (area.trim()) { addArea(area.trim()); setArea(""); }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {data.priorityAreas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.priorityAreas.map((a, i) => (
                <Badge
                  key={i}
                  variant="success"
                  className="gap-1 cursor-pointer"
                  onClick={() => update({ priorityAreas: data.priorityAreas.filter((_, idx) => idx !== i) })}
                >
                  {a} <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Budget for Automation <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-col gap-2">
              {BUDGET_OPTIONS.map((b) => (
                <label key={b} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="budget"
                    value={b}
                    checked={data.budgetRange === b}
                    onChange={() => update({ budgetRange: b })}
                    className="h-4 w-4 accent-cyan-500"
                  />
                  <span className="text-sm text-slate-300">{b}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Implementation Timeline <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-col gap-2">
              {TIMELINE_OPTIONS.map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="timeline"
                    value={t}
                    checked={data.timeline === t}
                    onChange={() => update({ timeline: t })}
                    className="h-4 w-4 accent-cyan-500"
                  />
                  <span className="text-sm text-slate-300">{t}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={onSubmit} disabled={!canSubmit} size="lg" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate AI Analysis
        </Button>
      </div>
    </div>
  );
}
