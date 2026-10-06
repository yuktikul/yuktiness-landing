import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { hero, site } from "@content/landing";

export const alt = site.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const mark = await readFile(path.join(process.cwd(), "public/brand/logo-mark.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(circle at 80% 30%, #16324a 0%, #0A1628 60%)",
          color: "#F7F5F0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 84, height: 84, borderRadius: 42, background: "#F7F5F0" }}>
            <img src={markSrc} width={68} height={66} alt="" />
          </div>
          <div style={{ fontSize: 34, letterSpacing: 2 }}>{site.brand}</div>
        </div>
        <div style={{ fontSize: 64, marginTop: 40, lineHeight: 1.15, maxWidth: 980 }}>Breath Alignment Masterclass</div>
        <div style={{ fontSize: 30, marginTop: 24, color: "#AEB9CA", maxWidth: 900 }}>{hero.eyebrow}</div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 26, color: "#E8A838" }}>Every Wednesday · 11 AM and 7 PM IST</div>
      </div>
    ),
    size,
  );
}
