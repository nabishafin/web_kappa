/**
 * Chrome-less layout for focused flows (creator application, confirmation).
 * Plain black canvas, no header/footer.
 */
export default function StandaloneLayout({ children }: LayoutProps<"/">) {
  return (
    <main id="main" className="flex-1 bg-black">
      {children}
    </main>
  );
}
