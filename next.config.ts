import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy: only the third parties the page really uses.
 *  - Meta Pixel: connect.facebook.net (script), www.facebook.com (beacon)
 *  - Video: YouTube (no-cookie) / Vimeo players, YouTube thumbnails, direct video files over https
 * Next.js inlines small scripts/styles, so 'unsafe-inline' is needed without nonces.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://connect.facebook.net${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://i.ytimg.com https://www.facebook.com",
  "font-src 'self'",
  `connect-src 'self' https://www.facebook.com https://connect.facebook.net${isDev ? " ws:" : ""}`,
  "frame-src https://www.youtube-nocookie.com https://player.vimeo.com",
  "media-src 'self' https:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Inline the (small) Tailwind CSS into the HTML so it doesn't block first paint.
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
        ],
      },
    ];
  },
};

export default nextConfig;
