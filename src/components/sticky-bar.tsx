"use client";

import { useEffect, useState } from "react";
import { cta, hero } from "@content/landing";
import { Countdown } from "./countdown";
import { ReserveButton } from "./reserve-button";

/**
 * Mobile-only bottom bar. Appears once the hero has scrolled away and hides again
 * while the signup section is on screen, so it never covers the form.
 */
export function StickyBar() {
  const [pastHero, setPastHero] = useState(false);
  const [atSignup, setAtSignup] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    const signupEl = document.getElementById("signup");
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === heroEl) setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0);
        if (e.target === signupEl) setAtSignup(e.isIntersecting);
      }
    });
    if (heroEl) observer.observe(heroEl);
    if (signupEl) observer.observe(signupEl);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !atSignup;
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line-dark bg-midnight/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-teal">{hero.stickyCountdownLabel}</p>
          <Countdown compact />
        </div>
        <ReserveButton size="md" label={cta.stickyReserve} className="shrink-0" />
      </div>
    </div>
  );
}
