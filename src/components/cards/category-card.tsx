import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Genre } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryCard({ genre, className }: { genre: Genre; className?: string }) {
  return (
    <Link
      data-spotlight
      href={`/categories/${genre.slug}`}
      className={cn(
        "group relative flex flex-col rounded-[12px] border border-line bg-graphite p-[29px] pb-[31px] transition duration-300 hover:-translate-y-1 hover:border-[#3d3150] hover:bg-[#1e1a24]",
        className,
      )}
    >
      <div className="relative aspect-[228/250] w-full overflow-hidden rounded-[10px]">
        {genre.cover ? (
          <Image src={genre.cover} alt="" fill sizes="(min-width: 1280px) 228px, 45vw" className="object-cover" />
        ) : (
          <div className="grid size-full grid-cols-2 grid-rows-2 gap-[5px]">
            {genre.collage.map((src, i) => (
              <div key={i} className="relative overflow-hidden rounded-[10px]">
                <Image src={src} alt="" fill sizes="(min-width: 1280px) 114px, 22vw" className="object-cover" />
              </div>
            ))}
            {/* the design fades the bottom row into the card surface */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-b from-transparent to-graphite/95" />
          </div>
        )}
      </div>
      <div className="mt-[6px] flex items-center justify-between">
        <span className="text-lg leading-[26px] font-medium text-white">{genre.name}</span>
        <ArrowRight aria-hidden className="size-7 text-white transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.6} />
      </div>
    </Link>
  );
}
