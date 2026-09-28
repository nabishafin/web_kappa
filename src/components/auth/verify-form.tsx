"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { actions, useAppState, useHydrated } from "@/lib/store";
import { maskEmail, sleep } from "@/lib/utils";
import { AuthHeading, AuthPanel, GlowButton } from "./auth-ui";
import { OtpInput } from "./otp-input";
import { DEMO_USER, OTP_LENGTH, otpSchema, safeNext, type OtpValues } from "./schemas";

const RESEND_COOLDOWN = 30;

export function VerifyForm({ flow, nextParam }: { flow?: string; nextParam?: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const pendingEmail = useAppState((s) => s.pendingEmail);
  const isReset = flow === "reset";
  const labelId = useId();
  const errorId = useId();

  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<OtpValues>({ resolver: zodResolver(otpSchema), defaultValues: { code: "" } });

  // The code box is the only thing to do on this screen — focus it straight away.
  useEffect(() => setFocus("code"), [setFocus]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  const onSubmit = async () => {
    await sleep(700); // simulated verification request
    if (isReset) {
      router.push("/reset-password");
      return;
    }
    actions.signIn(pendingEmail ?? DEMO_USER.email);
    actions.setPendingEmail(null);
    router.replace(safeNext(nextParam));
  };

  const pasteFromClipboard = async () => {
    try {
      const text = (await navigator.clipboard.readText()).replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (!text) {
        setNotice("Your clipboard doesn’t contain a code.");
        return;
      }
      setValue("code", text, { shouldValidate: text.length === OTP_LENGTH });
      setNotice(null);
      if (text.length === OTP_LENGTH) void handleSubmit(onSubmit)();
    } catch {
      setNotice("Clipboard access was blocked — paste the code with Ctrl+V / ⌘V instead.");
    }
  };

  const resend = async () => {
    setCooldown(RESEND_COOLDOWN);
    setValue("code", "");
    setFocus("code");
    await sleep(400); // simulated resend request
    setNotice(`A new code is on its way to ${pendingEmail ? maskEmail(pendingEmail) : "your email"}.`);
  };

  const target = pendingEmail ? maskEmail(pendingEmail) : "your email";

  return (
    <AuthPanel align="center" className="lg:pt-px">
      <AuthHeading
        center
        title="Enter Verification Code"
        className="[&_h1]:text-[#e6e6e6]"
        subtitle={
          <p id={labelId} className="mt-[3px] text-sm leading-[22px]">
            We’ve sent a {OTP_LENGTH}-digit code to{" "}
            <span className={hydrated ? undefined : "invisible"}>{target}</span>
          </p>
        }
      />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-[37px]" aria-label="Verify your email">
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <OtpInput
              value={field.value}
              onChange={field.onChange}
              onComplete={() => void handleSubmit(onSubmit)()}
              invalid={!!errors.code}
              disabled={isSubmitting}
              labelledBy={labelId}
              describedBy={errors.code ? errorId : undefined}
              firstRef={field.ref}
              className="lg:-mx-[11px]"
            />
          )}
        />
        {errors.code && (
          <p id={errorId} role="alert" className="mt-3 text-center text-sm font-medium text-danger">
            {errors.code.message}
          </p>
        )}

        <div className="mt-[22px] flex justify-center">
          <button
            type="button"
            onClick={pasteFromClipboard}
            className="rounded-md px-2 py-0.5 text-[15px] leading-5 font-medium text-[#c8c9cd] transition-colors hover:text-white"
          >
            Paste Code
          </button>
        </div>

        <GlowButton type="submit" loading={isSubmitting} wrapperClassName="mt-[19px]">
          Verify
        </GlowButton>
      </form>

      <p aria-live="polite" className="sr-only">
        {notice}
      </p>
      {notice && <p className="mt-4 text-center text-sm text-[#c8cacc]">{notice}</p>}

      <p className="mt-[25px] text-center text-[15px] leading-5 text-[#bfbac6]">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0}
          className="rounded-sm text-[#792bda] transition-colors hover:text-[#9a4ff0] disabled:cursor-not-allowed disabled:text-[#6d6480]"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
        </button>
      </p>
      <p className="mt-0.5 text-center">
        <Link
          href="/login"
          className="rounded-sm text-[17px] leading-6 font-semibold text-[#bdbac2] transition-colors hover:text-white"
        >
          Back to Login
        </Link>
      </p>
    </AuthPanel>
  );
}
