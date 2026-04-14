# Testing Guide

## Prerequisites

1. Set environment variables in `.env.local` (site root):
   ```
   OPENAI_API_KEY=sk-your-key-here
   WEBHOOK_SECRET=your-secret-here
   ```

2. Start the dev server:
   ```bash
   cd site
   npm run dev
   ```

## Testing the Endpoint

### 1. Test Webhook Security (should return 401)

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hello", "user_id": "test123"}'
```

Expected: `{"error":"Unauthorized"}` with status 401.

### 2. Test with Wrong Secret (should return 401)

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: wrong-secret" \
  -d '{"message": "hello", "user_id": "test123"}'
```

Expected: `{"error":"Unauthorized"}` with status 401.

### 3. Test with Valid Secret (should return 200)

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret-here" \
  -d '{"message": "Hi, I want to learn about trading", "user_id": "test123"}'
```

Expected: A JSON response with all fields:
```json
{
  "reply": "Hey! Great to hear you're interested in trading...",
  "conversation_complete": false,
  "qualified": false,
  "category": "general-inquiry",
  "lead_score": 15,
  "collected_fields": {},
  "next_best_action": "continue-conversation",
  "summary": "New lead expressed interest in trading. No details collected yet."
}
```

### 4. Test with Conversation History

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret-here" \
  -d '{
    "message": "My name is John and my email is john@example.com",
    "user_id": "test123",
    "conversation_history": [
      {"role": "user", "content": "Hi, I want to learn about trading"},
      {"role": "assistant", "content": "Hey! Great to hear. What aspect of trading are you most interested in?"}
    ]
  }'
```

Expected: Higher lead_score, collected_fields populated with name and email.

### 5. Test Invalid Body (should return 400)

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret-here" \
  -d '{"message": ""}'
```

Expected: `{"error":"Field 'message' is required and must be a non-empty string"}` with status 400.

## Common Debug Paths

| Symptom                    | Check                                              |
|----------------------------|-----------------------------------------------------|
| 401 on every request       | Verify WEBHOOK_SECRET matches in .env.local and header |
| 500 or empty reply         | Verify OPENAI_API_KEY is valid and has credits       |
| Prompt not loading         | Check omc/prompts/ files exist at deployment path    |
| Slow responses             | Normal — 3 sequential AI calls; consider async later |
| Invalid JSON in qualification | AI model returned non-JSON; fallback handles this  |

## Vercel Deployment Testing

After deploying:
1. Set `OPENAI_API_KEY` and `WEBHOOK_SECRET` in Vercel → Project → Settings → Environment Variables
2. Replace `localhost:3000` with your Vercel domain in the curl commands above
3. Test the same sequence

## Response Validation

Every response should always contain these 8 fields:
- `reply` (string)
- `conversation_complete` (boolean)
- `qualified` (boolean)
- `category` (string, one of 5 values)
- `lead_score` (integer 0-100)
- `collected_fields` (object)
- `next_best_action` (string, one of 6 values)
- `summary` (string)

Even on error, the endpoint returns this structure via the fallback response builder.
