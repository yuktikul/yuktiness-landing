import Link from "next/link";
import { footer, site } from "@content/landing";

export function Footer() {
  return (
    <footer className="bg-[#060E1B] px-4 pb-28 pt-14 text-mist sm:px-6 md:pb-14">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <p className="font-serif text-2xl font-semibold text-offwhite">{site.brand}</p>
          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm sm:flex-row sm:gap-8">
            <a href={`tel:${site.contactPhone.replace(/[^\d+]/g, "")}`} className="hover:text-offwhite">
              {footer.contactLabel}: {site.contactPhone}
            </a>
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`} className="hover:text-offwhite">
                {site.contactEmail}
              </a>
            )}
            <a href={site.privacyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-offwhite">
              {footer.privacyLabel}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Link href="/terms" className="hover:text-offwhite">
              {footer.termsLabel}
            </Link>
          </nav>
        </div>
        <p className="mt-10 max-w-3xl border-t border-line-dark pt-8 text-sm leading-relaxed">{footer.disclaimer}</p>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} {site.brand}</p>
      </div>
    </footer>
  );
}
