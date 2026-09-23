"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { journey } from "@/content/site";
import { FadeIn, SplitText } from "../ui/Reveal";
import { useSmoothScroll } from "../ui/SmoothScroll";

const ease = [0.16, 1, 0.3, 1] as const;
type Side = "both" | "creative" | "operational";

/** Minimal line icons, drawn on when their stage becomes active. */
const glyphs: Record<string, string[]> = {
  concept: ["M50 14a24 24 0 0 1 14 43v9H36v-9a24 24 0 0 1 14-43z", "M40 74h20M43 82h14", "M50 2v6M16 20l5 4M84 20l-5 4"],
  strategy: ["M50 50m-34 0a34 34 0 1 0 68 0a34 34 0 1 0-68 0", "M50 50m-20 0a20 20 0 1 0 40 0a20 20 0 1 0-40 0", "M50 50L86 14M78 14h8v8"],
  planning: ["M14 22h72v62H14z", "M14 38h72M34 14v14M66 14v14", "M26 50h10M45 50h10M64 50h10M26 66h10M45 66h10"],
  production: ["M50 14L88 34L50 54L12 34z", "M12 50l38 20 38-20", "M12 66l38 20 38-20"],
  experience: ["M34 40m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0", "M66 40m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0", "M14 84c0-14 9-22 20-22s20 8 20 22M46 84c0-14 9-22 20-22s20 8 20 22"],
  results: ["M14 86h72", "M22 86V60M42 86V44M62 86V52M82 86V24", "M18 54L42 36L62 44L86 16"],
};

function Glyph({ k, className = "" }: { k: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {glyphs[k].map((d, i) => (
        <motion.path key={`${k}-${i}`} d={d} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease, delay: i * 0.2 }} />
      ))}
    </svg>
  );
}

function SideToggle({ side, setSide, dark = true }: { side: Side; setSide: (s: Side) => void; dark?: boolean }) {
  const opts: { v: Side; l: string }[] = [
    { v: "creative", l: "Creative" },
    { v: "both", l: "Both" },
    { v: "operational", l: "Operational" },
  ];
  return (
    <div role="radiogroup" aria-label="Show the creative or operational side" className={`inline-flex rounded-full border p-1 ${dark ? "border-bone/20" : "border-ink/20"}`}>
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={side === o.v}
          onClick={() => setSide(o.v)}
          className={`relative min-h-10 rounded-full px-4 text-[12px] uppercase tracking-[0.14em] transition-colors ${side === o.v ? (dark ? "text-ink" : "text-bone") : ""}`}
        >
          {side === o.v && <motion.span layoutId={`side-${dark}`} className={`absolute inset-0 rounded-full ${dark ? "bg-bone" : "bg-ink"}`} transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
          <span className="relative">{o.l}</span>
        </button>
      ))}
    </div>
  );
}

export function Events() {
  const pin = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [side, setSide] = useState<Side>("both");
  const { scrollTo } = useSmoothScroll();
  const { scrollYProgress } = useScroll({ target: pin, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(journey.length - 1, Math.floor(v * journey.length)));
  });

  const jump = (i: number) => {
    const el = pin.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    scrollTo(top + span * ((i + 0.5) / journey.length));
  };

  const s = journey[active];

  return (
    <section id="events" className="section-dark relative" aria-labelledby="events-title">
      <div className="wrap pb-16 pt-32 md:pt-44">
        <div className="mb-10 flex items-center justify-between eyebrow text-bone/50">
          <span>(03) — Events / Experiences</span>
          <span>Concept → Results</span>
        </div>
        <h2 id="events-title" className="font-display text-[clamp(52px,11vw,200px)] font-light uppercase leading-[0.84] tracking-[-0.06em]">
          <SplitText text="Events /" className="block" />
          <SplitText text="Experiences" className="block pl-[10vw] italic normal-case text-accent" delay={0.15} />
        </h2>
        <FadeIn className="mt-12 grid gap-8 md:grid-cols-12">
          <p className="text-[clamp(20px,2vw,30px)] leading-[1.35] md:col-span-7">
            An event is two stories told at once: the one guests live, and the one nobody sees. I care about both —
            <em className="text-accent"> the creative side</em> and <em className="text-accent">the operational side</em>.
          </p>
          <div className="md:col-span-4 md:col-start-9 md:justify-self-end">
            <SideToggle side={side} setSide={setSide} />
          </div>
        </FadeIn>
      </div>

      {/* Desktop: pinned journey */}
      <div ref={pin} className="relative hidden md:block" style={{ height: `${journey.length * 90}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          {/* Stage rail */}
          <div className="wrap pt-24">
            <div className="relative">
              <div className="absolute left-0 right-0 top-[5px] h-px bg-bone/15" />
              <motion.div className="absolute left-0 top-[5px] h-px bg-accent" style={{ width: progress }} />
              <ol className="relative grid grid-cols-6">
                {journey.map((j, i) => (
                  <li key={j.key}>
                    <button type="button" onClick={() => jump(i)} className="group flex flex-col items-start gap-3 text-left" aria-current={active === i ? "step" : undefined}>
                      <span className={`block h-[11px] w-[11px] rounded-full transition-all duration-500 ${i <= active ? "bg-accent" : "bg-bone/25"} ${i === active ? "scale-150" : ""}`} />
                      <span className={`eyebrow transition-colors ${i === active ? "text-bone" : "text-bone/40 group-hover:text-bone/70"}`}>
                        {String(i + 1).padStart(2, "0")} {j.label}
                        {i < journey.length - 1 && <span className="ml-2 text-accent">→</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="wrap grid flex-1 grid-cols-12 items-center gap-8">
            <div className="col-span-7">
              <p className="eyebrow text-bone/50">Stage {String(active + 1).padStart(2, "0")} / {String(journey.length).padStart(2, "0")}</p>
              <div className="relative h-[clamp(72px,8.4vw,160px)] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={s.key}
                    className="absolute inset-0 whitespace-nowrap font-display text-[clamp(56px,7vw,132px)] font-light uppercase leading-[1.1] tracking-[-0.06em]"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease }}
                  >
                    {s.label}
                  </motion.p>
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait">
                <motion.ul
                  key={s.key}
                  className="mt-8 flex flex-wrap gap-2"
                  initial="h"
                  animate="v"
                  exit="h"
                  variants={{ v: { transition: { staggerChildren: 0.08 } } }}
                >
                  {s.items.map((it) => (
                    <motion.li
                      key={it}
                      variants={{ h: { opacity: 0, y: 12 }, v: { opacity: 1, y: 0 } }}
                      className="rounded-full border border-bone/25 px-4 py-2 text-[13px]"
                    >
                      {it}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>

            <div className="col-span-5 grid gap-4">
              <div className="relative mb-2 h-28 w-28 text-accent">
                <AnimatePresence mode="wait">
                  <motion.div key={s.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                    <Glyph k={s.key} className="h-full w-full" />
                  </motion.div>
                </AnimatePresence>
              </div>
              {(["creative", "operational"] as const).map((k) => (
                <motion.div
                  key={k}
                  animate={{ opacity: side === "both" || side === k ? 1 : 0.18, x: side === k ? 12 : 0 }}
                  transition={{ duration: 0.6, ease }}
                  className={`rounded-sm border p-6 ${k === "creative" ? "border-accent/50" : "border-bone/20"}`}
                >
                  <p className={`eyebrow ${k === "creative" ? "text-accent" : "text-bone/60"}`}>The {k} side</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={s.key}
                      className="mt-3 text-[clamp(17px,1.4vw,21px)] leading-snug"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      {s[k]}
                    </motion.p>
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Big faint counter */}
          <p aria-hidden className="pointer-events-none absolute -bottom-[4vw] right-[2vw] font-display text-[26vw] font-light leading-none tracking-[-0.08em] text-bone/[0.04] tabular-nums">
            0{active + 1}
          </p>
        </div>
      </div>

      {/* Mobile: stacked journey */}
      <ol className="wrap relative pb-24 md:hidden">
        <span aria-hidden className="absolute bottom-24 left-[calc(var(--gutter)+5px)] top-0 w-px bg-bone/15" />
        {journey.map((j, i) => (
          <motion.li
            key={j.key}
            className="relative pb-12 pl-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.9, ease }}
          >
            <span className="absolute left-0 top-3 h-[11px] w-[11px] rounded-full bg-accent" />
            <p className="eyebrow text-bone/50">{String(i + 1).padStart(2, "0")} / 06</p>
            <p className="mt-1 font-display text-[52px] font-light uppercase leading-none tracking-[-0.05em]">{j.label}</p>
            <div className="mt-5 grid gap-3">
              {(["creative", "operational"] as const).map((k) =>
                side === "both" || side === k ? (
                  <div key={k} className={`rounded-sm border p-4 ${k === "creative" ? "border-accent/50" : "border-bone/20"}`}>
                    <p className={`eyebrow ${k === "creative" ? "text-accent" : "text-bone/60"}`}>{k}</p>
                    <p className="mt-2 text-[16px] leading-snug">{j[k]}</p>
                  </div>
                ) : null,
              )}
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {j.items.map((it) => (
                <li key={it} className="rounded-full border border-bone/25 px-3 py-1.5 text-[12px]">{it}</li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
