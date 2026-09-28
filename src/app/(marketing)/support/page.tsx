import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { SectionHeading } from "@/components/sections/section-heading";
import { listFaqs } from "@/lib/api/catalog";

export const metadata: Metadata = { title: "Support", description: "Get help with your Channel Infinity account, billing or playback." };

export default async function SupportPage() {
  const faqs = await listFaqs();
  return (
    <div className="bg-night pt-16 pb-24 font-display md:pt-24 md:pb-[140px]">
      <div className="container-ci grid gap-14 lg:grid-cols-[1fr_460px] lg:gap-16">
        <div className="min-w-0">
          <SectionHeading
            title={<span className="text-[40px] leading-[1.1] md:text-5xl">How can we help?</span>}
            description="Our support team typically replies within 24 hours. You might find your answer right here first."
          />
          {/* single column here: the sidebar leaves no room for two */}
          <div className="mt-10 [&>div]:lg:grid-cols-1">
            <FaqAccordion items={faqs} />
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
