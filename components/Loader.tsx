"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { setReady } from "./ui/ready";

const words = ["Strategy", "Creativity", "Communication", "Experiences"];

export function Loader() {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);
  const [w, setW] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("in-intro") === "1"; } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setShow(false);
      setReady();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const c = animate(0, 100, { duration: 2.2, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => setN(Math.round(v)) });
    const wi = setInterval(() => setW((x) => Math.min(x + 1, words.length - 1)), 560);
    const t = setTimeout(() => {
      setShow(false);
      document.documentElement.style.overflow = "";
      try { sessionStorage.setItem("in-intro", "1"); } catch {}
      setTimeout(setReady, 350);
    }, 2500);
    return () => { c.stop(); clearInterval(wi); clearTimeout(t); document.documentElement.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[400] flex flex-col justify-between bg-ink p-[var(--gutter)] text-bone"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
          role="status"
          aria-label="Loading"
        >
          <div className="flex justify-between eyebrow opacity-60">
            <span>Illana Nemard</span>
            <span>Portfolio — MMXXVI</span>
          </div>
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={w}
                className="font-display text-[clamp(40px,9vw,140px)] font-light italic leading-none tracking-[-0.04em]"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {words[w]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex items-end justify-between">
            <span className="eyebrow opacity-60">Setting the stage</span>
            <span className="font-display text-[clamp(64px,14vw,200px)] font-light leading-[0.8] tabular-nums tracking-[-0.05em]">
              {n}
              <span className="text-accent">%</span>
            </span>
          </div>
          <motion.span className="absolute bottom-0 left-0 h-[2px] bg-accent" style={{ width: `${n}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
