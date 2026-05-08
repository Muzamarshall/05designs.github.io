"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Mail, Loader2, CreditCard, Smartphone } from "lucide-react";

interface Props {
  sessionId: string;
  contactEmail: string;
}

type Gateway = "stripe" | "paypal" | "paynow";
type ProductType = "pdf" | "email";

const PRICES: Record<ProductType, string> = { pdf: "$9.99", email: "$4.99" };
const PAYNOW_METHODS = [
  { value: "ecocash", label: "EcoCash" },
  { value: "onemoney", label: "OneMoney" },
  { value: "telecash", label: "TeleCash" },
  { value: "webpay", label: "Card / Web Pay" },
];

export default function DownloadActions({ sessionId, contactEmail }: Props) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<ProductType>("pdf");
  const [gateway, setGateway] = useState<Gateway>("stripe");
  const [phone, setPhone] = useState("");
  const [paynowMethod, setPaynowMethod] = useState("ecocash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paynowPending, setPaynowPending] = useState<{
    instructions?: string;
    pollUrl?: string;
  } | null>(null);

  function openModal(type: ProductType) {
    setProduct(type);
    setError(null);
    setPaynowPending(null);
    setOpen(true);
  }

  async function handlePay() {
    setLoading(true);
    setError(null);

    try {
      if (gateway === "stripe") {
        const res = await fetch("/api/payment/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, productType: product, contactEmail }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        window.location.href = data.checkoutUrl;

      } else if (gateway === "paypal") {
        const res = await fetch("/api/payment/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, productType: product, contactEmail }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        window.location.href = data.approveUrl;

      } else if (gateway === "paynow") {
        const isMobile = paynowMethod !== "webpay";
        if (isMobile && !phone.trim()) {
          setError("Please enter your mobile number.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/payment/paynow/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            productType: product,
            contactEmail,
            phone: isMobile ? phone.trim() : undefined,
            method: isMobile ? paynowMethod : "webpay",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        if (data.isMobile && data.instructions) {
          // Mobile money — show USSD instructions, don't redirect
          setPaynowPending({ instructions: data.instructions, pollUrl: data.pollUrl });
        } else if (data.browserUrl) {
          // Web / card payment — redirect to PayNow
          window.location.href = data.browserUrl;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex-1">
          <p className="font-medium text-white">Get Your Full Report</p>
          <p className="text-sm text-slate-400">
            Download as PDF or receive it by email. Pay with Card, PayPal, or PayNow 🇿🇼
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal("pdf")}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            PDF — $9.99
          </Button>
          <Button size="sm" onClick={() => openModal("email")} className="gap-2">
            <Mail className="h-4 w-4" />
            Email — $4.99
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {product === "pdf" ? "📄 Download PDF Report" : "📧 Email Report"} —{" "}
              {PRICES[product]}
            </DialogTitle>
          </DialogHeader>

          {paynowPending ? (
            /* PayNow mobile money pending state */
            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-emerald-700/40 bg-emerald-500/10 p-4">
                <p className="text-sm font-semibold text-emerald-400 mb-2">
                  📱 Check Your Phone
                </p>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">
                  {paynowPending.instructions}
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Once you approve the payment on your phone, your report will be delivered
                automatically. You can close this window.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  setPaynowPending(null);
                }}
              >
                Got it — I'll check my phone
              </Button>
            </div>
          ) : (
            /* Payment method selection */
            <div className="space-y-5 py-2">
              {/* Gateway selector */}
              <div>
                <p className="mb-3 text-sm font-medium text-slate-300">
                  Choose payment method
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        id: "stripe" as Gateway,
                        label: "Card",
                        sub: "Visa / MC",
                        icon: <CreditCard className="h-5 w-5" />,
                      },
                      {
                        id: "paypal" as Gateway,
                        label: "PayPal",
                        sub: "Global",
                        icon: <span className="text-lg font-bold text-blue-400">P</span>,
                      },
                      {
                        id: "paynow" as Gateway,
                        label: "PayNow",
                        sub: "🇿🇼 Zimbabwe",
                        icon: <Smartphone className="h-5 w-5" />,
                      },
                    ] as const
                  ).map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => { setGateway(g.id); setError(null); }}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                        gateway === g.id
                          ? "border-cyan-500 bg-cyan-500/10 text-white"
                          : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      <span className={gateway === g.id ? "text-cyan-400" : "text-slate-400"}>
                        {g.icon}
                      </span>
                      <span className="text-xs font-semibold">{g.label}</span>
                      <span className="text-[10px] text-slate-500">{g.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gateway-specific fields */}
              {gateway === "stripe" && (
                <p className="text-sm text-slate-400">
                  You'll be redirected to Stripe's secure checkout. Accepts all major cards worldwide.
                </p>
              )}

              {gateway === "paypal" && (
                <p className="text-sm text-slate-400">
                  You'll be redirected to PayPal. Works in 200+ countries with your PayPal balance or linked card.
                </p>
              )}

              {gateway === "paynow" && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYNOW_METHODS.map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setPaynowMethod(m.value)}
                          className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                            paynowMethod === m.value
                              ? "border-cyan-500 bg-cyan-500/10 text-white"
                              : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paynowMethod !== "webpay" && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-300">
                        Mobile Number
                      </label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+263 77 123 4567"
                        type="tel"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        You'll receive a USSD prompt on your phone to confirm payment.
                      </p>
                    </div>
                  )}

                  {paynowMethod === "webpay" && (
                    <p className="text-sm text-slate-400">
                      You'll be redirected to the PayNow payment page to pay by card or internet banking.
                    </p>
                  )}
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Button onClick={handlePay} disabled={loading} className="w-full gap-2">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  <>Pay {PRICES[product]} →</>
                )}
              </Button>

              <p className="text-center text-xs text-slate-600">
                Secure payment · Your analysis is always available at this URL
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

