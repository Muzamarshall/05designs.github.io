import { NextRequest, NextResponse } from "next/server";
import { getAnalysisById } from "@/lib/d1";
import { sendReportEmail } from "@/lib/resend";
import type { AnalysisResult } from "@/types/analysis";

export async function POST(req: NextRequest) {
  const { sessionId, contactEmail } = await req.json();
  if (!sessionId || !contactEmail) {
    return NextResponse.json({ error: "sessionId and contactEmail required" }, { status: 400 });
  }

  const record = await getAnalysisById(sessionId);
  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const analysis: AnalysisResult = JSON.parse(record.analysis_json);
  await sendReportEmail({
    sessionId,
    contactName: record.contact_name,
    contactEmail,
    companyName: record.company_name,
    analysis,
  });

  return NextResponse.json({ success: true });
}
