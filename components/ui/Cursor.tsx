"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Desktop-only cursor: a dot plus a ring that grows over interactive elements.
 * Any element can set `data-cursor="Label"` to show a word inside the ring.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const [dark, setDark] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? "");
      setHover(!!t?.closest("a, button, [role='button'], input, textarea, label, [data-cursor]"));
      setDark(!!t?.closest("[data-cursor-invert]"));
    };
    const pd = () => setDown(true);
    const pu = () => setDown(false);
    const leave = () => { x.set(-100); y.set(-100); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", pd);
    window.addEventListener("pointerup", pu);
    document.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointerup", pu);
      document.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 88 : hover ? 46 : 26;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300] mix-blend-difference">
      <motion.div className="absolute left-0 top-0 h-[6px] w-[6px] rounded-full bg-white" style={{ x, y, translateX: "-50%", translateY: "-50%" }} />
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full border border-white text-white"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: size, height: size, scale: down ? 0.85 : 1, backgroundColor: label ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)" }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        {label && <span className={`eyebrow text-[10px] ${dark ? "text-white" : "text-black"}`}>{label}</span>}
      </motion.div>
    </div>
  );
}
