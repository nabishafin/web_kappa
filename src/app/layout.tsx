import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Roboto } from "next/font/google";
import { Effects } from "@/components/ui/effects";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-family",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Channel Infinity — The Future of Independent Animation",
    template: "%s · Channel Infinity",
  },
  description:
    "Immerse yourself in a universe of award-winning shorts, series, and experimental films curated from the world's most visionary independent creators.",
  applicationName: "Channel Infinity",
  keywords: ["animation", "streaming", "independent creators", "short films", "indie animation"],
  openGraph: {
    type: "website",
    siteName: "Channel Infinity",
    title: "Channel Infinity — The Future of Independent Animation",
    description: "Award-winning shorts, series and experimental films from visionary independent animators.",
    images: [{ url: "/images/landing/hero-bg.webp", width: 1440, height: 640 }],
  },
  twitter: { card: "summary_large_image" },
  
};

export const viewport: Viewport = {
  themeColor: "#030213",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${roboto.variable} h-full`} data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        {children}
        <Toaster />
        <Effects />
      </body>
    </html>
  );
}
