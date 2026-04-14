import type { ChatResponse } from "./types";

export function buildErrorResponse(fallbackMessage?: string): ChatResponse {
  return {
    reply: fallbackMessage ?? "Thanks for your message! Let me connect you with our team who can help you directly.",
    conversation_complete: false,
    qualified: false,
    category: "general-inquiry",
    lead_score: 0,
    collected_fields: {},
    next_best_action: "continue-conversation",
    summary: "",
  };
}

export function jsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
