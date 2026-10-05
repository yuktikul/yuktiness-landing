import type { Config } from "tailwindcss";

/** Yuktiness brand palette. Loaded from src/app/globals.css via @config. */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.ts"],
  theme: {
    extend: {
      colors: {
        midnight: { DEFAULT: "#0A1628", 2: "#111F35", 3: "#1A2A44" },
        offwhite: "#F7F5F0",
        teal: {
          DEFAULT: "#4ECDC4",
          /** Text-safe teal for light backgrounds (5.4:1 on off-white). */
          deep: "#1B6F6A",
        },
        amber: {
          /** Primary buttons only. */
          DEFAULT: "#E8A838",
          hover: "#F0B954",
          deep: "#8A5A0E",
        },
        mist: "#AEB9CA",
        ink: { DEFAULT: "#0A1628", soft: "#4B5563" },
        line: { light: "#E4E0D6", dark: "#22324D" },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      maxWidth: { content: "72rem" },
    },
  },
};

export default config;
