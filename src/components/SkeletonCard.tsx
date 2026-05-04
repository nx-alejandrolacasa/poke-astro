export function SkeletonCard() {
  // Mirrors PokemonTile's outer structure (border, padding, image area, text +
  // type-badge row) so placeholder rows have the exact same height as real
  // cards. Critical for scroll restoration on the lister pages — if heights
  // diverge, the document is the wrong height and scrollTo lands off.
  return (
    <div
      className="overflow-hidden rounded-2xl bg-white p-4 text-center dark:bg-dark-surface"
      style={{ border: '2px solid transparent' }}
    >
      <div className="relative aspect-square w-full">
        <div className="skeleton-shimmer h-full w-full rounded-xl" />
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="skeleton-shimmer mx-auto h-6 w-3/4 rounded-md" />
        <div className="flex flex-wrap justify-center gap-1">
          <div className="skeleton-shimmer h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}
