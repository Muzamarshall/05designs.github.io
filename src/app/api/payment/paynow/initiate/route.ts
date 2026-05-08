import { NextRequest, NextResponse } from "next/server";
import { initiatePaynowTransaction, type PaynowMethod } from "@/lib/paynow";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, productType, contactEmail, phone, method } = await req.json();

    if (!sessionId || !productType || !contactEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const amount = productType === "pdf" ? 9.99 : 4.99;
    const description = productType === "pdf"
      ? "FlowIQ PDF Report Download"
      : "FlowIQ Email Report Delivery";

    const isMobile = !!phone && !!method;

    const result = await initiatePaynowTransaction({
      reference: `FLOWIQ-${sessionId}-${Date.now()}`,
      amount,
      description,
      returnUrl: `${APP_URL}/payment/success?session_id=${sessionId}&gateway=paynow&product=${productType}`,
      resultUrl: `${APP_URL}/api/payment/paynow/result`,
      ...(isMobile && {
        customerEmail: contactEmail,
        phone,
        method: method as PaynowMethod,
      }),
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      browserUrl: result.browserUrl,
      pollUrl: result.pollUrl,
      instructions: result.instructions,
      isMobile,
    });
  } catch (err) {
    console.error("PayNow initiate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "PayNow failed" },
      { status: 500 }
    );
  }
}
