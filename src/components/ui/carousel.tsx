"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontal scroll-snap track driven by the design's pager control
 * (◀ ▬ ▬ ▬ ▬ ▶). One step = one card. Works with touch/trackpad scrolling too.
 */
export function useCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [steps, setSteps] = useState(1);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const step = first.offsetWidth + gap;
    const max = el.scrollWidth - el.clientWidth;
    setSteps(Math.max(1, Math.round(max / step) + 1));
    setIndex(Math.min(Math.round(el.scrollLeft / step), Math.round(max / step)));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const go = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const step = (first?.offsetWidth ?? el.clientWidth) + gap;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;
    // wrap around like the prototype does
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  return { trackRef, index, steps, prev: () => go(-1), next: () => go(1) };
}

export function PagerControl({
  index,
  steps,
  onPrev,
  onNext,
  className,
  label = "items",
  accentNext,
}: {
  index: number;
  steps: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  label?: string;
  /** the creator page renders the “next” arrow in brand violet */
  accentNext?: boolean;
}) {
  const dots = Math.max(steps, 1);
  return (
    <div className={cn("inline-flex items-center gap-4 rounded-[12px] border border-graphite-2 bg-coal p-[15px]", className)}>
      <button
        type="button"
        onClick={onPrev}
        aria-label={`Previous ${label}`}
        className="grid size-14 place-items-center rounded-[8px] border border-graphite-2 bg-graphite text-white transition-colors hover:bg-[#262626]"
      >
        <ArrowLeft className="size-6" strokeWidth={1.8} />
      </button>
      <div className="flex items-center gap-[3px]" role="tablist" aria-label={`${label} pages`}>
        {Array.from({ length: dots }).map((_, i) => (
          <span
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Page ${i + 1} of ${dots}`}
            className={cn("h-1 rounded-full transition-all duration-300", i === index ? "w-[23px] bg-brand" : "w-[13px] bg-[#333333]")}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onNext}
        aria-label={`Next ${label}`}
        className={cn(
          "grid size-14 place-items-center rounded-[8px] border border-graphite-2 bg-graphite transition-colors hover:bg-[#262626]",
          accentNext ? "text-brand" : "text-white",
        )}
      >
        <ArrowRight className="size-6" strokeWidth={1.8} />
      </button>
    </div>
  );
}

export function CarouselTrack({
  trackRef,
  children,
  className,
}: {
  trackRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      ref={trackRef}
      className={cn("scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth", className)}
    >
      {children}
    </div>
  );
}
