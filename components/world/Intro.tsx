"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { world } from "@/content/site";

function Word({ text, bold, progress, range }: { text: string; bold?: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className={bold ? "font-semibold text-[#fbf8f2]" : "font-light"}>
      {text}
    </motion.span>
  );
}

/** "Made in France, now in Melbourne…" — lights up word by word as you scroll. */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Flatten into words so each can light up in turn.
  const words = world.intro.flatMap((line, li) =>
    line.flatMap((seg) => seg.t.split(/(\s+)/).filter(Boolean).map((t) => ({ t, b: "b" in seg && seg.b, li }))),
  );
  const count = words.filter((w) => w.t.trim()).length;
  let k = 0;

  return (
    <section id="about" aria-label="About Illana" className="relative bg-[#2a1c14] text-[#f5f2ec]">
      <div ref={ref} className="relative h-[220vh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center px-[var(--gutter)]">
          <p className="max-w-[18ch] text-center font-sans text-[clamp(30px,5.2vw,72px)] leading-[1.18] tracking-[-0.02em] text-[#f5f2ec]/90">
            {world.intro.map((line, li) => (
              <span key={li} className="block">
                {words
                  .filter((w) => w.li === li)
                  .map((w, i) => {
                    if (!w.t.trim()) return <span key={i}>{w.t}</span>;
                    const idx = k++;
                    const a = 0.1 + (idx / count) * 0.75;
                    return <Word key={i} text={w.t} bold={w.b} progress={scrollYProgress} range={[a, a + 0.75 / count]} />;
                  })}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
