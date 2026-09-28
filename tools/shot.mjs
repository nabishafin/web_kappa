// usage: node scripts-shot.mjs <path> <out.png> [width] [signedIn]
import { chromium } from "playwright-core";
const [, , path = "/", out = "shot.png", width = "1440", signed = "0", extra = ""] = process.argv;
const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: +width, height: +(process.env.VH ?? 900) }, deviceScaleFactor: 1 });
if (signed === "1") {
  await ctx.addCookies([{ name: "ci_session", value: "1", url: (process.env.BASE_URL ?? "http://localhost:3000") }]);
  await ctx.addInitScript(() => {
    if (!localStorage.getItem("ci.state.v1")) localStorage.setItem("ci.state.v1", JSON.stringify({
      user: { id: "u1", email: "voyager@infinity-stream.io", displayName: "Rokey", avatar: "/images/avatars/blossom-pink.webp", plan: "free", emailVerified: true },
      watchlist: ["neon-genesis-rebirth", "stellar-odyssey", "void-dragon-chronicles", "ether-gardens"], following: [], ratings: {}, progress: {}, readNotifications: [], pendingEmail: "j.doe@gmail.com", historyCleared: false }));
  });
}
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto((process.env.BASE_URL ?? "http://localhost:3000") + path, { waitUntil: "load", timeout: 120000 });
await page.evaluate(async () => {
  await document.fonts.ready;
  for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
  window.scrollTo(0, 0);
  await Promise.race([
    Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.addEventListener("load", r); i.addEventListener("error", r); }))),
    new Promise((r) => setTimeout(r, 6000)),
  ]);
});
if (extra) await page.evaluate(extra);
await page.waitForTimeout(1500);
// deterministic capture: freeze motion (scroll reveal, Ken Burns) and hide the dev overlay
await page.addStyleTag({ content: "nextjs-portal{display:none!important} [data-reveal],.ken-burns{animation:none!important}" });
await page.screenshot({ path: out, fullPage: true });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
console.log("height", h, "url", page.url());
if (errors.length) console.log("ERRORS:\n" + errors.slice(0, 8).join("\n"));
await browser.close();
