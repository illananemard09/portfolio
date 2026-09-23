"use client";

import { useSyncExternalStore } from "react";

// Tiny global flag: flips to true once the intro loader has finished.
let ready = false;
const listeners = new Set<() => void>();

export function setReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((l) => l());
}

export function useReady() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => ready,
    () => false,
  );
}
