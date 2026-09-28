/**
 * Catalog service.
 *
 * Every function is async and returns plain serialisable data so the mock
 * implementation can be swapped for real HTTP calls (see `API_BASE_URL`)
 * without touching any UI code.
 */
import {
  communityCreators,
  continueWatchingSeed,
  creators,
  exploreSlugs,
  faqs,
  featuredSlugs,
  genres,
  plans,
  titles,
  trendingSlugs,
} from "@/lib/data/catalog";
import type { Creator, Genre, GenreSlug, Title } from "@/lib/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const bySlug = new Map(titles.map((t) => [t.slug, t]));
const creatorById = new Map([...creators, ...communityCreators].map((c) => [c.id, c]));

const pick = (slugs: string[]) => slugs.map((s) => bySlug.get(s)).filter(Boolean) as Title[];

export async function listTitles(): Promise<Title[]> {
  return titles;
}

export async function getTitle(slug: string): Promise<Title | null> {
  return bySlug.get(slug) ?? null;
}

export async function getExploreGrid(): Promise<Title[]> {
  return pick(exploreSlugs);
}

export async function getFeatured(): Promise<Title[]> {
  return pick(featuredSlugs);
}

export async function getTrending(): Promise<Title[]> {
  return pick(trendingSlugs);
}

export async function getContinueWatching() {
  return continueWatchingSeed.map((c) => ({ ...c, title: bySlug.get(c.slug)! }));
}

export async function getRelated(slug: string, limit = 8): Promise<Title[]> {
  const base = bySlug.get(slug);
  if (!base) return [];
  return titles
    .filter((t) => t.slug !== slug)
    .map((t) => ({ t, score: t.genres.filter((g) => base.genres.includes(g)).length + (t.creatorId === base.creatorId ? 1 : 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.t.views - a.t.views)
    .slice(0, limit)
    .map((x) => x.t);
}

export async function listGenres(): Promise<Genre[]> {
  return genres;
}

export async function getGenre(slug: string): Promise<Genre | null> {
  return genres.find((g) => g.slug === slug) ?? null;
}

export async function listByGenre(slug: GenreSlug): Promise<Title[]> {
  return titles.filter((t) => t.genres.includes(slug));
}

export async function searchTitles(query: string): Promise<Title[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return titles.filter((t) => {
    const c = creatorById.get(t.creatorId);
    return [t.title, t.label, t.synopsis, c?.name ?? "", ...t.genres].some((f) => f.toLowerCase().includes(q));
  });
}

export function getCreatorSync(id: string): Creator | undefined {
  return creatorById.get(id);
}

export async function getCreator(id: string): Promise<Creator | null> {
  return creatorById.get(id) ?? null;
}

export async function listCommunityCreators(): Promise<Creator[]> {
  return communityCreators;
}

export async function listFaqs() {
  return faqs;
}

export async function listPlans() {
  return plans;
}
