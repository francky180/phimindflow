# OMC System Flow

## Architecture Overview

```
ManyChat (DM trigger)
    ↓
External Request (POST /api/chat)
    ↓
Webhook Secret Validation
    ↓ (401 if invalid)
Request Body Validation
    ↓ (400 if invalid)
AI Processing Pipeline
    ├── Step 1: Conversation Reply (conversation.txt prompt)
    ├── Step 2: Qualification Analysis (qualification.txt prompt)
    └── Step 3: Summary Generation (summary.txt prompt)
    ↓
Structured JSON Response
    ↓
ManyChat (maps fields → sends reply → routes lead)
```

## Request Lifecycle

### 1. Incoming Webhook
ManyChat sends a POST request with the user's message, their subscriber ID, and optional conversation history.

### 2. Security Gate
The `x-webhook-secret` header is validated against `WEBHOOK_SECRET` using constant-time comparison. If it fails, processing stops immediately with a 401 response.

### 3. Input Validation
The request body is validated for required fields (`message`, `user_id`), type correctness, and length limits.

### 4. AI Processing Pipeline
Three sequential AI calls:

1. **Conversation Reply** — Uses `conversation.txt` system prompt + conversation history to generate a natural, human-like response.

2. **Qualification Analysis** — Uses `qualification.txt` to analyze the full conversation and extract structured data (lead score, category, collected fields, next action).

3. **Summary Generation** — Uses `summary.txt` to produce a brief, human-readable summary suitable for a sales team handoff.

### 5. Response Assembly
All three outputs are combined into the standard response format and returned as JSON.

### 6. Error Handling
If any step in the AI pipeline fails, a safe fallback response is returned. The endpoint never crashes — it always returns a valid JSON structure.

## Module Responsibilities

| Module              | Location                  | Purpose                               |
|---------------------|---------------------------|---------------------------------------|
| Route Handler       | app/api/chat/route.ts     | HTTP endpoint, orchestrates flow      |
| Validator           | omc/utils/validate.ts     | Security + input validation           |
| AI Client           | omc/utils/ai-client.ts    | OpenAI calls + prompt loading         |
| Response Builder    | omc/utils/response-builder.ts | Error fallbacks + JSON formatting |
| Types               | omc/utils/types.ts        | Shared TypeScript interfaces          |
| Prompts             | omc/prompts/*.txt         | Editable AI system prompts            |
| Schemas             | omc/schemas/*.json        | Request/response JSON schemas         |
| Adapters            | omc/adapters/*.ts         | Future CRM/tool integrations          |

## Data Flow Summary

```
User Message → Validation → AI Reply + Qualification + Summary → JSON Response → ManyChat Fields → User Reply + Routing
```

## Future Expansion Points

- **Adapters** (`omc/adapters/`): GHL, GoSalesStack, BrandJet integrations will hook into the response pipeline to push qualified leads to external systems.
- **Creator Marketing Skills**: Strategic intelligence layer that can enhance prompt quality, qualification criteria, and campaign awareness. See `creator-marketing-skills-placement.md`.
