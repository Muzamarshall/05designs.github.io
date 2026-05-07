import type { AnalysisRecord } from "@/types/analysis";

// D1 is accessed via the Cloudflare Workers binding in production.
// In local dev (Next.js), we call the Cloudflare REST API as a fallback.

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

async function d1Query<T = unknown>(
  sql: string,
  params: (string | number | null)[] = []
): Promise<T[]> {
  // In Cloudflare Workers runtime, use the binding directly
  // This REST fallback is used during local Next.js dev
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`D1 query failed: ${err}`);
  }

  const data = (await res.json()) as {
    result: Array<{ results: T[] }>;
    success: boolean;
  };

  return data.result?.[0]?.results ?? [];
}

export async function createAnalysisRecord(params: {
  id: string;
  approvalToken: string;
  contactEmail: string;
  contactName: string;
  companyName: string;
  formData: string;
  analysisJson: string;
}): Promise<void> {
  await d1Query(
    `INSERT INTO analyses (id, approval_token, contact_email, contact_name, company_name, form_data, analysis_json)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      params.id,
      params.approvalToken,
      params.contactEmail,
      params.contactName,
      params.companyName,
      params.formData,
      params.analysisJson,
    ]
  );
}

export async function getAnalysisById(id: string): Promise<AnalysisRecord | null> {
  const rows = await d1Query<AnalysisRecord>(
    "SELECT * FROM analyses WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] ?? null;
}

export async function getAnalysisByToken(token: string): Promise<AnalysisRecord | null> {
  const rows = await d1Query<AnalysisRecord>(
    "SELECT * FROM analyses WHERE approval_token = ? LIMIT 1",
    [token]
  );
  return rows[0] ?? null;
}

export async function updateApprovalStatus(
  token: string,
  status: "approved" | "sent"
): Promise<void> {
  const approvedAt = status === "sent" ? new Date().toISOString() : null;
  await d1Query(
    "UPDATE analyses SET approval_status = ?, approved_at = ? WHERE approval_token = ?",
    [status, approvedAt, token]
  );
}

export async function updateFollowUpEdited(
  token: string,
  text: string
): Promise<void> {
  await d1Query(
    "UPDATE analyses SET follow_up_edited = ? WHERE approval_token = ?",
    [text, token]
  );
}

export async function updatePaymentStatus(
  sessionId: string,
  type: "pdf" | "email",
  stripeSessionId: string
): Promise<void> {
  const field = type === "pdf" ? "pdf_downloaded" : "email_sent";
  await d1Query(
    `UPDATE analyses SET ${field} = 1, stripe_session_id = ? WHERE id = ?`,
    [stripeSessionId, sessionId]
  );
}

export async function getAllAnalyses(): Promise<AnalysisRecord[]> {
  return d1Query<AnalysisRecord>(
    "SELECT id, approval_token, approval_status, contact_email, contact_name, company_name, created_at, approved_at, pdf_downloaded, email_sent FROM analyses ORDER BY created_at DESC"
  );
}
