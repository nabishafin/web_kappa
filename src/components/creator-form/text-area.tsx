import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function TextArea({ className, invalid, rows = 4, ...props }: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        "block h-[122px] min-h-[122px] w-full resize-y [field-sizing:content] supports-[field-sizing:content]:resize-none rounded-[8px] border-2 border-[#474747] bg-[#2b2b2b] px-[18px] pt-[13.5px] pb-3 font-roboto text-base leading-[18.75px] text-white outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#757575] placeholder:opacity-100 hover:border-[#5a5a5a] focus-visible:border-lilac focus-visible:shadow-[0_0_0_3px_rgb(199_125_255/0.3)] aria-invalid:border-[#ff4d4d]",
        className,
      )}
      {...props}
    />
  );
}
