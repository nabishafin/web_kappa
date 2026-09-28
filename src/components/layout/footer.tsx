import Link from "next/link";
import { FacebookIcon, LinkedInIcon, TwitterIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

const columns = [
  {
    heading: { label: "Home", href: "/home" },
    links: [
      { label: "Categories", href: "/categories" },
      { label: "Devices", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: { label: "Animation", href: "/categories" },
    links: [
      { label: "Genres", href: "/categories" },
      { label: "Trending", href: "/home#trending" },
      { label: "New Release", href: "/categories?sort=new" },
      { label: "Popular", href: "/categories?sort=popular" },
    ],
  },
  { heading: { label: "Support", href: "/support" }, links: [{ label: "Contact Us", href: "/support" }] },
  {
    heading: { label: "Subscription", href: "/pricing" },
    links: [
      { label: "Plans", href: "/pricing" },
      { label: "Features", href: "/pricing#features" },
    ],
  },
];

const socials = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Twitter", href: "https://twitter.com", Icon: TwitterIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedInIcon },
];

const legal = [
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Cookie Policy", href: "/legal/cookies" },
];

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("bg-footer font-display", className)}>
      <div className="container-ci pt-16 pb-12 md:pt-[102px] md:pb-[59px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[repeat(4,minmax(0,254px))_1fr] lg:gap-x-4 xl:gap-0">
          {columns.map((col) => (
            <nav key={col.heading.label} aria-label={col.heading.label}>
              <Link href={col.heading.href} className="text-xl leading-7 font-medium text-white transition-colors hover:text-lilac">
                {col.heading.label}
              </Link>
              <ul className="mt-6 space-y-[13px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-lg leading-7 text-haze transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className="text-xl leading-7 font-medium text-white">Connect With Us</p>
            <ul className="mt-[25px] flex gap-[14px]">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="grid size-14 place-items-center rounded-[10px] border border-line bg-graphite text-white transition-colors hover:border-brand/60 hover:bg-[#241c2e]"
                  >
                    <Icon className="size-6" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse gap-5 border-t border-line pt-6 md:mt-[99px] md:flex-row md:items-center md:justify-between">
          <p className="text-base leading-7 text-haze md:text-lg">@{new Date().getFullYear()} Channelinfinity, All Rights Reserved</p>
          <ul className="flex flex-wrap items-center">
            {legal.map((l, i) => (
              <li key={l.label} className={cn("flex items-center", i > 0 && "before:mx-5 before:h-7 before:w-px before:bg-line")}>
                <Link href={l.href} className="text-base leading-7 text-haze transition-colors hover:text-white md:text-lg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
