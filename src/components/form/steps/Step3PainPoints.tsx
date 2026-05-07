"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { FormData } from "@/types/analysis";

interface Props {
  data: FormData;
  update: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3PainPoints({ data, update, onNext, onBack }: Props) {
  const [bottleneck, setBottleneck] = useState("");
  const canProceed = data.painPointsDescription.length > 30;

  const addBottleneck = () => {
    const v = bottleneck.trim();
    if (v && !data.bottlenecks.includes(v)) {
      update({ bottlenecks: [...data.bottlenecks, v] });
      setBottleneck("");
    }
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-white">Pain Points & Challenges</h2>
      <p className="mb-8 text-slate-400">
        Tell us what's slowing your business down. This helps us identify the best automation opportunities.
      </p>

      <div className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Describe your biggest operational challenges <span className="text-red-400">*</span>
          </label>
          <Textarea
            value={data.painPointsDescription}
            onChange={(e) => update({ painPointsDescription: e.target.value })}
            placeholder="What tasks take the most time? What gets repeated unnecessarily? Where do things fall through the cracks? What frustrates your team the most? Where do you lose money or customers?"
            className="min-h-[130px]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Specific Bottlenecks
          </label>
          <div className="flex gap-2">
            <Input
              value={bottleneck}
              onChange={(e) => setBottleneck(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBottleneck())}
              placeholder="e.g. Manual invoice processing..."
            />
            <Button type="button" variant="secondary" size="icon" onClick={addBottleneck}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {data.bottlenecks.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.bottlenecks.map((b, i) => (
                <Badge
                  key={i}
                  variant="warning"
                  className="gap-1 cursor-pointer"
                  onClick={() => update({ bottlenecks: data.bottlenecks.filter((_, idx) => idx !== i) })}
                >
                  {b} <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Estimated Hours Wasted Per Week on Manual/Repetitive Tasks
          </label>
          <Input
            type="number"
            value={data.timeWastedHours}
            onChange={(e) => update({ timeWastedHours: e.target.value })}
            placeholder="e.g. 20"
            className="max-w-[200px]"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Next: Goals →
        </Button>
      </div>
    </div>
  );
}
