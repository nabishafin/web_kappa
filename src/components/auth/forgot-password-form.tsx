"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { actions } from "@/lib/store";
import { sleep } from "@/lib/utils";
import { AuthInput } from "./auth-input";
import { AuthHeading, AuthPanel, GlowButton, OrDivider } from "./auth-ui";
import { emailSchema, type EmailValues } from "./schemas";

export function ForgotPasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({ resolver: zodResolver(emailSchema), defaultValues: { email: "" }, mode: "onTouched" });

  const onSubmit = async ({ email }: EmailValues) => {
    await sleep(700); // simulated “send reset code” request
    actions.setPendingEmail(email);
    router.push("/verify?flow=reset");
  };
  const submit = handleSubmit(onSubmit);

  return (
    <AuthPanel align="center" className="lg:pt-[26px]">
      <AuthHeading
        center
        title="Forgot Password"
        className="[&_h1]:text-[#e6e6e6]"
        subtitle={
          <p className="mt-[6px] text-[17px] leading-6 tracking-[0.01em] lg:text-[19.5px] lg:leading-7">
            Please enter your email address to reset your password.
          </p>
        }
      />

      <OrDivider className="mt-[74px]" />

      <form noValidate onSubmit={submit} className="mt-[50px]" aria-label="Reset your password">
        <AuthInput
          label="Enter your E-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter your E-mail"
          variant="white"
          leading={<Mail className="size-6" strokeWidth={1.5} />}
          error={errors.email?.message}
          {...register("email")}
        />
        <GlowButton type="submit" loading={isSubmitting} wrapperClassName="mt-6">
          Reset Password
        </GlowButton>
      </form>

      <p className="mt-[13px] text-center font-display text-[20px] leading-7 text-[#e6e6e6]">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={submit}
          disabled={isSubmitting}
          className="rounded-sm underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Resend
        </button>
      </p>
    </AuthPanel>
  );
}
