import { NextRequest, NextResponse } from "next/server";
import { verifyPaynowResult, isPaynowPaid, type PaynowResultPayload } from "@/lib/paynow";
import { getAnalysisById, updatePaymentStatus } from "@/lib/d1";
import { updatePaymentStatus as updateAirtable } from "@/lib/airtable";
import { sendReportEmail } from "@/lib/resend";
import type { AnalysisResult } from "@/types/analysis";

// PayNow sends POST with URL-encoded body
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const params = Object.fromEntries(
      rawBody.split("&").map((p) => {
        const [k, v] = p.split("=");
        return [
          decodeURIComponent(k ?? ""),
          decodeURIComponent((v ?? "").replace(/\+/g, " ")),
        ];
      })
    ) as Record<string, string>;

    const payload = params as unknown as PaynowResultPayload;

    // Verify hash signature
    if (!verifyPaynowResult(payload)) {
      console.error("PayNow result: invalid hash");
      return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
    }

    if (!isPaynowPaid(payload.status)) {
      // Not paid yet — acknowledge but don't deliver
      return NextResponse.json({ received: true });
    }

    // Extract our session ID from the reference (format: FLOWIQ-{sessionId}-{timestamp})
    const parts = payload.reference.split("-");
    // reference format: FLOWIQ-{sessionId}-{timestamp}
    // sessionId is the second segment (nanoid, 12 chars)
    const sessionId = parts[1];
    if (!sessionId) {
      console.error("PayNow result: could not extract sessionId from reference", payload.reference);
      return NextResponse.json({ received: true });
    }

    // Derive productType from the reference (stored in paynow additionalinfo)
    // We look it up from D1 to get the actual product
    const record = await getAnalysisById(sessionId);
    if (!record) {
      console.error("PayNow result: record not found for sessionId", sessionId);
      return NextResponse.json({ received: true });
    }

    // Determine product type from amount
    const amount = parseFloat(payload.amount);
    const productType: "pdf" | "email" = amount >= 9 ? "pdf" : "email";

    // Update D1 and Airtable
    await updatePaymentStatus(sessionId, productType, `PAYNOW-${payload.paynowreference}`);
    updateAirtable(sessionId, productType).catch(console.error);

    // Send email report if that's the product
    if (productType === "email") {
      const analysis: AnalysisResult = JSON.parse(record.analysis_json);
      await sendReportEmail({
        sessionId,
        contactName: record.contact_name,
        contactEmail: record.contact_email,
        companyName: record.company_name,
        analysis,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("PayNow result error:", err);
    return NextResponse.json({ received: true }); // Always 200 to PayNow
  }
}
