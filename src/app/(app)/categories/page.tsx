import type { Metadata } from "next";
import { Suspense } from "react";
import { TitleBrowser } from "@/components/browse/title-browser";
import { CategoryCard } from "@/components/cards/category-card";
import { SectionHeading } from "@/components/sections/section-heading";
import { listGenres, listTitles } from "@/lib/api/catalog";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse independent animation by genre — action, adventure, comedy, drama, fantasy, sci-fi and more.",
};

export default async function CategoriesPage() {
  const [genres, titles] = await Promise.all([listGenres(), listTitles()]);
  return (
    <div className="bg-[#03010e] pt-12 pb-24 md:pt-[60px] md:pb-[140px]">
      <div className="container-ci">
        <SectionHeading
          title={<span className="text-[40px] leading-[1.1] md:text-[48px]">Categories</span>}
          description="Whether you're looking for a comedy to make you laugh, a drama to make you think, or a documentary to learn something new."
          descriptionClassName="max-w-[860px]"
        />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:mt-14 lg:grid-cols-4 lg:gap-[31px]">
          {genres.map((g) => (
            <li key={g.slug}>
              <CategoryCard genre={g} />
            </li>
          ))}
        </ul>

        <section aria-labelledby="all-heading" className="mt-20">
          <h2 id="all-heading" className="text-[28px] leading-10 font-bold md:text-[32px]">
            All animations
          </h2>
          <div className="mt-6">
            <Suspense>
              <TitleBrowser titles={titles} />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
