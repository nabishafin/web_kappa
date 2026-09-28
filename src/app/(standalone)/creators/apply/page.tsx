import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/creator-form/callout";
import { SubmissionForm } from "@/components/creator-form/submission-form";

export const metadata: Metadata = {
  title: "Content Submission Form",
  description:
    "Indie animation company or producer? Apply to feature your show or movie on Channel Infinity with our content submission form.",
  alternates: { canonical: "/creators/apply" },
};

export default function CreatorApplyPage() {
  return (
    <div className="px-3 py-6 font-roboto sm:px-4 md:pt-[78px] md:pb-[78px]">
      <article className="mx-auto max-w-[900px] rounded-2xl border border-[#323232] bg-[#121212] px-4 pt-8 pb-8 sm:px-8 md:px-12 md:pt-[45px] md:pb-[47px]">
        <header className="border-b-2 border-[#c77dff] pb-8 md:pb-[42px]">
          <h1
            id="apply-heading"
            className="relative top-[2px] mx-auto max-w-[700px] text-center text-[28px] leading-[34px] font-bold text-[#c77dff] sm:text-[34px] sm:leading-[42px] md:text-[40px] md:leading-[48px]"
          >
            Channel Infinity Content Submission Form
          </h1>
        </header>

        <div className="mt-6 space-y-6">
          <Callout className="pt-5 pb-5 md:pt-[32px] md:pb-[25px]">
            <p>
              Welcome! If you&apos;re an indie animation company or producer interested in featuring your show or movie on Channel Infinity,
              please complete the application below. We&apos;re excited to review your content and explore potential collaborations.
            </p>
          </Callout>

          <Callout tone="warning" className="pt-4 pb-4 md:pt-[24px] md:pr-[72px] md:pb-[17px]">
            To ensure compliance with platform policies and legal requirements, users must be 18 years or older to Access the Creator Page for
            uploading and managing content, and collect earnings from tips, fundraisers, or other revenue sources on Channel Infinity. This rule
            safeguards financial transactions, protects younger users, and maintains a professional and secure environment for creators and
            contributors.
          </Callout>

          <Callout className="pt-5 pb-5 md:pt-[24px] md:pb-[24px]">
            <p>
              Before uploading content to Channel Infinity, all creators must adhere to our Content Upload Rules and guidelines. To ensure quality
              and compliance, you are required to complete a submission form for your show or movie. Additionally, please review the linked
              document that outlines our guidelines and criteria for content approval. Only content that meets our standards will be considered
              for inclusion on the platform. Please make sure the drive links are public so the team can access them better Thank you :)
            </p>
            <Link
              href="/legal/content-guidelines"
              className="mt-[2px] inline-block text-[#c77dff] underline-offset-2 transition-colors hover:text-[#dcaaff] hover:underline"
            >
              See rules here
            </Link>
          </Callout>
        </div>

        <SubmissionForm />
      </article>
    </div>
  );
}
