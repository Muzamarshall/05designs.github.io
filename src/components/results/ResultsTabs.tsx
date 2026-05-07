"use client";

import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Map, GitBranch, Bot, FileText } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import BlueprintPanel from "./BlueprintPanel";
import RecommendationsPanel from "./RecommendationsPanel";
import ReportPanel from "./ReportPanel";
import DownloadActions from "./DownloadActions";

// Lazy-load the diagram to avoid SSR issues with React Flow
const DiagramPanel = dynamic(() => import("./DiagramPanel"), { ssr: false });

interface Props {
  analysis: AnalysisResult;
  sessionId: string;
  contactEmail: string;
}

export default function ResultsTabs({ analysis, sessionId, contactEmail }: Props) {
  return (
    <div>
      <DownloadActions sessionId={sessionId} contactEmail={contactEmail} />
      <Tabs defaultValue="blueprint" className="mt-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="blueprint" className="gap-2">
            <Map className="h-4 w-4" /> Blueprint
          </TabsTrigger>
          <TabsTrigger value="diagram" className="gap-2">
            <GitBranch className="h-4 w-4" /> Workflow Diagram
          </TabsTrigger>
          <TabsTrigger value="automation" className="gap-2">
            <Bot className="h-4 w-4" /> AI Automation
          </TabsTrigger>
          <TabsTrigger value="report" className="gap-2">
            <FileText className="h-4 w-4" /> Full Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blueprint">
          <BlueprintPanel blueprint={analysis.blueprint} />
        </TabsContent>

        <TabsContent value="diagram">
          <DiagramPanel
            nodes={analysis.diagram.nodes}
            edges={analysis.diagram.edges}
            opportunities={analysis.automationOpportunities}
          />
        </TabsContent>

        <TabsContent value="automation">
          <RecommendationsPanel opportunities={analysis.automationOpportunities} />
        </TabsContent>

        <TabsContent value="report">
          <ReportPanel report={analysis.report} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
