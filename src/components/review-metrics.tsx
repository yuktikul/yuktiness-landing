import { reviewMetrics } from "@content/landing";

function Star() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-amber" aria-hidden="true">
      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
    </svg>
  );
}

/** "★ 4.9 on Google (126 reviews) · 15,000+ lives impacted". Ratings without real numbers are hidden. */
export function ReviewMetrics({ className = "" }: { className?: string }) {
  const ratings = reviewMetrics.ratings.filter((r) => r.rating && r.count);
  const { impact } = reviewMetrics;
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-mist ${className}`}>
      {ratings.map((r) => (
        <li key={r.source} className="flex items-center gap-1.5">
          <Star />
          <span>
            <strong className="font-semibold text-offwhite">{r.rating}</strong> on {r.source} ({r.count} reviews)
          </span>
        </li>
      ))}
      <li>
        <strong className="font-semibold text-offwhite">{impact.value}</strong> {impact.label}
      </li>
    </ul>
  );
}
