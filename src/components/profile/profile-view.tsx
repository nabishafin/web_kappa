"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Bookmark, BookmarkX, Crown, Mail, Pencil, Play, Search, Trash2, UserCheck, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { PlaySquareIcon } from "@/components/ui/play-square-icon";
import { actions, useAppState, useHydrated } from "@/lib/store";
import type { ContinueWatchingItem, Creator, Title } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "follow" | "watchlist";

const TABS = [
  { id: "follow", label: "Follow creator", className: "" },
  { id: "watchlist", label: "Watchlist", className: "uppercase" },
] as const;

/* ------------------------------------------------------------------ */
function ProfileBand({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const hydrated = useHydrated();
  const user = useAppState((s) => s.user);
  const ready = hydrated && user;
  const avatar = (ready && user.avatar) || "/images/avatars/blossom-pink.webp";
  const premium = ready && user.plan === "premium";

  return (
    <section aria-label="Profile" className="mt-3 bg-[#080b1c]">
      <div className="container-ci pt-7 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative size-[120px] shrink-0 overflow-hidden rounded-full md:size-[156px]">
            <Image src={avatar} alt="" fill sizes="156px" className="object-cover" loading="eager" />
          </div>
          <div className="min-w-0 flex-1 sm:pt-[35px] sm:pl-3">
            <h1 className={cn("text-[28px] leading-9 font-semibold tracking-[-0.01em] text-white", !ready && "skeleton h-9 w-40 rounded-lg")}>
              {ready ? user.displayName : ""}
            </h1>
            <p className="mt-[9px] flex items-center gap-[6px] text-base leading-6 text-[#cfd0dc]">
              <Mail aria-hidden className="size-4 text-[#cfd0dc]" strokeWidth={1.6} />
              <span className="truncate">{ready ? user.email : " "}</span>
            </p>
            <span className="mt-[15px] inline-flex h-[25px] items-center gap-1 rounded-full border border-[#403d5b] bg-[#1c1d32] px-[12px] text-xs font-semibold tracking-[0.05em] text-[#c6c3e0]">
              {premium && <Crown aria-hidden className="size-3 text-lilac" />}
              {premium ? "Premium" : "Free user"}
            </span>
          </div>
          <ButtonLink href="/profile/edit" size="lg" className="h-[61px] w-[173px] gap-[6px] rounded-[10px] px-2 text-2xl sm:mt-[35px]">
            <Pencil aria-hidden className="size-5 shrink-0" strokeWidth={2} /> Edit Profile
          </ButtonLink>
        </div>

        <div role="tablist" aria-label="Profile sections" className="mt-[53px] flex gap-8 pb-[31px]">
          {TABS.map(({ id, label, className }) => (
            <button
              key={id}
              id={`ptab-${id}`}
              type="button"
              role="tab"
              aria-selected={tab === id}
              aria-controls={`ppanel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => onTab(id)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") onTab(tab === "follow" ? "watchlist" : "follow");
              }}
              className={cn(
                "relative pb-[6px] text-[15px] leading-5 tracking-[0.01em] text-white transition-opacity",
                className,
                tab === id ? "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[#1d4ed8]" : "opacity-90 hover:opacity-100",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function CreatorTile({ creator }: { creator: Creator }) {
  const following = useAppState((s) => s.following).includes(creator.id);
  return (
    <li data-reveal data-spotlight className="border-glow group relative rounded-[8px] bg-[linear-gradient(180deg,#060315_0%,#060419_50%,#0c1934_100%)] px-[23px] pt-[25px] pb-[27px] [--glow:linear-gradient(180deg,#9b3be0,#5a33b0_60%,#7a4ae0)]">
      <div className="flex items-center gap-4">
        <Image src={creator.avatar} alt="" width={64} height={64} className="size-16 shrink-0 rounded-full object-cover" />
        <p className="min-w-0 flex-1 truncate text-xl leading-7 text-white">{creator.handle}</p>
        <button
          type="button"
          aria-pressed={following}
          aria-label={following ? `Unfollow ${creator.handle}` : `Follow ${creator.handle}`}
          onClick={() => actions.toggleFollow(creator.id)}
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full border transition",
            following
              ? "border-lilac/60 bg-lilac/15 text-lilac"
              : "border-white/10 text-white/60 hover:border-white/30 hover:text-white md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
          )}
        >
          {following ? <UserCheck className="size-4" /> : <UserPlus className="size-4" />}
        </button>
      </div>
      <dl className="mt-[9px] grid grid-cols-[120px_120px] gap-x-[14px] text-center">
        {[
          ["Animation", creator.animations],
          ["Followers", creator.followers + (following ? 1 : 0)],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col-reverse">
            <dt className="text-sm leading-5 tracking-[0.04em] text-[#a3a7b8] uppercase">{label}</dt>
            <dd className="text-base leading-6 font-bold text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

function FollowTab({ creators }: { creators: Creator[] }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? creators.filter((c) => (c.handle + c.name).toLowerCase().includes(t)) : creators;
  }, [creators, q]);

  return (
    <>
      <div className="pt-[126px] max-md:pt-12">
        <h2 className="text-[32px] leading-[44px] font-bold tracking-[-0.01em] text-white md:text-[40px]">Creators</h2>
        <p className="mt-[9px] text-lg leading-7 text-[#a0a0b0]">Active Creators in the community</p>
      </div>
      <div className="relative mt-9 ml-auto w-full md:w-[469px]">
        <label htmlFor="creator-search" className="sr-only">
          Search creators
        </label>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#9a9aae]" strokeWidth={1.6} />
        <input
          id="creator-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search......."
          className="h-[43px] w-full rounded-[12px] border border-[#2c2b40] bg-[#1e1e32] pr-4 pl-12 text-sm text-white placeholder:text-[#9a9aae] placeholder:opacity-100 focus:border-brand/60 focus:outline-none"
        />
      </div>
      {list.length ? (
        <ul data-reveal-group className="mt-[31px] grid gap-[25px] sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CreatorTile key={c.id} creator={c} />
          ))}
        </ul>
      ) : (
        <p className="mt-16 text-center text-white/60">No creators match “{q}”.</p>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
function WatchlistTab({ titles, history }: { titles: Title[]; history: (ContinueWatchingItem & { title: Title })[] }) {
  const hydrated = useHydrated();
  const watchlist = useAppState((s) => s.watchlist);
  const cleared = useAppState((s) => s.historyCleared);
  const progress = useAppState((s) => s.progress);
  const [showAll, setShowAll] = useState(false);
  const bySlug = useMemo(() => new Map(titles.map((t) => [t.slug, t])), [titles]);
  const saved = hydrated ? (watchlist.map((s) => bySlug.get(s)).filter(Boolean) as Title[]) : [];
  const visible = showAll ? saved : saved.slice(0, 4);
  const rows = (cleared ? history.filter((h) => progress[h.slug]) : history).slice(2);

  return (
    <>
      <section aria-labelledby="wl-heading" className="pt-[70px] max-md:pt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 id="wl-heading" className="flex items-center gap-[10px] text-[28px] leading-9 font-semibold tracking-[-0.01em] text-white">
            <Bookmark aria-hidden className="size-[18px] fill-[#dbb8ff] text-[#dbb8ff]" />
            My Watchlist
          </h2>
          {saved.length > 4 && (
            <button type="button" onClick={() => setShowAll((v) => !v)} className="text-sm tracking-[0.02em] text-lilac hover:underline">
              {showAll ? "Show less" : "View All"}
            </button>
          )}
          {saved.length <= 4 && saved.length > 0 && (
            <Link href="/categories" className="text-sm tracking-[0.02em] text-lilac hover:underline">
              View All
            </Link>
          )}
        </div>
        {visible.length ? (
          <ul data-reveal-group className="mt-[23px] grid gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((t) => (
              <li key={t.slug} data-reveal data-spotlight className="group relative overflow-hidden rounded-[12px] border border-[#282729] bg-[#1c1b1d]">
                <div className="relative aspect-[296/118] overflow-hidden">
                  <Image src={t.thumbnail} alt="" fill sizes="(min-width: 1024px) 296px, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <button
                    type="button"
                    onClick={() => actions.toggleWatchlist(t.slug)}
                    aria-label={`Remove ${t.title} from watchlist`}
                    className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/60 text-white/80 backdrop-blur transition hover:text-white md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                  >
                    <BookmarkX className="size-4" />
                  </button>
                </div>
                <div className="px-4 pt-[19px] pb-[17px]">
                  <h3 className="truncate text-lg leading-6 text-white">
                    <Link href={`/title/${t.slug}`} className="hover:text-lilac">
                      {t.title}
                    </Link>
                  </h3>
                  <ButtonLink href={`/watch/${t.slug}`} size="lg" block className="mt-[17px] h-[62px] gap-3 rounded-[10px] text-2xl">
                    <PlaySquareIcon className="size-[22px]" /> Watch Now
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-[12px] border border-dashed border-white/10 p-10 text-center text-white/60">
            {hydrated ? "Your watchlist is empty. Tap the + on any title to save it for later." : " "}
          </div>
        )}
      </section>

      <section aria-labelledby="cw-profile-heading" className="mt-[66px]">
        <div className="flex items-center justify-between gap-4">
          <h2 id="cw-profile-heading" className="text-[28px] leading-10 font-medium tracking-[-0.01em] text-white md:text-[32px]">
            Continue Watching
          </h2>
          {rows.length > 0 && (
            <button type="button" onClick={() => actions.clearHistory()} className="flex items-center gap-1 text-sm tracking-[0.02em] text-[#a8a4ae] hover:text-white">
              Clear History <Trash2 aria-hidden className="size-3" />
            </button>
          )}
        </div>
        {rows.length ? (
          <ul className="mt-[22px] space-y-[18px]">
            {rows.map((h) => {
              const p = progress[h.slug] ? progress[h.slug].position / progress[h.slug].duration : h.progress;
              return (
                <li key={h.slug} className="flex flex-col gap-4 rounded-[12px] border border-white/[0.04] bg-[#17151a] p-4 sm:flex-row sm:items-center sm:gap-6">
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-[8px] sm:h-[108px] sm:w-[192px]">
                    <Image src={h.thumbnail ?? h.title.thumbnail} alt="" fill sizes="192px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 sm:pt-[11px]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-xl leading-7 font-semibold text-white">{h.heading ?? h.title.title}</h3>
                        <p className="text-base leading-6 tracking-[0.01em] text-[#a8a4ae]">{h.subtitle}</p>
                      </div>
                      <ButtonLink href={`/watch/${h.slug}`} variant="secondary" className="h-[42px] w-[161px] shrink-0 gap-2 rounded-[8px] text-base font-semibold max-sm:w-auto max-sm:px-4">
                        <Play aria-hidden className="size-5" strokeWidth={1.8} /> Resume
                      </ButtonLink>
                    </div>
                    <div
                      className="mt-[11px] h-1 overflow-hidden rounded-full bg-[#342f3b]"
                      role="progressbar"
                      aria-label="Progress"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(p * 100)}
                    >
                      <div className="h-full rounded-full bg-[#d3bbff]" style={{ width: `${p * 100}%` }} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-8 text-white/60">Nothing in progress. Start something new from Home.</p>
        )}
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
export function ProfileView({
  creators,
  titles,
  history,
}: {
  creators: Creator[];
  titles: Title[];
  history: (ContinueWatchingItem & { title: Title })[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const tab: Tab = params.get("tab") === "watchlist" ? "watchlist" : "follow";
  const setTab = (t: Tab) => router.replace(t === "follow" ? "/profile" : "/profile?tab=watchlist", { scroll: false });

  return (
    <>
      <ProfileBand tab={tab} onTab={setTab} />
      <div id={`ppanel-${tab}`} role="tabpanel" aria-labelledby={`ptab-${tab}`} className="container-ci animate-fade-in pb-24 md:pb-[140px]">
        {tab === "follow" ? <FollowTab creators={creators} /> : <WatchlistTab titles={titles} history={history} />}
      </div>
    </>
  );
}
