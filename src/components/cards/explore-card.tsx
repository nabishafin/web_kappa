import Image from "next/image";
import { ViewTransition } from "react";
import Link from "next/link";
import { BadgeCheck, Clapperboard, Palette, Sparkles, Star, Video, Zap } from "lucide-react";
import { getCreatorSync } from "@/lib/api/catalog";
import type { Title, TitleIcon } from "@/lib/types";
import { cn, formatCompact } from "@/lib/utils";

const icons: Record<TitleIcon, { Icon: typeof Sparkles; className: string }> = {
  sparkles: { Icon: Sparkles, className: "fill-[#c9a8ff] text-[#c9a8ff]" },
  badge: { Icon: BadgeCheck, className: "text-[#8f8a99]" },
  zap: { Icon: Zap, className: "fill-[#b28cff] text-[#b28cff]" },
  clapper: { Icon: Clapperboard, className: "text-[#8f8a99]" },
  video: { Icon: Video, className: "text-[#8f8a99]" },
  palette: {
    Icon: Palette,
    className: "fill-[#d8c4ff] text-[#d8c4ff] [&_circle]:fill-[#1a1521] [&_circle]:stroke-[#1a1521]",
  },
};

export function DurationPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "absolute top-[13px] right-[17px] inline-flex h-[26px] items-center rounded-full border border-white/10 bg-black/60 px-[10px] text-[13px] font-medium tracking-[0.04em] text-white backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** `morph` names the artwork for the card → title-page shared-element transition (must be unique per page). */
export function ExploreCard({ title, priority, morph = true }: { title: Title; priority?: boolean; morph?: boolean }) {
  const creator = getCreatorSync(title.creatorId);
  const { Icon, className: iconClass } = icons[title.icon];

  return (
    <article
      data-reveal
      data-spotlight
      className="group relative flex min-h-[346px] flex-col overflow-hidden rounded-[12px] border border-line-2 bg-panel transition duration-300 hover:-translate-y-1 hover:border-[#4a3a63] hover:shadow-[0_18px_40px_-18px_rgba(163,12,232,0.45)]"
    >
      <MorphArt slug={title.slug} enabled={morph} className="relative h-[157px] overflow-hidden">
        <Image
          src={title.thumbnail}
          alt=""
          fill
          sizes="(min-width: 1280px) 288px, (min-width: 768px) 45vw, 92vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading={priority ? "eager" : "lazy"}
        />
        <DurationPill>{title.duration}</DurationPill>
      </MorphArt>
      <div className="flex flex-1 flex-col px-6 pt-[25px] font-sans">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl leading-7 font-medium tracking-[-0.01em] text-[#f3ecff]">
            <Link href={`/title/${title.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
              {title.title}
            </Link>
          </h3>
          <Icon aria-hidden className={cn("mt-1 size-5 shrink-0", iconClass)} strokeWidth={1.8} />
        </div>
        <div className="mt-3 flex items-center gap-3 border-b border-[#2f2839] pb-[18px]">
          {creator && <Image src={creator.avatar} alt="" width={24} height={24} className="size-6 shrink-0 rounded-full object-cover" />}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="min-w-0 text-base leading-[25px] text-[#dcd6e4]">{creator?.name}</span>
            <span aria-hidden className="size-1 shrink-0 rounded-full bg-[#8f8a99]" />
            <span className="min-w-0 text-xs leading-3 font-medium tracking-[0.08em] text-[#a9a2b5] uppercase">{title.label}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-[13px] pb-[20px] text-[13px] leading-5 font-medium tracking-[0.04em]">
          <span className="inline-flex items-center gap-1.5 text-[#d7c8ff]">
            <Star aria-hidden className="size-[15px] fill-[#b89aff] text-[#b89aff]" />
            <span className="sr-only">Rating</span>
            {title.rating.toFixed(1)}
          </span>
          <span className="text-[#a9a2b5]">{formatCompact(title.views)} Views</span>
        </div>
      </div>
    </article>
  );
}

/** Wraps artwork in a named <ViewTransition> so it morphs into the title hero on navigation. */
export function MorphArt({
  slug,
  enabled = true,
  className,
  children,
}: {
  slug: string;
  enabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const box = <div className={className}>{children}</div>;
  if (!enabled) return box;
  return (
    <ViewTransition name={`art-${slug}`} share="morph" default="none">
      {box}
    </ViewTransition>
  );
}
