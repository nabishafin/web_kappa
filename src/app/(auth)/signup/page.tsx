import type { Metadata } from "next";
import { CredentialsForm } from "@/components/auth/credentials-form";
import { param } from "@/components/auth/search-params";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free Channel Infinity account and discover visionary independent animators.",
};

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const sp = await searchParams;
  return <CredentialsForm mode="signup" nextParam={param(sp, "next")} provider={param(sp, "provider")} />;
}
