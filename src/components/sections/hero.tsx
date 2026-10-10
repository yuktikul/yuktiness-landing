import { cta, hero, video } from "@content/landing";
import { VslPlayer } from "../vsl-player";
import { LogoLockup } from "../logo";
import { Countdown } from "../countdown";
import { ReserveButton } from "../reserve-button";
import { SeatsLeft } from "../seats-left";
import { SessionDates } from "../session-dates";
import { PriceTag } from "../price-tag";
import { ReviewMetrics } from "../review-metrics";

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
      <a href="#hero" className="rounded-full">
        <LogoLockup priority />
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
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-20 pt-8 text-center sm:px-6 sm:pt-14 lg:pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal sm:text-sm">{hero.eyebrow}</p>
        <h1 id="hero-heading" className="mt-5 font-serif text-[2.4rem] font-semibold leading-[1.08] tracking-tight text-offwhite sm:text-6xl lg:text-[4.1rem]">
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist">{hero.subline}</p>

        {/* 1. Headline → 2. VSL → 3. "Reserve my spot" directly below it */}
        <div className="mt-10 w-full">
          <VslPlayer />
        </div>
        <ReserveButton className="mt-8 w-full sm:w-auto sm:min-w-80" />
        <PriceTag className="mt-5 justify-center" />
        <p className="mt-1 text-sm text-mist">{video.ctaNote}</p>

        <div className="mt-8 flex flex-col items-center">
          <Countdown label={hero.countdownLabel} />
        </div>
        <div className="mt-6 flex flex-col items-center gap-2 text-sm">
          <p className="text-offwhite">
            <span className="text-mist">{hero.nextSessionsLabel}: </span>
            <SessionDates inline />
          </p>
          <div className="empty:hidden">
            <SeatsLeft />
          </div>
        </div>
        <ReviewMetrics className="mt-7 justify-center" />
      </div>
    </section>
  );
}
