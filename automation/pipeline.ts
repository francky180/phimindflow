/**
 * PhiMindFlow — Automated Pipeline
 *
 * Flow: Fetch Site → Capture Screenshots → Generate Video → Export
 *
 * Usage:
 *   npx tsx pipeline.ts
 *   npx tsx pipeline.ts --skip-video   (screenshots only)
 *   npx tsx pipeline.ts --skip-tests   (video only from existing screenshots)
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

const ROOT = __dirname;
const SCREENSHOTS_DIR = join(ROOT, "screenshots");
const VIDEO_DIR = join(ROOT, "..", "video");
const VIDEO_PUBLIC = join(VIDEO_DIR, "public", "screenshots");
const REPORTS_DIR = join(ROOT, "reports");

const args = process.argv.slice(2);
const skipVideo = args.includes("--skip-video");
const skipTests = args.includes("--skip-tests");

function log(msg: string) {
  console.log(`\n[${"=".repeat(60)}]`);
  console.log(`  ${msg}`);
  console.log(`[${"=".repeat(60)}]\n`);
}

function run(cmd: string, cwd?: string) {
  console.log(`> ${cmd}`);
  execSync(cmd, {
    cwd: cwd || ROOT,
    stdio: "inherit",
    timeout: 300_000,
  });
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

// ─── STEP 1: Run Playwright Tests + Capture Screenshots ───

if (!skipTests) {
  log("STEP 1 — Running Playwright tests + capturing screenshots");
  ensureDir(SCREENSHOTS_DIR);
  ensureDir(REPORTS_DIR);
  run("npx playwright test --project=Desktop");
  const screenshots = readdirSync(SCREENSHOTS_DIR).filter((f) =>
    f.endsWith(".png")
  );
  console.log(`\n  Captured ${screenshots.length} screenshots.`);
}

// ─── STEP 2: Copy Screenshots to Remotion ─────────────────

if (!skipVideo) {
  log("STEP 2 — Copying screenshots to Remotion public/");
  ensureDir(VIDEO_PUBLIC);

  const screenshots = readdirSync(SCREENSHOTS_DIR).filter((f) =>
    f.endsWith(".png")
  );

  for (const file of screenshots) {
    const src = join(SCREENSHOTS_DIR, file);
    const dest = join(VIDEO_PUBLIC, file);
    execSync(
      process.platform === "win32"
        ? `copy "${src}" "${dest}"`
        : `cp "${src}" "${dest}"`
    );
  }
  console.log(`  Copied ${screenshots.length} screenshots to video/public/`);

  // ─── STEP 3: Render Video ─────────────────────────────────

  log("STEP 3 — Rendering FunnelShowcase video");
  run("npx remotion render FunnelShowcase out/funnel-showcase.mp4", VIDEO_DIR);

  const outputPath = join(VIDEO_DIR, "out", "funnel-showcase.mp4");
  if (existsSync(outputPath)) {
    console.log(`\n  Video rendered: ${outputPath}`);
  } else {
    console.error("  ERROR: Video not found at expected path.");
    process.exit(1);
  }
}

// ─── DONE ───────────────────────────────────────────────────

log("PIPELINE COMPLETE");
console.log("  Screenshots: automation/screenshots/");
console.log("  Test Report: automation/reports/TEST_REPORT.md");
console.log("  Video:       video/out/funnel-showcase.mp4");
console.log("  Content:     automation/content/");
console.log("");
