/**
 * The academy checkout URL (CHECKOUT_URL), optionally with the visitor's details appended.
 *
 * CHECKOUT_PREFILL_PARAMS maps our fields to the checkout's query-parameter names, e.g.
 * "name=name,email=email,phone=phone". Leave it empty to send the plain URL. It is empty by
 * default because prefill on the academy checkout hasn't been confirmed (see README).
 */
export function checkoutUrl(details?: { name: string; email: string; phone: string }): string | null {
  const base = process.env.CHECKOUT_URL?.trim();
  if (!base) return null;
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return null;
  }
  const map = process.env.CHECKOUT_PREFILL_PARAMS?.trim();
  if (details && map) {
    for (const pair of map.split(",")) {
      const [ours, theirs] = pair.split("=").map((s) => s.trim());
      const value = details[ours as keyof typeof details];
      if (theirs && value) url.searchParams.set(theirs, value);
    }
  }
  return url.toString();
}

/** Origin of the checkout, for <link rel="preconnect">. */
export function checkoutOrigin(): string | null {
  try {
    return process.env.CHECKOUT_URL ? new URL(process.env.CHECKOUT_URL).origin : null;
  } catch {
    return null;
  }
}
