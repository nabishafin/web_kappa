import { Footer } from "@/components/layout/footer";
import { PublicHeader } from "@/components/layout/public-header";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <PublicHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
