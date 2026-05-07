import { z } from "zod";

// ─── Diagram types ─────────────────────────────────────────────────────────

export const NodeTypeSchema = z.enum([
  "process",
  "decision",
  "automation",
  "inputOutput",
  "system",
  "person",
]);
export type NodeType = z.infer<typeof NodeTypeSchema>;

export const DiagramNodeSchema = z.object({
  id: z.string(),
  type: NodeTypeSchema,
  label: z.string(),
  tooltip: z.string(),
  isAutomatable: z.boolean(),
  automationNote: z.string().optional(),
  position: z.object({ x: z.number(), y: z.number() }),
});
export type DiagramNode = z.infer<typeof DiagramNodeSchema>;

export const DiagramEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  animated: z.boolean(),
});
export type DiagramEdge = z.infer<typeof DiagramEdgeSchema>;

// ─── Analysis content types ────────────────────────────────────────────────

const DepartmentSchema = z.object({
  name: z.string(),
  description: z.string(),
  headcount: z.string().optional(),
});

const ProcessSchema = z.object({
  name: z.string(),
  description: z.string(),
  department: z.string(),
  currentTools: z.array(z.string()),
  isManual: z.boolean(),
});

const DataFlowSchema = z.object({
  from: z.string(),
  to: z.string(),
  description: z.string(),
});

const AutomationOpportunitySchema = z.object({
  processId: z.string(),
  processName: z.string(),
  currentMethod: z.string(),
  proposedAutomation: z.string(),
  toolSuggestions: z.array(z.string()),
  complexityLevel: z.enum(["low", "medium", "high"]),
  impactLevel: z.enum(["low", "medium", "high"]),
  estimatedHoursSaved: z.number(),
  estimatedMonthlyCost: z.string(),
  implementationSteps: z.array(z.string()),
});
export type AutomationOpportunity = z.infer<typeof AutomationOpportunitySchema>;

const RecommendationSectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  estimatedImpact: z.string(),
});

const RoadmapItemSchema = z.object({
  phase: z.number(),
  title: z.string(),
  description: z.string(),
  duration: z.string(),
  estimatedCost: z.string(),
});

const ToolRecommendationSchema = z.object({
  name: z.string(),
  category: z.string(),
  purpose: z.string(),
  estimatedCost: z.string(),
  url: z.string().optional(),
});
export type ToolRecommendation = z.infer<typeof ToolRecommendationSchema>;

// ─── Full analysis result ──────────────────────────────────────────────────

export const AnalysisResultSchema = z.object({
  blueprint: z.object({
    summary: z.string(),
    departments: z.array(DepartmentSchema),
    keyProcesses: z.array(ProcessSchema),
    dataFlows: z.array(DataFlowSchema),
    systemsUsed: z.array(z.string()),
    teamStructure: z.string(),
  }),
  diagram: z.object({
    nodes: z.array(DiagramNodeSchema),
    edges: z.array(DiagramEdgeSchema),
  }),
  automationOpportunities: z.array(AutomationOpportunitySchema),
  report: z.object({
    currentStateAnalysis: z.string(),
    automationRecommendations: z.array(RecommendationSectionSchema),
    estimatedResults: z.object({
      timeSavingsHoursPerWeek: z.number(),
      timeSavingsPercentage: z.number(),
      costReductionEstimate: z.string(),
      efficiencyGainPercentage: z.number(),
      roiTimelineMonths: z.number(),
      keyBenefits: z.array(z.string()),
    }),
    prioritizedRoadmap: z.array(RoadmapItemSchema),
    toolsRecommended: z.array(ToolRecommendationSchema),
    investmentSummary: z.string(),
  }),
  crm: z.object({
    painPointsSummary: z.string(),
    suggestedWorkflows: z.array(z.string()),
    toolsNeeded: z.array(z.string()),
    bestPractices: z.array(z.string()),
  }),
  ownerEmail: z.object({
    companySummary: z.string(),
    proposalDraft: z.string(),
    followUpMessage: z.string(),
  }),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// ─── Form data ─────────────────────────────────────────────────────────────

export interface FormData {
  // Step 1
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  contactName: string;
  contactEmail: string;
  // Step 2
  operationsDescription: string;
  departments: string[];
  currentTools: string[];
  employeeCount: string;
  // Step 3
  painPointsDescription: string;
  bottlenecks: string[];
  timeWastedHours: string;
  // Step 4
  goalsDescription: string;
  priorityAreas: string[];
  budgetRange: string;
  timeline: string;
}

// ─── D1 record ─────────────────────────────────────────────────────────────

export interface AnalysisRecord {
  id: string;
  approval_token: string;
  approval_status: "pending" | "approved" | "sent";
  contact_email: string;
  contact_name: string;
  company_name: string;
  form_data: string;
  analysis_json: string;
  follow_up_edited: string | null;
  pdf_downloaded: number;
  email_sent: number;
  stripe_session_id: string | null;
  created_at: string;
  approved_at: string | null;
}
