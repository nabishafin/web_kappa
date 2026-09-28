import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { TitleBrowser } from "@/components/browse/title-browser";
import { listGenres, searchTitles } from "@/lib/api/catalog";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: typeof q === "string" && q ? `Search: ${q}` : "Search", robots: { index: false } };
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const [results, genres] = await Promise.all([searchTitles(query), listGenres()]);

  return (
    <div className="bg-[#03010e] pt-12 pb-24 md:pt-[60px] md:pb-[140px]">
      <div className="container-ci">
        <h1 className="font-display text-[32px] leading-[1.2] font-bold md:text-[40px]">
          {query ? (
            <>
              Results for <span className="text-lilac">“{query}”</span>
            </>
          ) : (
            "Search"
          )}
        </h1>
        <p className="mt-2 text-base text-white/60">
          {query ? `${results.length} animation${results.length === 1 ? "" : "s"} found` : "Search by title, creator or genre using the bar above."}
        </p>

        {query ? (
          <div className="mt-10">
            <Suspense>
              <TitleBrowser titles={results} emptyText="No animations match your search. Try another title, creator or genre." />
            </Suspense>
          </div>
        ) : null}

        {(!query || results.length === 0) && (
          <section aria-labelledby="browse-genres" className="mt-12">
            <h2 id="browse-genres" className="text-xl font-semibold">
              Browse by genre
            </h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {genres.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/categories/${g.slug}`}
                    className="inline-flex h-11 items-center rounded-full border border-white/10 bg-white/[0.03] px-5 text-sm text-white/85 transition-colors hover:border-lilac/60 hover:text-lilac"
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
