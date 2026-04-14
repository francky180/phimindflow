const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'creditpath-flow');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });

const BASE = 'http://localhost:3434';
const REPORT_PDF = 'C:/Users/franc/Downloads/3-Bureau Credit Report & Scores _ SmartCredit3.pdf';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  const shot = async (n, label) => {
    await page.screenshot({ path: path.join(OUT, 'shots', `${n}-${label}.png`), fullPage: false });
    console.log(`[shot] ${n}-${label}`);
  };

  console.log('Step 1: Homepage');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await shot('01', 'homepage-hero');

  await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('02', 'homepage-how-it-works');

  await page.evaluate(() => window.scrollTo({ top: 1600, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('03', 'homepage-services');

  console.log('Step 2: Navigate to /analyze');
  await page.goto(`${BASE}/analyze`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await shot('04', 'analyze-upload-empty');

  console.log('Step 3: Upload real credit report');
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles(REPORT_PDF);
  console.log('File selected, waiting for parse...');
  // Wait for parsing to finish and results to appear
  await page.waitForTimeout(1500);
  await shot('05', 'analyze-parsing');
  try {
    await page.waitForSelector('text=Your Credit Report Analysis', { timeout: 30000 });
  } catch (e) {
    console.log('Parse wait fallback, taking shot anyway');
  }
  await page.waitForTimeout(2000);
  await shot('06', 'analyze-results');

  console.log('Step 4: Scroll through parsed results');
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('07', 'analyze-collections');

  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('08', 'analyze-negative-accounts');

  console.log('Step 5: Scroll to personalize form');
  await page.evaluate(() => {
    const el = document.body;
    window.scrollTo({ top: el.scrollHeight - 800, behavior: 'smooth' });
  });
  await page.waitForTimeout(2500);
  await shot('09', 'personalize-form-empty');

  console.log('Step 6: Fill custom plan form');
  try {
    await page.fill('input[placeholder="First name"]', 'Francky');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder="you@email.com"]', 'francky@example.com');
    await page.waitForTimeout(500);
    // Goal dropdown
    await page.selectOption('select >> nth=0', 'business');
    await page.waitForTimeout(400);
    // Timeline
    await page.selectOption('select >> nth=1', '6');
    await page.waitForTimeout(400);
    // Budget
    await page.selectOption('select >> nth=2', '150');
    await page.waitForTimeout(800);
    await shot('10', 'personalize-form-filled');
  } catch (e) {
    console.log('Form fill error:', e.message);
  }

  console.log('Step 7: Submit custom plan');
  await page.click('button:has-text("Build My Custom Plan")');
  await page.waitForTimeout(2500);
  await shot('11', 'custom-plan-generated');

  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('12', 'custom-plan-action-steps');

  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('13', 'custom-plan-pricing');

  console.log('Step 8: Navigate to /service');
  await page.goto(`${BASE}/service`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await shot('14', 'service-pricing');

  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('15', 'service-dfy-card');

  console.log('Step 9: Simulate post-payment welcome');
  await page.goto(`${BASE}/welcome?tier=dfy`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await shot('16', 'welcome-dfy');

  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('17', 'welcome-next-steps');

  console.log('Step 10: Check welcome DIY variant');
  await page.goto(`${BASE}/welcome?tier=diy`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await shot('18', 'welcome-diy');

  console.log('Done! Keeping browser open 60s for video finalization.');
  await page.waitForTimeout(60000);
  await context.close();
  await browser.close();
  console.log('Browser closed. Video finalized.');
})().catch((e) => {
  console.error('FAIL:', e);
  process.exit(1);
});
