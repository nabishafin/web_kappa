"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "soft" | "white" | "dark";

const fieldVariants: Record<Variant, string> = {
  /* login / sign-up / set-password: pale blue-white field */
  soft: "h-[52px] rounded-[8px] bg-[#f6fafd] font-display text-base text-[#15172a] placeholder:text-[#b8b8c9] placeholder:opacity-100 px-4",
  /* forgot-password: pure white with a hairline border */
  white:
    "h-12 rounded-[6px] border border-[#e0e0e0] bg-white font-display text-base text-[#15172a] placeholder:text-[#454e5b] placeholder:opacity-100 px-4",
  /* profile pages: near-black field with a light hairline */
  dark: "h-12 rounded-[8px] border border-[#dcdcdc] bg-[#04020a] text-[15px] text-white placeholder:text-[#e6e6e6] placeholder:opacity-100 px-3",
};

export interface AuthInputProps extends Omit<ComponentProps<"input">, "size"> {
  label: string;
  /** visually hide the label (still announced to screen readers) */
  hideLabel?: boolean;
  error?: string;
  hint?: ReactNode;
  variant?: Variant;
  leading?: ReactNode;
  trailing?: ReactNode;
  containerClassName?: string;
}

export function AuthInput({
  label,
  hideLabel,
  error,
  hint,
  variant = "soft",
  leading,
  trailing,
  id,
  className,
  containerClassName,
  ...rest
}: AuthInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col", containerClassName)}>
      <label
        htmlFor={inputId}
        className={cn(
          "mb-[6px] font-display text-[20px] leading-[26px] font-normal tracking-[0.005em] text-[#e6e6e6]",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>
      <div className="relative">
        {leading && (
          <span className="pointer-events-none absolute inset-y-0 left-1.5 flex items-center text-[#7a797a]">{leading}</span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full outline-none transition-[box-shadow,border-color] duration-150",
            "focus-visible:shadow-[0_0_0_2px_#080b1c,0_0_0_4px_var(--color-lilac)]",
            fieldVariants[variant],
            leading && "pl-[41px]",
            trailing && "pr-12",
            error && "shadow-[0_0_0_2px_var(--color-danger)] focus-visible:shadow-[0_0_0_2px_#080b1c,0_0_0_4px_var(--color-danger)]",
            className,
          )}
          {...rest}
        />
        {trailing && <span className="absolute inset-y-0 right-3 flex items-center">{trailing}</span>}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
      {hint && (
        <div id={hintId} className="mt-1.5">
          {hint}
        </div>
      )}
    </div>
  );
}

/** Password field with a show / hide toggle (optionally controlled, so one toggle can drive several fields). */
export function PasswordInput({
  visible: visibleProp,
  onVisibleChange,
  ...props
}: Omit<AuthInputProps, "type" | "trailing"> & { visible?: boolean; onVisibleChange?: (visible: boolean) => void }) {
  const [visibleState, setVisibleState] = useState(false);
  const visible = visibleProp ?? visibleState;
  const toggle = () => {
    setVisibleState(!visible);
    onVisibleChange?.(!visible);
  };
  return (
    <AuthInput
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={toggle}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="grid size-8 place-items-center rounded-md text-[#bfc3d4] transition-colors hover:text-[#7d8197] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand"
        >
          {visible ? <Eye className="size-6" strokeWidth={1.6} /> : <EyeOff className="size-6" strokeWidth={1.6} />}
        </button>
      }
    />
  );
}
