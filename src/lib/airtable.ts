import Airtable from "airtable";
import type { AnalysisResult, FormData } from "@/types/analysis";

function getBase() {
  Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY! });
  return Airtable.base(process.env.AIRTABLE_BASE_ID!);
}

export async function createLeadRecord(
  sessionId: string,
  approvalToken: string,
  formData: FormData,
  analysis: AnalysisResult
): Promise<void> {
  const base = getBase();
  const table = process.env.AIRTABLE_TABLE_NAME || "Leads";

  await base(table).create([
    {
      fields: {
        "Session ID": sessionId,
        "Approval Token": approvalToken,
        "Company Name": formData.companyName,
        Industry: formData.industry,
        "Company Size": formData.companySize,
        "Contact Name": formData.contactName,
        "Contact Email": formData.contactEmail,
        Website: formData.website || "",
        "Operations Description": formData.operationsDescription,
        "Pain Points Summary": analysis.crm.painPointsSummary,
        "Suggested AI Workflows": analysis.crm.suggestedWorkflows.join("\n"),
        "Tools Needed": analysis.crm.toolsNeeded.join("\n"),
        "Best Practices": analysis.crm.bestPractices.join("\n"),
        "Est. Time Savings (hrs/wk)":
          analysis.report.estimatedResults.timeSavingsHoursPerWeek,
        "Est. Cost Reduction":
          analysis.report.estimatedResults.costReductionEstimate,
        "ROI Timeline (months)":
          analysis.report.estimatedResults.roiTimelineMonths,
        "Approval Status": "Pending",
        "Created At": new Date().toISOString().split("T")[0],
        "Budget Range": formData.budgetRange,
        Timeline: formData.timeline,
      },
    },
  ]);
}

export async function updateApprovalStatus(
  approvalToken: string,
  status: "Approved" | "Sent"
): Promise<void> {
  const base = getBase();
  const table = process.env.AIRTABLE_TABLE_NAME || "Leads";

  const records = await base(table)
    .select({ filterByFormula: `{Approval Token} = "${approvalToken}"`, maxRecords: 1 })
    .firstPage();

  if (records.length === 0) return;

  const updates: Record<string, string> = { "Approval Status": status };
  if (status === "Sent") {
    updates["Follow-up Sent At"] = new Date().toISOString().split("T")[0];
  }

  await base(table).update(records[0].id, updates);
}

export async function updatePaymentStatus(
  sessionId: string,
  type: "pdf" | "email"
): Promise<void> {
  const base = getBase();
  const table = process.env.AIRTABLE_TABLE_NAME || "Leads";

  const records = await base(table)
    .select({ filterByFormula: `{Session ID} = "${sessionId}"`, maxRecords: 1 })
    .firstPage();

  if (records.length === 0) return;

  const field = type === "pdf" ? "PDF Downloaded" : "Email Sent";
  await base(table).update(records[0].id, { [field]: true });
}
