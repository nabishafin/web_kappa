import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { creatorPerks } from "@/lib/data/catalog";
import { PerksCarousel } from "./perks-carousel";

export const metadata: Metadata = {
  title: "For Creators",
  description:
    "The ultimate streaming platform for indie animation creators. Share your unique vision with the world — apply to publish on Channel Infinity.",
  alternates: { canonical: "/creators" },
};

export default function CreatorsPage() {
  return (
    <section
      aria-labelledby="creators-heading"
      // deep-violet wash sampled from the artboard: #13062a at the top → #060315 at the fold
      className="relative bg-linear-to-b from-[#13062a] to-[#060315] font-roboto"
    >
      <div className="container-ci flex flex-col items-center pt-16 text-center md:pt-[154px]">
        <h1 id="creators-heading" className="relative top-[2px] text-5xl leading-none font-bold text-[#c77dff] sm:text-[64px]">
          Channel Infinity
        </h1>
        <p className="mt-5 max-w-[800px] text-lg leading-6 text-[#d0cfd2] md:mt-[25px] md:text-[20.5px]">
          The ultimate streaming platform for indie animation creators. Share your unique vision with the world.
        </p>
        <ButtonLink
          href="/creators/apply"
          variant="primary"
          className="mt-8 h-[45px] w-[226px] rounded-[10px] font-display text-[15px] font-bold md:mt-[43px]"
        >
          Apply as Creator
        </ButtonLink>
      </div>

      <div className="mx-auto mt-16 w-[min(1242px,calc(100%-40px))] md:mt-[125px] md:w-[min(1242px,calc(100%-64px))]">
        <PerksCarousel perks={creatorPerks} className="-mb-11 md:-mb-[60px]" />
      </div>
    </section>
  );
}
