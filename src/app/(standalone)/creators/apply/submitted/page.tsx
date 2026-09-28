import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Application Under Review",
  description: "Thanks — we received your Channel Infinity creator application. It is currently under review.",
  robots: { index: false },
};

export default function ApplicationSubmittedPage() {
  return (
    <div className="px-4 py-10 md:px-8 md:pt-[185px] md:pb-[186px]">
      <section
        aria-labelledby="submitted-heading"
        className="mx-auto flex max-w-[1040px] animate-rise flex-col items-center border border-x-[#592da2] border-y-[#be2aef] bg-[#191320] px-5 py-16 text-center md:px-10 md:pt-[172px] md:pb-[165px]"
      >
        <h1 id="submitted-heading" className="relative top-[1.5px] text-2xl leading-[34px] font-semibold text-lilac-2 md:text-[28px]">
          Application Under Review
        </h1>
        <p role="status" className="mt-6 max-w-[730px] text-base leading-6 text-[#c8cacc] md:text-xl">
          Thanks - we received your application. Your submission is currently under review. Please keep an eye on your email (including the
          spam/junk folder). It may take a few weeks for us to reply. While you wait, feel free to check out other amazing animations created by
          talented people, or return to the main menu.
        </p>
        <div className="mt-[29px] flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:gap-6">
          <ButtonLink href="/home" variant="primary" className="h-[62px] w-full rounded-[10px] px-2 text-xl sm:w-[208px]">
            Explore Animations
          </ButtonLink>
          <ButtonLink
            href="/"
            variant="secondary"
            className="h-[62px] w-full rounded-[10px] border-[#8b6fa5] bg-linear-to-b from-[#493d52] to-[#44334f] px-2 text-xl hover:from-[#54475e] hover:to-[#4f3c5b] sm:w-[208px]"
          >
            Main Menu
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
