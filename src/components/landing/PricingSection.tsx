import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free Analysis",
    price: "$0",
    period: "",
    description: "Full AI workflow analysis and interactive diagram — no payment required.",
    features: [
      "Complete business blueprint",
      "Interactive workflow diagram",
      "AI automation recommendations",
      "ROI estimates & roadmap",
      "Tool recommendations",
    ],
    cta: "Start Free Analysis",
    href: "/analyze",
    highlight: false,
  },
  {
    name: "Report Delivery",
    price: "$9.99",
    period: "one-time",
    description: "Download your analysis as a polished PDF or have it emailed to you.",
    features: [
      "Everything in Free",
      "PDF report download",
      "Email delivery to your inbox",
      "Shareable with your team",
      "Professional formatting",
    ],
    cta: "Get Your Report",
    href: "/analyze",
    highlight: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            The analysis is always free. Pay only if you want the PDF or email delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 ${
                plan.highlight
                  ? "border-2 border-cyan-500 bg-gradient-to-b from-cyan-500/10 to-transparent relative"
                  : "border border-slate-800 bg-slate-900/50"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-cyan-500/50 bg-cyan-500/20 px-4 py-1 text-xs font-semibold text-cyan-400">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-slate-400">/{plan.period}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-400">{plan.description}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <Check className="h-4 w-4 flex-shrink-0 text-cyan-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="mt-8 block">
                <Button
                  className="w-full"
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
