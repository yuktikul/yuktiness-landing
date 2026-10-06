"use client";

import { cookieNotice, site } from "@content/landing";
import { setConsent } from "@/lib/attribution";

/**
 * A slim bar in the normal page flow at the very top, so it can never cover the form or
 * a button. Hidden before first paint (by the inline script in layout.tsx) once a choice exists.
 */
export function CookieNotice() {
  const choose = (c: "accepted" | "declined") => setConsent(c);
  return (
    <div className="cookie-notice border-b border-line-dark bg-[#060E1B] px-4 py-3 text-sm text-mist sm:px-6" role="region" aria-label="Cookie notice">
      <div className="mx-auto flex max-w-content flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="min-w-0 flex-1 text-[0.8rem] leading-snug sm:text-sm">
          {cookieNotice.text}{" "}
          <a href={site.privacyUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-offwhite">
            {cookieNotice.policy}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => choose("declined")} className="min-h-12 rounded-full border border-line-dark px-4 text-offwhite hover:border-mist">
            {cookieNotice.decline}
          </button>
          <button type="button" onClick={() => choose("accepted")} className="min-h-12 rounded-full bg-offwhite px-4 font-medium text-midnight hover:bg-white">
            {cookieNotice.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
