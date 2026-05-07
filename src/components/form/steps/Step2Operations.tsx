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

function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder,
}: {
  tags: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
  placeholder: string;
}) {
  const [val, setVal] = useState("");
  const add = () => {
    const v = val.trim();
    if (v && !tags.includes(v)) { onAdd(v); setVal(""); }
  };
  return (
    <div>
      <div className="flex gap-2">
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
        />
        <Button type="button" variant="secondary" size="icon" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Badge key={i} className="gap-1 cursor-pointer" onClick={() => onRemove(i)}>
              {tag} <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Step2Operations({ data, update, onNext, onBack }: Props) {
  const canProceed = data.operationsDescription.length > 50;

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-white">Current Operations</h2>
      <p className="mb-8 text-slate-400">
        Describe how your business operates day-to-day. The more detail, the better the analysis.
      </p>

      <div className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Describe your business operations and workflow <span className="text-red-400">*</span>
          </label>
          <Textarea
            value={data.operationsDescription}
            onChange={(e) => update({ operationsDescription: e.target.value })}
            placeholder="Walk us through a typical day/week in your business. How do leads come in? How are orders processed? How does your team communicate? What are the main processes? Be as detailed as possible..."
            className="min-h-[150px]"
          />
          <p className="mt-1 text-xs text-slate-500">
            {data.operationsDescription.length} characters (aim for 100+)
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Departments / Teams
          </label>
          <TagInput
            tags={data.departments}
            onAdd={(v) => update({ departments: [...data.departments, v] })}
            onRemove={(i) => update({ departments: data.departments.filter((_, idx) => idx !== i) })}
            placeholder="e.g. Sales, Operations, Finance..."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Tools & Software Currently Used
          </label>
          <TagInput
            tags={data.currentTools}
            onAdd={(v) => update({ currentTools: [...data.currentTools, v] })}
            onRemove={(i) => update({ currentTools: data.currentTools.filter((_, idx) => idx !== i) })}
            placeholder="e.g. Slack, HubSpot, QuickBooks..."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Number of Employees Involved
          </label>
          <Input
            type="number"
            value={data.employeeCount}
            onChange={(e) => update({ employeeCount: e.target.value })}
            placeholder="e.g. 12"
            className="max-w-[200px]"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Next: Pain Points →
        </Button>
      </div>
    </div>
  );
}
