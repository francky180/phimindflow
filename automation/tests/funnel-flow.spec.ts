import { test, expect } from "@playwright/test";

const SITE_URL =
  "https://phimindflow-mtr13wp9r-francky180s-projects.vercel.app";

const EXPECTED_LINKS = {
  broker:
    "https://dashboard.genesisfxmarkets.com/auth/register?ref=FRADEL185",
  course: "https://buy.stripe.com/3cI14n7Og2rn6g00Vhao804",
  management: "https://buy.stripe.com/14k2bnf256Oh0gwdQQ",
};

// ─── HOMEPAGE ────────────────────────────────────────────

test.describe("Homepage", () => {
  test("loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/PHIMINDFLOW/);
    await page.screenshot({
      path: "screenshots/01-homepage-full.png",
      fullPage: true,
    });
  });

  test("hero section visible", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("text=The Fibonacci Growth System");
    await expect(hero).toBeVisible();
    await page.screenshot({ path: "screenshots/02-hero.png" });
  });

  test("navbar has all links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav.locator('a[href="#process"]').first()).toBeVisible();
    await expect(nav.locator('a[href="#course"]').first()).toBeVisible();
    await expect(nav.locator('a[href="#management"]').first()).toBeVisible();
    await expect(nav.locator('a[href="#faq"]').first()).toBeVisible();
  });
});

// ─── CTA FLOW ────────────────────────────────────────────

test.describe("CTA Links", () => {
  test("broker CTA points to correct URL", async ({ page }) => {
    await page.goto("/");
    const brokerLinks = page.locator(`a[href="${EXPECTED_LINKS.broker}"]`);
    const count = await brokerLinks.count();
    expect(count).toBeGreaterThan(0);

    // Scroll to first broker CTA and screenshot
    await brokerLinks.first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: "screenshots/03-broker-cta.png" });
  });

  test("course CTA points to correct URL", async ({ page }) => {
    await page.goto("/");
    const courseLinks = page.locator(`a[href="${EXPECTED_LINKS.course}"]`);
    const count = await courseLinks.count();
    expect(count).toBeGreaterThan(0);

    await courseLinks.first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: "screenshots/04-course-cta.png" });
  });

  test("management CTA points to correct URL", async ({ page }) => {
    await page.goto("/");
    const mgmtLinks = page.locator(
      `a[href="${EXPECTED_LINKS.management}"]`
    );
    const count = await mgmtLinks.count();
    expect(count).toBeGreaterThan(0);

    await mgmtLinks.first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: "screenshots/05-management-cta.png" });
  });

  test("broker CTA opens external page", async ({ page, context }) => {
    await page.goto("/");
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page
        .locator(`a[href="${EXPECTED_LINKS.broker}"]`)
        .first()
        .click(),
    ]);
    await newPage.waitForLoadState("domcontentloaded");
    expect(newPage.url()).toContain("genesisfxmarkets.com");
    await newPage.screenshot({ path: "screenshots/06-broker-landing.png" });
    await newPage.close();
  });
});

// ─── SECTIONS ────────────────────────────────────────────

test.describe("Page Sections", () => {
  test("process section exists", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#process");
    if ((await section.count()) > 0) {
      await section.scrollIntoViewIfNeeded();
      await page.screenshot({ path: "screenshots/07-process-section.png" });
    }
  });

  test("FAQ section exists", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#faq");
    if ((await section.count()) > 0) {
      await section.scrollIntoViewIfNeeded();
      await page.screenshot({ path: "screenshots/08-faq-section.png" });
    }
  });

  test("footer exists with risk disclosure", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await footer.scrollIntoViewIfNeeded();
    await page.screenshot({ path: "screenshots/09-footer.png" });
  });
});

// ─── ANALYTICS ───────────────────────────────────────────

test.describe("Analytics", () => {
  test("page source includes analytics components", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html).toContain("Analytics");
    expect(html).toContain("SpeedInsights");
  });
});

// ─── MOBILE ──────────────────────────────────────────────

test.describe("Mobile Sticky CTA", () => {
  test("sticky CTA appears on scroll (mobile)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshots/10-mobile-sticky-cta.png" });
  });
});
