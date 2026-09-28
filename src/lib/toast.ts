"use client";

import { useSyncExternalStore } from "react";

export type ToastTone = "default" | "success" | "error";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  action?: { label: string; onClick: () => void };
  /** ms before auto-dismiss; 0 keeps it until closed */
  duration: number;
}

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();

const emit = () => listeners.forEach((l) => l());

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  const t = timers.get(id);
  if (t) clearTimeout(t);
  timers.delete(id);
  emit();
}

export function toast(title: string, opts: Partial<Omit<Toast, "id" | "title">> = {}) {
  const t: Toast = { id: nextId++, title, tone: "default", duration: 3800, ...opts };
  toasts = [...toasts.slice(-2), t]; // keep the stack short
  if (t.duration) timers.set(t.id, setTimeout(() => dismissToast(t.id), t.duration));
  emit();
  return t.id;
}

toast.success = (title: string, opts: Partial<Omit<Toast, "id" | "title" | "tone">> = {}) => toast(title, { ...opts, tone: "success" });
toast.error = (title: string, opts: Partial<Omit<Toast, "id" | "title" | "tone">> = {}) => toast(title, { ...opts, tone: "error" });

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const empty: Toast[] = [];

export function useToasts() {
  return useSyncExternalStore(subscribe, () => toasts, () => empty);
}
