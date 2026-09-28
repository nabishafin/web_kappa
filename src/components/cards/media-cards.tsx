import Image from "next/image";
import Link from "next/link";
import { DurationPill, MorphArt } from "@/components/cards/explore-card";
import { PlaySquareIcon } from "@/components/ui/play-square-icon";
import type { Title } from "@/lib/types";
import { cn, formatAge } from "@/lib/utils";

function PlayBadge() {
  return (
    <span
      aria-hidden
      className="absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center text-white/90 drop-shadow-[0_2px_6px_rgb(0_0_0/0.6)] transition duration-300 group-hover:scale-125 group-hover:text-white"
    >
      <PlaySquareIcon className="h-[17px] w-[22px]" />
    </span>
  );
}

/** “Continue Watching” card on Home — image with progress bar + title/subtitle */
export function ContinueCard({ title, subtitle, progress }: { title: Title; subtitle: string; progress: number }) {
  return (
    <article data-reveal data-spotlight className="group relative overflow-hidden rounded-[12px] border border-[#2a2338] bg-[#110c1b] transition duration-300 hover:-translate-y-1 hover:border-[#43365a]">
      <div className="relative h-[156px] overflow-hidden">
        <Image src={title.thumbnail} alt="" fill sizes="(min-width: 1280px) 396px, (min-width: 640px) 45vw, 92vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <PlayBadge />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#3a3346]" role="progressbar" aria-label="Watched" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <div className="h-full bg-[#c9b3ff]" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <div className="px-4 pt-[19px] pb-[29px]">
        <h3 className="text-xl leading-6 font-semibold tracking-[-0.01em] text-white">
          <Link href={`/watch/${title.slug}`} className="after:absolute after:inset-0">
            {title.title}
          </Link>
        </h3>
        <p className="mt-[3px] text-xs leading-4 font-medium tracking-[0.06em] text-[#c0b8cc]">{subtitle}</p>
      </div>
    </article>
  );
}

/** “Trending Now” card — image, duration, title, divider, age */
export function TrendingCard({ title, className }: { title: Title; className?: string }) {
  return (
    <article data-reveal data-spotlight className={cn("group relative overflow-hidden rounded-[12px] border border-[#2a2338] bg-[#1b1525] transition duration-300 hover:-translate-y-1 hover:border-[#43365a]", className)}>
      <MorphArt slug={title.slug} className="relative h-[158px] overflow-hidden">
        <Image src={title.thumbnail} alt="" fill sizes="(min-width: 1280px) 396px, (min-width: 640px) 45vw, 92vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <PlayBadge />
        <DurationPill className="top-[15px] right-[17px] h-[25px] bg-black/70 px-[10px] text-[13px]">{title.duration}</DurationPill>
      </MorphArt>
      <div className="px-6 pt-[25px] pb-[19px]">
        <h3 className="border-b border-white/[0.06] pb-[19px] text-xl leading-6 font-medium tracking-[-0.005em] text-[#f1ebfa]">
          <Link href={`/title/${title.slug}`} className="after:absolute after:inset-0">
            {title.title}
          </Link>
        </h3>
        <p className="pt-[15px] text-xs leading-4 font-medium tracking-[0.06em] text-[#a8a0b5]">
          <time dateTime={title.publishedAt} suppressHydrationWarning>
            {formatAge(title.publishedAt)}
          </time>
        </p>
      </div>
    </article>
  );
}
