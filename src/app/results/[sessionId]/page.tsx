import { notFound } from "next/navigation";
import { getAnalysisById } from "@/lib/d1";
import type { AnalysisResult } from "@/types/analysis";
import Header from "@/components/layout/Header";
import ResultsTabs from "@/components/results/ResultsTabs";

interface Props {
  params: { sessionId: string };
}

export default async function ResultsPage({ params }: Props) {
  const record = await getAnalysisById(params.sessionId);
  if (!record) notFound();

  const analysis: AnalysisResult = JSON.parse(record.analysis_json);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              {record.company_name}{" "}
              <span className="gradient-text">Workflow Analysis</span>
            </h1>
            <p className="mt-1 text-slate-400">
              AI-generated business blueprint and automation report for {record.contact_name}
            </p>
          </div>
          <ResultsTabs
            analysis={analysis}
            sessionId={params.sessionId}
            contactEmail={record.contact_email}
          />
        </div>
      </main>
    </>
  );
}
