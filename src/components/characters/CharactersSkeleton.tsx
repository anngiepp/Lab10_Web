export function CharactersSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-green-500/20 bg-black/40"
        >
          <div className="aspect-square w-full animate-pulse bg-green-900/30" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-green-900/30" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-green-900/20" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-green-900/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CharacterDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl border border-green-500/20 bg-black/40 p-6 sm:p-10">
      <div className="grid gap-8 md:grid-cols-[320px,1fr]">
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-green-900/30" />
        <div className="space-y-4">
          <div className="h-10 w-2/3 animate-pulse rounded bg-green-900/30" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-green-900/20" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-green-900/20"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
