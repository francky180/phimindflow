/**
 * LetterStream API client
 *
 * Wraps the LetterStream certified-mail / first-class API for PHIMINDFLOW
 * credit-dispute mailings. Designed so the only thing that needs to change
 * once Morgan activates the account is the env vars: LETTERSTREAM_API_ID
 * and LETTERSTREAM_API_KEY.
 *
 * Auth follows the LetterStream pattern (verified against API Information page
 * sample values for FITFLYBUSINESS account on 2026-04-29):
 *   t = unique_id  (per-request, never reused per error code -957)
 *   a = API_ID
 *   h = md5( base64( last6(unique_id) + API_KEY + first6(unique_id) ) )
 */

import { createHash, randomBytes } from "crypto";

const BASE_URL =
  process.env.LETTERSTREAM_API_BASE_URL ||
  "https://www.letterstream.com/ls/api";

export type LetterStreamSender = {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
};

export type LetterStreamRecipient = LetterStreamSender;

export type SubmitJobOptions = {
  jobName: string;
  pdf: Uint8Array;
  pdfFilename?: string;
  recipient: LetterStreamRecipient;
  sender: LetterStreamSender;
  certified?: boolean;
  electronicReturnReceipt?: boolean;
  duplex?: boolean;
  pageCount?: number;
};

export type SubmitJobResult = {
  ok: boolean;
  jobId?: string;
  trackingId?: string;
  rawCode?: string;
  rawMessage?: string;
  raw?: unknown;
};

export type JobStatusResult = {
  ok: boolean;
  jobId: string;
  status?: string;
  trackingId?: string;
  mailDate?: string;
  rawCode?: string;
  raw?: unknown;
};

function getCreds() {
  const apiId = process.env.LETTERSTREAM_API_ID;
  const apiKey = process.env.LETTERSTREAM_API_KEY;
  if (!apiId || !apiKey) {
    throw new Error(
      "LetterStream credentials missing. Set LETTERSTREAM_API_ID and LETTERSTREAM_API_KEY in env.",
    );
  }
  return { apiId, apiKey };
}

function hashAuth(apiKey: string, uniqueId: string) {
  if (uniqueId.length < 10) {
    throw new Error("LetterStream uniqueId must be at least 10 characters");
  }
  const first6 = uniqueId.slice(0, 6);
  const last6 = uniqueId.slice(-6);
  const stringToHash = last6 + apiKey + first6;
  const base64 = Buffer.from(stringToHash, "utf8").toString("base64");
  return createHash("md5").update(base64).digest("hex");
}

function newUniqueId() {
  // 13-char timestamp + 8 hex chars = 21 chars; well above the 12-char floor.
  return Date.now().toString() + randomBytes(4).toString("hex");
}

function buildAuthArgs() {
  const { apiId, apiKey } = getCreds();
  const t = newUniqueId();
  const h = hashAuth(apiKey, t);
  return { a: apiId, t, h };
}

export async function submitCertifiedMail(
  opts: SubmitJobOptions,
): Promise<SubmitJobResult> {
  const auth = buildAuthArgs();

  const form = new FormData();
  form.append("a", auth.a);
  form.append("t", auth.t);
  form.append("h", auth.h);

  form.append("jobname", opts.jobName);
  form.append("mailtype", opts.certified ? "certified" : "firstclass");
  if (opts.electronicReturnReceipt) form.append("err", "1");
  if (opts.duplex) form.append("duplex", "1");
  if (opts.pageCount) form.append("pagecount", String(opts.pageCount));

  form.append("recipient_name", opts.recipient.name);
  form.append("recipient_addr1", opts.recipient.address1);
  if (opts.recipient.address2)
    form.append("recipient_addr2", opts.recipient.address2);
  form.append("recipient_city", opts.recipient.city);
  form.append("recipient_state", opts.recipient.state);
  form.append("recipient_zip", opts.recipient.zip);

  form.append("sender_name", opts.sender.name);
  form.append("sender_addr1", opts.sender.address1);
  if (opts.sender.address2) form.append("sender_addr2", opts.sender.address2);
  form.append("sender_city", opts.sender.city);
  form.append("sender_state", opts.sender.state);
  form.append("sender_zip", opts.sender.zip);

  const filename = opts.pdfFilename || `${opts.jobName}.pdf`;
  const blob = new Blob([new Uint8Array(opts.pdf)], { type: "application/pdf" });
  form.append("file", blob, filename);

  const res = await fetch(`${BASE_URL}/post.php`, {
    method: "POST",
    body: form,
  });

  const text = await res.text();
  return parseJobResponse(text);
}

export async function getJobStatus(jobId: string): Promise<JobStatusResult> {
  const auth = buildAuthArgs();

  const params = new URLSearchParams({
    a: auth.a,
    t: auth.t,
    h: auth.h,
    jobid: jobId,
  });

  const res = await fetch(`${BASE_URL}/getjobstatus.php?${params.toString()}`, {
    method: "GET",
  });

  const text = await res.text();
  const parsed = tryParseJson(text);
  return {
    ok: res.ok,
    jobId,
    status: pickField(parsed, ["status", "Status", "jobstatus"]),
    trackingId: pickField(parsed, ["tracking_id", "trackingid", "TrackingID"]),
    mailDate: pickField(parsed, ["mail_date", "maildate", "MailDate"]),
    rawCode: pickField(parsed, ["code", "Code"]),
    raw: parsed ?? text,
  };
}

function parseJobResponse(text: string): SubmitJobResult {
  const parsed = tryParseJson(text);
  if (!parsed) {
    return { ok: false, rawMessage: text, raw: text };
  }
  const code = pickField(parsed, ["code", "Code"]);
  const jobId =
    pickField(parsed, ["job_id", "jobid", "JobID", "id"]) ?? undefined;
  const trackingId =
    pickField(parsed, ["tracking_id", "trackingid", "TrackingID"]) ?? undefined;
  const message =
    pickField(parsed, ["message", "Message", "description"]) ?? undefined;

  // LetterStream uses negative codes for status/info, fatal codes -900..-999
  const codeNum = code != null ? Number(code) : NaN;
  const fatal = !Number.isNaN(codeNum) && codeNum <= -900;
  return {
    ok: !fatal,
    jobId,
    trackingId,
    rawCode: code,
    rawMessage: message,
    raw: parsed,
  };
}

function tryParseJson(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function pickField(
  obj: Record<string, unknown> | null,
  keys: string[],
): string | undefined {
  if (!obj) return undefined;
  for (const k of keys) {
    const v = obj[k];
    if (v != null) return String(v);
  }
  return undefined;
}
