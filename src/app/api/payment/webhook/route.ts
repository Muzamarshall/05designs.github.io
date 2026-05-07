import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { updatePaymentStatus } from "@/lib/d1";
import { updatePaymentStatus as updateAirtable } from "@/lib/airtable";
import { sendReportEmail } from "@/lib/resend";
import { getAnalysisById } from "@/lib/d1";
import type { AnalysisResult } from "@/types/analysis";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as unknown as {
      id: string;
      metadata: { sessionId: string; productType: string; contactEmail: string };
    };

    const { sessionId, productType, contactEmail } = session.metadata;

    // Update D1 and Airtable
    await updatePaymentStatus(sessionId, productType as "pdf" | "email", session.id);
    updateAirtable(sessionId, productType as "pdf" | "email").catch(console.error);

    // For email product — send the report email now
    if (productType === "email") {
      const record = await getAnalysisById(sessionId);
      if (record) {
        const analysis: AnalysisResult = JSON.parse(record.analysis_json);
        await sendReportEmail({
          sessionId,
          contactName: record.contact_name,
          contactEmail,
          companyName: record.company_name,
          analysis,
        });
      }
    }
    // For pdf product — the PDF is generated client-side on the success page
  }

  return NextResponse.json({ received: true });
}
