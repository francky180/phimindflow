import type { ChatRequest } from "./types";

export function validateWebhookSecret(headerSecret: string | null): boolean {
  const expected = process.env.WEBHOOK_SECRET;
  if (!expected || !headerSecret) return false;
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== headerSecret.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ headerSecret.charCodeAt(i);
  }
  return mismatch === 0;
}

export function validateChatRequest(body: unknown): { valid: true; data: ChatRequest } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }

  const obj = body as Record<string, unknown>;

  if (typeof obj.message !== "string" || obj.message.length === 0) {
    return { valid: false, error: "Field 'message' is required and must be a non-empty string" };
  }

  if (obj.message.length > 2000) {
    return { valid: false, error: "Field 'message' must be 2000 characters or less" };
  }

  if (typeof obj.user_id !== "string" || obj.user_id.length === 0) {
    return { valid: false, error: "Field 'user_id' is required and must be a non-empty string" };
  }

  if (obj.conversation_history !== undefined) {
    if (!Array.isArray(obj.conversation_history)) {
      return { valid: false, error: "Field 'conversation_history' must be an array" };
    }
    for (const msg of obj.conversation_history) {
      if (!msg || typeof msg !== "object") {
        return { valid: false, error: "Each conversation_history entry must be an object" };
      }
      const m = msg as Record<string, unknown>;
      if (m.role !== "user" && m.role !== "assistant") {
        return { valid: false, error: "conversation_history role must be 'user' or 'assistant'" };
      }
      if (typeof m.content !== "string") {
        return { valid: false, error: "conversation_history content must be a string" };
      }
    }
  }

  return {
    valid: true,
    data: {
      message: obj.message,
      user_id: obj.user_id,
      conversation_history: obj.conversation_history as ChatRequest["conversation_history"],
    },
  };
}
