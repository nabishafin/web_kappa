"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { useAppState, useHydrated } from "@/lib/store";

const btn = "h-11 w-auto px-4 text-sm font-bold md:h-12 md:px-8 md:text-base lg:w-[214px]";

export function PublicHeader() {
  // The landing artboard uses flat buttons; the creator artboards use the glossy ones.
  const flat = usePathname() === "/";
  const hydrated = useHydrated();
  const signedIn = useAppState((s) => Boolean(s.user));

  return (
    <header className="bg-ink font-display">
      <div className="container-ci flex h-24 items-center justify-between gap-4 md:h-40 lg:justify-start">
        <Logo priority className="md:ml-[10px]" />
        <nav aria-label="Account" className="flex items-center gap-3 md:gap-[17px] lg:ml-[242px]">
          {hydrated && signedIn ? (
            <ButtonLink href="/home" variant={flat ? "flat" : "primary"} className={btn}>
              Go to Home
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/signup" variant={flat ? "flat" : "primary"} className={`hidden sm:inline-flex ${btn}`}>
                Create Account
              </ButtonLink>
              <ButtonLink href="/login" variant="glass" className={btn}>
                Log In
              </ButtonLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
