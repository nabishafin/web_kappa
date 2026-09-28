import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 1_200_000 → “1.2M”, 840_000 → “840K” */
export function formatCompact(n: number) {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

/** Relative age used on Trending cards: “2 Minutes”, “1 day”, “3 weeks” */
export function formatAge(iso: string, now: Date = new Date()) {
  const s = Math.max(0, (now.getTime() - new Date(iso).getTime()) / 1000);
  const steps: [number, string][] = [
    [60 * 60 * 24 * 365, "year"],
    [60 * 60 * 24 * 30, "month"],
    [60 * 60 * 24 * 7, "week"],
    [60 * 60 * 24, "day"],
    [60 * 60, "Hour"],
    [60, "Minute"],
  ];
  for (const [size, unit] of steps) {
    const v = Math.floor(s / size);
    if (v >= 1) return `${v} ${unit}${v > 1 ? "s" : ""}`;
  }
  return "Just now";
}

export function formatTime(totalSeconds: number) {
  const t = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 1)}***@${domain}`;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
