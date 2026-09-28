import { Check } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac";

type NativeProps = Omit<ComponentProps<"input">, "type"> & { invalid?: boolean };

/** Native checkbox, visually restyled (12px white square → violet with a tick when checked). */
export function CheckboxBox({ className, invalid, ...props }: NativeProps) {
  return (
    <span className={cn("relative inline-grid size-3 shrink-0 place-items-center", className)}>
      <input
        type="checkbox"
        aria-invalid={invalid || undefined}
        className={cn(
          "peer size-3 cursor-pointer appearance-none rounded-[2px] bg-white transition-colors checked:bg-brand aria-invalid:shadow-[0_0_0_1.5px_#ff4d4d] disabled:opacity-50",
          focusRing,
        )}
        {...props}
      />
      <Check aria-hidden strokeWidth={4} className="pointer-events-none absolute size-2.5 text-white opacity-0 peer-checked:opacity-100" />
    </span>
  );
}

/** Native radio, visually restyled (12px white disc → violet with a white centre when checked). */
export function RadioDot({ className, invalid, ...props }: NativeProps) {
  return (
    <input
      type="radio"
      // aria-invalid isn't valid on role=radio; the group's fieldset describes the error instead
      data-invalid={invalid || undefined}
      className={cn(
        "size-3 shrink-0 cursor-pointer appearance-none rounded-full bg-white transition-[background-color,box-shadow] checked:bg-brand checked:shadow-[inset_0_0_0_3px_white] data-invalid:shadow-[0_0_0_1.5px_#ff4d4d]",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

/** One option row (control + text); the whole row is the click target. */
export function ChoiceRow({ control, children, className }: { control: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cn("flex w-fit cursor-pointer items-start gap-[13px] text-base leading-[18.75px] text-white", className)}>
      <span className="flex shrink-0 pt-[6.5px]">{control}</span>
      <span className="relative top-[2px]">{children}</span>
    </label>
  );
}
