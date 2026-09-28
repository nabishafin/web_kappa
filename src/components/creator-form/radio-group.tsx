import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ChoiceRow, RadioDot } from "./choice";
import { describedBy, FieldError, labelClass, RequiredMark } from "./field";
import type { SelectOption } from "./select";

/** <fieldset> of native radios bound to one react-hook-form field. */
export function RadioGroup({
  id,
  legend,
  required,
  error,
  options,
  inputProps,
  className,
  children,
}: {
  id: string;
  legend: ReactNode;
  required?: boolean;
  error?: string;
  options: readonly SelectOption[];
  inputProps: UseFormRegisterReturn;
  className?: string;
  /** extra content under the options (e.g. a conditional follow-up field) */
  children?: ReactNode;
}) {
  const invalid = !!error;
  return (
    <fieldset id={id} aria-describedby={describedBy(id, error)} className={cn("min-w-0", className)}>
      <legend className={labelClass}>
        {legend}
        {required && <RequiredMark />}
      </legend>
      <div className="mt-[10px] flex flex-col gap-5">
        {options.map((o) => (
          <ChoiceRow key={o.value} control={<RadioDot value={o.value} invalid={invalid} required={required} {...inputProps} />}>
            {o.label}
          </ChoiceRow>
        ))}
      </div>
      <FieldError id={id} message={error} />
      {children}
    </fieldset>
  );
}
