export interface ChatRequest {
  message: string;
  user_id: string;
  conversation_history?: ConversationMessage[];
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CollectedFields {
  name?: string;
  email?: string;
  goal?: string;
  experience_level?: string;
  budget_signal?: string;
}

export type LeadCategory =
  | "broker-interest"
  | "course-interest"
  | "management-interest"
  | "general-inquiry"
  | "not-qualified";

export type NextAction =
  | "continue-conversation"
  | "offer-broker-signup"
  | "offer-course"
  | "offer-management"
  | "schedule-call"
  | "end-conversation";

export interface ChatResponse {
  reply: string;
  conversation_complete: boolean;
  qualified: boolean;
  category: LeadCategory;
  lead_score: number;
  collected_fields: CollectedFields;
  next_best_action: NextAction;
  summary: string;
}
