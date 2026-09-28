"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PlaySquareIcon } from "@/components/ui/play-square-icon";
import { buttonClass } from "@/components/ui/button";
import { actions, useAppState } from "@/lib/store";
import type { Title } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROTATE_MS = 9000;

function splitTitle(title: string) {
  // “Chronicles of the Nebula Void” → ["CHRONICLES OF", "THE NEBULA VOID"]
  const words = title.toUpperCase().split(" ");
  if (words.length < 3) return [words.join(" "), ""];
  const cut = Math.ceil(words.length / 2) - (words.length % 2 === 0 ? 0 : 1);
  return [words.slice(0, Math.max(cut, 1)).join(" "), words.slice(Math.max(cut, 1)).join(" ")];
}

export function HomeHero({ slides }: { slides: Title[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const watchlist = useAppState((s) => s.watchlist);
  const n = slides.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  // Rotation is driven by the pager-fill animation (see onAnimationEnd below), so pausing on
  // hover/focus freezes both in sync. Under reduced motion we don't auto-rotate at all.
  const [autoplay, setAutoplay] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAutoplay(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const t = slides[i];
  const [l1, l2] = splitTitle(t.title);
  const saved = watchlist.includes(t.slug);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative isolate overflow-hidden bg-[#0e0522]"
    >
      {slides.map((s, idx) => (
        <div
          key={s.slug}
          aria-hidden={idx !== i}
          className={cn(
            // desktop framing reproduces the artboard: art at ~1.05× width, offset left/down
            "absolute inset-0 -z-10 transition-opacity duration-1000 lg:inset-auto lg:top-[45px] lg:left-[-5.35%] lg:aspect-[1.65] lg:w-[105.4%] lg:[mask-image:linear-gradient(180deg,transparent,#000_90px)]",
            idx === i ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={s.backdrop ?? s.thumbnail}
            alt=""
            fill
            sizes="100vw"
            quality={90}
            loading={idx === 0 ? "eager" : "lazy"}
            fetchPriority={idx === 0 ? "high" : undefined}
            className={cn("object-cover object-[50%_30%] lg:object-center", idx === i && "ken-burns")}
          />
        </div>
      ))}
      {/* legibility + blend into page */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(24_8_52/0.62)_0%,rgb(24_8_52/0.38)_45%,rgb(24_8_52/0.12)_75%,transparent)]" />
      <div className="absolute inset-0 -z-10 bg-[rgb(40_14_80/0.18)] mix-blend-multiply" />
      <div className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-[#0e0522] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[110px] bg-gradient-to-b from-transparent via-[#0a0418]/80 to-[#03010e]" />

      <div className="container-ci flex min-h-[560px] flex-col justify-end pt-24 pb-36 md:min-h-[790px] md:pt-[220px] md:pb-[166px]">
        <div key={t.slug} className="max-w-[660px] animate-rise">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-[25px] items-center rounded-full border border-white/30 bg-white/10 px-3 text-[13px] leading-none font-semibold tracking-[0.12em] text-[#e4daf3] uppercase backdrop-blur-sm">
              {t.featured?.eyebrow ?? "Featured"}
            </span>
            <span className="text-[13px] font-medium tracking-[0.06em] text-[#e4daf3]">{t.featured?.meta ?? `${t.year} • ${t.label}`}</span>
          </div>
          <h1 className="mt-[29px] text-[40px] leading-[1.05] font-extrabold tracking-[-0.045em] sm:text-[56px] md:text-[66px] md:leading-[72px]">
            <Link href={`/title/${t.slug}`} className="hover:opacity-95">
              <span className="block text-[#ece4f6]">{l1}</span>
              {l2 && <span className="block text-[#d2bfff]">{l2}</span>}
            </Link>
          </h1>
          <p className="mt-3 text-base leading-7 text-[#e2dcea] sm:text-lg">{t.synopsis}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/watch/${t.slug}`}
              className={buttonClass({
                size: "lg",
                className: "w-[208px] gap-3",
              })}
            >
              <PlaySquareIcon className="size-[26px]" /> Watch Now
            </Link>
            <button
              type="button"
              onClick={() => actions.toggleWatchlist(t.slug)}
              aria-pressed={saved}
              className={buttonClass({
                variant: "outline",
                size: "lg",
                className: "w-[208px] gap-2 border-white/30 bg-white/[0.07]",
              })}
            >
              {saved ? <Check aria-hidden className="size-6" /> : <Plus aria-hidden className="hidden size-6" />}
              {saved ? "In Watchlist" : "Watch list"}
            </button>
          </div>
        </div>
      </div>

      {n > 1 && (
        <div className="absolute inset-x-0 bottom-[25px] flex justify-center md:bottom-[-15px]">
          <div className="flex items-center gap-4 rounded-[12px] border border-white/[0.06] bg-[#111018]/95 p-[15px] shadow-[0_20px_40px_-10px_rgb(0_0_0/0.8)] backdrop-blur">
            <button
              type="button"
              aria-label="Previous featured title"
              onClick={() => go(-1)}
              className="grid size-14 place-items-center rounded-[8px] border border-white/[0.06] bg-[#1c1b22] text-white hover:bg-[#26252d]"
            >
              <ArrowLeft className="size-6" strokeWidth={1.8} />
            </button>
            <div
              className={cn("flex gap-[3px]", paused && "pager-paused")}
              role="tablist"
              aria-label="Featured titles"
              style={{ "--pager-ms": `${ROTATE_MS}ms` } as React.CSSProperties}
            >
              {slides.map((s, idx) => (
                <button
                  key={s.slug}
                  type="button"
                  role="tab"
                  aria-selected={idx === i}
                  aria-label={s.title}
                  onClick={() => setI(idx)}
                  className={cn(
                    "relative h-1 overflow-hidden rounded-full transition-all duration-300",
                    idx === i ? "w-[23px] bg-brand" : "w-[13px] bg-[#3a3a40] hover:bg-[#55555c]",
                  )}
                >
                  {idx === i && autoplay && n > 1 && (
                    <span key={i} aria-hidden onAnimationEnd={() => go(1)} className="pager-fill absolute inset-0 rounded-full bg-[#e3b8ff]/60" />
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Next featured title"
              onClick={() => go(1)}
              className="grid size-14 place-items-center rounded-[8px] border border-white/[0.06] bg-[#1c1b22] text-white hover:bg-[#26252d]"
            >
              <ArrowRight className="size-6" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
