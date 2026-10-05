import { describe, expect, it } from "vitest";
import { parseVideoUrl } from "@/lib/video";

describe("parseVideoUrl", () => {
  it.each(["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://youtu.be/dQw4w9WgXcQ", "https://www.youtube.com/embed/dQw4w9WgXcQ", "https://youtube.com/shorts/dQw4w9WgXcQ"])(
    "YouTube: %s",
    (url) => {
      const v = parseVideoUrl(url);
      expect(v.kind).toBe("youtube");
      if (v.kind === "youtube") expect(v.embedUrl).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
    },
  );
  it.each(["https://vimeo.com/123456789", "https://player.vimeo.com/video/123456789"])("Vimeo: %s", (url) => {
    const v = parseVideoUrl(url);
    expect(v.kind === "vimeo" && v.embedUrl.startsWith("https://player.vimeo.com/video/123456789")).toBe(true);
  });
  it("direct mp4", () => expect(parseVideoUrl("https://cdn.example.com/vsl.mp4")).toEqual({ kind: "file", src: "https://cdn.example.com/vsl.mp4" }));
  it.each(["", undefined, "not a url", "http://cdn.example.com/vsl.mp4", "https://example.com/page"])("placeholder for %s", (url) =>
    expect(parseVideoUrl(url).kind).toBe("none"),
  );
});
