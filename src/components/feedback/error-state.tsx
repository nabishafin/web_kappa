import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/button";

export function ErrorState({
  title = (
    <>
      Oops! Something
      <br />
      Went Wrong!
    </>
  ),
  message = "We're having trouble loading this page. Our technical team has been notified. Please try again or return to the homepage.",
  primary,
  code,
}: {
  title?: ReactNode;
  message?: string;
  /** Primary action; defaults to nothing so server components can omit it */
  primary?: ReactNode;
  code?: string;
}) {
  return (
    <section aria-labelledby="error-title" className="flex flex-1 flex-col items-center bg-black px-5 pt-6 pb-24 text-center md:pt-[25px] md:pb-[120px]">
      <Image src="/images/illustrations/broken-tv.png" alt="" width={1041} height={1074} loading="eager" className="h-auto w-[240px] md:w-[347px]" />
      {code && <p className="mt-4 text-sm font-semibold tracking-[0.2em] text-[#888]">ERROR {code}</p>}
      <h1 id="error-title" className="mt-[38px] text-[36px] leading-[1.2] font-semibold tracking-[-0.01em] text-[#e6e6e6] md:text-[48px] md:leading-[61px]">
        {title}
      </h1>
      <p className="mt-[14px] max-w-[440px] text-base leading-[19px] text-[#e3e3e3]">{message}</p>
      <div className="mt-[33px] flex flex-wrap justify-center gap-4">
        {primary}
        <Link href="/home" className={buttonClass({ variant: "secondary", className: "w-[162px] rounded-[8px] text-base font-semibold" })}>
          Go to Homepage
        </Link>
      </div>
      <p className="mt-[34px] text-[15px] text-[#e6e6e6]">
        Need immediate help?{" "}
        <Link href="/support" className="font-medium text-[#9b3cf0] hover:underline">
          Contact Support
        </Link>
      </p>
    </section>
  );
}
