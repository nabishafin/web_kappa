import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** id helpers so every control / label / error triple stays in sync */
export const errorId = (id: string) => `${id}-error`;

/** aria-describedby value for a control: its error, when one is shown */
export function describedBy(id: string, error?: string) {
  return error ? errorId(id) : undefined;
}

export function RequiredMark() {
  return (
    <>
      <span aria-hidden className="text-[#ff4d4d]">
        {" *"}
      </span>
      <span className="sr-only"> (required)</span>
    </>
  );
}

/** Roboto ink sits ~2px lower on the artboard than Chrome draws it in the same line box, hence the nudge */
export const labelClass = "relative top-[2px] block text-base leading-[18.75px] font-bold text-[#f0f0f0]";

export function FieldError({ id, message, className }: { id: string; message?: string; className?: string }) {
  if (!message) return null;
  return (
    <p id={errorId(id)} className={cn("mt-2 animate-fade-in text-sm leading-5 font-medium text-[#ff6b6b]", className)}>
      {message}
    </p>
  );
}

/**
 * Label + control + inline error. The control must carry `id` and
 * `aria-describedby={describedBy(id, error)}` so the error is announced with it.
 */
export function Field({
  id,
  label,
  required,
  error,
  className,
  children,
}: {
  id: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={cn(labelClass, "mb-[9.75px]")}>
        {label}
        {required && <RequiredMark />}
      </label>
      {children}
      <FieldError id={id} message={error} />
    </div>
  );
}
