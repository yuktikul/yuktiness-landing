import { hero, signup, urgency, video } from "@content/landing";
import { Countdown } from "../countdown";
import { PriceTag } from "../price-tag";
import { ReserveButton } from "../reserve-button";
import { SectionHeading } from "./section-heading";

/** Bottom of the page: the same "Reserve my spot" button as under the video. */
export function SignupSection() {
  return (
    <section id="signup" aria-labelledby="signup-heading" className="bg-midnight py-20 sm:py-28">
      <div className="reveal mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <SectionHeading id="signup-heading" tone="dark">
          {signup.heading}
        </SectionHeading>
        <p className="mx-auto mt-4 max-w-xl text-lg text-mist">{signup.intro}</p>
        <ReserveButton className="mt-8 w-full sm:w-auto sm:min-w-80" />
        <PriceTag className="mt-5 justify-center" />
        <p className="mt-1 text-sm text-mist">{video.ctaNote}</p>
        <div className="mt-8 flex flex-col items-center">
          <Countdown label={hero.countdownLabel} />
        </div>
        <p className="mt-6 text-sm text-mist">{urgency.smallGroupLine}</p>
      </div>
    </section>
  );
}
