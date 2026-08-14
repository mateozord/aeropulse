// Captures the README screenshots. Requires `npm i -D playwright` (not a
// project dependency, install it only when you need to run this).
// Usage: SITE=http://localhost:5174 node scripts/captureScreenshots.mjs
import { chromium } from "playwright";

const SITE = process.env.SITE ?? "https://majestic-dodol-fc3c9f.netlify.app";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

await page.goto(SITE, { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=AEROPULSE");
await page.waitForTimeout(7000);
await page.screenshot({ path: "docs/screenshots/home.png", fullPage: false });

// Open an attention airport's panel, then go to full detail
const attentionBtn = page.locator('button:has-text("ATTENTION"), button:has-text("ELEVATED"), button:has-text("HIGH")').first();
if (await attentionBtn.count() > 0) {
  await attentionBtn.click({ force: true });
} else {
  await page.getByRole("button", { name: /^GRU/ }).first().click({ force: true });
}
await page.waitForTimeout(600);
await page.getByRole("link", { name: /View full detail/ }).click();
await page.waitForTimeout(1200);

const explainBtn = page.getByRole("button", { name: /Explain this signal/ });
if (await explainBtn.count() > 0) {
  await explainBtn.click();
  await page.waitForSelector("text=Gemini · experimental", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
}
await page.screenshot({ path: "docs/screenshots/airport-detail.png", fullPage: false });

await page.goto(`${SITE}/war-room`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=BRAZIL AVIATION", { timeout: 20000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: "docs/screenshots/war-room.png", fullPage: false });

console.log("done");
await browser.close();
