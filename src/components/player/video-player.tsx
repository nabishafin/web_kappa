"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Maximize, Minimize, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { actions } from "@/lib/store";
import { cn, formatTime } from "@/lib/utils";

export interface PlayerSource {
  slug: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  poster: string;
  src: string;
  /** seconds — used before metadata loads so the UI never shows 00:00 / 00:00 */
  fallbackDuration: number;
  startAt?: number;
  prevHref?: string;
  nextHref?: string;
  backHref: string;
}

const QUALITIES = ["4K", "1080p", "720p", "Auto"] as const;

export function VideoPlayer({ source }: { source: PlayerSource }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaved = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(source.startAt ?? 0);
  const [duration, setDuration] = useState(source.fallbackDuration);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [chrome, setChrome] = useState(true);
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>("4K");
  const [error, setError] = useState(false);

  const v = () => videoRef.current;

  /* ---- chrome auto-hide ---- */
  const poke = useCallback(() => {
    setChrome(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setChrome(false);
    }, 2800);
  }, []);

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  /* ---- video wiring ---- */
  useEffect(() => {
    const el = v();
    if (!el) return;
    el.volume = volume;
    if (source.startAt) el.currentTime = source.startAt;
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback(
    (force = false) => {
      const el = v();
      if (!el || !Number.isFinite(el.duration) || el.duration === 0) return;
      if (force || Math.abs(el.currentTime - lastSaved.current) > 5) {
        lastSaved.current = el.currentTime;
        actions.saveProgress(source.slug, el.currentTime, el.duration);
      }
    },
    [source.slug],
  );

  const toggle = useCallback(() => {
    const el = v();
    if (!el) return;
    if (el.paused) el.play().catch(() => setError(true));
    else el.pause();
    poke();
  }, [poke]);

  const seekBy = (d: number) => {
    const el = v();
    if (!el) return;
    el.currentTime = Math.min(Math.max(0, el.currentTime + d), el.duration || duration);
    poke();
  };

  const setVol = (next: number) => {
    const el = v();
    const val = Math.min(1, Math.max(0, next));
    setVolume(val);
    setMuted(val === 0);
    if (el) {
      el.volume = val;
      el.muted = val === 0;
    }
  };

  const toggleMute = () => {
    const el = v();
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapRef.current?.requestFullscreen?.();
  };

  /* ---- scrubbing ---- */
  const scrubTo = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const el = v();
    if (el) el.currentTime = ratio * (el.duration || duration);
    setCurrent(ratio * duration);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "SELECT") return;
    const map: Record<string, () => void> = {
      " ": toggle,
      k: toggle,
      ArrowRight: () => seekBy(10),
      ArrowLeft: () => seekBy(-10),
      ArrowUp: () => setVol(volume + 0.1),
      ArrowDown: () => setVol(volume - 0.1),
      m: toggleMute,
      f: toggleFullscreen,
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
      poke();
    }
  };

  const pct = duration ? (current / duration) * 100 : 0;
  const VolIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      ref={wrapRef}
      role="region"
      aria-label={`Video player: ${source.title}`}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerMove={poke}
      className={cn("relative h-dvh min-h-[560px] w-full overflow-hidden bg-[#0b0614] outline-none select-none", !chrome && "cursor-none")}
    >
      <video
        ref={videoRef}
        src={source.src}
        poster={source.poster}
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-cover"
        onClick={toggle}
        onPlay={() => {
          setPlaying(true);
          poke();
        }}
        onPause={() => {
          setPlaying(false);
          setChrome(true);
          persist(true);
        }}
        onTimeUpdate={(e) => {
          setCurrent(e.currentTarget.currentTime);
          persist();
        }}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
        onProgress={(e) => {
          const b = e.currentTarget.buffered;
          if (b.length) setBuffered(b.end(b.length - 1));
        }}
        onEnded={() => persist(true)}
        onError={() => setError(true)}
      />
      {/* poster stays visible until playback starts (matches the artboard) */}
      {!playing && current < 0.5 && (
        <Image src={source.poster} alt="" fill loading="eager" sizes="100vw" quality={90} className="pointer-events-none object-cover" />
      )}

      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(8_4_18/0.55)_0%,transparent_18%,transparent_62%,rgb(12_7_24/0.72)_86%,rgb(12_7_24/0.9)_100%)] transition-opacity duration-500",
          chrome ? "opacity-100" : "opacity-0",
        )}
      />

      {/* top bar */}
      <div className={cn("absolute inset-x-0 top-0 flex items-center gap-4 p-5 transition-opacity duration-500 md:px-[72px] md:pt-8", chrome ? "opacity-100" : "pointer-events-none opacity-0")}>
        <Link href={source.backHref} aria-label="Back" className="grid size-11 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50">
          <ArrowLeft className="size-5" />
        </Link>
        <p className="truncate text-sm font-medium text-white/80">Now Playing — {source.title}</p>
      </div>

      {error && (
        <div role="alert" className="absolute top-1/2 left-1/2 w-[min(420px,90%)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/70 p-6 text-center backdrop-blur">
          <p className="font-semibold">This video can’t be played right now.</p>
          <p className="mt-1 text-sm text-white/70">Check your connection and try again.</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-lilac px-4 py-2 text-sm font-semibold text-[#3c0e7a]"
            onClick={() => {
              setError(false);
              v()?.load();
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* controls */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 px-5 pb-6 transition-[opacity,transform] duration-500 md:px-[72px] md:pb-[82px]",
          chrome ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        {/* scrubber */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(current)}
          aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            scrubTo(e);
          }}
          onPointerMove={(e) => e.buttons === 1 && scrubTo(e)}
          className="group relative flex h-5 cursor-pointer items-center"
        >
          <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-white/[0.14]">
            <div className="absolute inset-y-0 left-0 bg-white/10" style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-lilac/80" style={{ width: `${pct}%` }} />
          </div>
          <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-lilac shadow transition-transform group-hover:scale-100" style={{ left: `${pct}%` }} />
        </div>
        <div className="mt-[13px] flex justify-between text-sm leading-5 text-[#cfc7dc] tabular-nums">
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="mt-6 grid items-center gap-6 md:mt-[34px] md:grid-cols-[1fr_auto_1fr] lg:grid-cols-[423px_200px_278px]">
          <div className="flex min-w-0 items-center gap-[31px]">
            <Image src={source.creatorAvatar} alt="" width={68} height={68} className="hidden size-[68px] shrink-0 rounded-full object-cover sm:block" />
            <div className="min-w-0">
              <h1 className="max-w-[330px] text-2xl leading-[40px] font-bold tracking-[-0.01em] text-[#ece2ff] md:text-[36px]">{source.title}</h1>
              <p className="mt-[2px] text-lg leading-6 text-lilac">by {source.creatorName}</p>
            </div>
          </div>

          <div className="flex h-[86px] w-[200px] items-center justify-between justify-self-center rounded-[24px] border border-white/10 bg-white/[0.03] px-[26px] backdrop-blur-md">
            <SkipLink href={source.prevHref} label="Previous episode">
              <SkipBack className="size-[18px]" />
            </SkipLink>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="grid h-[66px] w-[62px] place-items-center rounded-full bg-lilac text-[#3d0a8f] shadow-[0_8px_26px_-6px_rgb(208_188_255/0.65)] transition hover:scale-105"
            >
              {playing ? <Pause className="size-6 fill-current" /> : <Play className="ml-1 size-6 fill-current" />}
            </button>
            <SkipLink href={source.nextHref} label="Next episode">
              <SkipForward className="size-[18px]" />
            </SkipLink>
          </div>

          <div className="flex h-[60px] items-center gap-4 justify-self-center rounded-[20px] border border-white/10 bg-white/[0.03] px-5 backdrop-blur-md md:justify-self-start lg:w-[278px]">
            <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="text-[#e6dcf7] hover:text-white">
              <VolIcon className="size-6" />
            </button>
            <label className="sr-only" htmlFor="ci-volume">
              Volume
            </label>
            <input
              id="ci-volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => setVol(Number(e.target.value))}
              className="h-[5px] w-[90px] cursor-pointer appearance-none rounded-full bg-[#453e50] accent-lilac [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-lilac [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:opacity-0 hover:[&::-webkit-slider-thumb]:opacity-100 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-lilac"
              style={{ background: `linear-gradient(90deg,#d0bcff ${(muted ? 0 : volume) * 100}%,#453e50 ${(muted ? 0 : volume) * 100}%)` }}
            />
            <span aria-hidden className="h-[26px] w-px bg-white/10" />
            <label className="sr-only" htmlFor="ci-quality">
              Quality
            </label>
            <select
              id="ci-quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value as (typeof QUALITIES)[number])}
              className="w-12 cursor-pointer appearance-none bg-transparent text-center text-base tracking-[0.06em] text-lilac focus:outline-none"
            >
              {QUALITIES.map((q) => (
                <option key={q} value={q} className="bg-[#1a1226] text-white">
                  {q}
                </option>
              ))}
            </select>
            <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit full screen" : "Full screen"} className="text-[#e6dcf7] hover:text-white">
              {fullscreen ? <Minimize className="size-[22px]" /> : <Maximize className="size-[22px]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkipLink({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  const cls = "grid size-9 place-items-center rounded-full text-[#a79fb5] transition-colors hover:text-white";
  if (!href)
    return (
      <span aria-hidden className={cn(cls, "opacity-40")}>
        {children}
      </span>
    );
  return (
    <Link href={href} aria-label={label} className={cls}>
      {children}
    </Link>
  );
}
