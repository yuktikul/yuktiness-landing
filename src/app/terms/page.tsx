import type { Metadata } from "next";
import Link from "next/link";
import { footer, site, terms } from "@content/landing";

export const metadata: Metadata = { title: `${terms.heading} | ${site.brand}`, robots: { index: false } };

export default function TermsPage() {
  return (
    <main className="on-light mx-auto min-h-screen max-w-2xl px-4 py-20 sm:px-6">
      <Link href="/" className="text-sm font-medium text-teal-deep underline underline-offset-4">
        {terms.backLabel}
      </Link>
      <h1 className="mt-8 font-serif text-5xl font-semibold text-ink">{terms.heading}</h1>
      <div className="mt-8 space-y-4 leading-relaxed text-ink-soft">
        {terms.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <p className="mt-12 border-t border-line-light pt-6 text-sm text-ink-soft">{footer.disclaimer}</p>
    </main>
  );
}
