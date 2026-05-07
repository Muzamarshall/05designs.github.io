const steps = [
  {
    number: "01",
    title: "Describe Your Business",
    description:
      "Fill in a 4-step form covering your company info, current operations, pain points, and goals. Takes about 5 minutes.",
  },
  {
    number: "02",
    title: "AI Analyses Your Workflow",
    description:
      "Claude maps your entire business, identifies automation opportunities, and calculates ROI — all in under 2 minutes.",
  },
  {
    number: "03",
    title: "Explore Your Visual Blueprint",
    description:
      "Interact with your colour-coded workflow diagram. Hover over nodes for details. See exactly which processes can be automated.",
  },
  {
    number: "04",
    title: "Get Your Report & Proposal",
    description:
      "Download the PDF or receive it by email. We notify the owner with a personalised proposal that gets sent on approval.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            From description to full AI analysis in four simple steps.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-full hidden h-px w-full bg-gradient-to-r from-cyan-500/50 to-transparent lg:block" />
              )}

              <div className="glass rounded-xl p-6 h-full">
                <div className="mb-4 text-4xl font-bold gradient-text">{step.number}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
