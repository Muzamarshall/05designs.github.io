import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { getAnalysisById, updatePaymentStatus } from "@/lib/d1";
import { updatePaymentStatus as updateAirtable } from "@/lib/airtable";
import { sendReportEmail } from "@/lib/resend";
import type { AnalysisResult } from "@/types/analysis";

export async function POST(req: NextRequest) {
  try {
    const { orderId, sessionId, productType } = await req.json();

    if (!orderId || !sessionId || !productType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await capturePayPalOrder(orderId);

    if (result.status !== "COMPLETED") {
      return NextResponse.json(
        { error: `Payment not completed. Status: ${result.status}` },
        { status: 400 }
      );
    }

    const record = await getAnalysisById(sessionId);
    if (!record) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Update D1 and Airtable
    await updatePaymentStatus(sessionId, productType as "pdf" | "email", `PAYPAL-${orderId}`);
    updateAirtable(sessionId, productType as "pdf" | "email").catch(console.error);

    // Send email report if applicable
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PayPal capture error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Capture failed" },
      { status: 500 }
    );
  }
}
