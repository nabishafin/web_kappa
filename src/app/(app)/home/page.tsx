import type { Metadata } from "next";
import { GenreChips } from "@/components/home/genre-chips";
import { HomeHero } from "@/components/home/home-hero";
import { ContinueWatchingRow, TrendingSection } from "@/components/home/home-rows";
import { CollectiveCard, SpotlightCard } from "@/components/home/spotlight";
import { getContinueWatching, getCreator, getFeatured, getTitle, getTrending } from "@/lib/api/catalog";

export const metadata: Metadata = { title: "Home" };

export default async function HomePage() {
  const [featured, trending, continueWatching, spotlight] = await Promise.all([
    getFeatured(),
    getTrending(),
    getContinueWatching(),
    getTitle("canyon-heights"),
  ]);
  const spotlightCreator = spotlight ? await getCreator(spotlight.creatorId) : null;

  return (
    <div className="bg-[#03010e] pb-24 md:pb-[140px]">
      <HomeHero slides={featured} />
      <div className="mt-10 md:mt-[56px]">
        <GenreChips />
      </div>
      <ContinueWatchingRow items={continueWatching.slice(0, 2)} />
      <TrendingSection titles={trending} />
      {spotlight && (
        <section aria-label="Spotlight" className="container-ci mt-10 grid gap-[26px] lg:grid-cols-[minmax(0,817fr)_minmax(0,397fr)]">
          <SpotlightCard title={spotlight} creator={spotlightCreator ?? undefined} />
          <CollectiveCard />
        </section>
      )}
    </div>
  );
}
