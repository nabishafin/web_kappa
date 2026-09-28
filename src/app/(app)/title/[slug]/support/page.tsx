import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SupportPage } from "@/components/title/support-page";
import { getTitle } from "@/lib/api/catalog";

export async function generateMetadata({ params }: PageProps<"/title/[slug]/support">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTitle(slug);
  return { title: t ? `Support the creators of ${t.title}` : "Not found", robots: { index: false } };
}

export default async function SupportTitlePage({ params }: PageProps<"/title/[slug]/support">) {
  const { slug } = await params;
  const title = await getTitle(slug);
  if (!title) notFound();
  return <SupportPage slug={slug} titleName={title.title} />;
}
