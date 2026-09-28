"use client";

import { useSyncExternalStore } from "react";
import { avatarOptions, communityCreators, creators, titles, watchlistSeed } from "@/lib/data/catalog";
import { toast } from "@/lib/toast";
import type { UserProfile } from "@/lib/types";

/**
 * Tiny persisted client store (session + personal library).
 * Backed by localStorage and exposed through `useSyncExternalStore`, so it is
 * hydration-safe and needs no provider. Replace the action bodies with API
 * calls when the backend is ready — the component contract stays the same.
 */

export const SESSION_COOKIE = "ci_session";
const STORAGE_KEY = "ci.state.v1";

export interface AppState {
  user: UserProfile | null;
  watchlist: string[];
  following: string[];
  ratings: Record<string, number>;
  progress: Record<string, { position: number; duration: number; updatedAt: string }>;
  readNotifications: string[];
  /** email awaiting OTP verification / password reset */
  pendingEmail: string | null;
  historyCleared: boolean;
}

const titleName = (slug: string) => titles.find((t) => t.slug === slug)?.title ?? "Title";
const creatorName = (id: string) => [...creators, ...communityCreators].find((c) => c.id === id)?.handle ?? "creator";

const initialState: AppState = {
  user: null,
  watchlist: [],
  following: [],
  ratings: {},
  progress: {},
  readNotifications: [],
  pendingEmail: null,
  historyCleared: false,
};

let state: AppState = initialState;
let hydrated = false;
const listeners = new Set<() => void>();

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...initialState, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch {
    /* storage unavailable (private mode) — keep in-memory state */
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / privacy errors */
  }
}

function setState(updater: (s: AppState) => AppState) {
  load();
  state = updater(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      hydrated = false;
      load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

const getServerSnapshot = () => initialState;

/** Selectors must return stable references (a field, not a derived array). */
export function useAppState<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getServerSnapshot()),
  );
}

/** true once the client store has been read (avoids auth flicker) */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

function setSessionCookie(on: boolean) {
  if (typeof document === "undefined") return;
  document.cookie = on
    ? `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
    : `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */
export const actions = {
  signIn(email: string, displayName?: string) {
    const name = displayName ?? email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setState((s) => ({
      ...s,
      user: s.user?.email === email
        ? s.user
        : {
            id: crypto.randomUUID(),
            email,
            displayName: name || "Rokey",
            avatar: avatarOptions[1].src,
            plan: "free",
            emailVerified: true,
          },
      watchlist: s.watchlist.length ? s.watchlist : watchlistSeed,
    }));
    setSessionCookie(true);
    toast.success(`Welcome, ${state.user?.displayName ?? "creator"}!`, { description: "Pick up where you left off or discover something new." });
  },
  signOut() {
    setState((s) => ({ ...s, user: null }));
    setSessionCookie(false);
  },
  updateProfile(patch: Partial<Pick<UserProfile, "displayName" | "avatar" | "plan" | "emailVerified">>) {
    setState((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s));
  },
  toggleWatchlist(slug: string, { silent = false } = {}) {
    load();
    const had = state.watchlist.includes(slug);
    setState((s) => ({
      ...s,
      watchlist: had ? s.watchlist.filter((x) => x !== slug) : [slug, ...s.watchlist],
    }));
    if (!silent)
      toast(had ? "Removed from your watchlist" : "Added to your watchlist", {
        tone: had ? "default" : "success",
        description: titleName(slug),
        action: { label: "Undo", onClick: () => actions.toggleWatchlist(slug, { silent: true }) },
      });
  },
  toggleFollow(creatorId: string, { silent = false } = {}) {
    load();
    const had = state.following.includes(creatorId);
    setState((s) => ({
      ...s,
      following: had ? s.following.filter((x) => x !== creatorId) : [...s.following, creatorId],
    }));
    if (!silent)
      toast(had ? `Unfollowed ${creatorName(creatorId)}` : `You’re following ${creatorName(creatorId)}`, {
        tone: had ? "default" : "success",
        description: had ? undefined : "New releases will show up in your notifications.",
        action: { label: "Undo", onClick: () => actions.toggleFollow(creatorId, { silent: true }) },
      });
  },
  rate(slug: string, stars: number) {
    setState((s) => ({ ...s, ratings: { ...s.ratings, [slug]: stars } }));
    toast.success(`You rated ${titleName(slug)} ${"★".repeat(stars)}`, { description: "Thanks — ratings help independent creators get discovered." });
  },
  saveProgress(slug: string, position: number, duration: number) {
    setState((s) => ({ ...s, progress: { ...s.progress, [slug]: { position, duration, updatedAt: new Date().toISOString() } } }));
  },
  clearHistory() {
    load();
    const prev = { progress: state.progress, historyCleared: state.historyCleared };
    setState((s) => ({ ...s, progress: {}, historyCleared: true }));
    toast("Watch history cleared", { action: { label: "Undo", onClick: () => setState((s) => ({ ...s, ...prev })) } });
  },
  markNotificationsRead(ids: string[]) {
    setState((s) => ({ ...s, readNotifications: Array.from(new Set([...s.readNotifications, ...ids])) }));
  },
  setPendingEmail(email: string | null) {
    setState((s) => ({ ...s, pendingEmail: email }));
  },
};

export type Actions = typeof actions;
