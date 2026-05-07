import type { AnalysisResult, FormData } from "./analysis";

export interface AnalyzeRequest {
  formData: FormData;
}

export interface AnalyzeResponse {
  sessionId: string;
  analysisResult: AnalysisResult;
}

export interface ApproveResponse {
  success: boolean;
  message: string;
}

export interface CreateCheckoutRequest {
  sessionId: string;
  productType: "pdf" | "email";
  contactEmail: string;
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
}

export interface AdminUpdateRequest {
  token: string;
  followUpEdited: string;
}

export interface SSEEvent {
  type: "progress" | "complete" | "error";
  message?: string;
  progress?: number;
  sessionId?: string;
  analysisResult?: AnalysisResult;
  error?: string;
}
