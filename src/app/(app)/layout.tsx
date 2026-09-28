import { AppHeader } from "@/components/layout/app-header";
import { Footer } from "@/components/layout/footer";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AppHeader />
      <main id="main" className="relative flex-1 bg-[#060315]">
        {children}
      </main>
      <Footer />
    </>
  );
}
