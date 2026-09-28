import type { Metadata } from "next";
import { CredentialsForm } from "@/components/auth/credentials-form";
import { param } from "@/components/auth/search-params";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to Channel Infinity to keep watching independent animation.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const sp = await searchParams;
  return (
    <CredentialsForm
      mode="login"
      nextParam={param(sp, "next")}
      provider={param(sp, "provider")}
      resetDone={param(sp, "reset") === "1"}
    />
  );
}
