export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="container-ci py-12">
      <div className="skeleton h-[340px] w-full rounded-[24px] md:h-[480px]" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[12px] border border-white/5">
            <div className="skeleton h-[158px]" />
            <div className="space-y-3 p-6">
              <div className="skeleton h-5 w-2/3 rounded" />
              <div className="skeleton h-3 w-1/3 rounded" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
