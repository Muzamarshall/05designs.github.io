import Stripe from "stripe";

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });
}

export async function createCheckoutSession(params: {
  sessionId: string;
  productType: "pdf" | "email";
  contactEmail: string;
}): Promise<string> {
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const priceId =
    params.productType === "pdf"
      ? process.env.STRIPE_PDF_PRICE_ID!
      : process.env.STRIPE_EMAIL_PRICE_ID!;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: params.contactEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      sessionId: params.sessionId,
      productType: params.productType,
      contactEmail: params.contactEmail,
    },
    success_url: `${appUrl}/payment/success?checkout_session_id={CHECKOUT_SESSION_ID}&session_id=${params.sessionId}`,
    cancel_url: `${appUrl}/results/${params.sessionId}`,
  });

  return session.url!;
}
