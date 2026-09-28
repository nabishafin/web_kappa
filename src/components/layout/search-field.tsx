"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Clock, CornerDownLeft, LayoutGrid, Search, UserRound, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { communityCreators, creators, genres, titles } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";

const RECENT_KEY = "ci.recent-searches";
const creatorById = new Map([...creators, ...communityCreators].map((c) => [c.id, c]));

type Suggestion =
  | { kind: "title"; key: string; label: string; meta: string; image: string; href: string }
  | { kind: "creator"; key: string; label: string; meta: string; image: string; href: string }
  | { kind: "genre"; key: string; label: string; meta: string; href: string }
  | { kind: "recent"; key: string; label: string; href: string };

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}
function pushRecent(q: string) {
  try {
    const next = [q, ...readRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}

function suggest(q: string): Suggestion[] {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  const score = (s: string) => (s.toLowerCase().startsWith(t) ? 2 : s.toLowerCase().includes(t) ? 1 : 0);
  const ts = titles
    .map((x) => ({ x, s: Math.max(score(x.title) * 2, score(x.label), score(creatorById.get(x.creatorId)?.name ?? "")) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || b.x.views - a.x.views)
    .slice(0, 5)
    .map(({ x }) => ({
      kind: "title" as const,
      key: `t-${x.slug}`,
      label: x.title,
      meta: `${x.label} · ${creatorById.get(x.creatorId)?.name ?? ""}`,
      image: x.thumbnail,
      href: `/title/${x.slug}`,
    }));
  const cs = creators
    .filter((c) => score(c.name) || score(c.handle))
    .slice(0, 2)
    .map((c) => ({ kind: "creator" as const, key: `c-${c.id}`, label: c.name, meta: `${c.animations} animations`, image: c.avatar, href: `/search?q=${encodeURIComponent(c.name)}` }));
  const gs = genres
    .filter((g) => score(g.name))
    .slice(0, 2)
    .map((g) => ({ kind: "genre" as const, key: `g-${g.slug}`, label: g.name, meta: "Category", href: `/categories/${g.slug}` }));
  return [...ts, ...cs, ...gs];
}

/** Header search with live typeahead (ARIA combobox). Focusable with ⌘K / Ctrl+K / “/”. */
export function SearchField({ className, onSubmitted }: { className?: string; onSubmitted?: () => void }) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const [q, setQ] = useState(pathname === "/search" ? (params.get("q") ?? "") : "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const wrapRef = useRef<HTMLFormElement>(null);
  const id = useId();
  const listId = `${id}-list`;

  const items: Suggestion[] = useMemo(() => {
    if (q.trim()) return suggest(q);
    return recent.map((r) => ({ kind: "recent" as const, key: `r-${r}`, label: r, href: `/search?q=${encodeURIComponent(r)}` }));
  }, [q, recent]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const go = (href: string, query?: string) => {
    if (query) pushRecent(query);
    setOpen(false);
    setActive(-1);
    router.push(href);
    onSubmitted?.();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (active >= 0 && items[active]) {
      const it = items[active];
      return go(it.href, it.kind === "recent" ? it.label : q.trim() || undefined);
    }
    const v = q.trim();
    go(v ? `/search?q=${encodeURIComponent(v)}` : "/search", v || undefined);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (items.length ? (a + 1) % items.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (items.length ? (a - 1 + items.length) % items.length : -1));
    } else if (e.key === "Escape") {
      if (open) setOpen(false);
      else (e.target as HTMLInputElement).blur();
    }
  };

  const show = open && (items.length > 0 || q.trim().length > 0);

  return (
    <form ref={wrapRef} role="search" onSubmit={submit} className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        Search animations
      </label>
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-[14px] size-5 -translate-y-1/2 text-[#8d86a0]" strokeWidth={1.6} />
      <input
        id={id}
        data-global-search
        type="search"
        role="combobox"
        aria-expanded={show}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 && items[active] ? `${id}-${items[active].key}` : undefined}
        autoComplete="off"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(-1);
          setOpen(true);
        }}
        onFocus={() => {
          setRecent(readRecent());
          setOpen(true);
        }}
        onKeyDown={onKey}
        placeholder="Search animations..."
        className="h-10 w-full rounded-full border border-transparent bg-[#1e162d] pr-4 pl-12 text-[13px] tracking-[0.06em] text-white transition-[border-color,box-shadow] placeholder:text-[#8d86a0] placeholder:opacity-100 focus:border-brand/60 focus:shadow-[0_0_0_4px_rgb(163_12_232/0.15)] focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />

      {show && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 animate-rise overflow-hidden rounded-2xl border border-white/10 bg-[#130e1e]/95 shadow-2xl shadow-black/70 backdrop-blur-xl">
          {items.length > 0 ? (
            <>
              {!q.trim() && (
                <div className="flex items-center justify-between px-4 pt-3 pb-1 text-[11px] font-semibold tracking-[0.12em] text-white/40 uppercase">
                  Recent searches
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        localStorage.removeItem(RECENT_KEY);
                      } catch {}
                      setRecent([]);
                    }}
                    className="normal-case tracking-normal text-lilac hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}
              <ul id={listId} role="listbox" aria-label="Suggestions" className="max-h-[420px] overflow-y-auto p-1.5">
                {items.map((it, i) => (
                  <li
                    key={it.key}
                    id={`${id}-${it.key}`}
                    role="option"
                    aria-selected={i === active}
                    onPointerEnter={() => setActive(i)}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      go(it.href, it.kind === "recent" ? it.label : q.trim() || undefined);
                    }}
                    className={cn("flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-colors", i === active ? "bg-white/[0.07]" : "")}
                  >
                    {it.kind === "title" && (
                      <span className="relative h-10 w-[68px] shrink-0 overflow-hidden rounded-md">
                        <Image src={it.image} alt="" fill sizes="68px" className="object-cover" />
                      </span>
                    )}
                    {it.kind === "creator" && <Image src={it.image} alt="" width={40} height={40} className="size-10 shrink-0 rounded-full object-cover" />}
                    {it.kind === "genre" && (
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lilac/10 text-lilac">
                        <LayoutGrid className="size-[18px]" />
                      </span>
                    )}
                    {it.kind === "recent" && <Clock aria-hidden className="ml-1 size-4 shrink-0 text-white/40" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-white">
                        <Highlight text={it.label} q={q} />
                      </span>
                      {"meta" in it && (
                        <span className="flex items-center gap-1 truncate text-xs text-white/45">
                          {it.kind === "creator" && <UserRound className="size-3" />}
                          {it.meta}
                        </span>
                      )}
                    </span>
                    {i === active && <CornerDownLeft aria-hidden className="size-4 shrink-0 text-white/35" />}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="px-4 py-4 text-sm text-white/55">No quick matches — press Enter to search everything.</p>
          )}
          <div className="flex items-center gap-3 border-t border-white/5 px-4 py-2 text-[11px] text-white/35">
            <span>
              <kbd className="rounded bg-white/10 px-1">↑</kbd> <kbd className="rounded bg-white/10 px-1">↓</kbd> navigate
            </span>
            <span>
              <kbd className="rounded bg-white/10 px-1">Enter</kbd> open
            </span>
            <span className="ml-auto">
              <kbd className="rounded bg-white/10 px-1">Ctrl</kbd> <kbd className="rounded bg-white/10 px-1">K</kbd> anywhere
            </span>
          </div>
        </div>
      )}

      {q && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setQ("");
            setActive(-1);
            wrapRef.current?.querySelector("input")?.focus();
          }}
          className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>
      )}
    </form>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  const t = q.trim();
  const i = t ? text.toLowerCase().indexOf(t.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-semibold text-lilac">{text.slice(i, i + t.length)}</mark>
      {text.slice(i + t.length)}
    </>
  );
}
