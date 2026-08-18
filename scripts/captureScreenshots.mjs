// Captures the README screenshots + OG image.
// Usage: SITE=http://localhost:5173 node scripts/captureScreenshots.mjs
import { chromium } from "playwright";

const SITE = process.env.SITE ?? "https://aeropulse-eight.vercel.app";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

await page.goto(SITE, { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=AEROPULSE");
await page.waitForTimeout(7000);
await page.screenshot({ path: "docs/screenshots/home.png", fullPage: false });
await page.screenshot({ path: "public/og-image.png", fullPage: false });

// Open an attention airport's panel, then go to full detail
const attentionBtn = page.locator('button:has-text("ATENÇÃO"), button:has-text("ELEVADO"), button:has-text("ALTO")').first();
if (await attentionBtn.count() > 0) {
  await attentionBtn.click({ force: true });
} else {
  await page.getByRole("button", { name: /^GRU/ }).first().click({ force: true });
}
await page.waitForTimeout(600);
await page.getByRole("link", { name: /Ver detalhe completo/ }).click();
await page.waitForTimeout(1200);

const explainBtn = page.getByRole("button", { name: /Explicar este sinal/ });
if (await explainBtn.count() > 0) {
  await explainBtn.click();
  await page.waitForSelector("text=Gemini · experimental", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
}
await page.screenshot({ path: "docs/screenshots/airport-detail.png", fullPage: false });

await page.goto(`${SITE}/war-room`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("text=Aviação Brasil", { timeout: 20000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: "docs/screenshots/war-room.png", fullPage: false });

await page.goto(`${SITE}/airports`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
await page.screenshot({ path: "docs/screenshots/airports.png", fullPage: false });

console.log("done");
await browser.close();
