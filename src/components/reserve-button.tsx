"use client";

import { cta } from "@content/landing";
import { useSignup } from "./signup/signup-context";

const sizes = {
  sm: "min-h-12 px-4 text-sm sm:min-h-10",
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-8 text-base sm:text-lg",
};

/**
 * Primary amber CTA.
 *  - Below 1024px it opens the signup bottom sheet.
 *  - On desktop near the top it focuses the hero form; further down it jumps to #signup.
 *  - Without JavaScript it's a plain link to #signup, where the form also lives.
 */
export function ReserveButton({ size = "lg", label = cta.reserve, className = "" }: { size?: keyof typeof sizes; label?: string; className?: string }) {
  const { openSheet } = useSignup();
  return (
    <a
      href="#signup"
      onClick={(e) => {
        if (window.matchMedia("(max-width: 1023px)").matches) {
          e.preventDefault();
          openSheet();
          return;
        }
        const heroName = document.getElementById("hero-fullName");
        const hero = document.getElementById("hero");
        if (heroName && hero && hero.getBoundingClientRect().bottom > 120) {
          e.preventDefault();
          heroName.focus({ preventScroll: false });
          heroName.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        }
      }}
      className={`inline-flex items-center justify-center rounded-full bg-amber font-semibold text-midnight shadow-sm transition-colors hover:bg-amber-hover ${sizes[size]} ${className}`}
    >
      {label}
    </a>
  );
}
