"use client";

import { useRef } from "react";
import { stories } from "@content/landing";

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Scroll-snap carousel of featured client stories. Swipe on mobile, arrows on any device. */
export function StoriesCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const items = stories.items.filter((s) => s.featured);
  if (items.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-line-light bg-white text-ink transition-colors hover:border-teal-deep hover:text-teal-deep";

  return (
    <div role="region" aria-roledescription="carousel" aria-label={stories.heading}>
      <ul
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6"
        tabIndex={0}
        aria-label={stories.heading}
      >
        {items.map((s, i) => (
          <li
            key={s.name}
            className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border border-line-light bg-white p-7 sm:w-[46%] lg:w-[31.5%]"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
          >
            <span aria-hidden="true" className="font-serif text-5xl leading-none text-teal">
              &ldquo;
            </span>
            <blockquote className="mt-1 flex-1 text-[0.95rem] leading-relaxed text-ink">
              <p>{s.quote}</p>
            </blockquote>
            <p className="mt-6 font-serif text-xl font-semibold text-ink">{s.name}</p>
            <p className="mt-1 text-xs text-ink-soft">{stories.disclaimer}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className={btn} onClick={() => scroll(-1)} aria-label={stories.previousLabel}>
          <Arrow dir="left" />
        </button>
        <button type="button" className={btn} onClick={() => scroll(1)} aria-label={stories.nextLabel}>
          <Arrow dir="right" />
        </button>
      </div>
    </div>
  );
}
