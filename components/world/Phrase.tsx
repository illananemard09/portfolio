"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { world } from "@/content/site";

/** A quiet cream pause before the café: "One flat white, one big idea…" */
export function Phrase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const o1 = useTransform(p, [0.2, 0.32], [0, 1]);
  const o2 = useTransform(p, [0.3, 0.42], [0, 1]);
  const o3 = useTransform(p, [0.4, 0.52], [0, 1]);
  const y = useTransform(p, [0.2, 0.55], [30, 0]);
  const ops = [o1, o2, o3];

  return (
    <section aria-label="Interlude" className="relative bg-[#f1ebe1] text-[#6b5a4c]">
      <div ref={ref} className="flex h-[110vh] items-center justify-center px-[var(--gutter)]">
        <motion.p style={{ y }} className="text-center font-sans text-[clamp(26px,3.4vw,46px)] leading-[1.25] tracking-[-0.01em]">
          {world.phrase.map((l, i) => (
            <motion.span key={l} style={{ opacity: ops[i] }} className={`block ${i === world.phrase.length - 1 ? "font-semibold text-[#4a3b30]" : "font-light"}`}>
              {l}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </section>
  );
}
