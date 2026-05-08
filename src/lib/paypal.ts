const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const creds = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("PayPal auth failed");
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export interface PayPalOrderResult {
  orderId: string;
  approveUrl: string;
}

export async function createPayPalOrder(params: {
  sessionId: string;
  productType: "pdf" | "email";
  contactEmail: string;
  amount: number;          // USD
  description: string;
}): Promise<PayPalOrderResult> {
  const token = await getAccessToken();

  const returnUrl = `${APP_URL}/payment/success?session_id=${params.sessionId}&gateway=paypal&product=${params.productType}`;
  const cancelUrl = `${APP_URL}/results/${params.sessionId}`;

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.sessionId,
          description: params.description,
          custom_id: `${params.sessionId}|${params.productType}|${params.contactEmail}`,
          amount: {
            currency_code: "USD",
            value: params.amount.toFixed(2),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            user_action: "PAY_NOW",
            return_url: returnUrl,
            cancel_url: cancelUrl,
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal order creation failed: ${err}`);
  }

  const order = (await res.json()) as {
    id: string;
    links: Array<{ rel: string; href: string }>;
  };

  const approveLink = order.links.find((l) => l.rel === "payer-action");
  if (!approveLink) throw new Error("No PayPal approve URL found");

  return { orderId: order.id, approveUrl: approveLink.href };
}

export async function capturePayPalOrder(orderId: string): Promise<{
  status: string;
  customId: string;
  payerId: string;
}> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal capture failed: ${err}`);
  }

  const data = (await res.json()) as {
    status: string;
    purchase_units: Array<{
      custom_id: string;
      payments: { captures: Array<{ id: string }> };
    }>;
    payer: { payer_id: string };
  };

  return {
    status: data.status,
    customId: data.purchase_units[0]?.custom_id ?? "",
    payerId: data.payer?.payer_id ?? "",
  };
}
