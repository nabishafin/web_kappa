"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * “← Back”: returns to the previous page when there is history,
 * otherwise (deep link / new tab) navigates to `fallback`. Works without JS as a plain link.
 */
export function BackLink({ fallback, className }: { fallback: string; className?: string }) {
  const router = useRouter();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };
  return (
    <Link
      href={fallback}
      onClick={onClick}
      className={cn(
        "inline-flex w-fit items-center gap-[9px] rounded-md text-2xl leading-8 text-[#e6e6e6] transition-colors hover:text-white",
        className,
      )}
    >
      <ArrowLeft aria-hidden className="size-[29px]" strokeWidth={1.75} />
      Back
    </Link>
  );
}

/**
 * Two-column frame used by the focus screens at desktop: the Back link sits in a narrow
 * left gutter and the content column is centred beneath the title. Stacks on mobile.
 */
export function FocusFrame({
  back,
  title,
  titleId,
  gutter,
  column,
  className,
  children,
}: {
  back: ReactNode;
  className?: string;
  title: string;
  titleId?: string;
  /** width of the Back gutter at desktop (px) */
  gutter: number;
  /** width of the content column at desktop (px) */
  column: number;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid w-full max-w-(--col) animate-fade-in grid-cols-1 lg:w-auto lg:max-w-none lg:grid-cols-[var(--gutter)_var(--col)]",
        className,
      )}
      style={{ "--gutter": `${gutter}px`, "--col": `${column}px` } as CSSProperties}
    >
      <div className="mb-6 lg:mb-0">{back}</div>
      <div className="min-w-0">
        <h1 id={titleId} className="text-center text-[26px] leading-9 font-semibold text-white lg:text-[28px] lg:leading-10">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
