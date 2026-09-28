"use client";

import { useRouter } from "next/navigation";
import { SupportPanel } from "@/components/title/support-panel";

export function SupportPage({ slug, titleName }: { slug: string; titleName: string }) {
  const router = useRouter();
  return (
    <div className="flex justify-center bg-[linear-gradient(180deg,#130628_0%,#110a22_45%,#0f081d_100%)] px-4 py-16 md:py-[135px]">
      <SupportPanel titleName={titleName} onClose={() => router.push(`/title/${slug}`)} />
    </div>
  );
}
