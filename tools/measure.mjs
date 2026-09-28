// usage: node scripts-measure.mjs <path> <selectorsJSON> [signed]
import { chromium } from "playwright-core";
const [, , path, sels, signed = "0"] = process.argv;
const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
if (signed === "1") {
  await ctx.addCookies([{ name: "ci_session", value: "1", url: (process.env.BASE_URL ?? "http://localhost:3000") }]);
  await ctx.addInitScript(() => { if (!localStorage.getItem("ci.state.v1")) localStorage.setItem("ci.state.v1", JSON.stringify({ user: { id: "u1", email: "voyager@infinity-stream.io", displayName: "Rokey", avatar: "/images/avatars/blossom-pink.webp", plan: "free", emailVerified: true }, watchlist: ["neon-genesis-rebirth","stellar-odyssey","void-dragon-chronicles","ether-gardens"], following: [], ratings: {}, progress: {}, readNotifications: [], pendingEmail: "j.doe@gmail.com", historyCleared: false })); });
}
const page = await ctx.newPage();
await page.goto((process.env.BASE_URL ?? "http://localhost:3000") + path, { waitUntil: "networkidle" });
await page.evaluate(async () => { await document.fonts.ready; });
const res = await page.evaluate((sels) => sels.map((s) => {
  const els = [...document.querySelectorAll(s)].slice(0, 3);
  return [s, els.map((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return `x${Math.round(r.left)} y${Math.round(r.top + scrollY)} w${Math.round(r.width)} h${Math.round(r.height)} fs${cs.fontSize}`; }).join(" | ")];
}), JSON.parse(sels));
for (const [s, v] of res) console.log(s.padEnd(40), v);
await browser.close();
