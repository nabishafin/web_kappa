"use client";

import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent, type Ref } from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  /** fired once every box holds a digit */
  onComplete?: (value: string) => void;
  length?: number;
  invalid?: boolean;
  disabled?: boolean;
  /** id of the element labelling the group */
  labelledBy?: string;
  describedBy?: string;
  className?: string;
  /** receives the first box so a form library can focus it on error */
  firstRef?: Ref<HTMLInputElement>;
}

const onlyDigits = (s: string) => s.replace(/\D/g, "");

/**
 * Segmented one-time-code field.
 * Auto-advances, supports Backspace/Delete, ←/→/Home/End, paste of the whole code and
 * SMS / email autofill (`autocomplete="one-time-code"` delivers the full code to one box).
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  invalid,
  disabled,
  labelledBy,
  describedBy,
  className,
  firstRef,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");
  // Focus moves synchronously after a change, before React re-renders — keep the latest value at hand.
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);

  const focusBox = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select();
  };

  const commit = (next: string) => {
    const clean = onlyDigits(next).slice(0, length);
    latest.current = clean;
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  /** write `chars` starting at box `index`, then move focus after the last written box */
  const fill = (index: number, chars: string) => {
    const incoming = onlyDigits(chars);
    if (!incoming) return;
    const arr = digits.slice();
    // A full-length paste / autofill always replaces the whole code.
    const start = incoming.length >= length ? 0 : index;
    for (let k = 0; k < incoming.length && start + k < length; k++) arr[start + k] = incoming[k];
    // keep the value contiguous: never leave holes before a filled box
    const joined = arr.join("");
    commit(joined);
    focusBox(Math.min(start + incoming.length, length - 1));
  };

  const handleKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Backspace": {
        e.preventDefault();
        const arr = digits.slice();
        if (arr[i]) {
          arr[i] = "";
          commit(arr.join(""));
        } else if (i > 0) {
          arr[i - 1] = "";
          commit(arr.join(""));
          focusBox(i - 1);
        }
        break;
      }
      case "Delete": {
        e.preventDefault();
        const arr = digits.slice();
        arr.splice(i, 1);
        commit(arr.join(""));
        break;
      }
      case "ArrowLeft":
        e.preventDefault();
        focusBox(i - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        focusBox(i + 1);
        break;
      case "Home":
        e.preventDefault();
        focusBox(0);
        break;
      case "End":
        e.preventDefault();
        focusBox(length - 1);
        break;
      default:
        // block non-digit printable characters
        if (e.key.length === 1 && !/\d/.test(e.key) && !e.metaKey && !e.ctrlKey) e.preventDefault();
    }
  };

  const handlePaste = (i: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    fill(i, e.clipboardData.getData("text"));
  };

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={cn("flex justify-between gap-2", className)}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
            if (i === 0 && firstRef) {
              if (typeof firstRef === "function") firstRef(el);
              else firstRef.current = el;
            }
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          enterKeyHint={i === length - 1 ? "done" : "next"}
          maxLength={i === 0 ? length : 1}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          value={d}
          // Clicking a box past the first empty one jumps to the next box that needs a digit.
          onFocus={(e) => {
            const filled = latest.current.length;
            if (filled < length && i > filled) focusBox(filled);
            else e.currentTarget.select();
          }}
          onChange={(e) => {
            const v = onlyDigits(e.target.value);
            if (!v) return;
            // replace the current digit with the most recently typed one (or distribute an autofill)
            fill(i, v.length > 1 && v.length < length ? v.slice(-1) : v);
          }}
          onKeyDown={handleKeyDown(i)}
          onPaste={handlePaste(i)}
          className={cn(
            "size-11 shrink-0 rounded-[8px] border border-[#c8cacc] bg-transparent text-center text-xl font-semibold text-white caret-lilac outline-none transition-[border-color,box-shadow] duration-150 sm:size-[44px]",
            "focus-visible:border-lilac focus-visible:shadow-[0_0_0_3px_rgb(208_188_255/0.35)]",
            d && "border-white",
            invalid && "border-danger focus-visible:border-danger focus-visible:shadow-[0_0_0_3px_rgb(240_79_91/0.35)]",
            "disabled:opacity-60",
          )}
        />
      ))}
    </div>
  );
}
