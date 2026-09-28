"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ContinueCard, TrendingCard } from "@/components/cards/media-cards";
import { useAppState } from "@/lib/store";
import type { ContinueWatchingItem, Title } from "@/lib/types";

export function RowHeading({ id, title, action }: { id: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 id={id} className="text-[26px] leading-[38px] font-bold tracking-[-0.01em] text-white md:text-[32px]">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function ContinueWatchingRow({ items }: { items: (ContinueWatchingItem & { title: Title })[] }) {
  const cleared = useAppState((s) => s.historyCleared);
  const progress = useAppState((s) => s.progress);

  // Seeded history until the viewer clears it; live progress from the player wins.
  const rows = useMemo(
    () =>
      (cleared ? items.filter((i) => progress[i.slug]) : items).map((i) => ({
        ...i,
        progress: progress[i.slug] ? progress[i.slug].position / progress[i.slug].duration : i.progress,
      })),
    [cleared, items, progress],
  );

  if (!rows.length) return null;

  return (
    <section aria-labelledby="cw-heading" className="container-ci mt-[35px]">
      <RowHeading
        id="cw-heading"
        title="Continue Watching"
        action={
          <Link href="/profile?tab=watchlist" className="mb-[5px] text-[13px] font-semibold tracking-[0.04em] text-lilac hover:underline">
            View All
          </Link>
        }
      />
      <div data-reveal-group className="mt-[25px] grid gap-[25px] sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((c) => (
          <ContinueCard key={c.slug} title={c.title} subtitle={c.subtitle} progress={c.progress} />
        ))}
      </div>
    </section>
  );
}

const PAGE = 6;

export function TrendingSection({ titles }: { titles: Title[] }) {
  const pages = Math.max(1, Math.ceil(titles.length / PAGE));
  const [page, setPage] = useState(0);
  const visible = titles.slice(page * PAGE, page * PAGE + PAGE);
  const nav = (d: number) => setPage((p) => (p + d + pages) % pages);

  return (
    <section id="trending" aria-labelledby="trending-heading" className="container-ci mt-[33px] scroll-mt-6">
      <RowHeading
        id="trending-heading"
        title="Trending Now"
        action={
          <div className="mb-[2px] flex gap-[6px]">
            {[
              { d: -1, Icon: ChevronLeft, label: "Previous" },
              { d: 1, Icon: ChevronRight, label: "Next" },
            ].map(({ d, Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={`${label} trending page`}
                disabled={pages < 2}
                onClick={() => nav(d)}
                className="grid size-[26px] place-items-center rounded-full border border-white/25 bg-white/[0.04] text-white transition-colors hover:bg-white/15 disabled:opacity-40"
              >
                <Icon className="size-4" strokeWidth={2} />
              </button>
            ))}
          </div>
        }
      />
      <div key={page} data-reveal-group className="mt-[35px] grid animate-fade-in gap-[26px] sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {visible.map((t) => (
          <TrendingCard key={t.slug} title={t} />
        ))}
      </div>
      {pages > 1 && (
        <p className="sr-only">
          Page {page + 1} of {pages}
        </p>
      )}
    </section>
  );
}
