/**
 * LetterStream callback webhook
 *
 * LetterStream pushes USPS scan/tracking events here every 4 hours per their
 * docs. They send four POST args: key, api_version, timestamp, json. The
 * `json` arg is a stringified array of tracking line items. Each line item
 * has: batch_id, job_id, doc_id, tracking_id, scan_date, scan_zip,
 * scan_facility, scan_code, scan_status.
 *
 * Required response per LetterStream spec:
 *   200 OK + { "success": true, "reason": "Received data" }
 *
 * If we don't respond 200 they will resend on the next 4-hour cycle (LIFO).
 *
 * Auth: LetterStream's "Authentication string" set in the API Information
 * page → it arrives as the `key` POST arg. We compare against
 * LETTERSTREAM_CALLBACK_AUTH env var.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ScanLineItem = {
  batch_id?: string;
  job_id?: string;
  doc_id?: string;
  tracking_id?: string;
  scan_date?: string;
  scan_zip?: string;
  scan_facility?: string;
  scan_code?: string;
  scan_status?: string;
};

const SUCCESS_RESPONSE = { success: true, reason: "Received data" };

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  let key: string | null = null;
  let apiVersion: string | null = null;
  let timestamp: string | null = null;
  let jsonRaw: string | null = null;

  try {
    if (contentType.includes("application/json")) {
      const body = await request.json();
      key = body?.key ?? null;
      apiVersion = body?.api_version ?? null;
      timestamp = body?.timestamp ?? null;
      jsonRaw = typeof body?.json === "string" ? body.json : JSON.stringify(body?.json ?? null);
    } else {
      const form = await request.formData();
      key = (form.get("key") as string | null) ?? null;
      apiVersion = (form.get("api_version") as string | null) ?? null;
      timestamp = (form.get("timestamp") as string | null) ?? null;
      jsonRaw = (form.get("json") as string | null) ?? null;
    }
  } catch (e) {
    console.error("[LetterStream webhook] body parse failed", e);
    // Acknowledge so they don't keep resending malformed retries; we logged it.
    return NextResponse.json(SUCCESS_RESPONSE);
  }

  const expectedKey = process.env.LETTERSTREAM_CALLBACK_AUTH;
  if (!expectedKey) {
    console.warn(
      "[LetterStream webhook] LETTERSTREAM_CALLBACK_AUTH not set — accepting payload but skipping auth check",
    );
  } else if (key !== expectedKey) {
    console.warn("[LetterStream webhook] auth mismatch");
    return NextResponse.json(
      { success: false, reason: "Invalid auth key" },
      { status: 401 },
    );
  }

  // Heartbeat: LetterStream sends heartbeats when there's no new data.
  // Acknowledge and exit.
  if (!jsonRaw || jsonRaw === "null") {
    console.log(
      `[LetterStream webhook] heartbeat (api_version=${apiVersion} ts=${timestamp})`,
    );
    return NextResponse.json(SUCCESS_RESPONSE);
  }

  let scans: ScanLineItem[] = [];
  try {
    const parsed = JSON.parse(jsonRaw);
    scans = Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    console.error("[LetterStream webhook] json arg parse failed", e, jsonRaw);
    return NextResponse.json(SUCCESS_RESPONSE);
  }

  if (scans.length === 0) {
    return NextResponse.json(SUCCESS_RESPONSE);
  }

  const supabase = getServiceClient();
  if (!supabase) {
    console.error("[LetterStream webhook] no Supabase service client");
    // Still ack so they don't retry — we have the log line.
    return NextResponse.json(SUCCESS_RESPONSE);
  }

  for (const s of scans) {
    if (!s.job_id) continue;
    const update: Record<string, unknown> = {
      letterstream_status: s.scan_status || s.scan_code || "scan",
      letterstream_last_scan: s.scan_date || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (s.tracking_id) update.letterstream_tracking_id = s.tracking_id;

    const { error } = await supabase
      .from("credit_disputes")
      .update(update)
      .eq("letterstream_job_id", s.job_id);

    if (error) {
      console.error(
        `[LetterStream webhook] supabase update failed for job=${s.job_id}`,
        error,
      );
    } else {
      console.log(
        `[LetterStream webhook] scan applied job=${s.job_id} status=${update.letterstream_status}`,
      );
    }
  }

  return NextResponse.json(SUCCESS_RESPONSE);
}

export async function GET() {
  return NextResponse.json({ status: "ok", service: "letterstream-webhook" });
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
