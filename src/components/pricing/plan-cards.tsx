"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { actions, useAppState, useHydrated } from "@/lib/store";
import type { Plan } from "@/lib/types";
import { cn, sleep } from "@/lib/utils";
import { confetti } from "@/lib/confetti";
import { toast } from "@/lib/toast";

function CheckDot() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="mt-[5px] size-5 shrink-0">
      <circle cx="10" cy="10" r="10" fill="#d0bcff" />
      <path d="m6 10.2 2.6 2.6L14.2 7" fill="none" stroke="#2d243b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlanCards({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const current = useAppState((s) => s.user?.plan ?? "free");
  const [busy, setBusy] = useState<Plan["id"] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const choose = async (plan: Plan) => {
    if (plan.id === "free") {
      if (current !== "free") {
        setBusy("free");
        await sleep(600);
        actions.updateProfile({ plan: "free" });
        setNotice("You’re now on the Free plan. Premium perks stay active until the end of your billing period.");
        setBusy(null);
        return;
      }
      router.push("/home");
      return;
    }
    setBusy("premium");
    await sleep(900); // TODO: redirect to the checkout session returned by the billing API
    actions.updateProfile({ plan: "premium" });
    setBusy(null);
    setNotice("Welcome to Channel Infinity Premium! Enjoy ad-free 4K, early access and studio extras.");
    confetti();
    toast.success("Welcome to Premium ✦", { description: "Ad-free 4K, early access and studio extras unlocked." });
  };

  return (
    <>
      <div id="features" className="mt-12 grid gap-[26px] md:mt-[67px] lg:grid-cols-2">
        {plans.map((plan) => {
          const premium = plan.id === "premium";
          const isCurrent = hydrated && current === plan.id;
          return (
            <article
              data-reveal
              data-spotlight
              key={plan.id}
              aria-labelledby={`plan-${plan.id}`}
              className="border-glow flex flex-col rounded-[36px] bg-[#201a2c] px-6 pt-[38px] pb-[37px] [--glow:linear-gradient(180deg,rgb(170_90_235/0.95),rgb(120_60_190/0.35)_35%,rgb(90_50_150/0.2)_70%,rgb(160_80_230/0.8))] sm:px-10 lg:min-h-[622px]"
            >
              <div className="flex items-center gap-3">
                <p className="text-xs leading-4 font-medium tracking-[0.14em] text-[#b6aec3]">{plan.tier}</p>
                {isCurrent && (
                  <span className="rounded-full bg-lilac/15 px-2.5 text-[10px] leading-4 font-semibold tracking-[0.08em] text-lilac uppercase">Current plan</span>
                )}
              </div>
              <h2 id={`plan-${plan.id}`} className={cn("mt-[6px] text-[28px] leading-10 font-semibold tracking-[-0.01em] sm:text-[32px]", premium ? "text-lilac" : "text-[#efe6fa]")}>
                {plan.name}
              </h2>
              <p className="mt-[15px] flex items-baseline gap-[6px]">
                <span className="text-[36px] leading-[44px] font-bold tracking-[-0.01em] text-[#efe6fa]">${plan.price === 0 ? "0" : plan.price.toFixed(2)}</span>
                <span className="text-base text-[#cbc3d7]">/month</span>
              </p>
              <ul className="mt-[29px] space-y-[25px]">
                {plan.features.map((f) => (
                  <li key={f.title} className="flex gap-4">
                    <CheckDot />
                    <div>
                      <p className="text-xl leading-7 font-medium text-[#efe6fa]">{f.title}</p>
                      <p className="mt-[1px] text-base leading-6 tracking-[0.01em] text-[#cbc3d7]">{f.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-12">
                <Button
                  variant={premium ? "primary" : "secondary"}
                  size="lg"
                  block
                  loading={busy === plan.id}
                  disabled={premium && isCurrent}
                  onClick={() => choose(plan)}
                  className={cn("h-[62px] rounded-[10px] font-medium", premium ? "text-2xl" : "text-xl")}
                >
                  {premium && isCurrent ? "You’re on Premium" : plan.cta}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
      <div aria-live="polite" className="mt-6 min-h-6 text-center">
        {notice && <p className="animate-fade-in text-base text-lilac">{notice}</p>}
      </div>
    </>
  );
}
