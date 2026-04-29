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
  "https://www.letterstream.com/apis";

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

function formatAddr(
  a: LetterStreamRecipient | LetterStreamSender,
  withDocId?: string,
) {
  // LetterStream colon-delimited address: doc_id:name1:name2:address1:address2:city:state:zip
  // For "from" (sender) the doc_id is omitted.
  const name1 = (a.name || "").split(/\s+/)[0] || a.name;
  const name2 = (a.name || "").split(/\s+/).slice(1).join(" ") || "";
  const parts = [
    name1,
    name2,
    a.address1,
    a.address2 || "",
    a.city,
    a.state,
    a.zip,
  ];
  // strip colons from parts to avoid breaking the delimiter
  const safe = parts.map((p) => String(p).replace(/[:|]/g, " "));
  return withDocId
    ? [withDocId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20), ...safe].join(":")
    : safe.join(":");
}

export async function submitCertifiedMail(
  opts: SubmitJobOptions,
): Promise<SubmitJobResult> {
  const auth = buildAuthArgs();

  const form = new FormData();
  form.append("a", auth.a);
  form.append("t", auth.t);
  form.append("h", auth.h);

  // Required: unique 8–20 char job name
  form.append("job", opts.jobName);

  // Mail type: certified (with electronic return receipt by default) or certnoerr
  const mailtype = opts.certified
    ? opts.electronicReturnReceipt === false
      ? "certnoerr"
      : "certified"
    : "firstclass";
  form.append("mailtype", mailtype);

  // Coversheet=Y because our PDFs aren't formatted to LetterStream's window envelopes
  form.append("coversheet", "Y");

  if (opts.duplex) form.append("duplex", "Y");
  if (opts.pageCount) form.append("pages", String(opts.pageCount));

  // doc_id must be unique alphanumeric ≤20 chars; derive from job name
  const docId = (opts.jobName + Date.now().toString(36))
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 20);

  // Addresses go as colon-delimited strings
  form.append("from", formatAddr(opts.sender));
  form.append("to[]", formatAddr(opts.recipient, docId));

  // JSON response (instead of XML)
  form.append("responseformat", "json");
  // debug=3 for verbose error messages
  form.append("debug", "3");

  // PDF goes as `single_file` field
  const filename = opts.pdfFilename || `${opts.jobName}.pdf`;
  const blob = new Blob([new Uint8Array(opts.pdf)], { type: "application/pdf" });
  form.append("single_file", blob, filename);

  const res = await fetch(`${BASE_URL}/`, {
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

  const res = await fetch(`${BASE_URL}/?${params.toString()}&command=getjobstatus`, {
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
  // LetterStream returns nested JSON like:
  // { messages: { id, message: { type, code, details, batch, doc: [{id, job, cost}] } } }
  // Older fallback: XML or plain "AUTHOK ..."/"BAD ..." strings.
  const parsed = tryParseJson(text);
  if (!parsed) {
    return { ok: false, rawMessage: text.slice(0, 500), raw: text };
  }

  // Drill down to the inner message object
  const messages = (parsed as Record<string, unknown>).messages as Record<string, unknown> | undefined;
  const msg = messages?.message as Record<string, unknown> | undefined;
  const inner = msg ?? (parsed as Record<string, unknown>);

  const code = pickField(inner, ["code", "Code"]);
  const details = pickField(inner, ["details", "Details", "message", "Message"]);

  // doc may be array or single object
  let jobId: string | undefined;
  let docId: string | undefined;
  const docVal = (inner as Record<string, unknown>).doc;
  const firstDoc = Array.isArray(docVal)
    ? (docVal[0] as Record<string, unknown> | undefined)
    : (docVal as Record<string, unknown> | undefined);
  if (firstDoc) {
    jobId = pickField(firstDoc, ["job", "Job", "jobid", "JobID"]);
    docId = pickField(firstDoc, ["id", "Id", "doc_id", "DocId"]);
  }
  jobId = jobId ?? pickField(inner, ["job_id", "jobid", "JobID", "id"]);
  const trackingId = pickField(inner, ["tracking_id", "trackingid", "TrackingID"]);

  // LetterStream uses negative codes for status/info, fatal codes -900..-999
  const codeNum = code != null ? Number(code) : NaN;
  const fatal = !Number.isNaN(codeNum) && codeNum <= -900;
  return {
    ok: !fatal && !!jobId,
    jobId,
    trackingId: trackingId ?? docId,
    rawCode: code,
    rawMessage: details,
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
