"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Smartphone, ExternalLink } from "lucide-react";
import Header from "@/components/layout/Header";

function PendingContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="glass max-w-md w-full rounded-2xl p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-600/30">
          <Smartphone className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">Check Your Phone</h1>
        <p className="mb-6 text-slate-400">
          A payment request has been sent to your mobile number via{" "}
          <span className="text-emerald-400 font-medium">EcoCash / OneMoney</span>.
          Approve it to complete your purchase.
        </p>

        <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-300 text-left space-y-2">
          <p>1. Open your mobile money app or wait for the USSD prompt.</p>
          <p>2. Enter your PIN to approve the payment.</p>
          <p>3. Your report will be delivered automatically once payment is confirmed.</p>
        </div>

        <div className="flex flex-col gap-3">
          {sessionId && (
            <Link href={`/results/${sessionId}`}>
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                Return to Your Analysis
              </Button>
            </Link>
          )}
          <Link href="/">
            <Button variant="ghost" className="w-full text-slate-400">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaynowPendingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense>
            <PendingContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}
