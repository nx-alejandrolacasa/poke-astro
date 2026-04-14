export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white p-4 dark:bg-dark-surface">
      <div className="skeleton-shimmer aspect-square w-full rounded-xl" />
      <div className="mt-3 space-y-2">
        <div className="skeleton-shimmer mx-auto h-4 w-3/4 rounded-lg" />
        <div className="skeleton-shimmer mx-auto h-5 w-1/2 rounded-full" />
      </div>
    </div>
  )
}
