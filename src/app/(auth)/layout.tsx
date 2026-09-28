import Image from "next/image";
import Link from "next/link";

/** Split-screen shell shared by every auth screen: logo on the left, form column on the right. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main
      id="main"
      className="grid min-h-dvh flex-1 grid-rows-[auto_1fr] overflow-clip bg-[#080b1c] px-4 pb-12 sm:px-8 lg:grid-cols-[55.28%_1fr] lg:grid-rows-1 lg:px-0 lg:pb-0"
    >
      <div className="flex items-center justify-center pt-8 pb-8 sm:pt-12 lg:py-0 lg:pt-[11px] lg:pr-[9px]">
        <Link href="/" aria-label="Channel Infinity — home" className="inline-flex rounded-lg">
          <Image
            src="/images/brand/logo.png"
            alt="Channel Infinity"
            width={1438}
            height={670}
            sizes="(min-width: 1024px) 50vw, 240px"
            loading="eager"
            fetchPriority="high"
            className="h-auto w-[200px] sm:w-[260px] lg:w-[min(720px,50vw)]"
          />
        </Link>
      </div>
      <div className="flex justify-center lg:justify-start lg:pr-[5.28vw]">{children}</div>
    </main>
  );
}
