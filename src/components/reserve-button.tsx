import { cta } from "@content/landing";

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base sm:text-lg",
};

/** Primary amber CTA. Always jumps to the signup section. */
export function ReserveButton({ size = "lg", label = cta.reserve, className = "" }: { size?: keyof typeof sizes; label?: string; className?: string }) {
  return (
    <a
      href="#signup"
      className={`inline-flex items-center justify-center rounded-full bg-amber font-semibold text-midnight shadow-sm transition-colors hover:bg-amber-hover ${sizes[size]} ${className}`}
    >
      {label}
    </a>
  );
}
