"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const gateway = params.get("gateway") ?? "stripe";
  const productType = params.get("product") ?? "pdf";
  // PayPal returns token (order ID) and PayerID on redirect back
  const paypalOrderId = params.get("token");

  const [pdfReady, setPdfReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [captureComplete, setCaptureComplete] = useState(false);

  // For PayPal: capture the order as soon as the success page loads
  const capturePayPal = useCallback(async () => {
    if (!paypalOrderId || !sessionId || captureComplete) return;
    setCapturing(true);
    try {
      const res = await fetch("/api/payment/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: paypalOrderId, sessionId, productType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCaptureComplete(true);
    } catch (err) {
      setCaptureError(err instanceof Error ? err.message : "Capture failed");
    } finally {
      setCapturing(false);
    }
  }, [paypalOrderId, sessionId, productType, captureComplete]);

  useEffect(() => {
    if (gateway === "paypal" && paypalOrderId) {
      capturePayPal();
    }
    // Give a moment for webhooks to process before allowing PDF download
    const timer = setTimeout(() => setPdfReady(true), 2500);
    return () => clearTimeout(timer);
  }, [gateway, paypalOrderId, capturePayPal]);

  async function downloadPdf() {
    if (!sessionId) return;
    // Fetch the analysis and generate PDF client-side
    const res = await fetch(`/api/results/${sessionId}`);
    const data = await res.json();

    // Dynamic import to avoid SSR
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    // Generate a simple PDF from the analysis data
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const analysis = data.analysisResult;
    const est = analysis.report.estimatedResults;

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 595, 842, "F");

    doc.setTextColor(34, 211, 238);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Business Workflow Analysis", 40, 80);

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(16);
    doc.text(data.companyName, 40, 110);

    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 40, 130);
    doc.text(`Contact: ${data.contactName} — ${data.contactEmail}`, 40, 148);

    // Summary
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(30, 165, 535, 80, 8, 8, "F");
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", 45, 185);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const summary = doc.splitTextToSize(analysis.blueprint.summary, 500);
    doc.text(summary, 45, 200);

    // Metrics
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(34, 211, 238);
    doc.text("Estimated Results", 40, 270);

    const metrics = [
      [`Time Saved / Week`, `${est.timeSavingsHoursPerWeek}h (${est.timeSavingsPercentage}%)`],
      [`Cost Reduction`, est.costReductionEstimate],
      [`Efficiency Gain`, `${est.efficiencyGainPercentage}%`],
      [`ROI Timeline`, `${est.roiTimelineMonths} months`],
    ];
    doc.setFont("helvetica", "normal");
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(11);
    metrics.forEach(([label, value], i) => {
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(30, 280 + i * 45, 260, 35, 6, 6, "F");
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.text(label, 45, 293 + i * 45);
      doc.setTextColor(226, 232, 240);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(value, 45, 308 + i * 45);
      doc.setFont("helvetica", "normal");
    });

    // Automation Opportunities
    doc.setFontSize(13);
    doc.setTextColor(34, 211, 238);
    doc.setFont("helvetica", "bold");
    doc.text("Top Automation Opportunities", 320, 270);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(226, 232, 240);
    analysis.automationOpportunities.slice(0, 4).forEach((opp: { processName: string; estimatedHoursSaved: number; impactLevel: string }, i: number) => {
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(310, 280 + i * 45, 255, 35, 6, 6, "F");
      doc.setTextColor(16, 185, 129);
      doc.text(`${opp.processName}`, 320, 293 + i * 45);
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.text(`${opp.estimatedHoursSaved}h/wk · ${opp.impactLevel} impact`, 320, 307 + i * 45);
      doc.setFontSize(10);
    });

    // Roadmap
    let yPos = 470;
    doc.setFontSize(13);
    doc.setTextColor(34, 211, 238);
    doc.setFont("helvetica", "bold");
    doc.text("Implementation Roadmap", 40, yPos);
    yPos += 20;
    analysis.report.prioritizedRoadmap.forEach((item: { phase: number; title: string; duration: string; description: string }) => {
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(30, yPos, 535, 50, 6, 6, "F");
      doc.setTextColor(34, 211, 238);
      doc.setFontSize(11);
      doc.text(`Phase ${item.phase}: ${item.title}`, 45, yPos + 16);
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.text(item.duration, 510, yPos + 16, { align: "right" });
      doc.setTextColor(203, 213, 225);
      const desc = doc.splitTextToSize(item.description, 500);
      doc.text(desc[0], 45, yPos + 33);
      yPos += 60;
    });

    doc.save(`${data.companyName.replace(/\s+/g, "-")}-workflow-analysis.pdf`);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="glass max-w-md w-full rounded-2xl p-10 text-center">
        <CheckCircle className="mx-auto mb-4 h-14 w-14 text-emerald-400" />
        <h1 className="mb-2 text-2xl font-bold text-white">Payment Successful!</h1>
        <p className="mb-8 text-slate-400">
          Your report is ready. Download the PDF below or check your email for delivery.
        </p>

        <div className="flex flex-col gap-3">
          {!pdfReady ? (
            <Button disabled className="gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparing PDF...
            </Button>
          ) : (
            <Button onClick={downloadPdf} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF Report
            </Button>
          )}

          {sessionId && (
            <Link href={`/results/${sessionId}`}>
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                View Full Analysis
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense>
            <SuccessContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}
