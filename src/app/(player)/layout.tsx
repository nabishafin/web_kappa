export default function PlayerLayout({ children }: LayoutProps<"/">) {
  return (
    <main id="main" className="flex-1 bg-black">
      {children}
    </main>
  );
}
