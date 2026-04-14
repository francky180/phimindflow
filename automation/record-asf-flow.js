const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'asf-flow-recording');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });

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
  await page.goto('https://ai-system-factory.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await shot('01', 'hero');

  console.log('Step 2: Scroll through value layers');
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'smooth' }));
  await page.waitForTimeout(2500);
  await shot('02', 'value-layers');

  await page.evaluate(() => window.scrollTo({ top: 1800, behavior: 'smooth' }));
  await page.waitForTimeout(2500);
  await shot('03', 'one-brain');

  console.log('Step 3: Everything included');
  await page.evaluate(() => window.scrollTo({ top: 2700, behavior: 'smooth' }));
  await page.waitForTimeout(2500);
  await shot('04', 'everything-included');

  console.log('Step 4: Memory advantage');
  await page.evaluate(() => window.scrollTo({ top: 3600, behavior: 'smooth' }));
  await page.waitForTimeout(2500);
  await shot('05', 'memory');

  console.log('Step 5: Pricing cards');
  await page.evaluate(() => window.scrollTo({ top: 4500, behavior: 'smooth' }));
  await page.waitForTimeout(3000);
  await shot('06', 'pricing');

  console.log('Step 6: Simulate Stripe redirect → /api/welcome');
  await page.goto('https://ai-system-factory.vercel.app/api/welcome', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await shot('07', 'welcome-unlocked');

  console.log('Step 7: Scroll welcome page');
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(2500);
  await shot('08', 'welcome-download');

  await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'smooth' }));
  await page.waitForTimeout(2500);
  await shot('09', 'access-code');

  console.log('Done recording. Keeping browser open — close the window manually when done.');
  console.log('Video being saved to:', OUT);

  // DO NOT close — Franc wants the window kept open.
  // The video file is only finalized when context/browser closes, so we exit the
  // script but leave the browser process alive via a detached approach:
  // instead, we'll wait a long time to allow video finalization + window persistence.
  await page.waitForTimeout(60 * 60 * 1000); // 1 hour idle
})().catch((e) => {
  console.error('FAIL:', e);
  process.exit(1);
});
