import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  className,
  descriptionClassName,
  aside,
  id,
}: {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  descriptionClassName?: string;
  aside?: ReactNode;
  id?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-center md:justify-between", className)}>
      <div className="min-w-0 max-w-[1240px]">
        <h2 id={id} className="font-display text-[28px] leading-[1.2] font-bold tracking-[-0.01em] text-white sm:text-[38px] sm:leading-[46px]">
          {title}
        </h2>
        {description && (
          <p className={cn("mt-3 font-display text-base leading-[27px] font-light text-haze sm:text-lg", descriptionClassName)}>{description}</p>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}
