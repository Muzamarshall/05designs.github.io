import Header from "@/components/layout/Header";
import AnalysisForm from "@/components/form/AnalysisForm";

export default function AnalyzePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-white">
              Analyse Your <span className="gradient-text">Business Workflow</span>
            </h1>
            <p className="mt-3 text-slate-400">
              Fill in the details below. Our AI will map your entire workflow and identify automation opportunities.
            </p>
          </div>
          <AnalysisForm />
        </div>
      </main>
    </>
  );
}
