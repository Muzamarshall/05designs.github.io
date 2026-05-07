import { NextRequest, NextResponse } from "next/server";
import { getAnalysisById } from "@/lib/d1";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const record = await getAnalysisById(params.id);
  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    sessionId: record.id,
    companyName: record.company_name,
    contactName: record.contact_name,
    contactEmail: record.contact_email,
    analysisResult: JSON.parse(record.analysis_json),
    createdAt: record.created_at,
  });
}
