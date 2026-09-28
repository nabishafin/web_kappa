/** Tiny dependency-free confetti burst in brand colours. No-op under reduced motion. */
const COLORS = ["#a30ce8", "#d0bcff", "#c597ff", "#ffffff", "#f5a3ff", "#7a30a4"];

export function confetti({ x = 0.5, y = 0.45, count = 140 }: { x?: number; y?: number; count?: number } = {}) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "100" });
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const ox = innerWidth * x;
  const oy = innerHeight * y;
  const parts = Array.from({ length: count }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 6 + Math.random() * 9;
    return {
      x: ox,
      y: oy,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 6,
      w: 5 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      c: COLORS[(Math.random() * COLORS.length) | 0],
    };
  });

  const start = performance.now();
  const frame = (now: number) => {
    const t = now - start;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.32;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - t / 2600);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)));
      ctx.restore();
    }
    if (t < 2600) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
