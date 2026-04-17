"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/app/Navbar";
import type { ParsedReport } from "@/lib/credit/pdf-report-parser";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, FileText, Upload, Shield, Loader2, Send, User, Target, Calendar, DollarSign, Sparkles, ArrowRight } from "lucide-react";

type Goal = "home" | "car" | "business" | "build" | "lower";
type Timeline = "3" | "6" | "12";
type Budget = "0" | "50" | "150" | "300";

type CustomPlan = {
  name: string;
  email: string;
  goal: Goal;
  timeline: Timeline;
  budget: Budget;
};

const GOAL_LABEL: Record<Goal, string> = {
  home: "Buy a home",
  car: "Buy a car",
  business: "Start or fund a business",
  build: "Build credit from scratch",
  lower: "Lower interest rates",
};

export default function AnalyzePage() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [parsedReport, setParsedReport] = useState<ParsedReport | null>(null);
  const [planForm, setPlanForm] = useState<CustomPlan>({ name: "", email: "", goal: "home", timeline: "6", budget: "50" });
  const [customPlan, setCustomPlan] = useState<CustomPlan | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [pasteText, setPasteText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomPlan(planForm);
    if (typeof window !== "undefined") {
      localStorage.setItem("creditpath-custom-plan", JSON.stringify(planForm));
    }
  };

  const handleDisputeItem = (account: { creditorName: string; accountNumber: string; accountType: string; negativeReason: string; disputeReason: string; balance: number; isDisputable: boolean }) => {
    localStorage.setItem("creditpath-dispute-item", JSON.stringify(account));
    router.push("/credit/disputes?from=report");
  };

  const handleDisputeAll = () => {
    if (!parsedReport) return;
    const allNegative = [...parsedReport.collections, ...parsedReport.negativeAccounts].filter((a) => a.isDisputable);
    localStorage.setItem("creditpath-dispute-items", JSON.stringify(allNegative));
    localStorage.setItem("creditpath-report-scores", JSON.stringify(parsedReport.scores));
    router.push("/credit/disputes?from=report&mode=all");
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/analyze-report", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setParsedReport(data.report);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handlePasteSubmit = async (text: string) => {
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("text", text);
      const res = await fetch("/api/analyze-report", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setParsedReport(data.report);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Analysis failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-2xl mx-auto">

          {/* Upload State */}
          {!parsedReport && (
            <>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-semibold tracking-widest uppercase mb-4">
                  <Shield size={14} /> Free Analysis
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-[var(--text)] mb-3">
                  Upload Your Credit Report
                </h1>
                <p className="text-sm sm:text-base text-[var(--muted)] max-w-md mx-auto">
                  Our AI scans your report, finds every error, and shows you exactly what to dispute.
                </p>
              </div>

              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
                {/* Mode switcher */}
                <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--bg)] border border-[var(--border)] w-fit mx-auto">
                  <button
                    onClick={() => setInputMode("upload")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: inputMode === "upload" ? "var(--accent)" : "transparent",
                      color: inputMode === "upload" ? "#0a0a0e" : "var(--muted)",
                    }}
                  >
                    <Upload size={13} /> Upload File
                  </button>
                  <button
                    onClick={() => setInputMode("paste")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: inputMode === "paste" ? "var(--accent)" : "transparent",
                      color: inputMode === "paste" ? "#0a0a0e" : "var(--muted)",
                    }}
                  >
                    <FileText size={13} /> Paste Text
                  </button>
                </div>

                {inputMode === "upload" ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-[var(--border)] rounded-2xl p-10 sm:p-14 text-center cursor-pointer hover:border-[var(--accent)]/40 transition-all"
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 size={40} className="text-[var(--accent)] animate-spin" />
                        <p className="text-sm font-semibold text-[var(--text)]">Reading your report...</p>
                        <p className="text-xs text-[var(--muted)]">Parsing every tradeline — a few seconds</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-dim)] flex items-center justify-center mb-2">
                          <Upload size={28} className="text-[var(--accent)]" />
                        </div>
                        <p className="text-base font-semibold text-[var(--text)]">
                          Drop your credit report here
                        </p>
                        <p className="text-sm text-[var(--muted)]">or click to browse</p>
                        <p className="text-xs text-[var(--muted)] mt-1">
                          PDF · HTML · TXT · DOCX · RTF · JSON · CSV — max 25MB
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.txt,.html,.htm,.docx,.rtf,.json,.csv,.eml,application/pdf,text/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/rtf,application/json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                      placeholder="Paste your credit report text here — scores, accounts, collections, inquiries, whatever you can copy. We'll parse it."
                      rows={10}
                      disabled={uploading}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] text-sm resize-y focus:outline-none focus:border-[var(--accent)] font-mono disabled:opacity-60"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-[var(--muted)]">
                        {pasteText.length} characters · works for screenshots, emails, any format
                      </p>
                      <button
                        onClick={() => handlePasteSubmit(pasteText)}
                        disabled={uploading || pasteText.trim().length < 50}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[#0a0a0e] text-sm font-bold hover:bg-[var(--accent-light)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        {uploading ? "Analyzing..." : "Analyze Text"}
                      </button>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 flex items-start gap-2">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <div>
                      {uploadError}
                      {inputMode === "upload" && (
                        <button
                          onClick={() => { setInputMode("paste"); setUploadError(""); }}
                          className="mt-2 text-[var(--accent)] font-semibold hover:underline block"
                        >
                          → Try pasting the text instead
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-6 p-4 rounded-xl bg-[var(--accent-dim)]">
                  <Shield size={18} className="text-[var(--accent)] shrink-0" />
                  <p className="text-xs text-[var(--muted)]">
                    Your report is analyzed in real-time and never stored on our servers. All processing happens securely during your session.
                  </p>
                </div>
              </div>

              {/* Where to get report */}
              <div className="mt-6 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
                <h3 className="text-sm font-bold text-[var(--text)] mb-3">Where to get your free credit report</h3>
                <div className="space-y-2">
                  {[
                    "AnnualCreditReport.com — free from all 3 bureaus once per year",
                    "Credit Karma — free Equifax and TransUnion reports anytime",
                    "Experian.com — free Experian report anytime",
                    "Your bank or credit card app may also provide free reports",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-[var(--accent)] shrink-0 mt-0.5" />
                      <p className="text-xs text-[var(--muted)]">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reassurance */}
              <div className="mt-6 text-center">
                <p className="text-sm text-[var(--muted)]">
                  Free. No signup required. Results in ~10 seconds.
                </p>
              </div>
            </>
          )}

          {/* Upload Results */}
          {parsedReport && (
            <div className="space-y-6">
              {/* Overview */}
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--text)]">Your Credit Report Analysis</h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--accent-dim)] text-[var(--accent)]">
                    {parsedReport.bureau}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  {parsedReport.scores && parsedReport.scores.length > 0 ? (
                    parsedReport.scores.map((s: { bureau: string; score: number }) => (
                      <div key={s.bureau} className="p-4 rounded-xl bg-[var(--bg)]">
                        <div className="text-2xl sm:text-3xl font-bold text-[var(--text)]">{s.score}</div>
                        <div className="text-xs text-[var(--muted)]">{s.bureau}</div>
                      </div>
                    ))
                  ) : parsedReport.estimatedScore ? (
                    <div className="p-4 rounded-xl bg-[var(--bg)]">
                      <div className="text-2xl sm:text-3xl font-bold text-[var(--text)]">{parsedReport.estimatedScore}</div>
                      <div className="text-xs text-[var(--muted)]">Credit Score</div>
                    </div>
                  ) : null}
                  <div className="p-4 rounded-xl bg-[var(--bg)]">
                    <div className="text-2xl sm:text-3xl font-bold text-[var(--text)]">{parsedReport.totalAccounts}</div>
                    <div className="text-xs text-[var(--muted)]">Total Accounts</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--bg)]">
                    <div className="text-2xl sm:text-3xl font-bold text-red-500">
                      {parsedReport.negativeAccounts.length + parsedReport.collections.length}
                    </div>
                    <div className="text-xs text-[var(--muted)]">Negative Items</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--bg)]">
                    <div className="text-2xl sm:text-3xl font-bold text-[var(--accent)]">
                      {[...parsedReport.negativeAccounts, ...parsedReport.collections].filter((a) => a.isDisputable).length}
                    </div>
                    <div className="text-xs text-[var(--muted)]">Disputable</div>
                  </div>
                </div>

                {parsedReport.inquiries.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-2">
                    <AlertTriangle size={14} className="text-amber-500" />
                    {parsedReport.inquiries.length} hard inquiries found
                  </div>
                )}
                {parsedReport.publicRecords.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <XCircle size={14} />
                    {parsedReport.publicRecords.length} public record(s): {parsedReport.publicRecords.map((r) => r.type).join(", ")}
                  </div>
                )}
              </div>

              {/* Collections */}
              {parsedReport.collections.length > 0 && (
                <div className="bg-[var(--card)] rounded-2xl border border-red-500/30 p-6 sm:p-8">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text)] mb-1 flex items-center gap-2">
                    <XCircle size={18} className="text-red-500" />
                    Collection Accounts ({parsedReport.collections.length})
                  </h3>
                  <p className="text-sm text-[var(--muted)] mb-4">These are the most damaging items and often the most successfully disputed.</p>
                  <div className="space-y-3">
                    {parsedReport.collections.map((account, i) => (
                      <div key={i} className="p-4 rounded-xl bg-red-500/10 border border-red-500/25">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-[var(--text)]">{account.creditorName}</span>
                          {account.balance > 0 && <span className="text-sm font-semibold text-red-300">${account.balance.toLocaleString()}</span>}
                        </div>
                        <div className="text-xs text-[var(--muted)] mb-2">
                          Acct: ****{account.accountNumber} | Status: {account.status}
                        </div>
                        {account.isDisputable && (
                          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]">
                              <CheckCircle size={12} /> Disputable: {account.disputeReason}
                            </div>
                            <button
                              onClick={() => handleDisputeItem(account)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-light)] transition-all"
                            >
                              <Send size={10} /> Dispute This
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Negative Accounts */}
              {parsedReport.negativeAccounts.length > 0 && (
                <div className="bg-[var(--card)] rounded-2xl border border-amber-500/30 p-6 sm:p-8">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text)] mb-1 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-500" />
                    Negative Accounts ({parsedReport.negativeAccounts.length})
                  </h3>
                  <p className="text-sm text-[var(--muted)] mb-4">Late payments, charge-offs, and other derogatory marks.</p>
                  <div className="space-y-3">
                    {parsedReport.negativeAccounts.map((account, i) => (
                      <div key={i} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                          <span className="font-bold text-sm text-[var(--text)]">{account.creditorName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-semibold">{account.negativeReason}</span>
                        </div>
                        <div className="text-xs text-[var(--muted)] mb-2">
                          {account.accountType} | Acct: ****{account.accountNumber}
                          {account.balance > 0 && ` | Balance: $${account.balance.toLocaleString()}`}
                        </div>
                        {account.isDisputable && (
                          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]">
                              <CheckCircle size={12} /> Disputable: {account.disputeReason}
                            </div>
                            <button
                              onClick={() => handleDisputeItem(account)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-light)] transition-all"
                            >
                              <Send size={10} /> Dispute This
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dispute All Button */}
              {(parsedReport.negativeAccounts.length + parsedReport.collections.length) > 0 && (
                <button
                  onClick={handleDisputeAll}
                  className="w-full py-4 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 hover:bg-[var(--accent-light)] hover:shadow-lg transition-all"
                >
                  <Send size={18} />
                  Generate Dispute Letters for All {[...parsedReport.negativeAccounts, ...parsedReport.collections].filter((a) => a.isDisputable).length} Items
                </button>
              )}

              {/* Positive Accounts */}
              {parsedReport.positiveAccounts.length > 0 && (
                <div className="bg-[var(--card)] rounded-2xl border border-[#00e5a0]/30 p-6 sm:p-8">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                    <CheckCircle size={18} className="text-[var(--success)]" />
                    Positive Accounts ({parsedReport.positiveAccounts.length})
                  </h3>
                  <div className="space-y-2">
                    {parsedReport.positiveAccounts.slice(0, 5).map((account, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] border-l-2 border-[var(--success)]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CheckCircle size={14} className="text-[var(--success)] shrink-0" />
                          <span className="text-sm font-semibold text-[var(--text)] truncate">{account.creditorName}</span>
                        </div>
                        <span className="text-xs text-[var(--text-secondary)] font-medium shrink-0 ml-3">{account.accountType}</span>
                      </div>
                    ))}
                    {parsedReport.positiveAccounts.length > 5 && (
                      <p className="text-xs text-[var(--muted)] text-center pt-3">
                        + {parsedReport.positiveAccounts.length - 5} more positive accounts
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Plan Form — shown before plan is generated */}
              {!customPlan && (
                <div className="bg-[var(--card)] rounded-2xl border border-[var(--accent)]/30 p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={18} className="text-[var(--accent)]" />
                      <span className="text-xs font-bold tracking-[0.18em] text-[var(--accent)]">PERSONALIZE YOUR PLAN</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--text)] mb-2">
                      Get your custom action plan
                    </h3>
                    <p className="text-sm text-[var(--muted)] mb-6">
                      Tell us your goal. We&apos;ll build a personalized roadmap tailored to your report, your timeline, and your budget.
                    </p>

                    <form onSubmit={handlePlanSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="block">
                          <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1.5">
                            <User size={12} /> Your name
                          </span>
                          <input
                            type="text"
                            required
                            value={planForm.name}
                            onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                            placeholder="First name"
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] text-sm"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1.5">
                            <Send size={12} /> Email
                          </span>
                          <input
                            type="email"
                            required
                            value={planForm.email}
                            onChange={(e) => setPlanForm({ ...planForm, email: e.target.value })}
                            placeholder="you@email.com"
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] text-sm"
                          />
                        </label>
                      </div>

                      <label className="block">
                        <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1.5">
                          <Target size={12} /> Your main goal
                        </span>
                        <select
                          value={planForm.goal}
                          onChange={(e) => setPlanForm({ ...planForm, goal: e.target.value as Goal })}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] text-sm"
                        >
                          {(Object.keys(GOAL_LABEL) as Goal[]).map((g) => (
                            <option key={g} value={g}>{GOAL_LABEL[g]}</option>
                          ))}
                        </select>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="block">
                          <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1.5">
                            <Calendar size={12} /> Timeline
                          </span>
                          <select
                            value={planForm.timeline}
                            onChange={(e) => setPlanForm({ ...planForm, timeline: e.target.value as Timeline })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] text-sm"
                          >
                            <option value="3">Next 3 months</option>
                            <option value="6">Next 6 months</option>
                            <option value="12">Next 12 months</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1.5">
                            <DollarSign size={12} /> Monthly budget
                          </span>
                          <select
                            value={planForm.budget}
                            onChange={(e) => setPlanForm({ ...planForm, budget: e.target.value as Budget })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)] text-sm"
                          >
                            <option value="0">$0 — DIY only</option>
                            <option value="50">$50–$100/mo</option>
                            <option value="150">$100–$250/mo</option>
                            <option value="300">$250+/mo</option>
                          </select>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-[var(--accent)] text-[#0a0a0e] font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[var(--accent-light)] transition-all"
                      >
                        <Sparkles size={16} /> Build My Custom Plan
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Custom Plan Report */}
              {customPlan && (() => {
                const disputableCount = [...parsedReport.negativeAccounts, ...parsedReport.collections].filter((a) => a.isDisputable).length;
                const goalLabel = GOAL_LABEL[customPlan.goal];
                const months = parseInt(customPlan.timeline);
                const scoreTarget = months >= 12 ? 720 : months >= 6 ? 680 : 640;
                const isBusinessGoal = customPlan.goal === "business";
                const isHomeGoal = customPlan.goal === "home";

                return (
                  <>
                    <div className="bg-gradient-to-br from-[var(--card)] to-[var(--accent-dim)] rounded-2xl border border-[var(--accent)]/30 p-6 sm:p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles size={16} className="text-[var(--accent)]" />
                          <span className="text-xs font-bold tracking-[0.22em] text-[var(--accent)]">YOUR CUSTOM PLAN</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-2">
                          Hey {customPlan.name}, here&apos;s your path to <span className="text-[var(--accent)]">{scoreTarget}+</span>
                        </h2>
                        <p className="text-sm sm:text-base text-[var(--muted)] mb-6">
                          Custom-built for your goal: <span className="text-[var(--text)] font-semibold">{goalLabel}</span> in <span className="text-[var(--text)] font-semibold">{months} months</span>.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                          <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                            <div className="text-xs text-[var(--muted)] mb-1">Disputable items</div>
                            <div className="text-2xl font-bold text-[var(--accent)]">{disputableCount}</div>
                          </div>
                          <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                            <div className="text-xs text-[var(--muted)] mb-1">Target score</div>
                            <div className="text-2xl font-bold text-[var(--accent)]">{scoreTarget}+</div>
                          </div>
                          <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                            <div className="text-xs text-[var(--muted)] mb-1">Timeline</div>
                            <div className="text-2xl font-bold text-[var(--accent)]">{months}mo</div>
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-[var(--text)] mb-3 tracking-wide">YOUR ACTION STEPS</h3>
                        <div className="space-y-2 mb-6">
                          {[
                            `Dispute all ${disputableCount} inaccurate items on your report (biggest score impact)`,
                            months >= 6 ? "Build payment history with a secured card or builder loan" : "Lower utilization on existing cards below 10%",
                            isBusinessGoal ? "Separate personal from business credit — open a business tradeline" : "Keep old accounts open to preserve credit age",
                            isHomeGoal ? "Avoid new credit inquiries 6 months before mortgage application" : "Monitor progress with monthly score tracking",
                            `Re-pull your report every 30 days to verify bureau updates`,
                          ].map((step, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                              <div className="w-6 h-6 rounded-full bg-[var(--accent)] text-[#0a0a0e] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                              </div>
                              <p className="text-sm text-[var(--text-secondary)]">{step}</p>
                            </div>
                          ))}
                        </div>

                      </div>
                    </div>

                    {/* Pricing CTAs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <a
                        href="https://buy.stripe.com/00weVd4C4d616g01Zlao80e"
                        className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/50 transition-all"
                      >
                        <div className="text-xs font-bold tracking-[0.18em] text-[var(--muted)] mb-2">SMART SYSTEM · $97 ONCE</div>
                        <h4 className="font-bold text-[var(--text)] text-lg mb-2">Smart Dispute System</h4>
                        <p className="text-xs text-[var(--muted)] mb-4">Custom dispute letters built for your report. Full mailing instructions. Self-directed with our structure.</p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">Unlock System <ArrowRight size={14} /></span>
                      </a>

                      <a
                        href="https://buy.stripe.com/eVq14n4C40jffQAbzVao80g"
                        className="p-6 rounded-2xl border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--accent)]/10 to-transparent hover:shadow-lg transition-all relative"
                      >
                        <span className="absolute -top-2 right-4 px-3 py-0.5 text-[10px] font-bold tracking-widest bg-[var(--accent)] text-[#0a0a0e] rounded-full">MOST POPULAR</span>
                        <div className="text-xs font-bold tracking-[0.18em] text-[var(--accent)] mb-2">FULL SERVICE · $499 ONCE</div>
                        <h4 className="font-bold text-[var(--text)] text-lg mb-2">Full Credit Repair</h4>
                        <p className="text-xs text-[var(--muted)] mb-4">We handle everything start to finish. Multiple dispute rounds. Ongoing monitoring. Hands-off professional experience.</p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">Start Full Repair <ArrowRight size={14} /></span>
                      </a>
                    </div>

                    <button
                      onClick={() => { setParsedReport(null); setCustomPlan(null); }}
                      className="w-full py-3 rounded-xl border border-[var(--border)] text-[var(--muted)] font-semibold text-sm hover:border-[var(--accent)]/30 transition-all"
                    >
                      Analyze Another Report
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
