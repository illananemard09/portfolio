"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { toolkit } from "@/content/site";
import { SplitText } from "../ui/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

export function Toolkit() {
  const [active, setActive] = useState(0);

  return (
    <section id="toolkit" className="section-dark relative pb-32 pt-32 md:pt-44" aria-labelledby="toolkit-title">
      <div className="wrap">
        <div className="mb-10 flex items-center justify-between eyebrow text-bone/50">
          <span>(06) — Toolkit</span>
          <span>{toolkit.length} disciplines</span>
        </div>
        <h2 id="toolkit-title" className="max-w-[16ch] font-display text-[clamp(44px,7vw,120px)] font-light leading-[0.9] tracking-[-0.05em]">
          <SplitText text="A professional toolkit," className="block" />
          <SplitText text="not a list of buzzwords." className="block italic text-accent" delay={0.15} />
        </h2>

        <LayoutGroup>
          <ul className="mt-16 grid grid-cols-2 gap-2 md:grid-cols-4" role="tablist" aria-label="Skill categories">
            {toolkit.map((t, i) => {
              const on = active === i;
              return (
                <motion.li
                  key={t.key}
                  layout
                  transition={{ duration: 0.7, ease }}
                  className={`${on ? "col-span-2 row-span-2" : ""} overflow-hidden rounded-sm`}
                >
                  <motion.button
                    layout="position"
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls={`tk-${t.key}`}
                    onClick={() => setActive(i)}
                    className={`relative flex h-full min-h-[120px] w-full flex-col justify-between p-5 text-left transition-colors duration-500 md:min-h-[150px] ${
                      on ? "bg-accent text-bone" : "bg-ink-2 text-bone hover:bg-ink-3"
                    }`}
                  >
                    <span className="eyebrow opacity-60">{String(i + 1).padStart(2, "0")}</span>
                    <motion.span layout="position" className={`font-display font-light uppercase leading-[0.95] tracking-[-0.04em] ${on ? "text-[clamp(36px,5vw,76px)]" : "text-[clamp(20px,2vw,30px)]"}`}>
                      {t.label}
                    </motion.span>
                    <AnimatePresence>
                      {on && (
                        <motion.ul
                          id={`tk-${t.key}`}
                          role="tabpanel"
                          className="mt-6 flex flex-wrap gap-2"
                          initial="h"
                          animate="v"
                          exit="h"
                          variants={{ v: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } }}
                        >
                          {t.skills.map((s) => (
                            <motion.li
                              key={s}
                              variants={{ h: { opacity: 0, y: 16, scale: 0.9 }, v: { opacity: 1, y: 0, scale: 1 } }}
                              className="rounded-full bg-ink/15 px-3 py-1.5 text-[13px] backdrop-blur"
                            >
                              {s}
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>
        </LayoutGroup>
      </div>
    </section>
  );
}
