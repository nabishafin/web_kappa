import Image from "next/image";
import type { Metadata } from "next";
import { ExploreCard } from "@/components/cards/explore-card";
import { CategoriesCarousel } from "@/components/sections/categories-carousel";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { HowItWorks } from "@/components/sections/how-it-works";
import { SectionHeading } from "@/components/sections/section-heading";
import { FacebookColorIcon, GoogleIcon } from "@/components/ui/brand-icons";
import { ButtonLink } from "@/components/ui/button";
import { getExploreGrid, listFaqs, listGenres } from "@/lib/api/catalog";

export const metadata: Metadata = {
  title: { absolute: "Channel Infinity — The Future of Independent Animation" },
  alternates: { canonical: "/" },
};

export default async function LandingPage() {
  const [explore, genres, faqs] = await Promise.all([getExploreGrid(), listGenres(), listFaqs()]);

  return (
    <div className="bg-night pb-0 font-display">
      {/* ------------------------------------------------------------ Hero */}
      <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-full max-w-[1440px] min-[1441px]:[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] md:h-[640px]">
          <Image
            src="/images/landing/hero-bg.webp"
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1440px) 1440px, 100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-night max-md:via-night/40" />
        </div>

        <div className="container-ci flex flex-col items-center pt-12 text-center md:pt-[48px]">
          <h1
            id="hero-heading"
            className="max-w-[860px] text-[40px] leading-[1.05] font-extrabold tracking-[-0.03em] text-white [text-shadow:0_2px_18px_rgb(0_0_0/0.35)] sm:text-[56px] md:text-[66.5px] md:leading-[70px]"
          >
            The Future of Independent Animation
          </h1>
          <p className="mt-6 max-w-[620px] font-sans text-base leading-7 text-[#cfc8da] sm:text-lg sm:leading-[30px] md:mt-[23px]">
            Immerse yourself in a universe of award-winning shorts, series, and experimental films curated from the world&apos;s most visionary
            independent creators.
          </p>
          <div className="mt-8 flex gap-4 md:mt-[23px]">
            <ButtonLink href="/signup" variant="flat" className="w-[162px] font-bold">
              Start Watching
            </ButtonLink>
            <ButtonLink href="/login" variant="glass" className="w-[162px] font-bold">
              Sign In
            </ButtonLink>
          </div>

          <div className="mt-10 flex w-full max-w-[1240px] items-center gap-4 md:mt-[46px]" aria-hidden>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold tracking-[0.12em] text-[#a19aae] uppercase">Or continue with</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="mt-[22px] grid w-full max-w-[512px] grid-cols-2 gap-4">
            <a
              href="/login?provider=google"
              className="flex h-[60px] items-center justify-center gap-3 rounded-[10px] border border-white/10 bg-[#130e1b]/75 text-lg text-[#e7e2ef] backdrop-blur-md transition-colors hover:border-white/25 hover:bg-[#1c1527]/85"
            >
              <GoogleIcon className="size-5" /> Google
            </a>
            <a
              href="/login?provider=facebook"
              className="flex h-[60px] items-center justify-center gap-3 rounded-[10px] border border-white/10 bg-[#130e1b]/75 text-lg text-[#e7e2ef] backdrop-blur-md transition-colors hover:border-white/25 hover:bg-[#1c1527]/85"
            >
              <FacebookColorIcon className="size-5" /> Facebook
            </a>
          </div>
        </div>

        {/* creator call-out */}
        <div className="container-ci mt-16 md:mt-[115px]">
          <div className="flex flex-col gap-5 rounded-[12px] border border-white/10 bg-[#110c18]/[0.93] px-6 py-7 backdrop-blur-md md:flex-row md:items-center md:justify-between md:px-[25px] md:pt-[31px] md:pb-[23px]">
            <div>
              <h2 className="text-2xl leading-8 font-semibold tracking-[-0.01em] text-white md:text-[32px] md:leading-10">
                Want to share your animated creations with the world?
              </h2>
              <p className="mt-3 text-base leading-[27px] font-light text-[#a59fb0] md:mt-[17px] md:text-lg">
                Whether it’s a short film, pilot, or full series, Channel Infinity wants to help bring your vision to the world.
              </p>
            </div>
            <ButtonLink href="/creators" variant="flat" className="w-[162px] shrink-0 font-bold md:-mt-[6px]">
              Apply Here
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Explore */}
      <section aria-labelledby="explore-heading" className="container-ci mt-20 md:mt-[97px]">
        <SectionHeading
          id="explore-heading"
          title="Explore Unlimited Animated Worlds"
          description="Discover unique animations from independent creators and find your next favorite story."
        />
        <div data-reveal-group className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-[81px] lg:grid-cols-4 lg:gap-x-[29px] lg:gap-y-[51px]">
          {explore.map((t, i) => (
            // the design repeats some titles; only the first copy may carry the morph name
            <ExploreCard key={`${t.slug}-${i}`} title={t} priority={i < 4} morph={explore.findIndex((x) => x.slug === t.slug) === i} />
          ))}
        </div>
      </section>

      <CategoriesCarousel genres={genres.slice(0, 7)} />

      <HowItWorks />

      {/* ------------------------------------------------------------- FAQ */}
      <section id="faq" aria-labelledby="faq-heading" className="container-ci mt-[60px] scroll-mt-8">
        <SectionHeading
          id="faq-heading"
          title="Frequently Asked Questions"
          description="Got questions? We've got answers! Check out our FAQ section to find answers to the most common questions about Channel Infinity."
        />
        <div className="mt-10 md:mt-[89px]">
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section
        aria-labelledby="cta-heading"
        className="relative mx-auto mt-16 max-w-[1440px] overflow-hidden rounded-[12px] border border-line md:mt-0"
      >
        <Image src="/images/landing/cta-bg.webp" alt="" fill sizes="(min-width: 1440px) 1440px, 100vw" className="object-cover object-right" />
        <div className="relative flex min-h-[313px] flex-col justify-center gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-20">
          <div className="max-w-[900px]">
            <h2 id="cta-heading" className="text-[32px] leading-tight font-bold tracking-[-0.02em] text-white md:text-5xl md:leading-[58px]">
              Start your free trial today!
            </h2>
            <p className="mt-3 text-base leading-[27px] font-light text-fog md:mt-[22px] md:text-lg">
              This is a clear and concise call to action that encourages users to sign up for a free trial of Channel Infinity!
            </p>
          </div>
          <ButtonLink href="/signup" variant="flat" className="w-[162px] shrink-0 font-bold">
            Start a Free Trial
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
