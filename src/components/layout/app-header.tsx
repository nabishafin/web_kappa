"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Crown, LogOut, Menu, Pencil, Settings, User, X } from "lucide-react";
import { Suspense, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Logo } from "@/components/brand/logo";
import { SearchField } from "@/components/layout/search-field";
import { notificationsSeed } from "@/lib/data/catalog";
import { actions, useAppState } from "@/lib/store";
import { cn, formatAge } from "@/lib/utils";

export type HeaderTone = "default" | "black" | "violet";

const toneBg: Record<HeaderTone, string> = {
  default: "bg-[#030213]",
  black: "bg-[#000106]",
  violet: "bg-[#0e0522]",
};

function toneFor(pathname: string): HeaderTone {
  if (pathname === "/home") return "violet";
  if (pathname.startsWith("/title/")) return "black";
  return "default";
}

const primaryNav = [
  { label: "Home", href: "/home", match: (p: string) => p === "/home" },
  { label: "Categories", href: "/categories", match: (p: string) => p.startsWith("/categories") },
];

function useDismiss(ref: RefObject<HTMLElement | null>, onDismiss: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, onDismiss, active]);
}

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const read = useAppState((s) => s.readNotifications);
  const unread = notificationsSeed.filter((n) => !n.read && !read.includes(n.id)).length;
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, close, open);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="relative grid size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/5"
      >
        <Bell className="size-[21px]" strokeWidth={1.7} />
        {unread > 0 && <span className="absolute top-[9px] right-[10px] size-2 rounded-full bg-brand ring-2 ring-[#030213]" />}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute top-full right-0 z-50 mt-3 w-[340px] max-w-[calc(100vw-32px)] animate-rise overflow-hidden rounded-2xl border border-white/10 bg-[#151020]/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <button
              type="button"
              className="text-xs text-lilac hover:underline"
              onClick={() => actions.markNotificationsRead(notificationsSeed.map((n) => n.id))}
            >
              Mark all as read
            </button>
          </div>
          <ul className="max-h-[360px] overflow-y-auto">
            {notificationsSeed.map((n) => {
              const isUnread = !n.read && !read.includes(n.id);
              const body = (
                <div className="flex gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04]">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", isUnread ? "bg-brand" : "bg-white/10")} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{n.title}</p>
                    <p className="mt-0.5 text-[13px] leading-5 text-white/60">{n.body}</p>
                    <p className="mt-1 text-[11px] tracking-wide text-white/40 uppercase">{formatAge(n.createdAt)} ago</p>
                  </div>
                </div>
              );
              return (
                <li key={n.id}>
                  {n.href ? (
                    <Link
                      href={n.href}
                      onClick={() => {
                        actions.markNotificationsRead([n.id]);
                        setOpen(false);
                      }}
                    >
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  const user = useAppState((s) => s.user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, close, open);
  const avatar = user?.avatar ?? "/images/avatars/blossom-pink.webp";

  const items = [
    { label: "My Profile", href: "/profile", Icon: User },
    { label: "Edit Profile", href: "/profile/edit", Icon: Pencil },
    { label: "Subscription", href: "/pricing", Icon: Crown },
    { label: "Settings", href: "/settings", Icon: Settings },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="block size-10 overflow-hidden rounded-full transition hover:ring-2 hover:ring-lilac/70"
      >
        <Image src={avatar} alt="" width={80} height={80} className="size-full object-cover" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-3 w-60 animate-rise overflow-hidden rounded-2xl border border-white/10 bg-[#151020]/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl"
        >
          {user && (
            <div className="border-b border-white/5 px-3 pt-2 pb-3">
              <p className="truncate text-sm font-semibold">{user.displayName}</p>
              <p className="truncate text-xs text-white/50">{user.email}</p>
            </div>
          )}
          {items.map(({ label, href, Icon }) => (
            <Link
              key={href}
              role="menuitem"
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Icon className="size-4 text-lilac" /> {label}
            </Link>
          ))}
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              actions.signOut();
              router.push("/");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-4 text-lilac" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

const drawerLinks = [
  ...primaryNav,
  { label: "My Profile", href: "/profile", match: (p: string) => p.startsWith("/profile") },
  { label: "Pricing", href: "/pricing", match: (p: string) => p === "/pricing" },
  { label: "Settings", href: "/settings", match: (p: string) => p.startsWith("/settings") },
];

function MobileDrawer({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" aria-label="Close menu" className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-[min(340px,88vw)] animate-rise flex-col gap-6 border-l border-white/10 bg-[#0b0718] p-5">
        <div className="flex items-center justify-between">
          <Logo href="/home" imgClassName="w-[110px]" />
          <button type="button" aria-label="Close menu" onClick={onClose} className="grid size-10 place-items-center rounded-full hover:bg-white/5">
            <X className="size-5" />
          </button>
        </div>
        <Suspense>
          <SearchField onSubmitted={onClose} />
        </Suspense>
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {drawerLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className={cn(
                "rounded-xl px-3 py-3 text-base transition-colors hover:bg-white/5",
                l.match(pathname) ? "bg-white/5 font-semibold text-lilac" : "text-white/85",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function AppHeader({ tone }: { tone?: HeaderTone }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const closeDrawer = useCallback(() => setDrawer(false), []);
  const t = tone ?? toneFor(pathname);

  return (
    <header className={cn("relative z-40", toneBg[t])}>
      <div className="container-ci flex h-20 items-center gap-4 md:h-40 lg:gap-0 lg:pr-[28px] lg:pl-[10px]">
        <Logo href="/home" priority />
        <Suspense fallback={<div className="ml-10 hidden h-10 max-w-[626px] flex-1 rounded-full bg-[#1e162d] lg:block" />}>
          <SearchField className="ml-10 hidden max-w-[626px] flex-1 lg:block" />
        </Suspense>
        <nav aria-label="Primary" className="ml-8 hidden items-center gap-8 lg:flex">
          {primaryNav.map((l) => {
            const active = l.match(pathname);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-[13px] tracking-[0.06em] transition-colors",
                  active
                    ? "font-semibold text-lilac after:absolute after:-inset-x-[6px] after:bottom-[1px] after:h-[2px] after:rounded-full after:bg-lilac"
                    : "text-[#dcd3ea] hover:text-white",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-[29px] lg:gap-[10px]">
          <NotificationsMenu />
          <Link
            href="/settings"
            aria-label="Settings"
            className="hidden size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/5 sm:grid"
          >
            <Settings className="size-[22px]" strokeWidth={1.7} />
          </Link>
          <div className="lg:ml-[14px]">
            <AccountMenu />
          </div>
          <button
            type="button"
            aria-label="Open menu"
            data-open-menu
            onClick={() => setDrawer(true)}
            className="grid size-10 place-items-center rounded-full hover:bg-white/5 lg:hidden"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>
      {drawer && <MobileDrawer onClose={closeDrawer} pathname={pathname} />}
    </header>
  );
}
