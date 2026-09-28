import Link from "next/link";
import type { Metadata } from "next";
import { ErrorState } from "@/components/feedback/error-state";
import { AppHeader } from "@/components/layout/app-header";
import { Footer } from "@/components/layout/footer";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <AppHeader tone="black" />
      <main id="main" className="flex flex-1 flex-col">
        <ErrorState
          code="404"
          title={
            <>
              Oops! This Channel
              <br />
              Is Off the Air
            </>
          }
          message="The page you're looking for doesn't exist or has been moved. Try searching for an animation or head back home."
          primary={
            <Link href="/search" className={buttonClass({ variant: "flat", className: "w-[162px] rounded-[8px] text-base font-semibold" })}>
              Search
            </Link>
          }
        />
      </main>
      <Footer />
    </>
  );
}
