"use client";

import { useScroll } from "framer-motion";
import { useRef } from "react";
import { CafeScene } from "./CafeScene";

/** The camera lowers from the ceiling to the table as you scroll, then the table stays put. */
export function CafeFinale() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section id="cafe" aria-label="The café table" className="relative bg-[#f3eee6]">
      <div ref={ref} className="relative h-[220svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <CafeScene pan={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
