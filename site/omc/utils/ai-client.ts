import { readFileSync } from "fs";
import { join } from "path";
import type { ChatRequest, ChatResponse } from "./types";

const PROMPTS_DIR = join(process.cwd(), "omc", "prompts");

function loadPrompt(filename: string): string {
  return readFileSync(join(PROMPTS_DIR, filename), "utf-8");
}

export async function processChat(request: ChatRequest): Promise<ChatResponse> {
  const conversationPrompt = loadPrompt("conversation.txt");
  const qualificationPrompt = loadPrompt("qualification.txt");
  const summaryPrompt = loadPrompt("summary.txt");

  const history = request.conversation_history ?? [];
  const messages = [
    { role: "system" as const, content: conversationPrompt },
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: request.message },
  ];

  // Step 1: Generate conversational reply
  const replyText = await callOpenAI(messages);

  // Step 2: Run qualification analysis on the full conversation
  const fullConversation = [
    ...history.map((m) => `${m.role}: ${m.content}`),
    `user: ${request.message}`,
    `assistant: ${replyText}`,
  ].join("\n");

  const qualificationResult = await callOpenAI([
    { role: "system", content: qualificationPrompt },
    { role: "user", content: fullConversation },
  ]);

  // Step 3: Generate summary
  const summaryResult = await callOpenAI([
    { role: "system", content: summaryPrompt },
    { role: "user", content: fullConversation },
  ]);

  // Parse qualification JSON
  const qualification = parseQualification(qualificationResult);

  return {
    reply: replyText,
    conversation_complete: qualification.conversation_complete,
    qualified: qualification.qualified,
    category: qualification.category,
    lead_score: qualification.lead_score,
    collected_fields: qualification.collected_fields,
    next_best_action: qualification.next_best_action,
    summary: summaryResult,
  };
}

async function callOpenAI(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errorBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

function parseQualification(raw: string): {
  conversation_complete: boolean;
  qualified: boolean;
  category: ChatResponse["category"];
  lead_score: number;
  collected_fields: ChatResponse["collected_fields"];
  next_best_action: ChatResponse["next_best_action"];
} {
  try {
    // Extract JSON from potential markdown code blocks
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, raw];
    const parsed = JSON.parse(jsonMatch[1]!.trim());
    return {
      conversation_complete: Boolean(parsed.conversation_complete),
      qualified: Boolean(parsed.qualified),
      category: parsed.category ?? "general-inquiry",
      lead_score: Math.min(100, Math.max(0, Number(parsed.lead_score) || 0)),
      collected_fields: parsed.collected_fields ?? {},
      next_best_action: parsed.next_best_action ?? "continue-conversation",
    };
  } catch {
    return {
      conversation_complete: false,
      qualified: false,
      category: "general-inquiry",
      lead_score: 0,
      collected_fields: {},
      next_best_action: "continue-conversation",
    };
  }
}
