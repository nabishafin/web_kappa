import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "System Settings", robots: { index: false } };

const items = [
  { label: "Subscription", href: "/pricing", description: "Manage your plan and billing" },
  { label: "Change Password", href: "/settings/password", description: "Update the password you sign in with" },
  { label: "Terms & Conditions", href: "/legal/terms", description: "Read our terms of use" },
  { label: "Privacy Policy", href: "/legal/privacy", description: "How we handle your data" },
  { label: "Support", href: "/support", description: "Get help from our team" },
];

export default function SettingsPage() {
  return (
    <div className="bg-[#060317] pt-12 pb-24 md:pt-[104px] md:pb-[132px]">
      <div className="mx-auto w-[min(1107px,calc(100%-40px))]">
        <h1 className="text-2xl leading-8 font-semibold tracking-[-0.005em] text-white md:text-[26px]">System Settings</h1>
        <p className="mt-[9px] text-lg leading-7 text-[#c9c6d2] md:text-xl">Manage your account, platform features, and system configuration</p>

        <nav aria-label="Settings" className="mt-12 rounded-[12px] border border-[#7a3fc4] bg-[#0f0f0f] p-[21px] md:mt-[94px]">
          <ul className="space-y-[18px]">
            {items.map((it, i) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`group flex h-[65px] items-center justify-between rounded-[8px] border px-[21px] text-white transition-colors hover:border-[#8a55e0] focus-visible:border-[#8a55e0] focus-visible:outline-none ${i === 0 ? "border-[#8a55e0]" : "border-transparent"}`}
                >
                  <span className="flex flex-col">
                    <span className="text-xl leading-7">{it.label}</span>
                    <span className="sr-only">{it.description}</span>
                  </span>
                  <ChevronRight aria-hidden className="size-8 text-white transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
