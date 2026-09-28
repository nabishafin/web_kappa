"use client";

import Image from "next/image";
import { Bookmark, Check, Flag, Plus, Star } from "lucide-react";
import { useId, useState } from "react";
import { DonateIcon, JarIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { SupportPanel } from "@/components/title/support-panel";
import { actions, useAppState } from "@/lib/store";
import type { Creator } from "@/lib/types";
import { cn, sleep } from "@/lib/utils";

/* ------------------------------------------------------------------ */
export function CreatorBadge({ creator, className }: { creator: Creator; className?: string }) {
  const following = useAppState((s) => s.following).includes(creator.id);
  return (
    <div className={cn("flex h-[81px] items-center gap-3 rounded-[16px] border border-white/[0.09] bg-[#1e1a22] pr-4 pl-[17px]", className)}>
      <Image src={creator.avatar} alt="" width={48} height={48} className="size-12 shrink-0 rounded-full object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base leading-5 font-semibold text-[#f2edf8]">{creator.name}</p>
        <p className="mt-[3px] truncate text-xs leading-4 tracking-[0.04em] text-[#c9c0d6]">{creator.headline}</p>
      </div>
      <button
        type="button"
        aria-pressed={following}
        onClick={() => actions.toggleFollow(creator.id)}
        className={cn(
          "h-[30px] shrink-0 rounded-full border px-3 text-xs font-medium tracking-[0.1em] uppercase transition-colors",
          following ? "border-lilac/60 bg-lilac/15 text-lilac" : "border-white/15 bg-[#2b272f] text-white hover:bg-[#37323c]",
        )}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function WatchlistToggle({ slug, variant = "plus" }: { slug: string; variant?: "plus" | "bookmark" }) {
  const saved = useAppState((s) => s.watchlist).includes(slug);
  const label = saved ? "Remove from watchlist" : "Add to watchlist";
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={label}
      title={label}
      onClick={() => actions.toggleWatchlist(slug)}
      className="grid size-[52px] place-items-center rounded-full text-white transition-colors hover:bg-white/10"
    >
      {variant === "bookmark" ? (
        <Bookmark className={cn("h-10 w-9", saved && "fill-white")} strokeWidth={1.9} />
      ) : saved ? (
        <Check className="size-10" strokeWidth={2.6} />
      ) : (
        <Plus className="size-10 text-[#e8e8e8]" strokeWidth={2.6} />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
export function SupportTrigger({ titleName, variant }: { titleName: string; variant: "button" | "jar" }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  return (
    <>
      {variant === "button" ? (
        <Button variant="secondary" size="lg" onClick={() => setOpen(true)} className="w-[208px] gap-2 rounded-[12px]">
          <DonateIcon className="size-6 text-[#d9c6ff]" /> donation
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Tip the creator (TipJar)"
          title="TipJar"
          className="grid size-[52px] place-items-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <JarIcon className="h-[39px] w-[34px]" />
        </button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} labelledBy={titleId} className="max-w-[670px]">
        <SupportPanel titleName={titleName} onClose={() => setOpen(false)} />
      </Dialog>
    </>
  );
}

/* ------------------------------------------------------------------ */
const reasons = ["Inappropriate content", "Copyright infringement", "Wrong age rating", "Playback problem", "Something else"];

export function ReportTrigger({ titleName }: { titleName: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const id = useId();
  const close = () => {
    setOpen(false);
    setState("idle");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Report this title"
        title="Report"
        className="grid size-[52px] place-items-center rounded-full text-white transition-colors hover:bg-white/10"
      >
        <Flag className="size-10" strokeWidth={1.9} />
      </button>
      <Dialog open={open} onClose={close} labelledBy={id} className="max-w-[480px]">
        <div className="border-glow relative rounded-[24px] bg-[#1d142a] p-8">
          <DialogClose onClick={close} className="absolute top-4 right-4" />
          {state === "done" ? (
            <div aria-live="polite" className="py-4 text-center">
              <h2 id={id} className="text-2xl font-bold">
                Report received
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">Thanks for helping keep Channel Infinity safe. Our moderation team will review it shortly.</p>
              <Button onClick={close} variant="secondary" className="mt-6 w-40">
                Done
              </Button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setState("sending");
                await sleep(700);
                setState("done");
              }}
            >
              <h2 id={id} className="pr-8 text-2xl font-bold">
                Report “{titleName}”
              </h2>
              <fieldset className="mt-5 space-y-2">
                <legend className="mb-2 text-sm text-white/70">What’s the problem?</legend>
                {reasons.map((r) => (
                  <label key={r} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm transition-colors hover:bg-white/5 has-[:checked]:border-lilac/60 has-[:checked]:bg-lilac/10">
                    <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="size-4 accent-[#a30ce8]" />
                    {r}
                  </label>
                ))}
              </fieldset>
              <Button type="submit" block loading={state === "sending"} className="mt-6">
                Submit report
              </Button>
            </form>
          )}
        </div>
      </Dialog>
    </>
  );
}

/* ------------------------------------------------------------------ */
export function RatingStars({ slug, className }: { slug: string; className?: string }) {
  const value = useAppState((s) => s.ratings[slug] ?? 0);
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className={cn("flex items-center gap-5", className)}>
      <span id={`rate-${slug}`} className="text-lg text-[#f1ecf7]">
        Rate this content:
      </span>
      <div role="radiogroup" aria-labelledby={`rate-${slug}`} className="flex" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => actions.rate(slug, n)}
            className="grid size-[18px] place-items-center"
          >
            <Star
              className={cn(
                "size-3 text-[#facc15] transition-transform",
                // unrated → all stars lit (as designed); rated/hovering → highlight up to n
                !shown || n <= shown ? "fill-[#facc15]" : "fill-[#facc15]/20",
                hover === n && "scale-125",
              )}
              strokeWidth={0}
            />
          </button>
        ))}
      </div>
      {value > 0 && <span className="text-sm text-white/60">Thanks for rating!</span>}
    </div>
  );
}
