"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthInput } from "@/components/auth/auth-input";
import { FLAT_GLOSS, GlowButton } from "@/components/auth/auth-ui";
import { buttonClass } from "@/components/ui/button";
import { actions, useAppState, useHydrated } from "@/lib/store";
import type { UserProfile } from "@/lib/types";
import { cn, sleep } from "@/lib/utils";
import { BackLink, FocusFrame } from "../../_components/focus-ui";
import { toast } from "@/lib/toast";

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(32, "Display name must be 32 characters or fewer"),
});
type ProfileValues = z.infer<typeof profileSchema>;

export function EditProfile() {
  const hydrated = useHydrated();
  const user = useAppState((s) => s.user);

  return (
    <FocusFrame
      className="lg:pb-[4px]" back={<BackLink fallback="/profile" className="-ml-[6px] lg:mt-0.5" />} title="Edit Profile" gutter={91} column={436}>
      <div className="mt-[25px] flex justify-center">
        {hydrated && user ? (
          <Image
            src={user.avatar}
            alt={`${user.displayName}’s avatar`}
            width={156}
            height={156}
            sizes="156px"
            loading="eager"
            fetchPriority="high"
            className="size-[132px] rounded-full object-cover sm:size-[156px]"
          />
        ) : (
          <span aria-hidden className="skeleton size-[132px] rounded-full sm:size-[156px]" />
        )}
      </div>

      <p className="mt-[22px] text-center text-lg leading-7 text-white sm:text-xl">
        Select profile avatar and enter a display name
      </p>

      {/* Remount once the persisted user is available so the field is pre-filled. */}
      <ProfileForm key={hydrated ? (user?.id ?? "none") : "ssr"} user={hydrated ? user : null} />
    </FocusFrame>
  );
}

function ProfileForm({ user }: { user: UserProfile | null }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: user?.displayName ?? "" },
    mode: "onTouched",
  });

  const onSubmit = async ({ displayName }: ProfileValues) => {
    await sleep(500); // simulated profile update request
    actions.updateProfile({ displayName });
    toast.success("Profile updated", { description: `You’ll appear as “${displayName}”.` });
    router.push("/profile");
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Edit profile" className="mt-12">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/profile/avatar"
          className={cn(
            buttonClass({ variant: "secondary", size: "sm" }),
            "h-12 rounded-[10px] border-[#a079ba] bg-[linear-gradient(180deg,#433a47_0%,#46304f_100%)] text-base font-bold tracking-[0.01em] shadow-[0_4px_14px_-4px_rgb(120_40_170/0.55)]",
          )}
        >
          Select profile avatar
        </Link>
        <AuthInput
          label="Display name"
          hideLabel
          variant="dark"
          placeholder="Display name"
          autoComplete="nickname"
          maxLength={32}
          disabled={!user}
          error={errors.displayName?.message}
          {...register("displayName")}
        />
      </div>
      <GlowButton
        type="submit"
        glow={false}
        className={FLAT_GLOSS}
        loading={isSubmitting}
        disabled={!user}
        wrapperClassName="mt-6"
      >
        Save
      </GlowButton>
    </form>
  );
}
