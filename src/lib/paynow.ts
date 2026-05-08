import { createHash } from "crypto";

const PAYNOW_INITIATE_URL = "https://www.paynow.co.zw/interface/initiatetransaction";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export type PaynowMethod = "ecocash" | "onemoney" | "telecash" | "webpay";

export interface PaynowInitiateParams {
  reference: string;       // unique order reference
  amount: number;
  description: string;
  returnUrl?: string;      // where to send user after payment
  resultUrl: string;       // server webhook URL
  // Mobile money fields (omit for web/card payment)
  customerEmail?: string;
  phone?: string;
  method?: PaynowMethod;
}

export interface PaynowInitiateResult {
  success: boolean;
  browserUrl?: string;    // web payment redirect URL
  pollUrl?: string;       // mobile money status poll URL
  instructions?: string;  // mobile money user instructions
  error?: string;
}

function computeHash(values: string[], integrationKey: string): string {
  const raw = values.join("") + integrationKey;
  return createHash("sha512").update(raw).digest("hex").toUpperCase();
}

function parsePaynowResponse(body: string): Record<string, string> {
  return Object.fromEntries(
    body.split("&").map((pair) => {
      const [k, v] = pair.split("=");
      return [decodeURIComponent(k ?? ""), decodeURIComponent((v ?? "").replace(/\+/g, " "))];
    })
  );
}

export async function initiatePaynowTransaction(
  params: PaynowInitiateParams
): Promise<PaynowInitiateResult> {
  const integrationId = process.env.PAYNOW_INTEGRATION_ID!;
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY!;

  const returnUrl = params.returnUrl ?? `${APP_URL}/payment/success`;
  const status = "Message";
  const amountStr = params.amount.toFixed(2);

  // Build the fields for the request and hash
  const isMobile = !!params.phone && !!params.method;

  const fields: Record<string, string> = {
    id: integrationId,
    reference: params.reference,
    amount: amountStr,
    additionalinfo: params.description,
    returnurl: returnUrl,
    resulturl: params.resultUrl,
    status,
  };

  // Hash values in this exact order
  const hashValues = [
    integrationId,
    params.reference,
    amountStr,
    params.description,
    returnUrl,
    params.resultUrl,
    status,
  ];

  if (isMobile) {
    fields.authemail = params.customerEmail || "";
    fields.phone = params.phone!;
    fields.method = params.method!;
    hashValues.push(params.customerEmail || "", params.phone!, params.method!);
  }

  fields.hash = computeHash(hashValues, integrationKey);

  const body = new URLSearchParams(fields).toString();

  const res = await fetch(PAYNOW_INITIATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const text = await res.text();
  const data = parsePaynowResponse(text);

  if (data.status?.toLowerCase() !== "ok") {
    return { success: false, error: data.error || "PayNow initiation failed" };
  }

  return {
    success: true,
    browserUrl: data.browserurl,
    pollUrl: data.pollurl,
    instructions: data.instructions,
  };
}

export interface PaynowResultPayload {
  reference: string;
  paynowreference: string;
  amount: string;
  status: string; // Paid, Failed, Cancelled, etc.
  pollurl: string;
  hash: string;
}

export function verifyPaynowResult(
  payload: PaynowResultPayload
): boolean {
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY!;
  const { reference, paynowreference, amount, status, pollurl } = payload;
  const expected = computeHash(
    [reference, amount, paynowreference, status, pollurl],
    integrationKey
  );
  return expected === payload.hash.toUpperCase();
}

export function isPaynowPaid(status: string): boolean {
  return ["paid", "awaiting delivery"].includes(status.toLowerCase());
}
