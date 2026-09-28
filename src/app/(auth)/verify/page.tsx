import type { Metadata } from "next";
import { param } from "@/components/auth/search-params";
import { VerifyForm } from "@/components/auth/verify-form";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Enter the 6-digit verification code we sent to your email.",
  robots: { index: false },
};

export default async function VerifyPage({ searchParams }: PageProps<"/verify">) {
  const sp = await searchParams;
  return <VerifyForm flow={param(sp, "flow")} nextParam={param(sp, "next")} />;
}
