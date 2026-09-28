import { MonitorPlay, TvMinimalPlay, UserRoundCog } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { howItWorks } from "@/lib/data/catalog";

const icons = { user: UserRoundCog, play: MonitorPlay, gift: TvMinimalPlay };

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="container-ci mt-[60px] scroll-mt-8">
      <SectionHeading
        id="how-heading"
        title="How it works"
        description="With Channel Infinity, you can enjoy your favorite movies and TV shows anytime, anywhere. Our platform is designed to be compatible with a wide range of devices, ensuring that you never miss a moment of entertainment."
        descriptionClassName="max-w-[945px]"
      />
      <ol data-reveal-group className="mt-10 grid gap-5 sm:mt-[81px] md:grid-cols-3 md:gap-[31px]">
        {howItWorks.map((step) => {
          const Icon = icons[step.icon];
          return (
            <li
              data-reveal
              data-spotlight
              key={step.title}
              className="border-glow rounded-[12px] bg-[linear-gradient(180deg,#1c1527_0%,#17121e_45%,#141019_100%)] px-8 pt-[50px] pb-[23px] font-display [--glow:linear-gradient(180deg,rgb(140_60_200/0.95),rgb(90_50_150/0.35)_55%,rgb(130_60_200/0.85))] lg:px-[49px]"
            >
              <div className="flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-[10px] border border-graphite-2 bg-coal">
                  <Icon aria-hidden className="size-6 text-white" strokeWidth={1.7} />
                </span>
                <h3 className="text-[22px] leading-8 font-medium text-white lg:text-2xl">{step.title}</h3>
              </div>
              <p className="mt-[29px] text-lg leading-[27px] font-light text-fog">{step.body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
