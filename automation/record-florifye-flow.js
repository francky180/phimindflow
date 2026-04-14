const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'florifye-flow');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });

const BASE = 'http://localhost:3535';
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

  console.log('Step 1: Homepage hero');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await shot('01', 'hero');

  console.log('Step 2: What We Remove');
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'smooth' }));
  await page.waitForTimeout(2200);
  await shot('02', 'what-we-remove');

  console.log('Step 3: How It Works');
  await page.evaluate(() => window.scrollTo({ top: 1800, behavior: 'smooth' }));
  await page.waitForTimeout(2200);
  await shot('03', 'how-it-works');

  console.log('Step 4: Services');
  await page.evaluate(() => window.scrollTo({ top: 2700, behavior: 'smooth' }));
  await page.waitForTimeout(2200);
  await shot('04', 'services');

  console.log('Step 5: Testimonials');
  await page.evaluate(() => window.scrollTo({ top: 3600, behavior: 'smooth' }));
  await page.waitForTimeout(2200);
  await shot('05', 'testimonials');

  console.log('Step 6: Founder');
  await page.evaluate(() => window.scrollTo({ top: 4500, behavior: 'smooth' }));
  await page.waitForTimeout(2200);
  await shot('06', 'founder');

  console.log('Step 7: FAQ');
  await page.evaluate(() => window.scrollTo({ top: 5400, behavior: 'smooth' }));
  await page.waitForTimeout(2200);
  await shot('07', 'faq');

  console.log('Step 8: Contact form');
  await page.evaluate(() => window.scrollTo({ top: 6200, behavior: 'smooth' }));
  await page.waitForTimeout(2200);
  await shot('08', 'contact');

  console.log('Step 9: Disclaimer + footer');
  await page.evaluate(() => window.scrollTo({ top: 7200, behavior: 'smooth' }));
  await page.waitForTimeout(2200);
  await shot('09', 'footer');

  console.log('Step 10: Pricing page');
  await page.goto(`${BASE}/service`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await shot('10', 'pricing-3-tiers');

  await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('11', 'pricing-trust');

  console.log('Step 11: Analyze page');
  await page.goto(`${BASE}/analyze`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await shot('12', 'analyze-empty');

  console.log('Step 12: Upload real credit report');
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles(REPORT_PDF);
  await page.waitForTimeout(1500);
  await shot('13', 'analyze-parsing');
  try {
    await page.waitForSelector('text=Your Credit Report Analysis', { timeout: 30000 });
  } catch (e) {
    console.log('Fallback: taking shot anyway');
  }
  await page.waitForTimeout(2000);
  await shot('14', 'analyze-results');

  console.log('Step 13: Fill personalize form');
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight - 800, behavior: 'smooth' });
  });
  await page.waitForTimeout(2500);
  await shot('15', 'personalize-empty');

  try {
    await page.fill('input[placeholder="First name"]', 'Franc');
    await page.waitForTimeout(400);
    await page.fill('input[placeholder="you@email.com"]', 'franc@example.com');
    await page.waitForTimeout(400);
    await page.selectOption('select >> nth=0', 'home');
    await page.waitForTimeout(400);
    await page.selectOption('select >> nth=1', '6');
    await page.waitForTimeout(400);
    await page.selectOption('select >> nth=2', '150');
    await page.waitForTimeout(600);
    await shot('16', 'personalize-filled');
  } catch (e) {
    console.log('Form fill error:', e.message);
  }

  console.log('Step 14: Build plan');
  await page.click('button:has-text("Build My Custom Plan")');
  await page.waitForTimeout(2500);
  await shot('17', 'custom-plan');

  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('18', 'custom-plan-steps');

  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await shot('19', 'custom-plan-ctas');

  console.log('Step 15: Welcome pages');
  await page.goto(`${BASE}/welcome?tier=ebook`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await shot('20', 'welcome-ebook');

  await page.goto(`${BASE}/welcome?tier=smart`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await shot('21', 'welcome-smart');

  await page.goto(`${BASE}/welcome?tier=full`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await shot('22', 'welcome-full');

  console.log('Done! Closing in 30s.');
  await page.waitForTimeout(30000);
  await context.close();
  await browser.close();
  console.log('Video finalized.');
})().catch((e) => {
  console.error('FAIL:', e);
  process.exit(1);
});
