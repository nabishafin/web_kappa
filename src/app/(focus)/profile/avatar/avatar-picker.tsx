"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { FLAT_GLOSS, GlowButton } from "@/components/auth/auth-ui";
import { avatarOptions } from "@/lib/data/catalog";
import { actions, useAppState, useHydrated } from "@/lib/store";
import { cn, sleep } from "@/lib/utils";
import { BackLink, FocusFrame } from "../../_components/focus-ui";
import { toast } from "@/lib/toast";

const COLUMNS = 3;

export function AvatarPicker() {
  const router = useRouter();
  const titleId = useId();
  const hydrated = useHydrated();
  const current = useAppState((s) => s.user?.avatar ?? null);
  const [picked, setPicked] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Until the user picks, reflect the saved avatar (falls back to the default avatar).
  const selected = picked ?? (hydrated ? current : null) ?? avatarOptions[1].src;
  const selectedIndex = Math.max(
    0,
    avatarOptions.findIndex((a) => a.src === selected),
  );

  const choose = (index: number) => {
    const i = (index + avatarOptions.length) % avatarOptions.length;
    setPicked(avatarOptions[i].src);
    refs.current[i]?.focus();
  };

  // WAI-ARIA radio group: arrows move + select, Home/End jump; Up/Down move by a row in the grid.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: COLUMNS,
      ArrowLeft: -1,
      ArrowUp: -COLUMNS,
    };
    if (e.key in moves) {
      e.preventDefault();
      choose(selectedIndex + moves[e.key]);
    } else if (e.key === "Home") {
      e.preventDefault();
      choose(0);
    } else if (e.key === "End") {
      e.preventDefault();
      choose(avatarOptions.length - 1);
    }
  };

  const save = async () => {
    setSaving(true);
    await sleep(500); // simulated profile update request
    actions.updateProfile({ avatar: selected });
    toast.success("New avatar saved");
    router.push("/profile/edit");
  };

  return (
    <FocusFrame
      className="lg:pb-[5px]"
      back={<BackLink fallback="/profile/edit" className="-ml-[6px] lg:mt-0.5" />}
      title="Select an avatar"
      titleId={titleId}
      gutter={103}
      column={580}
    >
      <div
        role="radiogroup"
        aria-labelledby={titleId}
        className="mx-auto mt-[48px] grid w-fit grid-cols-3 gap-x-5 gap-y-7 sm:gap-x-[39px] sm:gap-y-[53px]"
      >
        {avatarOptions.map((a, i) => {
          const checked = i === selectedIndex;
          return (
            <button
              key={a.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={a.label}
              tabIndex={checked ? 0 : -1}
              onClick={() => choose(i)}
              onKeyDown={onKeyDown}
              className={cn(
                "group relative size-[88px] rounded-full transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-offset-[6px] sm:size-[133px]",
                checked && "shadow-[0_0_0_1px_#000,0_0_0_3px_#2fff7e]",
              )}
            >
              <Image
                src={a.src}
                alt=""
                width={133}
                height={133}
                sizes="(min-width: 640px) 133px, 88px"
                loading="eager"
                className="size-full rounded-full object-cover"
              />
            </button>
          );
        })}
      </div>

      <GlowButton
        type="button"
        glow={false}
        className={FLAT_GLOSS}
        loading={saving}
        onClick={save}
        wrapperClassName="mt-[50px]"
      >
        Save
      </GlowButton>
    </FocusFrame>
  );
}
