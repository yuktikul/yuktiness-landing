"use client";

import { useEffect } from "react";
import { getConsent } from "@/lib/attribution";

/**
 * Meta Pixel. Loads only when NEXT_PUBLIC_META_PIXEL_ID is set AND the visitor accepted the
 * cookie notice (now, or on an earlier visit). Fires PageView once loaded.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: unknown };
declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function loadPixel(id: string) {
  if (window.fbq) return;
  // Meta's standard base code, written out (no inline <script> needed).
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  fbq("init", id);
  fbq("track", "PageView");
}

export function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ID) return;
    if (getConsent() === "accepted") loadPixel(PIXEL_ID);
    const onConsent = (e: Event) => {
      if ((e as CustomEvent<string>).detail === "accepted") loadPixel(PIXEL_ID);
    };
    window.addEventListener("yk:consent", onConsent);
    return () => window.removeEventListener("yk:consent", onConsent);
  }, []);
  return null;
}

/** Fire the browser-side Lead event with the same event id the server sends to the Conversions API. */
export function trackLead(eventId: string): boolean {
  if (!PIXEL_ID || !window.fbq || getConsent() !== "accepted") return false;
  window.fbq("track", "Lead", { content_name: "Breath Alignment Masterclass" }, { eventID: eventId });
  return true;
}
