import Image from "next/image";
import { site } from "@content/landing";
import logoFull from "../../public/brand/logo-full.png";
import logoMark from "../../public/brand/logo-mark.png";

/**
 * Tree emblem on a soft off-white badge, so the original colours stay true on dark
 * backgrounds, followed by the wordmark.
 */
export function LogoLockup({ size = "md", priority = false }: { size?: "md" | "lg"; priority?: boolean }) {
  const badge = size === "lg" ? "h-14 w-14" : "h-11 w-11";
  return (
    <span className="inline-flex items-center gap-3">
      <span className={`flex ${badge} shrink-0 items-center justify-center rounded-full bg-offwhite`}>
        <Image src={logoMark} alt="" sizes="48px" priority={priority} className="h-[78%] w-auto" />
      </span>
      <span className={`font-serif font-semibold tracking-wide text-offwhite ${size === "lg" ? "text-3xl" : "text-2xl"}`}>
        {site.brand}
      </span>
    </span>
  );
}

/** Full logo with tagline, for light backgrounds. */
export function LogoFull({ className = "" }: { className?: string }) {
  return <Image src={logoFull} alt={site.logoAlt} sizes="240px" className={`h-auto ${className}`} />;
}
