import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runAnalysis } from "@/lib/anthropic";
import { createAnalysisRecord } from "@/lib/d1";
import { createLeadRecord } from "@/lib/airtable";
import { sendOwnerNotification } from "@/lib/resend";
import { nanoid } from "@/lib/utils";

const FormDataSchema = z.object({
  companyName: z.string().min(1),
  industry: z.string().min(1),
  companySize: z.string().min(1),
  website: z.string().optional().default(""),
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  operationsDescription: z.string().min(20),
  departments: z.array(z.string()).default([]),
  currentTools: z.array(z.string()).default([]),
  employeeCount: z.string().optional().default(""),
  painPointsDescription: z.string().min(10),
  bottlenecks: z.array(z.string()).default([]),
  timeWastedHours: z.string().optional().default(""),
  goalsDescription: z.string().min(10),
  priorityAreas: z.array(z.string()).default([]),
  budgetRange: z.string().min(1),
  timeline: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData } = body;

    const parsed = FormDataSchema.safeParse(formData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const sessionId = nanoid();
    const approvalToken = crypto.randomUUID();

    // Run Claude analysis
    const analysis = await runAnalysis(parsed.data);

    // Save to Cloudflare D1
    await createAnalysisRecord({
      id: sessionId,
      approvalToken,
      contactEmail: parsed.data.contactEmail,
      contactName: parsed.data.contactName,
      companyName: parsed.data.companyName,
      formData: JSON.stringify(parsed.data),
      analysisJson: JSON.stringify(analysis),
    });

    // Save to Airtable CRM (non-blocking — don't fail the request if this errors)
    createLeadRecord(sessionId, approvalToken, parsed.data, analysis).catch((e) =>
      console.error("Airtable save failed:", e)
    );

    // Send owner notification email (non-blocking)
    sendOwnerNotification({
      sessionId,
      approvalToken,
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName,
      contactEmail: parsed.data.contactEmail,
      analysis,
    }).catch((e) => console.error("Owner email failed:", e));

    return NextResponse.json({ sessionId, analysisResult: analysis });
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
