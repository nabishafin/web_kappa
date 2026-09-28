import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalDocs } from "@/lib/data/legal";

export function generateStaticParams() {
  return legalDocs.map((d) => ({ doc: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const { doc } = await params;
  const d = legalDocs.find((x) => x.slug === doc);
  return { title: d?.title ?? "Not found" };
}

export default async function LegalPage({ params }: PageProps<"/legal/[doc]">) {
  const { doc } = await params;
  const d = legalDocs.find((x) => x.slug === doc);
  if (!d) notFound();
  return (
    <article className="bg-night py-16 font-display md:py-24">
      <div className="mx-auto w-[min(820px,calc(100%-40px))]">
        <h1 className="text-[40px] leading-[1.1] font-bold tracking-[-0.02em] md:text-5xl">{d.title}</h1>
        <p className="mt-3 text-sm text-haze">
          Last updated <time dateTime={d.updated}>{new Date(d.updated).toLocaleDateString("en-US", { dateStyle: "long", timeZone: "UTC" })}</time>
        </p>
        <div className="mt-12 space-y-10">
          {d.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-2xl font-semibold">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 text-lg leading-8 font-light text-fog">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
