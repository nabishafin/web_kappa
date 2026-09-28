import Image from "next/image";
import { Award } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { Creator, Title } from "@/lib/types";

export function SpotlightCard({ title, creator }: { title: Title; creator?: Creator }) {
  return (
    <article data-reveal className="group/spot relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[28px] border border-white/[0.08] md:min-h-[538px]">
      <Image src={title.backdrop ?? title.thumbnail} alt="" fill sizes="(min-width: 1280px) 817px, 100vw" className="-z-10 object-cover transition-transform duration-[1.2s] ease-out group-hover/spot:scale-[1.04]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_40%,rgb(10_6_20/0.55)_70%,rgb(10_6_20/0.92)_100%)]" />
      <div className="p-6 md:px-10 md:pt-0 md:pb-10">
        <span className="inline-flex h-[22px] items-center rounded-full border border-[#b9a2e8]/60 bg-[#3b2a57]/70 px-4 text-[13px] font-medium tracking-[0.02em] text-[#e7dcfb] backdrop-blur-sm">
          Spotlight Artist: {creator?.name}
        </span>
        <h3 className="mt-[15px] text-[28px] leading-10 font-bold tracking-[-0.01em] text-white md:text-[32px]">{title.title}</h3>
        <p className="mt-[7px] max-w-[520px] text-base leading-[25px] text-[#d6cfe0]">{title.synopsis}</p>
        <ButtonLink href={`/title/${title.slug}`} variant="light" className="mt-[26px] h-[50px] w-[206px] rounded-[10px] text-base">
          Explore Collection
        </ButtonLink>
      </div>
    </article>
  );
}

export function CollectiveCard() {
  return (
    <aside data-reveal data-spotlight className="relative flex flex-col self-start rounded-[28px] border border-[#2a2540] bg-[#0f0b1e] px-8 pt-8 pb-[33px]" aria-labelledby="collective-heading">
      <Award aria-hidden className="size-10 text-lilac" strokeWidth={1.8} />
      <h3 id="collective-heading" className="mt-[25px] max-w-[220px] text-[32px] leading-[38px] font-bold tracking-[-0.01em] text-white">
        Join the Collective
      </h3>
      <p className="mt-[17px] max-w-[205px] text-base leading-[25.6px] text-[#cfc7dc]">
        Access exclusive behind-the-scenes storyboards, raw animation assets, and early screenings from independent creators worldwide.
      </p>
      <div className="mt-[34px]">
        <div className="flex items-center">
          <Image src="/images/people/collective-strip.webp" alt="" width={92} height={38} className="h-[38px] w-[92px]" />
          <span className="-ml-3 grid size-[38px] place-items-center rounded-full border-2 border-[#0f0b1e] bg-[#2a2439] text-[10px] font-semibold text-white">
            +2k
          </span>
          <span className="sr-only">Over 2,000 members</span>
        </div>
        <ButtonLink href="/pricing" variant="secondary" className="mt-[26px] h-[61px] w-full max-w-[330px] rounded-[10px] text-xl font-medium lg:max-w-none xl:max-w-[330px]">
          Upgrade Now
        </ButtonLink>
      </div>
    </aside>
  );
}
