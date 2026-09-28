// Smoke test for the interaction layer. Usage: BASE_URL=http://localhost:3100 node tools/e2e-awesome.mjs
import { chromium } from "playwright-core";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addCookies([{ name: "ci_session", value: "1", url: BASE }]);
await ctx.addInitScript(() => {
  if (!localStorage.getItem("ci.state.v1"))
    localStorage.setItem("ci.state.v1", JSON.stringify({ user: { id: "u1", email: "voyager@infinity-stream.io", displayName: "Rokey", avatar: "/images/avatars/blossom-pink.webp", plan: "free", emailVerified: true }, watchlist: [], following: [], ratings: {}, progress: {}, readNotifications: [], pendingEmail: null, historyCleared: false }));
});
const p = await ctx.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
const ok = (name, cond) => console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);

await p.goto(BASE + "/home", { waitUntil: "load" });
await p.waitForTimeout(500);
// scroll reveal (CSS scroll-driven): an off-screen card starts hidden and is fully visible once scrolled to
const probe = () => p.evaluate(() => { const els = [...document.querySelectorAll("[data-reveal]")]; const el = els[els.length - 1]; const cs = getComputedStyle(el); return { op: +cs.opacity, anim: cs.animationName }; });
const before = await probe();
await p.evaluate(() => document.querySelectorAll("[data-reveal]")[document.querySelectorAll("[data-reveal]").length - 1].scrollIntoView({ block: "center" }));
await p.waitForTimeout(400);
const after = await probe();
ok(`scroll reveal (opacity ${before.op.toFixed(2)} → ${after.op.toFixed(2)}, ${after.anim})`, before.op < 0.5 && after.op > 0.99 && after.anim === "reveal-in");

// Ctrl+K focuses search, typeahead works
await p.evaluate(() => scrollTo(0, 0));
await p.locator("main").click({ position: { x: 5, y: 5 } }).catch(() => {});
await p.keyboard.press("Control+k");
ok("Ctrl+K focuses search", await p.evaluate(() => document.activeElement?.hasAttribute("data-global-search")));
await p.keyboard.type("nebula", { delay: 30 });
await p.waitForTimeout(250);
const opts = await p.locator("[role=option]").count();
ok(`typeahead shows suggestions (${opts})`, opts > 0);
await p.keyboard.press("ArrowDown");
await p.keyboard.press("Enter");
await p.waitForURL(/\/title\//, { timeout: 15000 });
ok(`Enter opens suggestion → ${new URL(p.url()).pathname}`, /\/title\//.test(p.url()));
await p.waitForTimeout(600);

// watchlist toast + undo
const slug = new URL(p.url()).pathname.split("/").pop();
await p.locator('button[aria-label="Add to watchlist"]').first().click();
await p.locator('[role=status]:has-text("Added to your watchlist")').waitFor({ timeout: 5000 });
ok("watchlist toast appears", true);
await p.locator('[role=status] button:has-text("Undo")').click();
await p.waitForTimeout(200);
const wl = await p.evaluate((s) => JSON.parse(localStorage.getItem("ci.state.v1")).watchlist.includes(s), slug);
ok("Undo reverts watchlist", wl === false);

// tip → confetti + toast
await p.goto(BASE + "/title/stellar-drift/support", { waitUntil: "load" });
await p.locator('button[type=submit]:has-text("Support Creator")').click();
const confettiSeen = await p.waitForSelector("canvas[aria-hidden=true]", { timeout: 4000 }).then(() => true).catch(() => false);
ok("confetti on tip", confettiSeen);
ok("tip toast", (await p.locator('[role=status]:has-text("Tip of $10 sent")').count()) > 0);

ok(`no console errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`, errors.length === 0);
await b.close();
