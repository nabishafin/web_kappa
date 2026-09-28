import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/player/video-player";
import { getCreator, getTitle, listTitles } from "@/lib/api/catalog";

/** Streaming URLs come from the media API; until then every title plays a CC-licensed sample. */
const SAMPLE_STREAM = process.env.NEXT_PUBLIC_SAMPLE_STREAM_URL ?? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

function toSeconds(d: string) {
  return d.split(":").map(Number).reduce((acc, n) => acc * 60 + n, 0);
}

export async function generateStaticParams() {
  return (await listTitles()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/watch/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTitle(slug);
  return { title: t ? `Now Playing — ${t.title}` : "Not found", robots: { index: false } };
}

export default async function WatchPage({ params, searchParams }: PageProps<"/watch/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;
  const title = await getTitle(slug);
  if (!title) notFound();
  const creator = await getCreator(title.creatorId);

  const episodes = title.episodes ?? [];
  const epId = typeof sp.ep === "string" ? sp.ep : episodes[0]?.id;
  const epIndex = Math.max(0, episodes.findIndex((e) => e.id === epId));
  const episode = episodes[epIndex];
  const startAt = typeof sp.t === "string" ? Number(sp.t) || 0 : 0;

  return (
    <VideoPlayer
      key={`${slug}-${episode?.id ?? "film"}`}
      source={{
        slug,
        title: episode ? `${title.title}: ${episode.title}` : title.title,
        creatorName: creator?.name ?? "Unknown creator",
        creatorAvatar: creator?.avatar ?? "/images/avatars/blossom-pink.webp",
        poster: episode?.thumbnail ?? title.backdrop ?? title.thumbnail,
        src: SAMPLE_STREAM,
        fallbackDuration: toSeconds(episode?.duration ?? title.duration),
        startAt,
        prevHref: episode && epIndex > 0 ? `/watch/${slug}?ep=${episodes[epIndex - 1].id}` : undefined,
        nextHref: episode && epIndex < episodes.length - 1 ? `/watch/${slug}?ep=${episodes[epIndex + 1].id}` : undefined,
        backHref: `/title/${slug}`,
      }}
    />
  );
}
