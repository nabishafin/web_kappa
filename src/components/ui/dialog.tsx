"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Accessible modal built on the native <dialog> element
 * (focus trapping, Esc to close and inert background come for free).
 */
export function Dialog({
  open,
  onClose,
  children,
  className,
  labelledBy,
  describedBy,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  describedBy?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.body.style.overflow = "hidden";
    } else if (!open && el.open) {
      el.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // click on the backdrop (the dialog element itself) closes
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] overflow-visible bg-transparent p-0 text-white backdrop:bg-[#07020f]/75 backdrop:backdrop-blur-sm open:animate-rise",
        className,
      )}
    >
      {open && children}
    </dialog>
  );
}

export function DialogClose({ onClick, className, label = "Close" }: { onClick: () => void; className?: string; label?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn("grid size-9 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white", className)}
    >
      <X className="size-6" strokeWidth={1.8} />
    </button>
  );
}
