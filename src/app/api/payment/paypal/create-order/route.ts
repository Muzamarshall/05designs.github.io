import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";

const PRICES = { pdf: 9.99, email: 4.99 };
const DESCRIPTIONS = {
  pdf: "FlowIQ PDF Report Download",
  email: "FlowIQ Email Report Delivery",
};

export async function POST(req: NextRequest) {
  try {
    const { sessionId, productType, contactEmail } = await req.json();

    if (!sessionId || !productType || !contactEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const amount = PRICES[productType as "pdf" | "email"];
    const description = DESCRIPTIONS[productType as "pdf" | "email"];

    const result = await createPayPalOrder({
      sessionId,
      productType,
      contactEmail,
      amount,
      description,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("PayPal create-order error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "PayPal order failed" },
      { status: 500 }
    );
  }
}
