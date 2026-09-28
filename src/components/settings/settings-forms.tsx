"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useEffect, useId, useRef, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cn, sleep } from "@/lib/utils";
import { toast } from "@/lib/toast";

/* ------------------------------------------------------------------ */
export function SettingsCard({
  title,
  backHref,
  description,
  children,
  className,
}: {
  title: string;
  backHref: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="bg-[#040114] px-5 pt-12 pb-24 lg:pt-[299px] lg:pb-[226px]">
      <section aria-labelledby="settings-card-title" className={cn("mx-auto w-full max-w-[610px] rounded-[8px] bg-[#201a2b] px-6 pt-10 pb-12 sm:px-[60px] sm:pt-[130px] sm:pb-[57px]", className)}>
        <div className="flex items-center gap-[14px]">
          <Link href={backHref} aria-label="Back" className="-ml-1 grid size-8 place-items-center rounded-full text-white transition-colors hover:bg-white/10">
            <ArrowLeft className="size-6" strokeWidth={2} />
          </Link>
          <h1 id="settings-card-title" className="text-[26px] leading-9 font-medium text-white">
            {title}
          </h1>
        </div>
        <p className="mt-[5px] text-lg leading-7 text-white">{description}</p>
        {children}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function PasswordField({ label, error, ...rest }: { label: string; error?: string } & React.ComponentProps<"input">) {
  const [show, setShow] = useState(false);
  const id = useId();
  return (
    <div>
      {/* the approved design paints the label on a tinted strip */}
      <label htmlFor={id} className="block bg-[#2d2536] pt-[5px] pb-[10px] text-lg leading-6 text-white">
        {label}
      </label>
      <div className="relative">
        <LockKeyhole aria-hidden className="pointer-events-none absolute top-1/2 left-[13px] size-[18px] -translate-y-1/2 text-[#3f3a47]" strokeWidth={1.8} />
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={label}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="h-[55px] w-full rounded-[4px] border border-[#8bd8c0]/40 bg-white pr-12 pl-10 text-base text-[#1c1824] placeholder:text-[#57525f] placeholder:opacity-100 focus:border-brand focus:ring-2 focus:ring-brand/40 focus:outline-none aria-invalid:border-danger"
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-controls={id}
          className="absolute top-1/2 right-[13px] grid size-8 -translate-y-1/2 place-items-center text-[#2b2632] hover:text-black"
        >
          {show ? <Eye className="size-5" strokeWidth={1.8} /> : <EyeOff className="size-5" strokeWidth={1.8} />}
        </button>
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm text-[#ff8a93]">
          {error}
        </p>
      )}
    </div>
  );
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password."),
    next: z.string().min(8, "Your password must be 8–10 characters long.").max(10, "Your password must be 8–10 characters long."),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], message: "Passwords don’t match." })
  .refine((v) => v.next !== v.current, { path: ["next"], message: "Choose a password you haven’t used before." });

type PasswordValues = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema), defaultValues: { current: "", next: "", confirm: "" } });

  const onSubmit = async () => {
    await sleep(800); // TODO: PATCH /me/password
    toast.success("Password updated", { description: "Confirm it’s you with the code we just emailed." });
    router.push("/settings/verify-email?from=password");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-[7px] space-y-[21px]">
      <PasswordField label="Enter old password" autoComplete="current-password" error={errors.current?.message} {...register("current")} />
      <PasswordField label="Set new password" autoComplete="new-password" error={errors.next?.message} {...register("next")} />
      <PasswordField label="Re-enter new password" autoComplete="new-password" error={errors.confirm?.message} {...register("confirm")} />
      <div className="!mt-[13px]">
        <Link href="/forgot-password" className="text-[15px] leading-5 text-white hover:underline">
          Forget password?
        </Link>
      </div>
      <Button type="submit" size="lg" block loading={isSubmitting} className="!mt-[23px] h-[62px] rounded-[12px] text-2xl font-semibold">
        Update password
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
const LEN = 6;

export function VerifyEmailForm() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(LEN).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sent, setSent] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!cooldown) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const setAt = (i: number, v: string) => setDigits((d) => d.map((x, j) => (j === i ? v : x)));

  const onChange = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, "");
    if (!v) return setAt(i, "");
    if (v.length > 1) return fill(v, i);
    setAt(i, v);
    setError(null);
    if (i < LEN - 1) refs.current[i + 1]?.focus();
  };

  const fill = (v: string, from = 0) => {
    const chars = v.replace(/\D/g, "").slice(0, LEN - from).split("");
    setDigits((d) => d.map((x, j) => (j >= from && j - from < chars.length ? chars[j - from] : x)));
    refs.current[Math.min(from + chars.length, LEN - 1)]?.focus();
  };

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LEN - 1) refs.current[i + 1]?.focus();
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    fill(e.clipboardData.getData("text"));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.some((d) => !d)) {
      setError("Enter all 6 digits of the code.");
      refs.current[digits.findIndex((d) => !d)]?.focus();
      return;
    }
    setBusy(true);
    await sleep(800); // TODO: POST /me/verify-email { code }
    setBusy(false);
    toast.success("Email verified", { description: "Your account is fully secured." });
    router.push("/settings");
  };

  const resend = async () => {
    setCooldown(30);
    setSent(true);
    toast("A new code is on its way", { description: "Check your inbox (and spam folder)." });
    await sleep(400); // TODO: POST /me/verify-email/resend
  };

  return (
    <form onSubmit={submit} noValidate className="mt-[18px]">
      <fieldset>
        <legend className="sr-only">6-digit verification code</legend>
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={LEN}
              aria-label={`Digit ${i + 1}`}
              aria-invalid={(!!error && !d) || undefined}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              onPaste={onPaste}
              onFocus={(e) => e.target.select()}
              className="h-[70px] w-[46px] rounded-[4px] border border-[#8bd8c0]/50 bg-white text-center text-lg text-[#1c1824] focus:border-brand focus:ring-2 focus:ring-brand/40 focus:outline-none aria-invalid:border-danger sm:w-[63px]"
            />
          ))}
        </div>
      </fieldset>
      <div className="mt-[15px] flex items-center justify-between text-base">
        <span className="text-white">{sent ? "Code sent! Check your inbox." : "Didn’t receive the code?"}</span>
        <button type="button" disabled={cooldown > 0} onClick={resend} className={cn("text-lg font-medium text-[#9b3cf0] hover:underline disabled:text-white/40 disabled:no-underline")}>
          {cooldown ? `Resend in ${cooldown}s` : "Resend"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-[#ff8a93]">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" block loading={busy} className="mt-[13px] h-[62px] rounded-[12px] text-2xl font-semibold">
        Verify
      </Button>
    </form>
  );
}
