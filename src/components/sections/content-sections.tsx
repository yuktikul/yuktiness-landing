import Image from "next/image";
import { faq, guide, learn, soundsLikeYou, stats, stories, timeline } from "@content/landing";
import { ReserveButton } from "../reserve-button";
import { StoriesCarousel } from "../stories-carousel";
import { SectionHeading } from "./section-heading";

const wrap = "mx-auto max-w-content px-4 sm:px-6";

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SoundsLikeYou() {
  return (
    <section aria-labelledby="sly-heading" className="on-light bg-offwhite py-20 sm:py-28">
      <div className="reveal mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading id="sly-heading">{soundsLikeYou.heading}</SectionHeading>
        <p className="mt-4 text-lg text-ink-soft">{soundsLikeYou.intro}</p>
        <ul className="mt-10 space-y-4">
          {soundsLikeYou.items.map((item) => (
            <li key={item} className="flex gap-4 rounded-2xl border border-line-light bg-white p-5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal/20 text-teal-deep">
                <Check />
              </span>
              <span className="leading-relaxed text-ink">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-10 font-serif text-2xl text-ink">{soundsLikeYou.closing}</p>
      </div>
    </section>
  );
}

export function Learn() {
  return (
    <section aria-labelledby="learn-heading" className="on-light bg-white py-20 sm:py-28">
      <div className={wrap}>
        <SectionHeading id="learn-heading" className="reveal">
          {learn.heading}
        </SectionHeading>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {learn.cards.map((card, i) => (
            <li key={card.title} className="reveal flex flex-col rounded-2xl border border-line-light bg-offwhite p-7" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="font-serif text-3xl font-semibold text-teal-deep">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-serif text-2xl font-semibold leading-snug text-ink">{card.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{card.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Timeline() {
  return (
    <section aria-labelledby="timeline-heading" className="bg-midnight py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading id="timeline-heading" tone="dark" className="reveal">
          {timeline.heading}
        </SectionHeading>
        <ol className="relative mt-12 space-y-10 border-l border-line-dark pl-8 sm:pl-10">
          {timeline.steps.map((step, i) => (
            <li key={step.title} className="reveal relative">
              <span
                aria-hidden="true"
                className="absolute -left-[2.55rem] top-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-teal bg-midnight font-serif text-base font-semibold text-teal sm:-left-[3.05rem]"
              >
                {i + 1}
              </span>
              <h3 className="font-serif text-3xl font-semibold text-offwhite">{step.title}</h3>
              <p className="mt-2 text-lg leading-relaxed text-mist">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="reveal mt-14">
          <ReserveButton />
        </div>
      </div>
    </section>
  );
}

export function Guide() {
  return (
    <section aria-labelledby="guide-heading" className="on-light bg-offwhite py-20 sm:py-28">
      <div className={`${wrap} grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16`}>
        <div className="reveal mx-auto w-full max-w-[17rem] sm:max-w-sm lg:sticky lg:top-10">
          {guide.portraitSrc ? (
            <Image
              src={guide.portraitSrc}
              alt={guide.portraitAlt}
              width={800}
              height={1000}
              sizes="(min-width: 1024px) 384px, 90vw"
              className="aspect-[4/5] w-full rounded-3xl object-cover"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-ink-soft/40 bg-white text-ink-soft">
              <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                <circle cx="12" cy="8.5" r="3.5" />
                <path d="M5 20c1.2-3.5 3.8-5.5 7-5.5s5.8 2 7 5.5" strokeLinecap="round" />
              </svg>
              <p className="mt-3 text-sm font-medium">{guide.portraitPlaceholder}</p>
            </div>
          )}
        </div>
        <div className="reveal">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">{guide.heading}</p>
          <h2 id="guide-heading" className="mt-3 font-serif text-[2.6rem] font-semibold leading-tight text-ink sm:text-5xl">
            {guide.name}
          </h2>
          <p className="mt-2 text-lg text-ink-soft">{guide.role}</p>
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-ink">
            {guide.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="mt-8 space-y-3">
            {guide.credentials.map((c) => (
              <li key={c} className="flex gap-3 text-ink">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-deep" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <blockquote className="mt-10 border-l-2 border-teal-deep pl-6 font-serif text-2xl leading-snug text-ink sm:text-[1.7rem]">
            <p>&ldquo;{guide.belief}&rdquo;</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section aria-label="Yuktiness in numbers" className="bg-midnight-2 py-14">
      <dl className={`${wrap} grid gap-8 text-center sm:grid-cols-3`}>
        {stats.map((s) => (
          <div key={s.label} className="reveal flex flex-col-reverse">
            <dt className="mt-1 text-sm uppercase tracking-[0.16em] text-mist">{s.label}</dt>
            <dd className="font-serif text-5xl font-semibold text-teal">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Stories() {
  return (
    <section aria-labelledby="stories-heading" className="on-light overflow-hidden bg-offwhite py-20 sm:py-28">
      <div className={wrap}>
        <SectionHeading id="stories-heading" className="reveal">
          {stories.heading}
        </SectionHeading>
        <div className="reveal mt-12">
          <StoriesCarousel />
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="on-light bg-white py-20 sm:py-28">
      <div className="reveal mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading id="faq-heading">{faq.heading}</SectionHeading>
        <div className="mt-10 divide-y divide-line-light border-y border-line-light">
          {faq.items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left text-lg font-medium text-ink">
                <h3>{item.q}</h3>
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0 text-teal-deep">
                  <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-current transition-transform group-open:rotate-90" />
                </span>
              </summary>
              <p className="pb-6 pr-10 leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
