"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ExploreCard } from "@/components/cards/explore-card";
import type { Title } from "@/lib/types";
import { cn } from "@/lib/utils";

const sorts = [
  { id: "popular", label: "Popular" },
  { id: "new", label: "New Release" },
  { id: "rating", label: "Top Rated" },
  { id: "az", label: "A–Z" },
] as const;
type SortId = (typeof sorts)[number]["id"];

const kinds = [
  { id: "all", label: "All" },
  { id: "series", label: "Series" },
  { id: "film", label: "Films & Shorts" },
] as const;

export function TitleBrowser({ titles, emptyText = "No animations found." }: { titles: Title[]; emptyText?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const sort = (sorts.find((s) => s.id === params.get("sort"))?.id ?? "popular") as SortId;
  const kind = params.get("kind") ?? "all";

  const set = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params);
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const list = useMemo(() => {
    const filtered = titles.filter((t) => kind === "all" || t.kind === kind);
    const sorted = [...filtered];
    if (sort === "popular") sorted.sort((a, b) => b.views - a.views);
    if (sort === "new") sorted.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating || b.views - a.views);
    if (sort === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [titles, sort, kind]);

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="radiogroup" aria-label="Type" className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <button
              key={k.id}
              type="button"
              role="radio"
              aria-checked={kind === k.id}
              onClick={() => set("kind", k.id, "all")}
              className={cn(
                "h-10 rounded-full border px-5 text-sm font-medium transition-colors",
                kind === k.id ? "border-lilac/70 bg-lilac/15 text-lilac" : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/25 hover:text-white",
              )}
            >
              {k.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-white/60">
          Sort by
          <select
            value={sort}
            onChange={(e) => set("sort", e.target.value, "popular")}
            className="h-10 cursor-pointer rounded-[10px] border border-white/10 bg-[#1e162d] px-3 text-sm text-white focus:border-brand/60 focus:outline-none"
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="sr-only" aria-live="polite">
        {list.length} results
      </p>
      {list.length ? (
        <div data-reveal-group className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-[29px] lg:gap-y-[40px]">
          {list.map((t, i) => (
            <ExploreCard key={t.slug} title={t} priority={i < 4} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-lg text-white/60">{emptyText}</p>
      )}
    </>
  );
}
