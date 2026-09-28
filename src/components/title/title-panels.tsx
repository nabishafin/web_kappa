"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { ExploreCard } from "@/components/cards/explore-card";
import type { Creator, Title } from "@/lib/types";
import { cn, formatCompact } from "@/lib/utils";

export function EpisodeList({ title }: { title: Title }) {
  if (!title.episodes?.length) return <p className="text-lg text-white/80">No episode data available.</p>;
  return (
    <ol data-reveal-group className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {title.episodes.map((ep) => (
        <li key={ep.id} data-reveal>
          <Link
            href={`/watch/${title.slug}?ep=${ep.id}`}
            data-spotlight
            className="group relative block overflow-hidden rounded-[12px] border border-white/[0.08] bg-[#120e18] transition duration-300 hover:-translate-y-1 hover:border-[#4a3a63]"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image src={ep.thumbnail} alt="" fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute top-3 right-3 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium tracking-wide">{ep.duration}</span>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold tracking-[0.1em] text-lilac uppercase">
                S{ep.season} • E{ep.number}
              </p>
              <h3 className="mt-1 text-lg leading-6 font-semibold">{ep.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/65">{ep.synopsis}</p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function TitleDetails({ title, creator }: { title: Title; creator?: Creator }) {
  const rows: [string, React.ReactNode][] = [
    ["Creator", creator?.name ?? "—"],
    ["Released", title.year],
    ["Genres", title.genres.map((g) => g.replace(/^\w/, (c) => c.toUpperCase())).join(", ")],
    ["Maturity rating", title.maturity],
    [title.kind === "series" ? "Seasons" : "Runtime", title.kind === "series" ? (title.seasons ?? 1) : title.duration],
    ["Quality", title.badges.join(" · ")],
    ["Views", formatCompact(title.views)],
    ["Average rating", `${title.rating.toFixed(1)} / 5`],
  ];
  if (title.awards) rows.push(["Awards", title.awards]);
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <p className="max-w-[720px] text-lg leading-8 text-white/85">{title.synopsis}</p>
      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-[15px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-white/50">{k}</dt>
            <dd className="text-white">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function RelatedGrid({ titles }: { titles: Title[] }) {
  if (!titles.length) return <p className="text-lg text-white/80">Nothing similar yet — check back soon.</p>;
  return (
    <div data-reveal-group className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-[29px] lg:gap-y-10">
      {titles.map((t) => (
        <ExploreCard key={t.slug} title={t} />
      ))}
    </div>
  );
}

const tabs = [
  { id: "episodes", label: "Episodes", width: "flex-1 lg:w-[160px] lg:flex-none" },
  { id: "details", label: "Details", width: "flex-1 lg:w-[160px] lg:flex-none" },
  { id: "related", label: "More like this", width: "flex-[1.4] lg:w-[160px] lg:flex-none" },
] as const;
type TabId = (typeof tabs)[number]["id"];

/** Series layout tab strip (Episodes / Details / More like this) + panels */
export function SeriesTabs({ title, creator, related, tagline }: { title: Title; creator?: Creator; related: Title[]; tagline?: string }) {
  const [active, setActive] = useState<TabId>("episodes");

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === active);
    if (e.key === "ArrowRight") setActive(tabs[(i + 1) % tabs.length].id);
    if (e.key === "ArrowLeft") setActive(tabs[(i - 1 + tabs.length) % tabs.length].id);
  };

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-[46px]">
        <div role="tablist" aria-label="Title sections" onKeyDown={onKey} className="flex shrink-0 gap-2 sm:gap-3">
          {tabs.map((t) => {
            const selected = active === t.id;
            return (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(t.id)}
                className={cn(
                  "surface-secondary h-12 min-w-0 rounded-[10px] px-2 text-base font-medium whitespace-nowrap text-white transition sm:px-3 sm:text-2xl lg:px-0",
                  t.width,
                  selected && "border-[#b58cf0] shadow-[0_0_0_1px_#b58cf0,0_8px_24px_-8px_rgb(163_12_232/0.6)]",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        {tagline && <p className="text-2xl leading-9 font-medium text-white lg:text-[32px]">{tagline}</p>}
      </div>

      <div className="mt-12">
        {tabs.map((t) => (
          <div key={t.id} id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} hidden={active !== t.id} className="animate-fade-in">
            {t.id === "episodes" && <EpisodeList title={title} />}
            {t.id === "details" && <TitleDetails title={title} creator={creator} />}
            {t.id === "related" && <RelatedGrid titles={related} />}
          </div>
        ))}
      </div>
    </>
  );
}
