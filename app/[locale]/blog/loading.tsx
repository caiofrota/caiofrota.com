const skeletonCards = Array.from({ length: 3 }, (_, index) => index);

export default function BlogLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-16 sm:px-6" aria-busy="true" aria-label="Loading content" role="status">
      <span className="sr-only">Loading content…</span>
      <div className="motion-safe:animate-pulse" aria-hidden="true">
        <div className="h-3 w-36 rounded-full bg-site-border" />
        <div className="mt-5 h-10 w-full max-w-md rounded-xl bg-site-border sm:h-12" />
        <div className="mt-5 h-5 w-full max-w-2xl rounded-lg bg-site-border" />
        <div className="mt-3 h-5 w-3/4 max-w-xl rounded-lg bg-site-border" />

        <div className="mt-10 grid gap-5">
          {skeletonCards.map((card) => (
            <div key={card} className="rounded-3xl border border-site-border bg-site-surface p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="aspect-[16/9] w-full shrink-0 rounded-2xl bg-site-border sm:w-48" />
                <div className="min-w-0 flex-1">
                  <div className="h-3 w-24 rounded-full bg-site-border" />
                  <div className="mt-4 h-7 w-full max-w-lg rounded-lg bg-site-border" />
                  <div className="mt-4 h-4 w-full rounded-lg bg-site-border" />
                  <div className="mt-2 h-4 w-4/5 rounded-lg bg-site-border" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
