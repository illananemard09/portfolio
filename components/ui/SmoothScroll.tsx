"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";

type ScrollTo = (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;
type Ctx = { scrollTo: ScrollTo; stop: () => void; start: () => void };

const ScrollContext = createContext<Ctx>({ scrollTo: () => {}, stop: () => {}, start: () => {} });
export const useSmoothScroll = () => useContext(ScrollContext);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.current = instance;
    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  const scrollTo = useCallback<ScrollTo>((target, opts = {}) => {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (lenis.current && el !== null) {
      lenis.current.scrollTo(el as HTMLElement | number, { offset: opts.offset ?? 0, immediate: opts.immediate });
      return;
    }
    if (typeof el === "number") window.scrollTo({ top: el });
    else el?.scrollIntoView({ block: "start" });
  }, []);

  const stop = useCallback(() => {
    lenis.current?.stop();
    document.documentElement.style.overflow = "hidden";
  }, []);
  const start = useCallback(() => {
    lenis.current?.start();
    document.documentElement.style.overflow = "";
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ScrollContext.Provider value={{ scrollTo, stop, start }}>{children}</ScrollContext.Provider>
    </MotionConfig>
  );
}
