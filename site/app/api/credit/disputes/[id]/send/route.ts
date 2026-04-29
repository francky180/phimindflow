/**
 * POST /api/credit/disputes/[id]/send
 *
 * Loads a dispute + the user's credit profile, generates a PDF via the
 * existing letter generator, and submits it to LetterStream as certified
 * mail addressed to the bureau on the dispute. On success, saves
 * letterstream_job_id + letterstream_tracking_id back onto the dispute row.
 *
 * No UI is wired to this route yet. It exists so the backend is fully
 * ready the moment Morgan ships the API_ID + API_KEY — at that point the
 * existing "Send via LetterStream" button can be flipped from an external
 * `<a href>` to a fetch() against this route, with no other code changes.
 *
 * Test from a shell once env vars are set:
 *   curl -X POST -b "<cookie>" \
 *     https://phimindflow.com/api/credit/disputes/<dispute-id>/send
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  submitCertifiedMail,
  type LetterStreamSender,
  type LetterStreamRecipient,
} from "@/lib/letterstream";
import { generateLetterPdf } from "@/lib/credit/pdf-letter-generator";

const BUREAU_ADDRESSES: Record<
  "equifax" | "experian" | "transunion",
  LetterStreamRecipient
> = {
  equifax: {
    name: "Equifax Information Services LLC",
    address1: "P.O. Box 740256",
    city: "Atlanta",
    state: "GA",
    zip: "30374",
  },
  experian: {
    name: "Experian",
    address1: "P.O. Box 4500",
    city: "Allen",
    state: "TX",
    zip: "75013",
  },
  transunion: {
    name: "TransUnion Consumer Solutions",
    address1: "P.O. Box 2000",
    city: "Chester",
    state: "PA",
    zip: "19016",
  },
};

function getSender(): LetterStreamSender | null {
  const name = process.env.LETTERSTREAM_SENDER_NAME;
  const address1 = process.env.LETTERSTREAM_SENDER_ADDR1;
  const address2 = process.env.LETTERSTREAM_SENDER_ADDR2;
  const city = process.env.LETTERSTREAM_SENDER_CITY;
  const state = process.env.LETTERSTREAM_SENDER_STATE;
  const zip = process.env.LETTERSTREAM_SENDER_ZIP;
  if (!name || !address1 || !city || !state || !zip) return null;
  return { name, address1, address2, city, state, zip };
}

function shortJobName(disputeId: string) {
  // LetterStream requires 8–20 chars, [a-zA-Z0-9_-]
  const stamp = Date.now().toString(36);
  const tail = disputeId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
  const name = `pmf-${tail}-${stamp}`;
  return name.slice(0, 20);
}

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json({ error: "Missing dispute id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: dispute, error: dErr } = await supabase
    .from("credit_disputes")
    .select(
      "id, user_id, item_id, bureau, subject, letter_text, status, letterstream_job_id",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (dErr || !dispute) {
    return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
  }

  if (dispute.letterstream_job_id) {
    return NextResponse.json(
      {
        error: "Already submitted",
        jobId: dispute.letterstream_job_id,
      },
      { status: 409 },
    );
  }

  const bureau = String(dispute.bureau).toLowerCase() as keyof typeof BUREAU_ADDRESSES;
  const recipient = BUREAU_ADDRESSES[bureau];
  if (!recipient) {
    return NextResponse.json(
      { error: `Unsupported bureau: ${dispute.bureau}` },
      { status: 400 },
    );
  }

  const sender = getSender();
  if (!sender) {
    return NextResponse.json(
      {
        error:
          "Sender address not configured. Set LETTERSTREAM_SENDER_NAME / ADDR1 / CITY / STATE / ZIP env vars.",
      },
      { status: 500 },
    );
  }

  if (!process.env.LETTERSTREAM_API_ID || !process.env.LETTERSTREAM_API_KEY) {
    return NextResponse.json(
      {
        error:
          "LetterStream not yet activated. Waiting on API_ID + API_KEY from LetterStream support.",
      },
      { status: 503 },
    );
  }

  // Pull creditor name for PDF header from the linked credit_items row (if any)
  let creditor = "Credit Bureau";
  if (dispute.item_id) {
    const { data: item } = await supabase
      .from("credit_items")
      .select("creditor")
      .eq("id", dispute.item_id)
      .maybeSingle();
    if (item?.creditor) creditor = String(item.creditor);
  }

  const pdfDoc = generateLetterPdf({
    letterText: String(dispute.letter_text),
    creditor,
    bureau: String(dispute.bureau),
    round: 1,
  });
  const pdfBytes = pdfDoc.output("arraybuffer");
  const pdf = new Uint8Array(pdfBytes as ArrayBuffer);
  const pageCount = pdfDoc.getNumberOfPages();

  const jobName = shortJobName(dispute.id);

  let result;
  try {
    result = await submitCertifiedMail({
      jobName,
      pdf,
      pdfFilename: `${jobName}.pdf`,
      recipient,
      sender,
      certified: true,
      electronicReturnReceipt: false,
      pageCount,
    });
  } catch (e) {
    console.error("[dispute send] LetterStream submit threw", e);
    return NextResponse.json(
      { error: "LetterStream submit failed", detail: String(e) },
      { status: 502 },
    );
  }

  if (!result.ok || !result.jobId) {
    return NextResponse.json(
      {
        error: "LetterStream rejected the job",
        detail: result.rawMessage || result.rawCode,
        raw: result.raw,
      },
      { status: 502 },
    );
  }

  const { error: updateErr } = await supabase
    .from("credit_disputes")
    .update({
      letterstream_job_id: result.jobId,
      letterstream_tracking_id: result.trackingId ?? null,
      letterstream_status: "submitted",
      sent_via_letterstream_at: new Date().toISOString(),
      status: "sent",
      date_sent: new Date().toISOString().slice(0, 10),
    })
    .eq("id", dispute.id)
    .eq("user_id", user.id);

  if (updateErr) {
    console.error("[dispute send] supabase update failed", updateErr);
    // The mail is already in flight — return success but log the drift.
  }

  return NextResponse.json({
    ok: true,
    jobId: result.jobId,
    trackingId: result.trackingId ?? null,
  });
}
