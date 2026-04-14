# ManyChat Integration Guide

## Endpoint

```
POST https://your-domain.vercel.app/api/chat
```

## Required Headers

| Header             | Value                          |
|--------------------|--------------------------------|
| Content-Type       | application/json               |
| x-webhook-secret   | (your WEBHOOK_SECRET value)    |

## Request Body

```json
{
  "message": "User's message text",
  "user_id": "manychat_subscriber_id",
  "conversation_history": [
    { "role": "user", "content": "previous user message" },
    { "role": "assistant", "content": "previous AI reply" }
  ]
}
```

- `message` (required): The current message from the user
- `user_id` (required): ManyChat subscriber ID
- `conversation_history` (optional): Array of previous messages for context

## Response Body

```json
{
  "reply": "AI response text to send back",
  "conversation_complete": false,
  "qualified": false,
  "category": "general-inquiry",
  "lead_score": 25,
  "collected_fields": {
    "name": "John",
    "email": "john@example.com"
  },
  "next_best_action": "continue-conversation",
  "summary": "Brief summary of the conversation."
}
```

## ManyChat Custom Fields to Create

Create these custom fields in ManyChat (all as **Text** type unless noted):

| Custom Field Name          | Type    | Maps To                      |
|---------------------------|---------|-------------------------------|
| ai_reply                  | Text    | response.reply                |
| ai_summary                | Text    | response.summary              |
| ai_category               | Text    | response.category             |
| ai_qualified              | Text    | response.qualified            |
| ai_lead_score             | Number  | response.lead_score           |
| ai_next_action            | Text    | response.next_best_action     |
| ai_conversation_complete  | Text    | response.conversation_complete|

## ManyChat Setup Steps

### 1. Create Custom Fields
Go to **Settings → Custom Fields** in ManyChat and create all 7 fields listed above.

### 2. Create an Automation Flow
1. Set a trigger (e.g., user sends a message, keyword trigger, or button click)
2. Add an **External Request** action block
3. Configure the external request:
   - **Method:** POST
   - **URL:** `https://your-domain.vercel.app/api/chat`
   - **Headers:** Add `x-webhook-secret` with your secret value
   - **Body:** JSON with `message`, `user_id`, and optionally `conversation_history`

### 3. Map Response Fields
In the External Request block's response mapping:
- Map `$.reply` → `ai_reply`
- Map `$.summary` → `ai_summary`
- Map `$.category` → `ai_category`
- Map `$.qualified` → `ai_qualified`
- Map `$.lead_score` → `ai_lead_score`
- Map `$.next_best_action` → `ai_next_action`
- Map `$.conversation_complete` → `ai_conversation_complete`

### 4. Add Send Message Block
After the External Request, add a **Send Message** block that uses `{{ai_reply}}` as the message text.

### 5. Add Conditional Logic (Optional)
Use conditions based on custom fields:
- If `ai_conversation_complete` is `true` → end flow or hand off
- If `ai_qualified` is `true` → trigger qualified lead flow
- If `ai_next_action` is `schedule-call` → trigger booking flow
- Route by `ai_category` to different follow-up sequences
