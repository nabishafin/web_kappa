// Reports horizontal overflow for every route at several widths.
import { chromium } from "playwright-core";
const routes = ["/", "/creators", "/creators/apply", "/creators/apply/submitted", "/home", "/title/chronicles-of-the-nebula-void", "/title/stellar-drift", "/title/stellar-drift/support", "/watch/neon-horizon-part-ii", "/profile", "/profile?tab=watchlist", "/profile/edit", "/profile/avatar", "/pricing", "/settings", "/settings/password", "/settings/verify-email", "/categories", "/categories/sci-fi", "/search?q=nebula", "/support", "/legal/terms", "/login", "/signup", "/verify", "/forgot-password", "/reset-password", "/nope"];
const widths = [360, 768, 1024, 1280];
const b = await chromium.launch({ channel: "chrome" });
let bad = 0;
for (const w of widths) {
  const c = await b.newContext({ viewport: { width: w, height: 800 } });
  await c.addCookies([{ name: "ci_session", value: "1", url: (process.env.BASE_URL ?? "http://localhost:3000") }]);
  const p = await c.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  for (const r of routes) {
    // auth-only pages redirect when signed in; check them signed out
    if (["/login", "/signup"].includes(r)) await c.clearCookies();
    await p.goto((process.env.BASE_URL ?? "http://localhost:3000") + r, { waitUntil: "load" });
    await p.waitForTimeout(250);
    const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (o > 0) { bad++; console.log(`${w} ${r} OVERFLOW ${o}`); }
    if (["/login", "/signup"].includes(r)) await c.addCookies([{ name: "ci_session", value: "1", url: (process.env.BASE_URL ?? "http://localhost:3000") }]);
  }
  if (errs.length) console.log(w, "console errors:", [...new Set(errs)].slice(0, 5));
  await c.close();
}
console.log(bad ? `${bad} overflow issue(s)` : "no overflow at " + widths.join("/"));
await b.close();
