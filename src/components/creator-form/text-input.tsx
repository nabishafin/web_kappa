import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Shared look for single-line controls (text inputs + selects). */
export const controlClass =
  "block w-full rounded-[6px] border border-[#dcdcdc] bg-[#04020a] font-sans text-sm tracking-[0.02em] text-white outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#e6e6e6] placeholder:opacity-100 hover:border-white focus-visible:border-lilac focus-visible:shadow-[0_0_0_3px_rgb(199_125_255/0.35)] aria-invalid:border-[#ff4d4d] aria-invalid:focus-visible:shadow-[0_0_0_3px_rgb(255_77_77/0.3)] disabled:opacity-50";

export function TextInput({ className, invalid, ...props }: ComponentProps<"input"> & { invalid?: boolean }) {
  return <input aria-invalid={invalid || undefined} className={cn(controlClass, "h-11 px-[11px]", className)} {...props} />;
}
