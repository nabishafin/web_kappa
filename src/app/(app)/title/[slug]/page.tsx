import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { EpisodeList, RelatedGrid, SeriesTabs, TitleDetails } from "@/components/title/title-panels";
import { CreatorBadge, RatingStars, ReportTrigger, SupportTrigger, WatchlistToggle } from "@/components/title/title-interactive";
import { buttonClass } from "@/components/ui/button";
import { PlaySquareIcon } from "@/components/ui/play-square-icon";
import { getCreator, getRelated, getTitle, listTitles } from "@/lib/api/catalog";
import type { Creator, Title } from "@/lib/types";

export async function generateStaticParams() {
  return (await listTitles()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/title/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const title = await getTitle(slug);
  if (!title) return { title: "Not found" };
  return {
    title: title.title,
    description: title.synopsis,
    openGraph: {
      title: title.title,
      description: title.synopsis,
      images: [{ url: title.backdrop ?? title.thumbnail }],
    },
  };
}

function TitleHeading({ title }: { title: Title }) {
  return (
    <h1 className="max-w-[300px] text-[28px] leading-[34px] font-semibold tracking-[-0.005em] text-[#c799ff] uppercase sm:text-[32px] sm:leading-[39px]">
      {title.title}
    </h1>
  );
}

function WatchNow({ title, className }: { title: Title; className?: string }) {
  return (
    <Link
      href={`/watch/${title.slug}`}
      className={buttonClass({
        size: "lg",
        className: `gap-3 rounded-[12px] ${className ?? ""}`,
      })}
    >
      <PlaySquareIcon className="size-[26px]" /> Watch Now
    </Link>
  );
}

/* ---------------------------------------------------------------- series (D13) */
function SeriesLayout({ title, creator, related }: { title: Title; creator?: Creator; related: Title[] }) {
  return (
    <div className="bg-black pb-24 md:pb-[140px]">
      <div className="grid grid-cols-1 gap-8 pt-[10px] lg:grid-cols-[364px_minmax(0,1fr)] lg:gap-[39px] lg:pl-[37px]">
        <div className="order-2 min-w-0 px-5 sm:px-8 lg:order-1 lg:px-0">
          {creator && <CreatorBadge creator={creator} />}
          <div className="mt-10">
            <TitleHeading title={title} />
          </div>
          <ul className="mt-10 flex gap-2 sm:gap-3" aria-label="Title information">
            {[title.maturity, ...title.badges].map((b, i) => (
              <li
                key={b}
                className={`surface-secondary grid h-[52px] place-items-center rounded-[12px] text-xl font-medium text-white sm:h-[61px] sm:text-2xl ${i === 0 ? "w-[108px] sm:w-[124px]" : "w-[84px] sm:w-[100px]"}`}
              >
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-[31px] flex gap-[34px] text-2xl leading-8 font-medium text-white lg:pl-[103px]">
            <span>{title.year}</span>
            <span>
              {title.seasons ?? 1} Season{(title.seasons ?? 1) > 1 ? "s" : ""}
            </span>
          </p>
          <div className="mt-[43px] flex items-center gap-[29px]">
            <WatchNow title={title} className="w-[208px]" />
            <WatchlistToggle slug={title.slug} />
          </div>
          <div className="mt-[44px]">
            <SupportTrigger titleName={title.title} variant="button" />
          </div>
        </div>
        <ViewTransition name={`art-${title.slug}`} share="morph" default="none">
          <div className="relative order-1 aspect-[1000/606] w-full lg:order-2">
            <Image
              src={title.backdrop ?? title.thumbnail}
              alt={`${title.title} key art`}
              fill
              quality={90}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 1000px, 100vw"
              className="object-cover"
            />
          </div>
        </ViewTransition>
      </div>
      <div className="mt-6 px-5 sm:px-8 lg:pl-[37px]">
        <SeriesTabs title={title} creator={creator} related={related} tagline={title.tagline ?? `Follow ${title.title}`} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- film (D17) */
function FilmLayout({ title, creator, related }: { title: Title; creator?: Creator; related: Title[] }) {
  return (
    <div className="bg-black pb-24 md:pb-[140px]">
      <div className="grid grid-cols-1 gap-8 px-5 pt-[10px] sm:px-8 lg:grid-cols-[minmax(0,844px)_400px] lg:justify-between lg:gap-[60px] lg:px-[68px]">
        <ViewTransition name={`art-${title.slug}`} share="morph" default="none">
          <div className="relative aspect-[844/511] w-full overflow-hidden rounded-[24px]">
            <Image
              src={title.backdrop ?? title.thumbnail}
              alt={`${title.title} key art`}
              fill
              quality={90}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 844px, 100vw"
              className="object-cover"
            />
          </div>
        </ViewTransition>
        <div className="min-w-0">
          {creator && <CreatorBadge creator={creator} />}
          <div className="mt-[45px]">
            <TitleHeading title={title} />
          </div>
          <div className="mt-[44px] flex flex-wrap items-center gap-4">
            <WatchNow title={title} className="w-[233px]" />
            <div className="flex items-center">
              <WatchlistToggle slug={title.slug} variant="bookmark" />
              <SupportTrigger titleName={title.title} variant="jar" />
              <ReportTrigger titleName={title.title} />
            </div>
          </div>
          <RatingStars slug={title.slug} className="mt-[42px]" />
          <p className="mt-[17px] text-lg leading-7 text-[#f1ecf7]">Episodes, details and recommendations below</p>
        </div>
      </div>

      <div className="px-5 sm:px-8 lg:px-[68px]">
        <section aria-labelledby="details-heading" className="mt-9">
          <h2 id="details-heading" className="text-2xl leading-8 font-semibold">
            Episodes &amp; Details
          </h2>
          <div className="mt-3">{title.episodes?.length ? <EpisodeList title={title} /> : <TitleDetails title={title} creator={creator} />}</div>
        </section>
        <section aria-labelledby="related-heading" className="mt-[29px]">
          <h2 id="related-heading" className="text-2xl leading-8 font-semibold">
            More like this
          </h2>
          <div className="mt-6">
            <RelatedGrid titles={related} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default async function TitlePage({ params }: PageProps<"/title/[slug]">) {
  const { slug } = await params;
  const title = await getTitle(slug);
  if (!title) notFound();
  const [creator, related] = await Promise.all([getCreator(title.creatorId), getRelated(slug)]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": title.kind === "series" ? "TVSeries" : "Movie",
    name: title.title,
    description: title.synopsis,
    image: title.backdrop ?? title.thumbnail,
    datePublished: title.publishedAt,
    contentRating: title.maturity,
    creator: creator ? { "@type": "Organization", name: creator.name } : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: title.rating,
      bestRating: 5,
      ratingCount: Math.round(title.views / 100),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {title.kind === "series" ? (
        <SeriesLayout title={title} creator={creator ?? undefined} related={related} />
      ) : (
        <FilmLayout title={title} creator={creator ?? undefined} related={related} />
      )}
    </>
  );
}
