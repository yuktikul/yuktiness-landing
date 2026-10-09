/**
 * Reject cross-site POSTs: if the browser sent an Origin header, it must match this site.
 * (Server-to-server callers without an Origin header are unaffected.)
 */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}
