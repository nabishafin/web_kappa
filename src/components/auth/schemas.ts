import { z } from "zod";

/** Shared validation rules for the auth flow (mirrors the API contract). */
export const emailField = z
  .string()
  .trim()
  .min(1, "Please enter your email address")
  .pipe(z.email("Please enter a valid email address"));

export const passwordField = z
  .string()
  .min(1, "Please enter your password")
  .min(8, "Password must be at least 8 characters");

export const credentialsSchema = z.object({ email: emailField, password: passwordField });
export type CredentialsValues = z.infer<typeof credentialsSchema>;

export const emailSchema = z.object({ email: emailField });
export type EmailValues = z.infer<typeof emailSchema>;

export const newPasswordSchema = z
  .object({
    password: passwordField,
    confirm: z.string().min(1, "Please confirm your new password"),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords do not match" });
export type NewPasswordValues = z.infer<typeof newPasswordSchema>;

export const OTP_LENGTH = 6;
export const otpSchema = z.object({
  code: z.string().regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `Enter the ${OTP_LENGTH}-digit code`),
});
export type OtpValues = z.infer<typeof otpSchema>;

/** Only allow same-origin relative redirects (prevents open-redirects via ?next=). */
export function safeNext(next: string | null | undefined, fallback = "/home") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

/** Demo account used by the social sign-in buttons until OAuth is wired up. */
export const DEMO_USER = { email: "rokey@channelinfinity.com", displayName: "Rokey" } as const;
