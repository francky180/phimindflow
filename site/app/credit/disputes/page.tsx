"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/Navbar";
import { generateDisputeLetter, ROUND_INFO, type DisputeInput, type DisputeRound } from "@/lib/credit/dispute-letters";
import {
  COMMON_COLLECTION_AGENCIES, COMMON_CREDITORS, COMMON_MEDICAL,
  DISPUTE_REASONS, ALL_BUREAUS, type DisputeTypeKey, type Bureau,
} from "@/lib/credit/dispute-data";
import { downloadLetterPdf, downloadLetterBundle } from "@/lib/credit/pdf-letter-generator";
import { FileText, Download, Copy, CheckCircle, Plus, Sparkles, Search, ArrowRight, Shield, AlertTriangle, Zap, ChevronRight, Upload, Loader2, FileDown } from "lucide-react";

interface ReportItem {
  creditorName: string;
  accountNumber: string;
  accountType: string;
  negativeReason: string;
  disputeReason: string;
  balance: number;
  isDisputable: boolean;
  bureaus?: string[];
}

export default function DisputeLettersPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-[var(--muted)]">Loading...</div></div>}>
      <DisputeLettersPage />
    </Suspense>
  );
}

function DisputeLettersPage() {
  const searchParams = useSearchParams();
  const fromReport = searchParams.get("from") === "report";
  const modeAll = searchParams.get("mode") === "all";

  // Report-based state
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const [selectedReportItem, setSelectedReportItem] = useState<ReportItem | null>(null);
  const [allLetters, setAllLetters] = useState<{ creditor: string; bureau: Bureau; text: string }[]>([]);
  const [showReportMode, setShowReportMode] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);
  const [letters, setLetters] = useState<{ bureau: Bureau; text: string }[]>([]);
  const [selectedType, setSelectedType] = useState<DisputeTypeKey>("collection");
  const [selectedCreditor, setSelectedCreditor] = useState("");
  const [customCreditor, setCustomCreditor] = useState("");
  const [creditorSearch, setCreditorSearch] = useState("");
  const [showCreditorList, setShowCreditorList] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [selectedBureaus, setSelectedBureaus] = useState<Bureau[]>([...ALL_BUREAUS]);
  const [selectedRound, setSelectedRound] = useState<DisputeRound>(1);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/analyze-report", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const report = data.report;
      const allNegative = [...(report.collections || []), ...(report.negativeAccounts || [])].filter(
        (a: ReportItem) => a.isDisputable
      );

      if (allNegative.length === 0) {
        setUploadError("No disputable items found in your report. Your report looks clean!");
        return;
      }

      setReportItems(allNegative);
      setShowReportMode(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Try again or use a different file format.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  // Load report data from localStorage
  useEffect(() => {
    if (!fromReport) return;

    if (modeAll) {
      const items = localStorage.getItem("creditpath-dispute-items");
      if (items) {
        const parsed = JSON.parse(items) as ReportItem[];
        setReportItems(parsed);
        setShowReportMode(true);
      }
    } else {
      const item = localStorage.getItem("creditpath-dispute-item");
      if (item) {
        const parsed = JSON.parse(item) as ReportItem;
        setSelectedCreditor(parsed.creditorName);
        setAccountNumber(parsed.accountNumber || "****");
        // Map account type to dispute type
        const typeMap: Record<string, DisputeTypeKey> = {
          "Collection": "collection",
          "Credit Card": "late-payment",
          "Auto Loan": "late-payment",
          "Student Loan": "student-loan",
          "Medical": "medical-debt",
          "Mortgage": "late-payment",
        };
        const reason = parsed.negativeReason?.toLowerCase() || "";
        if (reason.includes("charge")) setSelectedType("charge-off");
        else if (reason.includes("collection")) setSelectedType("collection");
        else if (reason.includes("repossession")) setSelectedType("repossession");
        else setSelectedType(typeMap[parsed.accountType] || "late-payment");

        setSelectedReason(parsed.disputeReason || "I dispute the accuracy of this account. Please verify.");
      }
    }
  }, [fromReport, modeAll]);

  // Generate all letters for all report items at once
  const handleGenerateAll = () => {
    if (!userName || !userAddress) return;
    const generated: { creditor: string; bureau: Bureau; text: string }[] = [];

    for (const item of reportItems) {
      const reason = item.negativeReason?.toLowerCase() || "";
      let type: DisputeInput["type"] = "late-payment";
      if (reason.includes("collection")) type = "collection";
      else if (reason.includes("charge")) type = "charge-off";
      else if (reason.includes("repossession")) type = "repossession";
      else if (item.accountType === "Collection") type = "collection";
      else if (item.accountType === "Student Loan") type = "student-loan";
      else if (item.accountType === "Medical") type = "medical-debt";

      const disputeReason = item.disputeReason || "I dispute the accuracy of this account and request full verification under FCRA Section 611.";

      for (const bureau of ALL_BUREAUS) {
        generated.push({
          creditor: item.creditorName,
          bureau,
          text: generateDisputeLetter({
            type,
            round: selectedRound,
            creditorName: item.creditorName,
            accountNumber: item.accountNumber || "****",
            userName,
            userAddress,
            bureau,
            reason: disputeReason,
          }),
        });
      }
    }
    setAllLetters(generated);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const creditorName = selectedCreditor || customCreditor;
  const reason = selectedReason || customReason;
  const canGenerate = creditorName && userName && userAddress && reason;

  // Build creditor list based on dispute type
  const getCreditorList = () => {
    const search = creditorSearch.toLowerCase();
    let list: string[] = [];

    if (selectedType === "collection" || selectedType === "identity-theft") {
      list = [...COMMON_COLLECTION_AGENCIES, ...COMMON_CREDITORS];
    } else if (selectedType === "medical-debt") {
      list = [...COMMON_MEDICAL, ...COMMON_COLLECTION_AGENCIES];
    } else {
      list = [...COMMON_CREDITORS];
    }

    if (search) {
      list = list.filter((c) => c.toLowerCase().includes(search));
    }
    return list;
  };

  const handleGenerate = () => {
    const generated = selectedBureaus.map((bureau) => {
      const input: DisputeInput = {
        type: selectedType as DisputeInput["type"],
        round: selectedRound,
        creditorName,
        accountNumber: accountNumber || "****",
        userName,
        userAddress,
        bureau,
        reason,
      };
      return { bureau, text: generateDisputeLetter(input) };
    });
    setLetters(generated);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleCopy = (bureau: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(bureau);
    setTimeout(() => setCopied(null), 2000);
  };

  const logLetterToDashboard = (entry: {
    creditor: string;
    bureau: string;
    round: number;
    type: string;
  }) => {
    if (typeof window === "undefined") return;
    try {
      const key = "florifye-letters";
      const existing = JSON.parse(localStorage.getItem(key) || "[]") as Array<{
        id: string;
        creditor: string;
        bureau: string;
        round: number;
        type: string;
        status: string;
        createdAt: string;
      }>;
      const id = `${entry.creditor}-${entry.bureau}-${entry.round}-${Date.now()}`;
      existing.push({
        id,
        creditor: entry.creditor,
        bureau: entry.bureau,
        round: entry.round,
        type: entry.type,
        status: "downloaded",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(existing.slice(-200)));
    } catch {
      /* non-fatal */
    }
  };

  const handleDownload = (bureau: string, text: string) => {
    const creditor = customCreditor || selectedCreditor || "creditor";
    downloadLetterPdf({
      letterText: text,
      creditor,
      bureau,
      round: selectedRound,
    });
    logLetterToDashboard({ creditor, bureau, round: selectedRound, type: selectedType });
  };

  const handleDownloadAll = () => {
    const creditor = customCreditor || selectedCreditor || "creditor";
    downloadLetterBundle(
      letters.map((l) => ({
        letterText: l.text,
        creditor,
        bureau: l.bureau,
        round: selectedRound,
      })),
      `florifye-disputes-round${selectedRound}`
    );
    letters.forEach((l) =>
      logLetterToDashboard({ creditor, bureau: l.bureau, round: selectedRound, type: selectedType })
    );
  };

  const handleDownloadReportLetter = (l: { creditor: string; bureau: Bureau; text: string }) => {
    downloadLetterPdf({
      letterText: l.text,
      creditor: l.creditor,
      bureau: l.bureau,
      round: selectedRound,
    });
    logLetterToDashboard({ creditor: l.creditor, bureau: l.bureau, round: selectedRound, type: "collection" });
  };

  const handleDownloadAllReportLetters = () => {
    downloadLetterBundle(
      allLetters.map((l) => ({
        letterText: l.text,
        creditor: l.creditor,
        bureau: l.bureau,
        round: selectedRound,
      })),
      `florifye-disputes-full-round${selectedRound}`
    );
    allLetters.forEach((l) =>
      logLetterToDashboard({ creditor: l.creditor, bureau: l.bureau, round: selectedRound, type: "collection" })
    );
  };

  const toggleBureau = (bureau: Bureau) => {
    if (selectedBureaus.includes(bureau)) {
      if (selectedBureaus.length > 1) {
        setSelectedBureaus(selectedBureaus.filter((b) => b !== bureau));
      }
    } else {
      setSelectedBureaus([...selectedBureaus, bureau]);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-semibold tracking-widest uppercase mb-4">
              <FileText size={14} /> Free Tool
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[var(--text)] mb-3">
              Dispute Letter Generator
            </h1>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              Generate FCRA-compliant dispute letters for all 3 bureaus at once. Just pick your options and click generate.
            </p>
          </div>

          {/* UPLOAD SECTION */}
          {!showReportMode && (
            <div className="mb-8">
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-dim)] flex items-center justify-center">
                    <Upload size={18} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[var(--text)]">Upload Your Credit Report</h2>
                    <p className="text-xs text-[var(--muted)]">We&apos;ll find every disputable item and generate letters automatically</p>
                  </div>
                </div>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileRef.current?.click()}
                  className="mt-4 border-2 border-dashed border-[var(--border)] rounded-xl p-8 sm:p-10 text-center cursor-pointer hover:border-[var(--accent)]/40 transition-all"
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={32} className="text-[var(--accent)] animate-spin" />
                      <p className="text-sm font-semibold text-[var(--text)]">Analyzing your report...</p>
                      <p className="text-xs text-[var(--muted)]">Finding disputable items</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={28} className="text-[var(--accent)] mb-1" />
                      <p className="text-sm font-semibold text-[var(--text)]">
                        Drag and drop your credit report here
                      </p>
                      <p className="text-xs text-[var(--muted)]">PDF, TXT, or HTML — max 10MB</p>
                      <p className="text-[10px] text-[var(--muted)] mt-1">
                        From Equifax, Experian, TransUnion, Credit Karma, or AnnualCreditReport.com
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.txt,.html"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {uploadError && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 flex items-start gap-2">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    {uploadError}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-[var(--accent-dim)]">
                  <Shield size={16} className="text-[var(--accent)] shrink-0" />
                  <p className="text-[11px] text-[var(--muted)]">
                    Your report is analyzed in real-time and never stored. All processing happens during your session.
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="text-xs text-[var(--muted)] font-medium">or fill in manually below</span>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>
              </div>
            </div>
          )}

          {/* REPORT MODE: Generate for all items from credit report */}
          {showReportMode && reportItems.length > 0 && (
            <div className="mb-8 space-y-6">
              <div className="bg-[var(--accent-dim)] rounded-2xl border border-[var(--accent)]/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap size={20} className="text-[var(--accent)]" />
                  <h2 className="text-lg font-bold text-[var(--text)]">
                    From Your Credit Report — {reportItems.length} Disputable Items
                  </h2>
                </div>
                <p className="text-sm text-[var(--muted)] mb-4">
                  These items were found in your uploaded credit report. Enter your name and address below, pick your round, and we&apos;ll generate dispute letters for ALL items to ALL 3 bureaus at once.
                </p>

                {/* Items list */}
                <div className="space-y-2 mb-6">
                  {reportItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                      <div>
                        <span className="font-semibold text-sm text-[var(--text)]">{item.creditorName}</span>
                        <div className="text-xs text-[var(--muted)]">
                          {item.accountType} | {item.negativeReason}
                          {item.balance > 0 && ` | $${item.balance.toLocaleString()}`}
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-[var(--muted)]" />
                    </div>
                  ))}
                </div>

                {/* Your info for all letters */}
                <div className="grid gap-4 mb-4">
                  <input
                    type="text" value={userName} onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your Full Name"
                    className="px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)] bg-[var(--card)]"
                  />
                  <input
                    type="text" value={userAddress} onChange={(e) => setUserAddress(e.target.value)}
                    placeholder="Your Mailing Address (123 Main St, City, State ZIP)"
                    className="px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)] bg-[var(--card)]"
                  />
                </div>

                {/* Round selector */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {([1, 2, 3] as DisputeRound[]).map((round) => (
                    <button
                      key={round}
                      onClick={() => setSelectedRound(round)}
                      className="py-3 rounded-xl border text-sm font-semibold transition-all"
                      style={{
                        borderColor: selectedRound === round ? "var(--accent)" : "var(--border)",
                        background: selectedRound === round ? "var(--accent)" : "white",
                        color: selectedRound === round ? "white" : "var(--muted)",
                      }}
                    >
                      Round {round}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[var(--muted)] mb-4">{ROUND_INFO[selectedRound].description}</p>

                <button
                  onClick={handleGenerateAll}
                  disabled={!userName || !userAddress}
                  className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[var(--accent-light)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Sparkles size={18} />
                  Generate {reportItems.length * 3} Letters ({reportItems.length} items x 3 bureaus)
                </button>
              </div>

              {/* All generated letters */}
              {allLetters.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[var(--text)]">
                      Your Dispute Letters ({allLetters.length})
                    </h2>
                    <button
                      onClick={handleDownloadAllReportLetters}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-[#0a0a0e] text-sm font-bold hover:bg-[var(--accent-light)] transition-all"
                    >
                      <FileDown size={14} /> Download PDF Bundle ({allLetters.length})
                    </button>
                  </div>

                  {/* Group by creditor */}
                  {reportItems.map((item, idx) => {
                    const itemLetters = allLetters.filter(l => l.creditor === item.creditorName);
                    if (itemLetters.length === 0) return null;
                    return (
                      <div key={idx} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
                        <div className="px-6 py-4 bg-[var(--bg)] border-b border-[var(--border)]">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-[var(--text)]">{item.creditorName}</span>
                              <span className="text-xs text-[var(--muted)] ml-2">{item.negativeReason}</span>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] font-semibold">
                              {itemLetters.length} letters
                            </span>
                          </div>
                        </div>
                        {itemLetters.map((l) => (
                          <div key={l.bureau} className="border-b border-[var(--border)] last:border-0">
                            <div className="flex items-center justify-between px-6 py-3 bg-[var(--accent-dim)]/30">
                              <span className="text-sm font-semibold text-[var(--text)]">{l.bureau}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { navigator.clipboard.writeText(l.text); setCopied(`${l.creditor}-${l.bureau}`); setTimeout(() => setCopied(null), 2000); }}
                                  className="px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--muted)] hover:text-[var(--accent)]"
                                >
                                  {copied === `${l.creditor}-${l.bureau}` ? "Copied" : "Copy"}
                                </button>
                                <button
                                  onClick={() => handleDownloadReportLetter(l)}
                                  className="px-2 py-1 rounded-lg bg-[var(--accent)] text-xs text-[#0a0a0e] font-bold inline-flex items-center gap-1 hover:bg-[var(--accent-light)]"
                                >
                                  <FileDown size={10} /> PDF
                                </button>
                              </div>
                            </div>
                            <pre className="whitespace-pre-wrap text-xs text-[var(--text)] leading-relaxed font-sans p-6 max-h-[300px] overflow-y-auto">
                              {l.text}
                            </pre>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  {/* How to send — instructions + links */}
                  <HowToSendPanel nextRound={Math.min(3, selectedRound + 1)} />
                </div>
              )}

            </div>
          )}

          {/* Educational Round 1-2-3 block (always visible) */}
          <div className="mt-8 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={16} className="text-[var(--accent)]" />
              <span className="text-xs font-bold tracking-[0.22em] text-[var(--accent)]">THE 3-ROUND SYSTEM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] mb-2">
              How Dispute Rounds Work
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Every Phimindflow letter is built around a 3-round escalation system. Each round ups the legal pressure and cites stronger FCRA, FDCPA, and Metro 2 compliance demands.
            </p>

            <div className="space-y-3">
              {([1, 2, 3] as DisputeRound[]).map((round) => {
                const info = ROUND_INFO[round];
                return (
                  <div
                    key={round}
                    className="p-4 sm:p-5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--accent)] text-[#0a0a0e]">
                        {round}
                      </div>
                      <span className="font-bold text-[var(--text)] text-sm sm:text-base">{info.label}</span>
                      {round === 3 && <AlertTriangle size={14} className="text-red-300" />}
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] ml-11 mb-1">{info.description}</p>
                    <p className="text-[11px] text-[var(--accent)] ml-11 font-semibold tracking-wide">{info.timing}</p>
                  </div>
                );
              })}
            </div>

            {/* Round flow visual */}
            <div className="flex items-center justify-center gap-2 mt-5 py-3 px-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
              {([1, 2, 3] as DisputeRound[]).map((r, i) => (
                <div key={r} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--accent)] text-[#0a0a0e]">
                    {r}
                  </div>
                  {i < 2 && <ArrowRight size={14} className="text-[var(--accent)]" />}
                </div>
              ))}
              <span className="ml-3 text-xs text-[var(--muted)]">30–45 day wait between rounds</span>
            </div>

            {/* Metro 2 info */}
            <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-[#00e5a0]/10 border border-[#00e5a0]/30">
              <Shield size={18} className="text-[#00e5a0] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#00e5a0]">Metro 2 Compliance Embedded</p>
                <p className="text-xs text-[#00e5a0]/90 mt-1 leading-relaxed">
                  Every letter demands Metro 2 data format verification — account status codes, payment ratings, dates, and balances. This gives you an additional legal basis for removal beyond standard FCRA disputes.
                </p>
              </div>
            </div>

            {/* Start CTA — show when not in fromReport mode */}
            {!fromReport && (
              <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Ready to generate your letters? Start with your free credit report analysis.
                </p>
                <a
                  href="/credit/analyze"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--accent)] text-[#0a0a0e] font-bold hover:bg-[var(--accent-light)] transition-all"
                >
                  <Upload size={16} /> Upload Your Credit Report
                </a>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}

function HowToSendPanel({ nextRound }: { nextRound: number }) {
  return (
    <div className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--card)] overflow-hidden">
      <div className="px-6 py-5 bg-[var(--accent-dim)] border-b border-[var(--accent)]/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)] text-[#0a0a0e] flex items-center justify-center">
            <FileText size={16} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text)] text-base">How to Send These Letters</h3>
            <p className="text-xs text-[var(--muted)]">Read before mailing — this is how the rules work</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Step n={1} title="Sign each letter">
          Print every letter. Sign each one by hand in blue or black ink above your typed name.
        </Step>

        <Step n={2} title="Enclose these 3 items (required)">
          Without all three, the bureau can legally stall your dispute.
          <ul className="mt-2 space-y-1 list-disc list-inside text-[var(--muted)]">
            <li>Clear copy of your government-issued photo ID (driver&apos;s license, state ID, or passport)</li>
            <li>Copy of your Social Security card — or a document showing your full SSN (W-2, SSA letter, or tax return)</li>
            <li>Proof of current address dated within the last 60 days (utility bill, bank statement, or lease)</li>
          </ul>
        </Step>

        <Step n={3} title="Send via certified mail with return receipt">
          Do <strong>not</strong> use regular mail. You must have tracking and proof of delivery.
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <a
              href="https://www.letterstream.com/certified-mail/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-dim)] hover:border-[var(--accent)] transition-all"
            >
              <div className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-1">Recommended · Online</div>
              <div className="text-sm font-semibold text-[var(--text)]">LetterStream</div>
              <div className="text-xs text-[var(--muted)] mt-1">Print + mail certified without leaving home →</div>
            </a>
            <div className="block p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-1">In person</div>
              <div className="text-sm font-semibold text-[var(--text)]">USPS Post Office</div>
              <div className="text-xs text-[var(--muted)] mt-1">Ask for Certified Mail + Return Receipt (Forms 3800 + 3811)</div>
            </div>
          </div>
        </Step>

        <Step n={4} title="Save everything">
          Keep a copy of each signed letter, the certified mail receipt, and the green return receipt card when it comes back. This is your legal proof the bureau received the dispute.
        </Step>

        <Step n={5} title="Wait 30 days">
          The bureau has 30 days by law to investigate and respond. If they don&apos;t respond, or respond with &ldquo;verified&rdquo; but provide no proof — escalate.
        </Step>

        <Step n={6} title="Escalate if ignored or verified without proof">
          File a free complaint with the Consumer Financial Protection Bureau. This triggers a federal investigation and almost always forces deletion.
          <a
            href="https://www.consumerfinance.gov/complaint/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-[#0a0a0e] text-sm font-bold hover:bg-[var(--accent-light)] transition-all"
          >
            File a CFPB Complaint →
          </a>
        </Step>

        <Step n={7} title={`Still not removed? Come back for Round ${nextRound}`}>
          If items aren&apos;t removed after 30 days, return to this page and generate Round {nextRound} letters. Each round escalates the legal pressure.
        </Step>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] text-[#0a0a0e] flex items-center justify-center text-sm font-bold">
        {n}
      </div>
      <div className="flex-1 pt-1">
        <div className="font-bold text-[var(--text)] text-sm mb-1">{title}</div>
        <div className="text-sm text-[var(--muted)] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
