"use client";

import { useSyncExternalStore } from "react";

/**
 * A single shared 1-second clock for all countdowns. Returns null during server
 * rendering and hydration, so callers fall back to the server's timestamp and the
 * markup matches; it then ticks on the client.
 */
let current = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    current = Date.now();
    timer = setInterval(() => {
      current = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function useNow(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => current || Date.now(),
    () => null,
  );
}
