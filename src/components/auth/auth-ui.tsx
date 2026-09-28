import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

/**
 * Right-hand form column of the split-screen auth layout.
 * `align="top"` pins the heading at the artboard's top offset (Log In, Create Account, Set Password);
 * `align="center"` vertically centres the column (verification, forgot password).
 */
export function AuthPanel({
  align = "top",
  className,
  children,
}: {
  align?: "top" | "center";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[568px] animate-rise lg:mx-0",
        align === "top" ? "lg:self-start lg:pt-[clamp(48px,17.2dvh,176px)]" : "lg:self-center",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AuthHeading({
  title,
  subtitle,
  center,
  className,
}: {
  title: string;
  subtitle?: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <header className={cn(center && "text-center", className)}>
      <h1 className="text-[28px] leading-[40px] font-semibold tracking-[-0.01em] text-white lg:text-[32.5px] lg:leading-[44px]">
        {title}
      </h1>
      {subtitle && <div className="text-[#c8cacc]">{subtitle}</div>}
    </header>
  );
}

export function OrDivider({ className }: { className?: string }) {
  return (
    <div role="separator" aria-label="or" className={cn("flex items-center gap-[22px]", className)}>
      <span aria-hidden className="h-0.5 flex-1 bg-[#c8cacc]" />
      <span aria-hidden className="w-7 text-center text-[19px] leading-6 text-[#c8cacc]">
        OR
      </span>
      <span aria-hidden className="h-0.5 flex-1 bg-[#c8cacc]" />
    </div>
  );
}

/** Inner-gloss only (no outer drop shadow) — for primary buttons on the pure-black focus screens. */
export const FLAT_GLOSS =
  "shadow-[inset_0_0_14px_2px_rgb(236_150_255/0.55),inset_0_-3px_6px_rgb(255_190_255/0.25)]";

/** Glossy violet CTA with the soft purple light-spill beneath it (as in the auth designs). */
export function GlowButton({
  glow = true,
  className,
  wrapperClassName,
  ...rest
}: ComponentProps<typeof Button> & { glow?: boolean; wrapperClassName?: string }) {
  return (
    <div className={cn("relative isolate", wrapperClassName)}>
      {glow && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-4 top-[calc(100%-8px)] -z-10 h-[150px] rounded-[40px] bg-[linear-gradient(180deg,rgb(122_18_214/0.55)_0%,rgb(92_16_170/0.22)_28%,rgb(60_14_120/0.08)_65%,transparent_100%)] blur-[14px]"
        />
      )}
      <Button
        variant="primary"
        size="sm"
        block
        className={cn("h-12 rounded-[10px] text-base font-bold tracking-[0.01em]", className)}
        {...rest}
      />
    </div>
  );
}

export function GoogleButton({ className, children = "Continue with Google", ...rest }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-16 w-full items-center justify-center gap-[18px] rounded-full border border-[#333] bg-white font-display text-xl font-medium text-[#333] transition-[background,transform] hover:bg-[#f1f1f4] active:translate-y-px disabled:opacity-60",
        className,
      )}
      {...rest}
    >
      <GoogleIcon className="size-6" />
      {children}
    </button>
  );
}

/** Underlined inline link, e.g. “Create Account”, “Forget your password”. */
export function AuthLink({ className, ...rest }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "underline decoration-1 underline-offset-[5px] transition-opacity hover:opacity-80 focus-visible:rounded-sm",
        className,
      )}
      {...rest}
    />
  );
}

export function ForgotPasswordLink({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-end", className)}>
      <AuthLink href="/forgot-password" className="font-display text-[15.5px] leading-5 text-[#fe5c5f] underline-offset-[4px]">
        Forget your password
      </AuthLink>
    </div>
  );
}

/** Polite live region for success / error notices above a form. */
export function FormNotice({ tone = "success", children }: { tone?: "success" | "error"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-4 py-3 text-sm font-medium",
        tone === "success" ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger",
      )}
    >
      {children}
    </p>
  );
}
