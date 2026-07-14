function SkeletonCard() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="mt-auto h-8 w-full animate-pulse rounded-lg bg-slate-200" />
    </div>
  );
}

/**
 * Reusable loading state. Default mode shows a title/description with a
 * skeleton grid mimicking a listing page's card layout. Compact mode shows
 * a minimal inline indicator for smaller spaces.
 * @param {{
 *   title?: string,
 *   description?: string,
 *   compact?: boolean,
 * }} props
 */
function LoadingState({ title = "Loading...", description, compact = false }) {
  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={title}
        className="flex items-center justify-center gap-3 py-8"
      >
        <div className="h-5 w-5 animate-pulse rounded-full bg-blue-200" />
        <p className="text-sm text-slate-600">{title}</p>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={title}
      className="flex flex-col gap-6 py-8"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-medium text-slate-900 sm:text-base">
          {title}
        </p>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}

export default LoadingState;
