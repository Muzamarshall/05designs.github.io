import { NextRequest, NextResponse } from "next/server";
import { getAnalysisByToken, updateApprovalStatus } from "@/lib/d1";
import { updateApprovalStatus as updateAirtable } from "@/lib/airtable";
import { sendClientFollowUp } from "@/lib/resend";
import type { AnalysisResult } from "@/types/analysis";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const record = await getAnalysisByToken(params.token);

  if (!record) {
    return new NextResponse(html("Error", "Invalid approval token. Please check the link."), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (record.approval_status === "sent") {
    return new NextResponse(
      html("Already Sent", `The follow-up email was already sent to ${record.contact_email} on ${record.approved_at ?? "an earlier date"}.`),
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const analysis: AnalysisResult = JSON.parse(record.analysis_json);
  const followUpMessage = record.follow_up_edited ?? analysis.ownerEmail.followUpMessage;

  // Send client follow-up email
  await sendClientFollowUp({
    sessionId: record.id,
    contactName: record.contact_name,
    contactEmail: record.contact_email,
    companyName: record.company_name,
    followUpMessage,
  });

  // Update D1
  await updateApprovalStatus(params.token, "sent");

  // Update Airtable (non-blocking)
  updateAirtable(params.token, "Sent").catch((e) =>
    console.error("Airtable update failed:", e)
  );

  return new NextResponse(
    html(
      "✅ Follow-Up Sent!",
      `The follow-up email has been sent to <strong>${record.contact_email}</strong> for <strong>${record.company_name}</strong>.<br><br>
       <a href="${APP_URL}/results/${record.id}" style="color:#22d3ee">View their full analysis →</a>`
    ),
    { headers: { "Content-Type": "text/html" } }
  );
}

function html(title: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title} — FlowIQ</title>
<style>body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center;margin:0}
.card{background:#1e293b;border:1px solid #334155;border-radius:16px;padding:48px;max-width:480px;text-align:center}
h1{color:#22d3ee;font-size:28px;margin:0 0 16px}
p{color:#cbd5e1;line-height:1.7;margin:0}
a{color:#22d3ee}</style></head>
<body>
<div class="card">
  <h1>${title}</h1>
  <p>${body}</p>
</div>
</body>
</html>`;
}
