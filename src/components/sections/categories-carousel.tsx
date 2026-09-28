"use client";

import { CategoryCard } from "@/components/cards/category-card";
import { CarouselTrack, PagerControl, useCarousel } from "@/components/ui/carousel";
import { SectionHeading } from "@/components/sections/section-heading";
import type { Genre } from "@/lib/types";

export function CategoriesCarousel({ genres }: { genres: Genre[] }) {
  const { trackRef, index, steps, prev, next } = useCarousel();
  return (
    <section aria-labelledby="categories-heading" className="container-ci mt-[60px]">
      <SectionHeading
        id="categories-heading"
        title="Explore our wide variety of categories"
        description="Whether you're looking for a comedy to make you laugh, a drama to make you think, or a documentary to learn something new"
        descriptionClassName="max-w-[860px]"
        aside={<PagerControl index={index} steps={steps} onPrev={prev} onNext={next} label="categories" className="hidden md:inline-flex" />}
      />
      <CarouselTrack trackRef={trackRef} className="mt-[81px] gap-[31px] max-md:mt-10 max-md:gap-4">
        {genres.map((g) => (
          <div key={g.slug} className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-31px)/2)] lg:w-[calc((100%-93px)/4)]">
            <CategoryCard genre={g} />
          </div>
        ))}
      </CarouselTrack>
      <div className="mt-6 flex justify-center md:hidden">
        <PagerControl index={index} steps={steps} onPrev={prev} onNext={next} label="categories" />
      </div>
    </section>
  );
}
