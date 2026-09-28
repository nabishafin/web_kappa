"use client";

import { Heart, PartyPopper } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { cn, sleep } from "@/lib/utils";
import { confetti } from "@/lib/confetti";
import { toast } from "@/lib/toast";

const presets = [5, 10, 25] as const;
type Choice = (typeof presets)[number] | "custom";

/** “Support the Vision” TipJar panel — used inside a dialog and on its own page */
export function SupportPanel({ titleName, onClose }: { titleName: string; onClose?: () => void }) {
  const [choice, setChoice] = useState<Choice>(10);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const headingId = useId();
  const customId = useId();

  const amount = choice === "custom" ? Number(custom) : choice;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(amount) || amount < 1) {
      setError("Enter an amount of at least $1.");
      return;
    }
    if (amount > 10000) {
      setError("The maximum single tip is $10,000.");
      return;
    }
    setError(null);
    setStatus("sending");
    await sleep(900); // TODO: POST /tips { title, amount } once the payments API is live
    setStatus("done");
    confetti({ y: 0.4 });
    toast.success(`Tip of $${amount % 1 ? amount.toFixed(2) : amount} sent`, { description: `Thank you for supporting ${titleName}!` });
  };

  return (
    <div
      role="document"
      className="border-glow relative w-full max-w-[670px] rounded-[32px] bg-[#1d142a] px-6 pt-10 pb-10 text-center [--glow:linear-gradient(180deg,rgb(160_80_230/0.9),rgb(90_50_160/0.35)_50%,rgb(150_70_220/0.9))] sm:px-12 sm:pt-[60px] sm:pb-[49px]"
    >
      {onClose && <DialogClose onClick={onClose} className="absolute top-[22px] right-[22px]" />}

      {status === "done" ? (
        <div className="py-10" aria-live="polite">
          <PartyPopper aria-hidden className="mx-auto size-12 text-lilac" strokeWidth={1.6} />
          <h2 id={headingId} className="mt-5 text-[28px] font-bold">
            Thank you!
          </h2>
          <p className="mx-auto mt-3 max-w-[420px] text-base leading-[25px] text-[#cfc6da]">
            Your ${amount.toFixed(amount % 1 ? 2 : 0)} tip is on its way to the creators of “{titleName}”. Exclusive concept art &amp; director
            commentary are now unlocked.
          </p>
          {onClose && (
            <Button onClick={onClose} variant="secondary" className="mt-8 w-[200px]">
              Back to title
            </Button>
          )}
        </div>
      ) : (
        <form onSubmit={submit} aria-labelledby={headingId} noValidate>
          <h2 id={headingId} className="text-[28px] leading-10 font-bold tracking-[-0.01em] sm:text-[32px]">
            Support the Vision
          </h2>
          <p className="mx-auto mt-[9px] max-w-[440px] text-base leading-[25px] tracking-[0.01em] text-[#cfc6da]">
            Your contribution directly fuels the independent artists behind “{titleName}”.
          </p>

          <fieldset className="mt-[36px]">
            <legend className="sr-only">Choose an amount</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[134px_136px_135px_131px] sm:justify-between sm:gap-0">
              {[...presets, "custom" as const].map((p) => {
                const selected = choice === p;
                return (
                  <label
                    key={p}
                    className={cn(
                      "flex h-[93px] cursor-pointer flex-col items-center justify-center rounded-[14px] border transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-lilac",
                      selected ? "border-[#8d7aa8] bg-[#2e253e] text-white" : "border-white/10 bg-[#1f1729] text-white/85 hover:border-white/25",
                    )}
                  >
                    <input
                      type="radio"
                      name="amount"
                      value={String(p)}
                      checked={selected}
                      onChange={() => {
                        setChoice(p);
                        setError(null);
                      }}
                      className="sr-only"
                    />
                    <span className={cn("text-[13px] font-medium tracking-[0.04em]", selected ? "text-white" : "text-[#b9b0c6]")}>
                      {p === "custom" ? "CUSTOM" : "Donate"}
                    </span>
                    <span className="mt-[3px] text-xl leading-7 font-semibold">{p === "custom" ? "..." : `$${p}`}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="relative mt-[33px]">
            <label htmlFor={customId} className="sr-only">
              Custom amount in US dollars
            </label>
            <span aria-hidden className="pointer-events-none absolute top-1/2 left-6 -translate-y-1/2 text-base font-semibold text-[#8f86a0]">
              $
            </span>
            <input
              id={customId}
              inputMode="decimal"
              type="number"
              min={1}
              step="0.01"
              placeholder="Enter custom amount"
              value={custom}
              aria-invalid={!!error || undefined}
              aria-describedby={error ? `${customId}-err` : undefined}
              onFocus={() => setChoice("custom")}
              onChange={(e) => {
                setCustom(e.target.value);
                setChoice("custom");
                setError(null);
              }}
              className="h-[65px] w-full rounded-[14px] border border-white/10 bg-[#1a1224] pr-5 pl-12 text-base text-white placeholder:text-[#7d7489] placeholder:opacity-100 focus:border-brand/70 focus:outline-none aria-invalid:border-danger"
            />
          </div>
          {error && (
            <p id={`${customId}-err`} role="alert" className="mt-2 text-left text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" block loading={status === "sending"} className="mt-[33px] h-[61px] gap-3 rounded-[12px]">
            {status !== "sending" && <Heart aria-hidden className="size-6 fill-white" />}
            Support Creator
          </Button>
          <p className="mt-[24px] text-[13px] leading-5 font-medium tracking-[0.05em] text-[#a79fb3]">
            By supporting, you unlock exclusive concept art &amp; director commentary.
          </p>
        </form>
      )}
    </div>
  );
}
