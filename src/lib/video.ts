export type VideoSource =
  | { kind: "youtube"; embedUrl: string; thumbnail: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "file"; src: string }
  | { kind: "none" };

/** Work out how to play a VSL URL: YouTube, Vimeo, or a direct video file. */
export function parseVideoUrl(raw: string | undefined): VideoSource {
  const value = raw?.trim();
  if (!value) return { kind: "none" };
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { kind: "none" };
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "youtu.be") {
    const id =
      host === "youtu.be"
        ? url.pathname.slice(1)
        : url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
    if (id && /^[\w-]{6,20}$/.test(id)) {
      return {
        kind: "youtube",
        // Loaded only after a click, so autoplay here never starts without the visitor's action.
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    }
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.match(/(\d{6,})/)?.[1];
    if (id) {
      const h = url.searchParams.get("h");
      return { kind: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1${h ? `&h=${h}` : ""}` };
    }
  }

  if (/\.(mp4|webm|mov|m4v)$/i.test(url.pathname) && url.protocol === "https:") return { kind: "file", src: value };
  return { kind: "none" };
}
