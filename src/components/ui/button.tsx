import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "flat" | "secondary" | "outline" | "ghost" | "light" | "glass";
type Size = "sm" | "md" | "lg" | "xl";

const base =
  "relative inline-flex select-none [&>svg]:shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold text-white transition-[background,box-shadow,transform,opacity,border-color] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac";

const variants: Record<Variant, string> = {
  primary: "surface-primary",
  flat: "surface-flat",
  secondary: "surface-secondary",
  outline: "border border-white/35 bg-white/[0.06] backdrop-blur-sm hover:bg-white/[0.12]",
  glass: "border border-[#5a476f] bg-[#302a41]/90 hover:bg-[#3b3350]",
  ghost: "bg-transparent hover:bg-white/5",
  light: "bg-lilac text-[#3c0e7a] hover:bg-[#dccbff]",
};

const sizes: Record<Size, string> = {
  sm: "h-12 rounded-[10px] px-6 text-base",
  md: "h-[52px] rounded-[10px] px-7 text-lg",
  lg: "h-[62px] rounded-[12px] px-6 text-2xl font-medium",
  xl: "h-16 rounded-[14px] px-8 text-2xl font-medium",
};

export interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
}

export function buttonClass({ variant = "primary", size = "sm", block, className }: ButtonStyleProps = {}) {
  return cn(base, variants[variant], sizes[size], block && "w-full", className);
}

export function Button({
  variant,
  size,
  block,
  className,
  loading,
  children,
  type = "button",
  disabled,
  ...rest
}: ComponentProps<"button"> & ButtonStyleProps & { loading?: boolean }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass({ variant, size, block, className })}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  block,
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & ButtonStyleProps & { children: ReactNode }) {
  return (
    <Link className={buttonClass({ variant, size, block, className })} {...rest}>
      {children}
    </Link>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white", className)}
    />
  );
}
