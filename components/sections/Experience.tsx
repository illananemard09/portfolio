"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { education, roles, type Role } from "@/content/site";
import { SplitText } from "../ui/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;
const chronological = [...roles].reverse();

function RoleCard({ r, i, open, toggle }: { r: Role; i: number; open: boolean; toggle: () => void }) {
  return (
    <article className="relative flex h-full flex-col">
      <p className="eyebrow text-ink/40">Stop {String(i + 1).padStart(2, "0")} · {r.place}</p>
      <p className="mt-3 font-display text-[clamp(48px,5vw,84px)] font-light leading-none tracking-[-0.05em]">{r.period}</p>
      <h3 className="mt-5 text-[20px] font-medium leading-tight">{r.position}</h3>
      <p className="mt-1 font-display text-[20px] italic text-accent">{r.company}</p>
      <p className="mt-4 max-w-[30ch] font-hand text-[22px] leading-tight text-ink/70">“{r.highlight}”</p>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="mt-6 flex min-h-11 items-center gap-3 self-start rounded-full border border-ink/20 px-4 text-[12px] uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-bone"
      >
        {open ? "Less" : "Responsibilities"}
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-[16px] leading-none">+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            className="overflow-hidden text-[14px] leading-relaxed text-ink/75"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            {r.responsibilities.map((x) => (
              <li key={x} className="flex gap-3 border-b hairline py-2 first:mt-4">
                <span className="text-accent">—</span>
                {x}
              </li>
            ))}
            <li className="pt-3 eyebrow text-ink/40">{r.sector}</li>
          </motion.ul>
        )}
      </AnimatePresence>
    </article>
  );
}

export function Experience() {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: pin, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const dot = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const toggle = (i: number) => setOpen((o) => (o === i ? null : i));

  return (
    <section id="experience" className="relative bg-paper-2" aria-labelledby="experience-title">
      <div className="wrap pb-10 pt-32 md:pt-44">
        <div className="mb-10 flex items-center justify-between eyebrow text-ink/50">
          <span>(05) — Experience</span>
          <span>2020 → Now</span>
        </div>
        <h2 id="experience-title" className="font-display text-[clamp(48px,10vw,180px)] font-light uppercase leading-[0.84] tracking-[-0.06em]">
          <SplitText text="The journey" className="block" />
          <SplitText text="so far" className="block pl-[30vw] italic normal-case text-accent" delay={0.15} />
        </h2>
      </div>

      {/* Desktop: horizontal journey driven by vertical scroll */}
      <div ref={pin} className="relative hidden md:block" style={{ height: `calc(100vh + ${dist}px)` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className="wrap mb-10 flex items-center gap-4">
            <span className="eyebrow text-ink/50">Hoenheim</span>
            <div className="relative h-px flex-1 bg-ink/15">
              <motion.span className="absolute -top-[5px] h-[11px] w-[11px] -translate-x-1/2 rounded-full bg-accent" style={{ left: dot }} />
              <motion.span className="absolute left-0 top-0 h-px bg-accent" style={{ width: dot }} />
            </div>
            <span className="eyebrow text-ink/50">Melbourne</span>
          </div>
          <motion.div ref={track} style={{ x }} className="flex w-max items-stretch gap-[4vw] pl-[var(--gutter)] pr-[12vw]">
            {chronological.map((r, i) => (
              <motion.div
                key={r.company}
                className="w-[min(420px,32vw)] border-l hairline pl-8"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px -10% 0px 0px" }}
                transition={{ duration: 1, ease }}
                style={{ marginTop: i % 2 ? "8vh" : 0 }}
              >
                <RoleCard r={r} i={i} open={open === i} toggle={() => toggle(i)} />
              </motion.div>
            ))}
            <div className="w-[min(420px,32vw)] self-center">
              <p className="eyebrow text-ink/40">Studied along the way</p>
              <ul className="mt-4 space-y-4">
                {education.map((e) => (
                  <li key={e.title} className="border-b hairline pb-3">
                    <p className="text-[15px] font-medium leading-snug">{e.title}</p>
                    <p className="text-[13px] text-ink/60">{e.school} · {e.period}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile: vertical journey */}
      <ol className="wrap relative pb-24 md:hidden">
        {chronological.map((r, i) => (
          <motion.li
            key={r.company}
            className="border-t hairline py-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, ease }}
          >
            <RoleCard r={r} i={i} open={open === i} toggle={() => toggle(i)} />
          </motion.li>
        ))}
        <li className="border-t hairline pt-10">
          <p className="eyebrow text-ink/40">Studied along the way</p>
          <ul className="mt-4 space-y-4">
            {education.map((e) => (
              <li key={e.title}>
                <p className="text-[15px] font-medium">{e.title}</p>
                <p className="text-[13px] text-ink/60">{e.school} · {e.period}</p>
              </li>
            ))}
          </ul>
        </li>
      </ol>
    </section>
  );
}
