import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CheckboxBox, ChoiceRow } from "./choice";
import { describedBy, FieldError, labelClass, RequiredMark } from "./field";
import type { SelectOption } from "./select";

/**
 * <fieldset> of checkboxes bound to one react-hook-form array field.
 * `other` renders a trailing “Other: [input]” row whose checkbox belongs to the same group.
 */
export function CheckboxGroup({
  id,
  legend,
  required,
  error,
  options,
  inputProps,
  other,
  className,
}: {
  id: string;
  legend: ReactNode;
  required?: boolean;
  error?: string;
  options: readonly SelectOption[];
  inputProps: UseFormRegisterReturn;
  other?: { value: string; label?: string; input: ReactNode };
  className?: string;
}) {
  const invalid = !!error;
  return (
    <fieldset id={id} aria-describedby={describedBy(id, error)} className={cn("min-w-0", className)}>
      <legend className={labelClass}>
        {legend}
        {required && <RequiredMark />}
      </legend>
      <div className="mt-[9.75px] flex flex-col gap-5">
        {options.map((o) => (
          <ChoiceRow key={o.value} control={<CheckboxBox value={o.value} invalid={invalid} {...inputProps} />}>
            {o.label}
          </ChoiceRow>
        ))}
        {other && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <label className="flex cursor-pointer items-center gap-[9px] text-base text-white">
              <CheckboxBox value={other.value} invalid={invalid} {...inputProps} />
              <span className="relative top-px">{other.label ?? "Other:"}</span>
            </label>
            <div className="max-w-[350px] min-w-[200px] flex-1">{other.input}</div>
          </div>
        )}
      </div>
      <FieldError id={id} message={error} />
    </fieldset>
  );
}
