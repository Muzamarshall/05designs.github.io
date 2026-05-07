"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FormData } from "@/types/analysis";

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Retail & E-commerce", "Real Estate",
  "Marketing & Advertising", "Legal", "Education", "Manufacturing", "Logistics",
  "Hospitality", "Construction", "Consulting", "Media & Entertainment", "Other",
];

const COMPANY_SIZES = [
  "Solo / Freelancer", "2–10 employees", "11–50 employees",
  "51–200 employees", "200+ employees",
];

interface Props {
  data: FormData;
  update: (partial: Partial<FormData>) => void;
  onNext: () => void;
}

export default function Step1CompanyInfo({ data, update, onNext }: Props) {
  const canProceed =
    data.companyName && data.industry && data.companySize &&
    data.contactName && data.contactEmail;

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-white">Company Information</h2>
      <p className="mb-8 text-slate-400">Tell us about your company.</p>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Company Name <span className="text-red-400">*</span>
            </label>
            <Input
              value={data.companyName}
              onChange={(e) => update({ companyName: e.target.value })}
              placeholder="Acme Corporation"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Website
            </label>
            <Input
              value={data.website}
              onChange={(e) => update({ website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Industry <span className="text-red-400">*</span>
            </label>
            <select
              value={data.industry}
              onChange={(e) => update({ industry: e.target.value })}
              className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Company Size <span className="text-red-400">*</span>
            </label>
            <select
              value={data.companySize}
              onChange={(e) => update({ companySize: e.target.value })}
              className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <option value="">Select size</option>
              {COMPANY_SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Your Name <span className="text-red-400">*</span>
            </label>
            <Input
              value={data.contactName}
              onChange={(e) => update({ contactName: e.target.value })}
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Email Address <span className="text-red-400">*</span>
            </label>
            <Input
              type="email"
              value={data.contactEmail}
              onChange={(e) => update({ contactEmail: e.target.value })}
              placeholder="jane@company.com"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} disabled={!canProceed}>
          Next: Operations →
        </Button>
      </div>
    </div>
  );
}
