import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  className,
  imgClassName = "w-[118px] md:w-[182px]",
  priority,
}: {
  href?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <Link href={href} aria-label="Channel Infinity — home" className={cn("inline-flex shrink-0", className)}>
      <Image
        src="/images/brand/logo.png"
        alt="Channel Infinity"
        width={1438}
        height={670}
        className={cn("h-auto", imgClassName)}
        sizes="(min-width: 768px) 182px, 118px"
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : undefined}
      />
    </Link>
  );
}
