import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { AnalysisResultSchema, type AnalysisResult, type FormData } from "@/types/analysis";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SCHEMA_DESCRIPTION = `{
  "blueprint": {
    "summary": "2-3 sentence executive summary",
    "departments": [{"name":"","description":"","headcount":""}],
    "keyProcesses": [{"name":"","description":"","department":"","currentTools":[],"isManual":true}],
    "dataFlows": [{"from":"","to":"","description":""}],
    "systemsUsed": ["string"],
    "teamStructure": "string"
  },
  "diagram": {
    "nodes": [
      {
        "id": "unique-id",
        "type": "process|decision|automation|inputOutput|system|person",
        "label": "Short label",
        "tooltip": "Detailed description shown on hover (1-2 sentences)",
        "isAutomatable": true,
        "automationNote": "How AI can automate this (optional)",
        "position": {"x": 0, "y": 0}
      }
    ],
    "edges": [
      {"id": "e1", "source": "node-id", "target": "node-id", "label": "optional label", "animated": false}
    ]
  },
  "automationOpportunities": [
    {
      "processId": "matches diagram node id",
      "processName": "",
      "currentMethod": "",
      "proposedAutomation": "",
      "toolSuggestions": [],
      "complexityLevel": "low|medium|high",
      "impactLevel": "low|medium|high",
      "estimatedHoursSaved": 5,
      "estimatedMonthlyCost": "$200-$500/month",
      "implementationSteps": []
    }
  ],
  "report": {
    "currentStateAnalysis": "Detailed markdown analysis of current state",
    "automationRecommendations": [
      {"title":"","description":"","priority":"high|medium|low","estimatedImpact":""}
    ],
    "estimatedResults": {
      "timeSavingsHoursPerWeek": 15,
      "timeSavingsPercentage": 30,
      "costReductionEstimate": "$2,000–$5,000/month",
      "efficiencyGainPercentage": 40,
      "roiTimelineMonths": 6,
      "keyBenefits": ["benefit 1", "benefit 2"]
    },
    "prioritizedRoadmap": [
      {"phase":1,"title":"","description":"","duration":"2-4 weeks","estimatedCost":"$500-$1,000"}
    ],
    "toolsRecommended": [
      {"name":"","category":"","purpose":"","estimatedCost":"","url":""}
    ],
    "investmentSummary": "Summary of total investment and expected returns"
  },
  "crm": {
    "painPointsSummary": "Concise summary of pain points",
    "suggestedWorkflows": ["workflow 1", "workflow 2"],
    "toolsNeeded": ["tool 1", "tool 2"],
    "bestPractices": ["practice 1", "practice 2"]
  },
  "ownerEmail": {
    "companySummary": "2-3 paragraph summary for the owner",
    "proposalDraft": "Full proposal text to send to the client",
    "followUpMessage": "Personalized follow-up email body to send to the client after approval"
  }
}`;

export function buildAnalysisPrompt(formData: FormData): string {
  return `You are an expert business process analyst and AI automation consultant. Analyze the following business and produce a comprehensive workflow analysis as a JSON object.

COMPANY INFORMATION:
- Company Name: ${formData.companyName}
- Industry: ${formData.industry}
- Company Size: ${formData.companySize}
- Website: ${formData.website || "Not provided"}
- Contact Name: ${formData.contactName}
- Contact Email: ${formData.contactEmail}

CURRENT OPERATIONS & WORKFLOW:
${formData.operationsDescription}
Departments: ${formData.departments.join(", ") || "Not specified"}
Tools currently used: ${formData.currentTools.join(", ") || "Not specified"}
Employees involved: ${formData.employeeCount}

PAIN POINTS & CHALLENGES:
${formData.painPointsDescription}
Specific bottlenecks: ${formData.bottlenecks.join(", ") || "Not specified"}
Estimated time wasted per week: ${formData.timeWastedHours} hours

GOALS & DESIRED OUTCOMES:
${formData.goalsDescription}
Priority areas: ${formData.priorityAreas.join(", ") || "Not specified"}
Budget range for automation: ${formData.budgetRange}
Timeline: ${formData.timeline}

INSTRUCTIONS:
1. Create a complete business blueprint mapping all departments, processes, and data flows
2. Design a workflow diagram with 8-15 nodes showing how all business components connect. Use varied node types (process, decision, automation, inputOutput, system, person). Mark isAutomatable=true on nodes that would benefit from AI automation. Use position coordinates that create a logical left-to-right flow (x: 0-1200, y: 0-600)
3. Identify 3-6 specific AI automation opportunities with concrete tool suggestions and realistic time/cost estimates
4. Write a detailed professional report with current state analysis, specific recommendations, and realistic ROI projections
5. Craft compelling owner email content with a professional proposal and personalized client follow-up message

IMPORTANT: Respond ONLY with a valid JSON object matching this exact schema. No markdown, no explanation, just the JSON:

${SCHEMA_DESCRIPTION}`;
}

export async function runAnalysis(formData: FormData): Promise<AnalysisResult> {
  const prompt = buildAnalysisPrompt(formData);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        temperature: 0,
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: "{" },
        ],
      });

      const rawText =
        "{" +
        (message.content[0].type === "text" ? message.content[0].text : "");

      const parsed = JSON.parse(rawText);
      const validated = AnalysisResultSchema.parse(parsed);
      return validated;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw new Error(`Analysis failed after 3 attempts: ${lastError?.message}`);
}

export async function* streamAnalysis(
  formData: FormData
): AsyncGenerator<{ type: string; message: string; progress: number }> {
  yield { type: "progress", message: "Analyzing your business structure...", progress: 10 };
  await new Promise((r) => setTimeout(r, 500));

  yield { type: "progress", message: "Mapping workflow processes and dependencies...", progress: 25 };
  await new Promise((r) => setTimeout(r, 500));

  yield { type: "progress", message: "Identifying AI automation opportunities...", progress: 40 };

  const result = await runAnalysis(formData);

  yield { type: "progress", message: "Calculating ROI and efficiency estimates...", progress: 60 };
  await new Promise((r) => setTimeout(r, 300));

  yield { type: "progress", message: "Generating your business blueprint...", progress: 75 };
  await new Promise((r) => setTimeout(r, 300));

  yield { type: "progress", message: "Crafting your personalised report...", progress: 90 };
  await new Promise((r) => setTimeout(r, 300));

  return result;
}
