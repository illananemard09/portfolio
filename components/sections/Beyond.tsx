"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { beyond, type Project } from "@/content/site";
import { Plate } from "../ui/Plate";
import { SplitText } from "../ui/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;
const looks: { palette: Project["palette"]; motif: Project["motif"] }[] = [
  { palette: ["#2a2622", "#e9e3d9", "#c9a27a"], motif: "arches" },
  { palette: ["#1b1a18", "#e9e3d9", "#e0482c"], motif: "waves" },
  { palette: ["#e0482c", "#121110", "#f5f2ec"], motif: "rings" },
  { palette: ["#e9e3d9", "#121110", "#c9a27a"], motif: "dots" },
  { palette: ["#121110", "#e0482c", "#8a847b"], motif: "grid" },
];

export function Beyond() {
  const [open, setOpen] = useState(0);

  return (
    <section id="beyond" className="section-dark relative pb-32 pt-32 md:pt-44" aria-labelledby="beyond-title">
      <div className="wrap">
        <div className="mb-10 flex items-center justify-between eyebrow text-bone/50">
          <span>(09) — Beyond the brief</span>
          <span>The person behind the work</span>
        </div>
        <h2 id="beyond-title" className="font-display text-[clamp(48px,9vw,160px)] font-light uppercase leading-[0.86] tracking-[-0.06em]">
          <SplitText text="Beyond" className="block" />
          <SplitText text="the brief." className="block pl-[18vw] italic normal-case text-accent" delay={0.1} />
        </h2>

        <div className="mt-16 flex h-auto flex-col gap-2 md:h-[560px] md:flex-row">
          {beyond.map((b, i) => {
            const on = open === i;
            return (
              <motion.button
                key={b.title}
                type="button"
                onClick={() => setOpen(i)}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                aria-expanded={on}
                className="relative overflow-hidden rounded-sm text-left"
                animate={{ flexGrow: on ? 5 : 1 }}
                style={{ flexBasis: 0, minHeight: on ? 360 : 76 }}
                transition={{ duration: 0.9, ease }}
                data-cursor={on ? undefined : "Open"}
              >
                <motion.div className="absolute inset-0" animate={{ scale: on ? 1 : 1.2, opacity: on ? 1 : 0.55 }} transition={{ duration: 1.2, ease }}>
                  <Plate palette={looks[i].palette} motif={looks[i].motif} />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="eyebrow absolute left-5 top-5 text-bone/70">0{i + 1}</span>
                <span
                  className={`absolute font-display font-light uppercase leading-none tracking-[-0.04em] text-bone transition-all duration-700 ${
                    on
                      ? "bottom-24 left-5 text-[clamp(36px,4.6vw,76px)]"
                      : "bottom-5 left-5 whitespace-nowrap text-[24px] md:rotate-180 md:text-[28px] md:[writing-mode:vertical-rl]"
                  }`}
                >
                  {b.title}
                </span>
                <AnimatePresence>
                  {on && (
                    <motion.div
                      className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-2 text-bone"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.6, ease } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    >
                      <p className="max-w-[42ch] text-[15px] leading-snug">{b.text}</p>
                      <p className="eyebrow text-bone/60">{b.place}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
