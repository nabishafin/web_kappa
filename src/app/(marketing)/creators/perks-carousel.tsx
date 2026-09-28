"use client";

import { useId, useState } from "react";
import { PagerControl } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface Perk {
  title: string;
  body: string;
}

const PAGE_SIZE = 6;

/**
 * Perk cards, six per page (3 × 2 on desktop), paged by the design's pager
 * control. Pages wrap around like the prototype.
 */
export function PerksCarousel({ perks, className }: { perks: readonly Perk[]; className?: string }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(perks.length / PAGE_SIZE));
  const visible = perks.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const gridId = useId();

  const go = (dir: 1 | -1) => setPage((p) => (p + dir + pages) % pages);

  return (
    <div className={cn("flex flex-col items-center", className)} role="region" aria-roledescription="carousel" aria-label="Creator perks">
      <ul
        id={gridId}
        key={page}
        aria-live="polite"
        aria-label={`Page ${page + 1} of ${pages}`}
        className="grid w-full animate-fade-in gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-[50px]"
      >
        {visible.map((perk) => (
          <li
            key={perk.title}
            className="rounded-card border border-x-[#592da2] border-y-[#b73cf3] bg-linear-to-b from-[#1f162e] to-[#1c1629] pt-[27px] pr-4 pb-8 pl-6 md:min-h-[200px] md:pt-[31px] md:pl-[33px]"
          >
            <h3 className="relative top-[2px] text-2xl leading-8 font-bold text-[#c77dff] md:text-[27.5px]">{perk.title}</h3>
            <p className="relative top-px mt-3 text-lg leading-[23px] text-[#f0f0f0] md:mt-[17.5px] md:text-xl">{perk.body}</p>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <PagerControl
          index={page}
          steps={pages}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          label="perks"
          accentNext
          className="relative z-10 mt-10 md:mt-[51px]"
        />
      )}
    </div>
  );
}
