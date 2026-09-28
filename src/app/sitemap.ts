import type { MetadataRoute } from "next";
import { listGenres, listTitles } from "@/lib/api/catalog";
import { legalDocs } from "@/lib/data/legal";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [titles, genres] = await Promise.all([listTitles(), listGenres()]);
  const now = new Date();
  return [
    ...["", "/creators", "/pricing", "/support", "/categories"].map((p) => ({ url: `${site}${p}`, lastModified: now })),
    ...genres.map((g) => ({ url: `${site}/categories/${g.slug}`, lastModified: now })),
    ...titles.map((t) => ({ url: `${site}/title/${t.slug}`, lastModified: new Date(t.publishedAt) })),
    ...legalDocs.map((d) => ({ url: `${site}/legal/${d.slug}`, lastModified: new Date(d.updated) })),
  ];
}
