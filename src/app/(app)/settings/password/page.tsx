import type { Metadata } from "next";
import { ChangePasswordForm, SettingsCard } from "@/components/settings/settings-forms";

export const metadata: Metadata = { title: "Change Password", robots: { index: false } };

export default function ChangePasswordPage() {
  return (
    <SettingsCard title="Change Password" backHref="/settings" description="Your password must be 8-10 character long.">
      <ChangePasswordForm />
    </SettingsCard>
  );
}
