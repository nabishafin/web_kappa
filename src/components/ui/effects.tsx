"use client";

import { useEffect } from "react";

/**
 * Global, delegated UI effects (one listener each, zero per-component cost):
 *  - [data-spotlight]  → cursor-following glow (sets --mx/--my)
 *  (scroll reveal is pure CSS — see [data-reveal] in globals.css)
 *  - ⌘K / Ctrl+K / "/" → focus the header search
 */
export function Effects() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-spotlight]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, select, [contenteditable=true]");
      const combo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (combo || (e.key === "/" && !typing)) {
        const input = [...document.querySelectorAll<HTMLInputElement>("[data-global-search]")].find((i) => i.offsetParent !== null);
        if (input) {
          e.preventDefault();
          input.focus();
          input.select();
        } else if (combo) {
          document.querySelector<HTMLButtonElement>("[data-open-menu]")?.click();
        }
      }
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
