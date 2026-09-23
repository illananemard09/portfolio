"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { process } from "@/content/site";
import { SplitText } from "../ui/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="relative bg-paper pb-32 pt-32 md:pt-44" aria-labelledby="process-title">
      <div className="wrap">
        <div className="mb-10 flex items-center justify-between eyebrow text-ink/50">
          <span>(07) — How I work</span>
          <span>Five steps, every time</span>
        </div>
        <h2 id="process-title" className="font-display text-[clamp(48px,9vw,160px)] font-light uppercase leading-[0.86] tracking-[-0.06em]">
          <SplitText text="How I" className="block" />
          <SplitText text="work" className="block pl-[14vw] italic normal-case text-accent" delay={0.1} />
        </h2>

        <ol ref={ref} className="relative mt-20">
          <motion.span aria-hidden className="absolute left-0 top-0 w-px bg-accent md:left-[calc(12.5%-1px)]" style={{ height: line }} />
          {process.map((p, i) => (
            <motion.li
              key={p.n}
              className="group relative isolate grid grid-cols-[1fr] gap-2 overflow-hidden border-t hairline py-10 pl-6 md:grid-cols-8 md:items-center md:gap-8 md:py-14 md:pl-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 0.6 }}
            >
              <span aria-hidden className="absolute inset-0 -z-10 origin-left scale-x-0 bg-ink transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
              <motion.span
                className="font-display text-[clamp(56px,7vw,120px)] font-light leading-none tracking-[-0.05em] text-outline-ink transition-colors duration-500 group-hover:[-webkit-text-stroke-color:var(--color-bone)] md:col-span-1"
                initial={{ x: -40 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease, delay: 0.1 }}
              >
                {p.n}
              </motion.span>
              <div className="overflow-hidden md:col-span-3 md:col-start-3">
                <motion.h3
                  className="font-display text-[clamp(40px,5.4vw,92px)] font-light uppercase leading-none tracking-[-0.05em] transition-colors duration-500 group-hover:text-bone"
                  initial={{ y: "100%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease, delay: 0.15 + i * 0.03 }}
                >
                  {p.title}
                </motion.h3>
              </div>
              <motion.p
                className="max-w-[34ch] text-[clamp(16px,1.4vw,20px)] leading-snug text-ink/70 transition-colors duration-500 group-hover:text-bone/80 md:col-span-3 md:col-start-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease, delay: 0.3 }}
              >
                {p.text}
              </motion.p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
