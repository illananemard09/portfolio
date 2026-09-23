"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/content/site";
import { Counter } from "../ui/Counter";
import { Plate } from "../ui/Plate";
import { SplitText } from "../ui/Reveal";
import { useSmoothScroll } from "../ui/SmoothScroll";

const ease = [0.16, 1, 0.3, 1] as const;
type Rect = { top: number; left: number; right: number; bottom: number };

export function Work() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState<{ i: number; rect: Rect } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  const openCase = (i: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setOpen({ i, rect: { top: r.top, left: r.left, right: window.innerWidth - r.right, bottom: window.innerHeight - r.bottom } });
  };

  return (
    <section id="work" className="section-dark relative overflow-hidden pb-32 pt-32 md:pt-44" aria-labelledby="work-title">
      <div className="wrap">
        <div className="mb-10 flex items-center justify-between eyebrow text-bone/50">
          <span>(02) — Selected work</span>
          <span>{projects.length} case studies</span>
        </div>
        <h2 id="work-title" className="font-display text-[clamp(56px,13vw,230px)] font-light uppercase leading-[0.82] tracking-[-0.06em]">
          <SplitText text="Selected" className="block" />
          <SplitText text="work" className="block pl-[22vw] italic normal-case text-accent" delay={0.15} />
        </h2>
      </div>

      <ul
        ref={listRef}
        className="relative mt-20 border-t border-bone/15"
        onPointerMove={(e) => {
          x.set(e.clientX);
          y.set(e.clientY);
        }}
        onPointerLeave={() => setHovered(null)}
      >
        {projects.map((p, i) => (
          <li key={p.slug} className="border-b border-bone/15">
            <button
              type="button"
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onClick={(e) => openCase(i, e.currentTarget)}
              data-cursor="View"
              data-cursor-invert
              className="wrap group relative grid w-full grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4 py-8 text-left md:grid-cols-[80px_1fr_auto] md:py-12"
              aria-label={`Open case study: ${p.title} — ${p.client}`}
            >
              <span className="eyebrow text-bone/40">{p.index}</span>
              <span className="min-w-0">
                <span className="eyebrow block text-accent">{p.client} · {p.kicker}</span>
                <span
                  className={`mt-3 block font-display text-[clamp(30px,5.6vw,96px)] font-light leading-[0.95] tracking-[-0.04em] transition-all duration-700 ease-[var(--ease-expo)] ${
                    hovered !== null && hovered !== i ? "opacity-25" : ""
                  } md:group-hover:translate-x-6 md:group-hover:italic`}
                >
                  {p.title}
                </span>
              </span>
              <span className="col-span-2 flex flex-wrap gap-2 md:col-span-1 md:justify-end">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border border-bone/20 px-3 py-1 text-[12px] text-bone/70">{t}</span>
                ))}
                <span className="rounded-full bg-bone px-3 py-1 text-[12px] text-ink">{p.year}</span>
              </span>
              {/* Mobile inline preview */}
              <span className="col-span-2 mt-2 block aspect-[16/10] overflow-hidden rounded-sm md:hidden">
                <Plate palette={p.palette} motif={p.motif} image={p.image} label={p.place} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Desktop floating preview that follows the cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[340px] w-[270px] md:block"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hovered === null ? 0 : 1, scale: hovered === null ? 0.6 : 1, rotate: hovered === null ? -8 : -3 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-sm shadow-2xl">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              className="absolute inset-0"
              initial={false}
              animate={{ clipPath: hovered === i ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", scale: hovered === i ? 1 : 1.3 }}
              transition={{ duration: 0.7, ease }}
            >
              <Plate palette={p.palette} motif={p.motif} image={p.image} label={p.place} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <CaseStudy
            key="case"
            project={projects[open.i]}
            rect={open.rect}
            onClose={() => setOpen(null)}
            onNext={() => setOpen({ i: (open.i + 1) % projects.length, rect: { top: 0, left: 0, right: 0, bottom: 0 } })}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function CaseStudy({ project: p, rect, onClose, onNext }: { project: Project; rect: Rect; onClose: () => void; onNext: () => void }) {
  const { stop, start } = useSmoothScroll();
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const from = `inset(${rect.top}px ${rect.right}px ${rect.bottom}px ${rect.left}px round 8px)`;
  const [bg, fg] = p.palette;
  const light = bg.toLowerCase() === "#e9e3d9";

  useEffect(() => {
    stop();
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    return () => {
      start();
      window.removeEventListener("keydown", onKey);
      prev?.focus({ preventScroll: true });
    };
  }, [stop, start]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Case study: ${p.title}`}
      className="fixed inset-0 z-[150]"
      style={{ background: bg, color: light ? "#121110" : "#f5f2ec" }}
      initial={{ clipPath: from }}
      animate={{ clipPath: "inset(0px 0px 0px 0px round 0px)" }}
      exit={{ clipPath: "inset(100% 0px 0px 0px round 0px)" }}
      transition={{ duration: reduce ? 0 : 1, ease: [0.65, 0, 0.35, 1] }}
    >
      <div ref={scroller} data-lenis-prevent className="h-full overflow-y-auto overscroll-contain">
        <div className="sticky top-0 z-10 flex items-center justify-between px-[var(--gutter)] py-5 mix-blend-difference text-white">
          <span className="eyebrow">Case {p.index} / {p.client}</span>
          <button ref={closeBtn} type="button" onClick={onClose} className="eyebrow flex h-11 items-center gap-3" data-cursor="Close">
            Close <span className="text-lg leading-none">✕</span>
          </button>
        </div>

        <header className="relative -mt-[76px] flex min-h-[100svh] flex-col justify-end overflow-hidden px-[var(--gutter)] pb-14">
          <motion.div className="absolute inset-0 opacity-90" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease }}>
            <Plate palette={p.palette} motif={p.motif} image={p.image} />
          </motion.div>
          <div className="relative">
            <motion.p className="eyebrow" style={{ color: fg }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              {p.kicker} · {p.place} · {p.year}
            </motion.p>
            <h3 key={p.slug} className="mt-4 max-w-[14ch] font-display text-[clamp(48px,9vw,160px)] font-light leading-[0.88] tracking-[-0.05em]">
              {p.title.split(" ").map((w, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom">
                  <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease, delay: 0.55 + i * 0.06 }}>
                    {w}&nbsp;
                  </motion.span>
                </span>
              ))}
            </h3>
          </div>
        </header>

        <div className="grid gap-px border-y border-current/15 md:grid-cols-3" style={{ borderColor: "color-mix(in srgb, currentColor 15%, transparent)" }}>
          {p.stats.map((s) => (
            <div key={s.label} className="px-[var(--gutter)] py-10">
              <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} className="font-display text-[clamp(56px,7vw,110px)] font-light leading-none tracking-[-0.05em]" />
              <p className="mt-3 max-w-[24ch] text-[14px] opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="px-[var(--gutter)] py-24">
          {p.steps.map((s, i) => (
            <motion.section
              key={s.label}
              className="grid gap-6 border-t py-12 md:grid-cols-12 md:py-16"
              style={{ borderColor: "color-mix(in srgb, currentColor 15%, transparent)" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, root: scroller, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.9, ease }}
            >
              <div className="md:col-span-4">
                <span className="eyebrow" style={{ color: fg === "#e9e3d9" ? undefined : fg }}>0{i + 1}</span>
                <h4 className="mt-2 font-display text-[clamp(32px,3.6vw,56px)] italic leading-none tracking-[-0.03em]">{s.label}</h4>
              </div>
              <p className="text-[clamp(19px,1.9vw,28px)] leading-[1.45] md:col-span-7 md:col-start-6">{s.text}</p>
            </motion.section>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            scroller.current?.scrollTo({ top: 0 });
            onNext();
          }}
          data-cursor="Next"
          className="group flex w-full items-end justify-between border-t px-[var(--gutter)] pb-16 pt-10 text-left"
          style={{ borderColor: "color-mix(in srgb, currentColor 15%, transparent)" }}
        >
          <span>
            <span className="eyebrow opacity-60">Next case</span>
            <span className="mt-3 block font-display text-[clamp(40px,8vw,130px)] font-light leading-none tracking-[-0.05em] transition-transform duration-700 group-hover:translate-x-4 group-hover:italic">
              Keep going →
            </span>
          </span>
        </button>
      </div>
    </motion.div>
  );
}
