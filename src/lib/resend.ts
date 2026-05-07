import { Resend } from "resend";
import type { AnalysisResult } from "@/types/analysis";

function getClient() {
  return new Resend(process.env.RESEND_API_KEY!);
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const FROM = process.env.RESEND_FROM_EMAIL || "noreply@example.com";
const OWNER_NAME = process.env.OWNER_NAME || "The Team";

export async function sendOwnerNotification(params: {
  sessionId: string;
  approvalToken: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  analysis: AnalysisResult;
}): Promise<void> {
  const resend = getClient();
  const { sessionId, approvalToken, companyName, contactName, contactEmail, analysis } = params;
  const est = analysis.report.estimatedResults;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;margin:0;padding:24px}
.card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;margin-bottom:16px}
h1{color:#22d3ee;font-size:24px;margin:0 0 8px}
h2{color:#94a3b8;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px}
h3{color:#e2e8f0;font-size:16px;margin:0 0 8px}
p{color:#cbd5e1;line-height:1.6;margin:0 0 12px}
ul{color:#cbd5e1;padding-left:20px}li{margin-bottom:6px}
.metric{display:inline-block;background:#0f172a;border:1px solid #22d3ee33;border-radius:8px;padding:12px 20px;margin:4px;text-align:center}
.metric-value{color:#22d3ee;font-size:24px;font-weight:bold}
.metric-label{color:#94a3b8;font-size:12px}
.btn{display:inline-block;padding:14px 28px;border-radius:8px;font-weight:bold;text-decoration:none;margin:8px}
.btn-approve{background:#10b981;color:#fff}
.btn-admin{background:#6366f1;color:#fff}
.pre{background:#0f172a;border:1px solid #334155;border-radius:8px;padding:16px;font-family:monospace;font-size:13px;white-space:pre-wrap;color:#e2e8f0}
</style></head>
<body>
<div class="card">
  <h1>🔔 New Analysis: ${companyName}</h1>
  <p>A new business workflow analysis has been completed and requires your review.</p>
  <p><strong>Contact:</strong> ${contactName} &lt;${contactEmail}&gt;</p>
</div>

<div class="card">
  <h2>Company Summary</h2>
  <p>${analysis.ownerEmail.companySummary}</p>
</div>

<div class="card">
  <h2>Pain Points</h2>
  <p>${analysis.crm.painPointsSummary}</p>
  <h3>Suggested AI Workflows</h3>
  <ul>${analysis.crm.suggestedWorkflows.map((w) => `<li>${w}</li>`).join("")}</ul>
  <h3>Tools Needed</h3>
  <ul>${analysis.crm.toolsNeeded.map((t) => `<li>${t}</li>`).join("")}</ul>
</div>

<div class="card">
  <h2>Estimated Results</h2>
  <div class="metric"><div class="metric-value">${est.timeSavingsHoursPerWeek}h</div><div class="metric-label">Saved/Week</div></div>
  <div class="metric"><div class="metric-value">${est.timeSavingsPercentage}%</div><div class="metric-label">Time Savings</div></div>
  <div class="metric"><div class="metric-value">${est.efficiencyGainPercentage}%</div><div class="metric-label">Efficiency Gain</div></div>
  <div class="metric"><div class="metric-value">${est.roiTimelineMonths}mo</div><div class="metric-label">ROI Timeline</div></div>
  <p style="margin-top:12px"><strong>Cost Reduction:</strong> ${est.costReductionEstimate}</p>
</div>

<div class="card">
  <h2>Proposal Draft</h2>
  <div class="pre">${analysis.ownerEmail.proposalDraft}</div>
</div>

<div class="card">
  <h2>Follow-Up Message (sent to client on approval)</h2>
  <div class="pre">${analysis.ownerEmail.followUpMessage}</div>
</div>

<div class="card" style="text-align:center">
  <p>Review and take action:</p>
  <a href="${APP_URL}/api/approve/${approvalToken}" class="btn btn-approve">✅ Approve & Send Follow-Up</a>
  <a href="${APP_URL}/admin" class="btn btn-admin">✏️ Edit in Admin Dashboard</a>
  <a href="${APP_URL}/results/${sessionId}" class="btn" style="background:#334155;color:#e2e8f0">📊 View Full Analysis</a>
</div>
</body>
</html>`;

  await resend.emails.send({
    from: FROM,
    to: process.env.OWNER_EMAIL!,
    subject: `New Analysis: ${companyName} — Review Required`,
    html,
  });
}

export async function sendClientFollowUp(params: {
  sessionId: string;
  contactName: string;
  contactEmail: string;
  companyName: string;
  followUpMessage: string;
}): Promise<void> {
  const resend = getClient();
  const { sessionId, contactName, contactEmail, companyName, followUpMessage } = params;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
body{font-family:system-ui,sans-serif;background:#ffffff;color:#1e293b;margin:0;padding:24px}
.header{background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:12px;padding:32px;margin-bottom:24px;text-align:center}
h1{color:#22d3ee;margin:0 0 8px}
.tagline{color:#94a3b8;margin:0}
.body-text{line-height:1.8;color:#334155;white-space:pre-wrap}
.btn{display:inline-block;background:#22d3ee;color:#0f172a;padding:14px 32px;border-radius:8px;font-weight:bold;text-decoration:none;margin-top:24px}
.footer{margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:13px}
</style></head>
<body>
<div class="header">
  <h1>Your Business Automation Analysis</h1>
  <p class="tagline">Personalised insights for ${companyName}</p>
</div>

<p>Hi ${contactName},</p>

<div class="body-text">${followUpMessage}</div>

<div style="text-align:center;margin-top:32px">
  <a href="${APP_URL}/results/${sessionId}" class="btn">📊 View Your Full Analysis Report</a>
</div>

<div class="footer">
  <p>Best regards,<br>${OWNER_NAME}</p>
  <p>Reply directly to this email if you have any questions.</p>
</div>
</body>
</html>`;

  await resend.emails.send({
    from: FROM,
    to: contactEmail,
    subject: `Your Business Automation Analysis is Ready — ${companyName}`,
    html,
  });
}

export async function sendReportEmail(params: {
  sessionId: string;
  contactName: string;
  contactEmail: string;
  companyName: string;
  analysis: AnalysisResult;
}): Promise<void> {
  const resend = getClient();
  const { sessionId, contactName, contactEmail, companyName, analysis } = params;
  const est = analysis.report.estimatedResults;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
body{font-family:system-ui,sans-serif;background:#fff;color:#1e293b;margin:0;padding:24px}
.header{background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:12px;padding:32px;text-align:center;margin-bottom:24px}
h1{color:#22d3ee;margin:0 0 4px}h2{color:#475569;margin:16px 0 8px}
.metric-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:16px 0}
.metric{background:#f8fafc;border-radius:8px;padding:16px;text-align:center}
.metric-value{font-size:28px;font-weight:bold;color:#0f172a}
.metric-label{color:#64748b;font-size:12px;margin-top:4px}
ul{color:#475569;padding-left:20px}li{margin-bottom:6px}
.btn{display:inline-block;background:#22d3ee;color:#0f172a;padding:14px 32px;border-radius:8px;font-weight:bold;text-decoration:none}
.footer{margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:13px}
</style></head>
<body>
<div class="header">
  <h1>Business Workflow Analysis Report</h1>
  <p style="color:#94a3b8;margin:0">${companyName}</p>
</div>

<p>Hi ${contactName},</p>
<p>Here is your personalised Business Workflow Analysis Report. Below is a summary of key findings and your AI automation opportunity estimates.</p>

<h2>Estimated Impact</h2>
<div class="metric-grid">
  <div class="metric"><div class="metric-value">${est.timeSavingsHoursPerWeek}h</div><div class="metric-label">Hours Saved/Week</div></div>
  <div class="metric"><div class="metric-value">${est.efficiencyGainPercentage}%</div><div class="metric-label">Efficiency Gain</div></div>
  <div class="metric"><div class="metric-value">${est.costReductionEstimate}</div><div class="metric-label">Monthly Savings</div></div>
  <div class="metric"><div class="metric-value">${est.roiTimelineMonths} mo</div><div class="metric-label">ROI Timeline</div></div>
</div>

<h2>Key Benefits</h2>
<ul>${est.keyBenefits.map((b) => `<li>${b}</li>`).join("")}</ul>

<h2>Top Automation Opportunities</h2>
<ul>${analysis.automationOpportunities.slice(0, 4).map((o) => `<li><strong>${o.processName}</strong> — ${o.proposedAutomation}</li>`).join("")}</ul>

<div style="text-align:center;margin-top:32px">
  <a href="${APP_URL}/results/${sessionId}" class="btn">View Full Report & Diagram</a>
</div>

<div class="footer">
  <p>Best regards,<br>${OWNER_NAME}</p>
</div>
</body>
</html>`;

  await resend.emails.send({
    from: FROM,
    to: contactEmail,
    subject: `Your Business Workflow Analysis Report — ${companyName}`,
    html,
  });
}
