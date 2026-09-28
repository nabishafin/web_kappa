"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { actions } from "@/lib/store";
import { sleep } from "@/lib/utils";
import { AuthInput, PasswordInput } from "./auth-input";
import { AuthHeading, AuthPanel, ForgotPasswordLink, GlowButton, OrDivider } from "./auth-ui";
import { newPasswordSchema, type NewPasswordValues } from "./schemas";

export function ResetPasswordForm() {
  const router = useRouter();
  // The eye on “Confirm Password” reveals both fields, so the new password can be checked too.
  const [visible, setVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirm: "" },
    mode: "onTouched",
  });

  const onSubmit = async () => {
    await sleep(700); // simulated “update password” request
    actions.setPendingEmail(null);
    router.replace("/login?reset=1");
  };

  return (
    <AuthPanel align="top">
      <AuthHeading
        title="Set Password"
        className="[&_h1]:text-[#e6e6e6]"
        subtitle={<p className="mt-[7px] text-lg leading-6 tracking-[0.01em]">Enter your new password</p>}
      />

      <OrDivider className="mt-[53px]" />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-[50px]" aria-label="Set a new password">
        {/* hidden username helps password managers attach the new credential to the right account */}
        <input type="text" name="username" autoComplete="username" hidden readOnly />
        <AuthInput
          label="New Password"
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          placeholder="New password"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Confirm password"
          containerClassName="mt-5"
          visible={visible}
          onVisibleChange={setVisible}
          error={errors.confirm?.message}
          {...register("confirm")}
        />
        <ForgotPasswordLink className="mt-2.5" />
        <GlowButton type="submit" loading={isSubmitting} wrapperClassName="mt-[26px]">
          Set New Password
        </GlowButton>
      </form>
    </AuthPanel>
  );
}
