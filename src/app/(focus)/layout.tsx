/** Distraction-free shell (no header / footer) for single-task screens such as profile editing. */
export default function FocusLayout({ children }: LayoutProps<"/">) {
  return (
    <main id="main" className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-black px-4 py-12 sm:px-8">
      {children}
    </main>
  );
}
