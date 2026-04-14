import { validateWebhookSecret, validateChatRequest } from "@/omc/utils/validate";
import { processChat } from "@/omc/utils/ai-client";
import { buildErrorResponse, jsonResponse } from "@/omc/utils/response-builder";

export async function POST(request: Request): Promise<Response> {
  // 1. SECURITY: Validate webhook secret before any processing
  const webhookSecret = request.headers.get("x-webhook-secret");
  if (!validateWebhookSecret(webhookSecret)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  // 2. Parse and validate request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const validation = validateChatRequest(body);
  if (!validation.valid) {
    return jsonResponse({ error: validation.error }, 400);
  }

  // 3. Process through AI pipeline
  try {
    const response = await processChat(validation.data);
    return jsonResponse(response);
  } catch (error) {
    console.error("[OMC] Chat processing error:", error instanceof Error ? error.message : error);
    return jsonResponse(buildErrorResponse());
  }
}
