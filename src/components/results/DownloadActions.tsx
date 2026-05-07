"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Loader2 } from "lucide-react";

interface Props {
  sessionId: string;
  contactEmail: string;
}

export default function DownloadActions({ sessionId, contactEmail }: Props) {
  const [loadingType, setLoadingType] = useState<"pdf" | "email" | null>(null);

  async function handleAction(type: "pdf" | "email") {
    setLoadingType(type);
    try {
      const res = await fetch("/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, productType: type, contactEmail }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } finally {
      setLoadingType(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex-1">
        <p className="font-medium text-white">Get Your Full Report</p>
        <p className="text-sm text-slate-400">Download as PDF or receive it by email.</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("pdf")}
          disabled={!!loadingType}
          className="gap-2"
        >
          {loadingType === "pdf" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          PDF — $9.99
        </Button>
        <Button
          size="sm"
          onClick={() => handleAction("email")}
          disabled={!!loadingType}
          className="gap-2"
        >
          {loadingType === "email" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          Email — $4.99
        </Button>
      </div>
    </div>
  );
}
