"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { dismissToast, useToasts } from "@/lib/toast";
import { cn } from "@/lib/utils";

const icons = { default: Info, success: CheckCircle2, error: AlertCircle };
const iconTone = { default: "text-lilac", success: "text-[#3ddc97]", error: "text-[#ff6b77]" };

export function Toaster() {
  const toasts = useToasts();
  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {toasts.map((t) => {
        const Icon = icons[t.tone];
        return (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className="toast-in pointer-events-auto flex w-full max-w-[380px] items-start gap-3 rounded-2xl border border-white/10 bg-[#171124]/90 p-4 shadow-[0_20px_50px_-12px_rgb(0_0_0/0.8),0_0_0_1px_rgb(163_12_232/0.12)] backdrop-blur-xl"
          >
            <Icon aria-hidden className={cn("mt-px size-5 shrink-0", iconTone[t.tone])} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">{t.title}</p>
              {t.description && <p className="mt-0.5 text-[13px] leading-5 text-white/65">{t.description}</p>}
            </div>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action!.onClick();
                  dismissToast(t.id);
                }}
                className="shrink-0 rounded-lg px-2 py-1 text-[13px] font-semibold text-lilac hover:bg-white/5"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismissToast(t.id)}
              className="-m-1 grid size-7 shrink-0 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
