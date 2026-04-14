import { NextRequest, NextResponse } from "next/server";
import { parseReportText } from "@/lib/credit/pdf-report-parser";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

/**
 * Detect file kind from magic bytes (first few bytes of the buffer).
 * This is more reliable than trusting file extension or Content-Type.
 */
function sniffKind(buf: Buffer, fallbackName: string, mime: string): string {
  if (buf.length >= 4) {
    const b0 = buf[0], b1 = buf[1], b2 = buf[2], b3 = buf[3];

    // PDF
    if (b0 === 0x25 && b1 === 0x50 && b2 === 0x44 && b3 === 0x46) return "pdf"; // %PDF
    // ZIP-based (DOCX/XLSX/ODT/etc.)
    if (b0 === 0x50 && b1 === 0x4b && (b2 === 0x03 || b2 === 0x05 || b2 === 0x07)) {
      const name = fallbackName.toLowerCase();
      if (name.endsWith(".docx")) return "docx";
      if (name.endsWith(".xlsx")) return "xlsx";
      if (name.endsWith(".odt")) return "odt";
      return "zip";
    }
    // RTF — starts with {\rtf
    if (b0 === 0x7b && b1 === 0x5c && b2 === 0x72 && b3 === 0x74) return "rtf";
    // PNG
    if (b0 === 0x89 && b1 === 0x50 && b2 === 0x4e && b3 === 0x47) return "image";
    // JPEG
    if (b0 === 0xff && b1 === 0xd8 && b2 === 0xff) return "image";
    // GIF
    if (b0 === 0x47 && b1 === 0x49 && b2 === 0x46) return "image";
    // HEIC/HEIF — starts with 'ftyp' at offset 4
    if (buf.length >= 12) {
      const ftyp = buf.slice(4, 8).toString("ascii");
      if (ftyp === "ftyp") return "image";
    }
    // WebP — RIFF....WEBP
    if (b0 === 0x52 && b1 === 0x49 && b2 === 0x46 && b3 === 0x46) {
      if (buf.length >= 12 && buf.slice(8, 12).toString("ascii") === "WEBP") return "image";
    }
  }

  // HTML — look for <!DOCTYPE or <html
  const head = buf.slice(0, 2048).toString("utf-8").toLowerCase().trimStart();
  if (head.startsWith("<!doctype html") || head.startsWith("<html") || head.includes("<body")) return "html";

  // JSON
  const firstNonWs = head.trimStart()[0];
  if (firstNonWs === "{" || firstNonWs === "[") {
    try {
      JSON.parse(buf.toString("utf-8"));
      return "json";
    } catch {
      /* fall through */
    }
  }

  // CSV heuristic
  if (/\.csv$/i.test(fallbackName) || mime === "text/csv") return "csv";

  // Plain text fallback
  // If content is mostly printable ASCII/UTF-8, treat as text.
  const sample = buf.slice(0, 512);
  let printable = 0;
  for (const byte of sample) {
    if (byte === 9 || byte === 10 || byte === 13 || (byte >= 32 && byte <= 126)) printable++;
  }
  if (printable / sample.length > 0.85) return "text";

  return "unknown";
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.mjs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { pathToFileURL } = require("url");
  pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(
    path.join(process.cwd(), "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs")
  ).href;
  const data = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({
    data,
    isEvalSupported: false,
    disableAutoFetch: true,
    useSystemFonts: true,
  });
  const doc = await loadingTask.promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let lastY = -1;
    const lines: string[] = [];
    let currentLine = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const textItem = item as any;
      const y = Math.round(textItem.transform?.[5] || 0);
      if (lastY !== -1 && Math.abs(y - lastY) > 3) {
        if (currentLine.trim()) lines.push(currentLine.trim());
        currentLine = "";
      }
      currentLine += (currentLine ? " " : "") + textItem.str;
      lastY = y;
    }
    if (currentLine.trim()) lines.push(currentLine.trim());
    pages.push(lines.join("\n"));
  }

  return pages.join("\n");
}

function htmlToText(buf: Buffer): string {
  return buf
    .toString("utf-8")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

function rtfToText(buf: Buffer): string {
  // Minimal RTF stripper — not perfect but handles common exports.
  return buf
    .toString("utf-8")
    .replace(/\\par[d]?/g, "\n")
    .replace(/\\'([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\[a-z]+-?\d*\s?/gi, "")
    .replace(/[{}]/g, "")
    .replace(/\\\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mammoth = require("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return (result.value as string) || "";
}

function jsonToText(buf: Buffer): string {
  try {
    const parsed = JSON.parse(buf.toString("utf-8"));
    const walk = (v: unknown): string => {
      if (v === null || v === undefined) return "";
      if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
      if (Array.isArray(v)) return v.map(walk).filter(Boolean).join("\n");
      if (typeof v === "object") {
        return Object.entries(v as Record<string, unknown>)
          .map(([k, val]) => {
            const s = walk(val);
            return s ? `${k}: ${s}` : "";
          })
          .filter(Boolean)
          .join("\n");
      }
      return "";
    };
    return walk(parsed);
  } catch {
    return buf.toString("utf-8");
  }
}

function csvToText(buf: Buffer): string {
  return buf
    .toString("utf-8")
    .split(/\r?\n/)
    .map((line) => line.replace(/,/g, " · "))
    .join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const pastedText = formData.get("text") as string | null;

    // Pasted-text fallback path
    if (!file && pastedText && pastedText.trim().length > 50) {
      const report = parseReportText(pastedText);
      const totalNegative = report.negativeAccounts.length + report.collections.length;
      const totalDisputable = [...report.negativeAccounts, ...report.collections].filter((a) => a.isDisputable).length;
      return NextResponse.json({
        success: true,
        report,
        summary: {
          bureau: report.bureau,
          scores: report.scores,
          averageScore: report.estimatedScore,
          totalAccounts: report.totalAccounts,
          totalNegative,
          totalDisputable,
          inquiries: report.inquiries.length,
          publicRecords: report.publicRecords.length,
          textExtracted: pastedText.length,
          source: "pasted",
        },
      });
    }

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Drag a file in or paste your report text directly." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 25MB.` },
        { status: 400 }
      );
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "That file is empty." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const kind = sniffKind(buffer, file.name || "", file.type || "");
    let text = "";
    let extractError: string | null = null;

    try {
      switch (kind) {
        case "pdf":
          text = await extractPdfText(buffer);
          if (!text || text.trim().length < 30) {
            extractError =
              "This looks like a scanned/image-based PDF. Our text parser can't read images. Open it in your browser and use 'Print to PDF' (the print dialog's built-in PDF export), or paste the text content into the box below.";
          }
          break;
        case "html":
          text = htmlToText(buffer);
          break;
        case "text":
          text = buffer.toString("utf-8");
          break;
        case "rtf":
          text = rtfToText(buffer);
          break;
        case "docx":
          text = await extractDocxText(buffer);
          break;
        case "json":
          text = jsonToText(buffer);
          break;
        case "csv":
          text = csvToText(buffer);
          break;
        case "image":
          extractError =
            "That looks like a screenshot or image. Our parser reads text, not pictures. Either (a) open your report in a browser and use 'Print to PDF', (b) paste the text directly, or (c) upload a different file type.";
          break;
        case "zip":
          extractError =
            "That looks like a generic zip archive. If it contains a credit report, extract the PDF or HTML file inside and upload that.";
          break;
        case "xlsx":
          extractError =
            "Excel files aren't supported yet. Open the file, copy your report data, and paste it into the text box.";
          break;
        default:
          // Last-resort fallback: try treating the buffer as UTF-8 text.
          text = buffer.toString("utf-8").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, " ");
          if (!text || text.trim().length < 50) {
            extractError =
              "We couldn't recognize this file type. Supported: PDF, HTML, TXT, DOCX, RTF, JSON, CSV. Or paste your report text directly.";
          }
      }
    } catch (parseErr: unknown) {
      const message = parseErr instanceof Error ? parseErr.message : String(parseErr);
      console.error("Extract error:", message);
      extractError = `We couldn't read this file (${message}). Try a different format, or paste the text directly.`;
    }

    if (extractError && (!text || text.trim().length < 50)) {
      return NextResponse.json({ error: extractError }, { status: 400 });
    }

    if (!text || text.trim().length < 30) {
      return NextResponse.json(
        {
          error:
            "We couldn't extract enough text from that file. Try a different format — or paste your report text directly into the box below.",
        },
        { status: 400 }
      );
    }

    const report = parseReportText(text);

    const totalNegative = report.negativeAccounts.length + report.collections.length;
    const totalDisputable = [...report.negativeAccounts, ...report.collections].filter((a) => a.isDisputable).length;

    return NextResponse.json({
      success: true,
      report,
      summary: {
        bureau: report.bureau,
        scores: report.scores,
        averageScore: report.estimatedScore,
        totalAccounts: report.totalAccounts,
        totalNegative,
        totalDisputable,
        inquiries: report.inquiries.length,
        publicRecords: report.publicRecords.length,
        textExtracted: text.length,
        kind,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Report analysis error:", message);
    return NextResponse.json(
      { error: "Something went wrong reading that file. Try a different format or paste your report text directly." },
      { status: 500 }
    );
  }
}
