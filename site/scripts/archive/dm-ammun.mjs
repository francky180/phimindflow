// One-shot: find Ammun in the Instagram inbox and send "what's up".
// Usage: node scripts/dm-ammun.mjs [--dry] [--dump]
import fs from "node:fs";
import path from "node:path";
import Zernio from "@zernio/node";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

if (!process.env.ZERNIO_API_KEY) {
  console.error("ZERNIO_API_KEY not found");
  process.exit(1);
}

const dryRun = process.argv.includes("--dry");
const dump = process.argv.includes("--dump");
const zernio = new Zernio({ apiKey: process.env.ZERNIO_API_KEY });

const { data, error } = await zernio.messages.listInboxConversations({
  query: { platform: "instagram", limit: 100 },
});
if (error) {
  console.error("API error:", JSON.stringify(error, null, 2));
  process.exit(1);
}
const convs = data?.data || data?.conversations || data || [];

if (dump) {
  console.log("=== FIRST CONVERSATION FULL SHAPE ===");
  console.log(JSON.stringify(convs[0], null, 2));
  process.exit(0);
}

// Search every nested string field for "ammun"
const match = convs.find((c) => JSON.stringify(c).toLowerCase().includes("ammun"));

if (!match) {
  console.log(`Scanned ${convs.length} conversations. No 'ammun' match.`);
  console.log("\nFirst 10 participant summaries:");
  for (const c of convs.slice(0, 10)) {
    // try multiple possible field paths
    const p =
      c.participants?.[0] ||
      c.instagramProfile ||
      c.profile ||
      c.sender ||
      {};
    console.log(
      ` - name="${p.name || p.fullName || ""}" user="${p.username || ""}" id="${p.id || p.igsid || ""}"`
    );
  }
  console.log("\nRun with --dump to inspect raw shape of conversation[0].");
  process.exit(1);
}

console.log("Match:", JSON.stringify(match, null, 2).slice(0, 2000));

const conversationId = match.conversationId || match.id;
const pid =
  match.participants?.[0]?.id ||
  match.instagramProfile?.id ||
  match.participant?.id ||
  match.senderId;

console.log(`\nconversationId: ${conversationId}`);
console.log(`recipientId:    ${pid}`);

if (dryRun) {
  console.log('\n[dry-run] Would send: "what\'s up"');
  process.exit(0);
}

const send = await zernio.messages.sendInboxMessage({
  body: {
    platform: "instagram",
    conversationId,
    recipientId: pid,
    text: "what's up",
  },
});
if (send.error) {
  console.error("Send failed:", JSON.stringify(send.error, null, 2));
  process.exit(1);
}
console.log("Sent:", JSON.stringify(send.data, null, 2));
