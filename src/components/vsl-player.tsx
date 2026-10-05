"use client";

import { useState } from "react";
import { video } from "@content/landing";
import { parseVideoUrl } from "@/lib/video";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

/**
 * Video sales letter player. Reads NEXT_PUBLIC_VSL_URL:
 *  - YouTube / Vimeo link → lightweight click-to-play facade, iframe loads on click
 *  - direct .mp4/.webm → native <video> with controls and playsInline
 *  - empty → an elegant placeholder
 * Nothing ever plays with sound on its own.
 */
export function VslPlayer({ videoUrl = process.env.NEXT_PUBLIC_VSL_URL }: { videoUrl?: string }) {
  const source = parseVideoUrl(videoUrl);
  const [playing, setPlaying] = useState(false);

  const frame = "relative aspect-video w-full overflow-hidden rounded-2xl border border-line-dark bg-midnight-2 shadow-2xl shadow-black/30";

  if (source.kind === "file") {
    return (
      <div className={frame}>
        <video className="h-full w-full" src={source.src} controls playsInline preload="metadata" aria-label={video.heading} />
      </div>
    );
  }

  if ((source.kind === "youtube" || source.kind === "vimeo") && playing) {
    return (
      <div className={frame}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={source.embedUrl}
          title={video.heading}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (source.kind === "youtube" || source.kind === "vimeo") {
    return (
      <div className={frame}>
        {source.kind === "youtube" && (
          // eslint-disable-next-line @next/next/no-img-element -- small remote thumbnail, lazy-loaded
          <img src={source.thumbnail} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        )}
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label={video.playLabel}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-amber text-midnight shadow-lg transition-transform group-hover:scale-105">
            <PlayIcon />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className={`${frame} flex items-center justify-center`}>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(78,205,196,0.16),transparent_60%)]" />
      <div className="relative flex flex-col items-center px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-teal/50 text-teal">
          <PlayIcon />
        </span>
        <p className="mt-5 font-serif text-2xl text-offwhite sm:text-3xl">{video.heading}</p>
        <p className="mt-2 text-sm text-mist">{video.placeholderNote}</p>
      </div>
    </div>
  );
}
