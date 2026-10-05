export function SectionHeading({ children, tone = "light", id, className = "" }: { children: React.ReactNode; tone?: "light" | "dark"; id?: string; className?: string }) {
  return (
    <h2
      id={id}
      className={`font-serif text-[2.4rem] font-semibold leading-[1.1] tracking-tight sm:text-5xl ${tone === "dark" ? "text-offwhite" : "text-ink"} ${className}`}
    >
      {children}
    </h2>
  );
}
