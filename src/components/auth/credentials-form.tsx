"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { actions } from "@/lib/store";
import { cn, sleep } from "@/lib/utils";
import { AuthInput, PasswordInput } from "./auth-input";
import {
  AuthHeading,
  AuthLink,
  AuthPanel,
  ForgotPasswordLink,
  FormNotice,
  GlowButton,
  GoogleButton,
  OrDivider,
} from "./auth-ui";
import { credentialsSchema, DEMO_USER, safeNext, type CredentialsValues } from "./schemas";

type Mode = "login" | "signup";

const copy: Record<Mode, { title: string; submit: string; prompt: string; cta: string; href: string }> = {
  login: { title: "Log In", submit: "Log In", prompt: "Don’t have an account?", cta: "Create Account", href: "/signup" },
  signup: { title: "Create Account", submit: "Create Account", prompt: "Already have an account?", cta: "Log In", href: "/login" },
};

/** Log In and Create Account share one layout; only copy and the submit outcome differ. */
export function CredentialsForm({
  mode,
  nextParam,
  provider,
  resetDone = false,
}: {
  mode: Mode;
  /** raw `?next=` value (validated here) */
  nextParam?: string;
  /** `?provider=` from the landing page social buttons */
  provider?: string;
  /** show the “password updated” notice */
  resetDone?: boolean;
}) {
  const router = useRouter();
  const next = safeNext(nextParam);
  const [socialPending, setSocialPending] = useState(false);
  const t = copy[mode];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CredentialsValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const signInWithProvider = () => {
    setSocialPending(true);
    actions.signIn(DEMO_USER.email, DEMO_USER.displayName);
    router.replace(next);
  };

  // Landing page links to /login?provider=google|facebook — complete the (demo) social sign-in straight away.
  const autoSocial = useRef(false);
  useEffect(() => {
    if (autoSocial.current || (provider !== "google" && provider !== "facebook")) return;
    autoSocial.current = true;
    actions.signIn(DEMO_USER.email, DEMO_USER.displayName);
    router.replace(next);
  }, [provider, next, router]);

  const onSubmit = async ({ email }: CredentialsValues) => {
    await sleep(700); // simulated network latency — replace with the API call
    if (mode === "login") {
      actions.signIn(email);
      router.replace(next);
    } else {
      actions.setPendingEmail(email);
      const qs = next !== "/home" ? `?next=${encodeURIComponent(next)}` : "";
      router.push(`/verify${qs}`);
    }
  };

  const busy = isSubmitting || socialPending;
  const altHref = nextParam ? `${t.href}?next=${encodeURIComponent(next)}` : t.href;

  return (
    <AuthPanel align="top">
      <AuthHeading title={t.title} />

      {resetDone && mode === "login" && (
        <div className="mt-4">
          <FormNotice>Your password has been updated. Log in with your new password.</FormNotice>
        </div>
      )}

      <GoogleButton className="mt-[46px]" onClick={signInWithProvider} disabled={busy} aria-busy={socialPending || undefined} />

      <OrDivider className="mt-[50px]" />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-[52px]" aria-label={t.title}>
        <AuthInput
          label="Your email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email address"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordInput
          label="Your password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="Your password"
          containerClassName="mt-5"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* The sign-up artboard keeps an invisible placeholder for this link; reserve the same space. */}
        {mode === "login" ? <ForgotPasswordLink className="mt-2.5" /> : <div aria-hidden className="mt-2.5 h-5" />}

        <GlowButton type="submit" loading={isSubmitting} disabled={socialPending} wrapperClassName="mt-[26px]">
          {t.submit}
        </GlowButton>
      </form>

      <p className="mt-[25px] text-center font-display text-base leading-6 tracking-[0.01em] text-[#e6e6e6]">
        {t.prompt}{" "}
        <AuthLink
          href={altHref}
          className={cn("font-medium text-white", mode === "signup" && "no-underline hover:underline")}
        >
          {t.cta}
        </AuthLink>
      </p>
    </AuthPanel>
  );
}
