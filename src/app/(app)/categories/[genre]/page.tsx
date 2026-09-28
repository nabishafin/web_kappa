import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import { TitleBrowser } from "@/components/browse/title-browser";
import { getGenre, listByGenre, listGenres } from "@/lib/api/catalog";

export async function generateStaticParams() {
  return (await listGenres()).map((g) => ({ genre: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categories/[genre]">): Promise<Metadata> {
  const { genre } = await params;
  const g = await getGenre(genre);
  return g ? { title: `${g.name} animations`, description: g.description } : { title: "Not found" };
}

export default async function GenrePage({ params }: PageProps<"/categories/[genre]">) {
  const { genre } = await params;
  const g = await getGenre(genre);
  if (!g) notFound();
  const titles = await listByGenre(g.slug);

  return (
    <div className="bg-[#03010e] pt-12 pb-24 md:pt-[60px] md:pb-[140px]">
      <div className="container-ci">
        <nav aria-label="Breadcrumb">
          <Link href="/categories" className="inline-flex items-center gap-1 text-sm text-lilac hover:underline">
            <ChevronLeft aria-hidden className="size-4" /> All categories
          </Link>
        </nav>
        <h1 className="mt-4 font-display text-[40px] leading-[1.1] font-bold tracking-[-0.01em] md:text-[48px]">{g.name}</h1>
        <p className="mt-3 max-w-[720px] font-display text-lg leading-7 font-light text-haze">{g.description}</p>
        <div className="mt-10">
          <Suspense>
            <TitleBrowser titles={titles} emptyText={`No ${g.name.toLowerCase()} animations yet — check back soon.`} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
