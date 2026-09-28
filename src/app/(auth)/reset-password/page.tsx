import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set Password",
  description: "Choose a new password for your Channel Infinity account.",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
