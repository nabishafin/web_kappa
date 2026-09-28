import type { Metadata } from "next";
import { PlanCards } from "@/components/pricing/plan-cards";
import { listPlans } from "@/lib/api/catalog";

export const metadata: Metadata = {
  title: "Plans & Pricing",
  description: "Support independent animation and unlock premium features. Choose Free or Premium.",
};

export default async function PricingPage() {
  const plans = await listPlans();
  return (
    <div className="bg-[#040114] pt-12 pb-24 md:pt-[49px] md:pb-[140px]">
      <div className="mx-auto w-[min(1150px,calc(100%-40px))]">
        <header className="text-center">
          <h1 className="text-[40px] leading-[1.1] font-extrabold tracking-[-0.045em] text-[#ebe0fb] sm:text-[52px] lg:text-[66px] lg:leading-[80px]">
            Unlock More with Channel Infinity
          </h1>
          <p className="mx-auto mt-[17px] max-w-[670px] text-lg leading-7 text-[#d7d0e2] sm:text-xl">
            Support independent animation and unlock premium features. Select the subscription that best fits your viewing experience.
          </p>
        </header>
        <PlanCards plans={plans} />
      </div>
    </div>
  );
}
