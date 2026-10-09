/** Fixed-window in-memory limiter (per Node instance; use Redis if you run several instances). */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  if (buckets.size > 10_000) for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  b.count += 1;
  return b.count > limit ? { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) } : { ok: true, retryAfterSec: 0 };
}

export function clientIp(req: Request): string {
  // Platform-set headers first (Vercel sets these; clients can't spoof them), then the proxy chain.
  return (
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
