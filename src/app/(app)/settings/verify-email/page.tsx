import type { Metadata } from "next";
import { SettingsCard, VerifyEmailForm } from "@/components/settings/settings-forms";

export const metadata: Metadata = { title: "Verify Email", robots: { index: false } };

export default function VerifyEmailPage() {
  return (
    <SettingsCard title="Verify Email" backHref="/settings" description="Please enter the OTP we have sent you in your email." className="sm:pb-[120px]">
      <VerifyEmailForm />
    </SettingsCard>
  );
}
