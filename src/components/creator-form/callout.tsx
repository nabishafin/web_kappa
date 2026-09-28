import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Info callout (violet left rule) or warning callout (hot-pink hairline, ⚠).
 * Vertical padding is passed by the caller so each block can match the artboard.
 */
export function Callout({
  tone = "info",
  className,
  children,
}: {
  tone?: "info" | "warning";
  className?: string;
  children: ReactNode;
}) {
  if (tone === "warning") {
    return (
      <div
        role="note"
        className={cn(
          "rounded-[8px] border border-[#ff006e] bg-[#410f24] px-4 text-base leading-[19px] font-bold text-[#f0f0f0]",
          className,
        )}
      >
        <p>
          <span aria-hidden>⚠️ </span>
          <span className="sr-only">Warning: </span>
          {children}
        </p>
      </div>
    );
  }
  return (
    <div role="note" className={cn("rounded-[4px] border-l-4 border-[#c77dff] bg-[#261b2e] pr-5 pl-6 text-base leading-[19px] text-[#f0f0f0]", className)}>
      {children}
    </div>
  );
}
