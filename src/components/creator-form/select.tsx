import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { controlClass } from "./text-input";

export interface SelectOption {
  value: string;
  label: string;
}

/** Native <select> (keyboard + screen-reader friendly) with the design's custom chevron. */
export function Select({
  className,
  invalid,
  options,
  placeholder,
  ...props
}: ComponentProps<"select"> & { invalid?: boolean; options: readonly SelectOption[]; placeholder: string }) {
  return (
    <div className={cn("relative", className)}>
      <select aria-invalid={invalid || undefined} className={cn(controlClass, "h-full min-h-11 appearance-none pr-11 pl-[11px]")} {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#121212] text-white">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        strokeWidth={1.6}
        className="pointer-events-none absolute top-1/2 right-4 size-[18px] -translate-y-1/2 text-white"
      />
    </div>
  );
}
