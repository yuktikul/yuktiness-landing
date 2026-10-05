import { cta, hero, site } from "@content/landing";
import { Countdown } from "../countdown";
import { ReserveButton } from "../reserve-button";
import { SeatsLeft } from "../seats-left";
import { SessionDates } from "../session-dates";

function BreathRings() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-24 h-[34rem] w-[34rem] sm:-right-24 lg:right-[-6rem] lg:top-[-4rem] lg:h-[46rem] lg:w-[46rem]">
      <div className="breath-ring absolute inset-0 rounded-full border border-teal/15" />
      <div className="breath-ring absolute inset-[12%] rounded-full border border-teal/20 [animation-delay:-2s]" />
      <div className="breath-ring absolute inset-[26%] rounded-full border border-teal/25 bg-[radial-gradient(circle,rgba(78,205,196,0.10),transparent_70%)] [animation-delay:-4s]" />
    </div>
  );
}

export function TopBar() {
  return (
    <header className="relative z-10 mx-auto flex max-w-content items-center justify-between px-4 py-4 sm:px-6">
      <a href="#hero" className="font-serif text-2xl font-semibold tracking-wide text-offwhite">
        {site.brand}
      </a>
      <ReserveButton size="sm" label={cta.topBarReserve} />
    </header>
  );
}

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative overflow-hidden bg-midnight">
      <BreathRings />
      <TopBar />
      <div className="relative mx-auto grid max-w-content gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16 lg:pb-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal sm:text-sm">{hero.eyebrow}</p>
          <h1 id="hero-heading" className="mt-5 font-serif text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-offwhite sm:text-6xl lg:text-[4.1rem]">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">{hero.subline}</p>
          <ReserveButton className="mt-9 w-full sm:w-auto" />
        </div>

        <div className="rounded-3xl border border-line-dark bg-midnight-2/80 p-6 backdrop-blur-sm sm:p-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-teal">{hero.nextSessionsLabel}</p>
          <SessionDates />
          <div className="mt-7 border-t border-line-dark pt-7">
            <Countdown label={hero.countdownLabel} />
          </div>
          <div className="mt-7 empty:hidden">
            <SeatsLeft />
          </div>
        </div>
      </div>
    </section>
  );
}
