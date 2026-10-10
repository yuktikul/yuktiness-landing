"use client";

import { cta } from "@content/landing";
import { useSignup } from "./signup/signup-context";

const sizes = {
  sm: "min-h-12 px-4 text-sm sm:min-h-10",
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-8 text-base sm:text-lg",
};

/**
 * Primary amber CTA. Opens the signup form as a popup on every screen size
 * (bottom sheet on phones, centred dialog on desktop).
 */
export function ReserveButton({ size = "lg", label = cta.reserve, className = "" }: { size?: keyof typeof sizes; label?: string; className?: string }) {
  const { openSheet } = useSignup();
  return (
    <a
      href="#signup"
      onClick={(e) => {
        e.preventDefault();
        openSheet();
      }}
      className={`inline-flex items-center justify-center rounded-full bg-amber font-semibold text-midnight shadow-sm transition-colors hover:bg-amber-hover ${sizes[size]} ${className}`}
    >
      {label}
    </a>
  );
}
