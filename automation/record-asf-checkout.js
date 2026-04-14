const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'asf-checkout-flow');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });

const BASE = 'http://localhost:3737';

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

  console.log('Step 2: Scroll to pricing');
  await page.evaluate(() => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else window.scrollTo({ top: 4500, behavior: 'smooth' });
  });
  await page.waitForTimeout(2500);
  await shot('02', 'pricing-cards');

  console.log('Step 3: Navigate to checkout');
  await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await shot('03', 'checkout-hero');

  console.log('Step 4: Scroll to see both plans');
  await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('04', 'checkout-plans');

  console.log('Step 5: Select monthly plan');
  try {
    const monthlyBtn = await page.locator('button:has-text("Operating Partner")');
    await monthlyBtn.click();
    await page.waitForTimeout(1500);
    await shot('05', 'checkout-monthly-selected');
  } catch (e) {
    console.log('Monthly click fallback');
    await shot('05', 'checkout-monthly-selected');
  }

  console.log('Step 6: Fill form');
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'smooth' }));
  await page.waitForTimeout(1500);
  try {
    await page.fill('input[placeholder="Your full name"]', 'Franc Delissaint');
    await page.waitForTimeout(400);
    await page.fill('input[placeholder="you@email.com"]', 'franc@aisystemfactory.com');
    await page.waitForTimeout(400);
    await page.fill('input[placeholder="(555) 123-4567"]', '+13212788908');
    await page.waitForTimeout(800);
  } catch (e) {
    console.log('Form fill error:', e.message);
  }
  await shot('06', 'checkout-form-filled');

  console.log('Step 7: Show the CTA button');
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('07', 'checkout-cta-button');

  console.log('Step 8: Welcome page (simulated post-payment)');
  await page.goto(`${BASE}/welcome`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await shot('08', 'welcome-delivered');

  console.log('Done. Closing in 15s.');
  await page.waitForTimeout(15000);
  await context.close();
  await browser.close();
  console.log('Video finalized.');
})().catch((e) => {
  console.error('FAIL:', e);
  process.exit(1);
});
