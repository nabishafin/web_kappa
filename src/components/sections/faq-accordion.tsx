"use client";

import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";
import type { FaqItem } from "@/lib/types";
import { cn } from "@/lib/utils";

function FaqRow({
  item,
  n,
  open,
  onToggle,
  column,
}: {
  item: FaqItem;
  n: number;
  open: boolean;
  onToggle: () => void;
  column: "left" | "right";
}) {
  const id = useId();
  return (
    <div
      className={cn(
        "relative after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[linear-gradient(90deg,#4a1763,#8a2fb3_50%,#6a2390)]",
        column === "right" ? "last:after:hidden" : "lg:last:after:hidden",
      )}
    >
      <div className={cn("flex gap-[18px] pt-[30px] pb-[31px] sm:gap-[25px] sm:pr-[39px] sm:pl-[34px]", open ? "items-start" : "items-center")}>
        <span
          aria-hidden
          className="border-glow grid h-[66px] w-16 shrink-0 place-items-center rounded-[10px] bg-graphite-2 text-xl font-medium text-white [--glow:linear-gradient(180deg,#9a5bd6,#4b2c6b)]"
        >
          {String(n).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h3>
            <button
              type="button"
              id={`${id}-btn`}
              aria-expanded={open}
              aria-controls={`${id}-panel`}
              onClick={onToggle}
              className="flex w-full items-start justify-between gap-4 text-left after:absolute after:inset-0 after:content-['']"
            >
              <span className="text-lg leading-8 font-medium text-white sm:text-[22px]">{item.question}</span>
              <span aria-hidden className={cn("grid size-8 shrink-0 place-items-center text-white", open && "-mt-1")}>
                {open ? <Minus className="size-7" strokeWidth={1.8} /> : <Plus className="size-7" strokeWidth={1.8} />}
              </span>
            </button>
          </h3>
          <div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-btn`}
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
              open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <p className="max-w-[330px] pt-[13px] pb-[5px] text-lg leading-[27px] font-light text-fog">{item.answer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const half = Math.ceil(items.length / 2);
  const cols = [items.slice(0, half), items.slice(half)];

  return (
    <div className="grid gap-x-20 lg:grid-cols-2">
      {cols.map((col, ci) => (
        <div key={ci}>
          {col.map((item, i) => (
            <FaqRow
              key={item.id}
              item={item}
              n={ci * half + i + 1}
              column={ci === 0 ? "left" : "right"}
              open={openId === item.id}
              onToggle={() => setOpenId((cur) => (cur === item.id ? null : item.id))}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
