import { hero, video } from "@content/landing";
import { Countdown } from "../countdown";
import { ReserveButton } from "../reserve-button";
import { VslPlayer } from "../vsl-player";

export function VideoSection() {
  return (
    <section aria-label={video.heading} className="bg-gradient-to-b from-midnight to-midnight-2 px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="reveal mx-auto max-w-4xl">
        <VslPlayer />
        <div className="mt-10 flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center">
            <ReserveButton />
            <p className="mt-3 text-sm text-mist">{video.ctaNote}</p>
          </div>
          <Countdown label={hero.countdownLabel} />
        </div>
      </div>
    </section>
  );
}
