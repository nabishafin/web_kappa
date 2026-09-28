"use client";

/* Last-resort boundary: renders its own document and cannot rely on globals.css. */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#000", color: "#e6e6e6", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
        <title>Something went wrong · Channel Infinity</title>
        <div style={{ padding: 24 }}>
          <h1 style={{ fontSize: 40, margin: "0 0 12px" }}>Oops! Something Went Wrong!</h1>
          <p style={{ margin: "0 0 28px", opacity: 0.85 }}>We&apos;re having trouble loading Channel Infinity. Please try again.</p>
          <button onClick={() => retry()} style={{ height: 48, padding: "0 28px", border: 0, borderRadius: 8, background: "linear-gradient(180deg,#a107e6,#b817ec)", color: "#fff", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
