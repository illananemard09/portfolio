"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { person } from "@/content/site";
import {
  Beret,
  CoffeeBean,
  Croissant,
  EspressoO,
  HalftoneFlower,
  LatteTop,
  Lanyard,
  MetroTicket,
  NameTag,
  Polaroid,
  Receipt,
  Stamp,
  Ticket,
} from "./stickers";

type Pos = { l: number; t: number; w: number; r: number };
type Sticker = { id: string; node: React.ReactNode; m: Pos | null; d: Pos; depth: number; fact: string; label: string };

// m = phone layout, d = desktop layout (percent of the hero), r = rotation in degrees.
const stickers: Sticker[] = [
  { id: "tag", label: "Name tag", node: <NameTag />, m: { l: 3, t: 10, w: 52, r: -4 }, d: { l: 2, t: 13, w: 24, r: -4 }, depth: 18, fact: `${person.name} — Event Manager & Communications Specialist.` },
  { id: "lanyard", label: "All-access pass", node: <Lanyard />, m: { l: 63, t: 1, w: 15, r: 4 }, d: { l: 25, t: -2, w: 10, r: 6 }, depth: 30, fact: "10+ corporate events, conferences and launches at LexisNexis France." },
  { id: "croissant", label: "Croissant", node: <Croissant />, m: { l: 55, t: 19, w: 42, r: -10 }, d: { l: 37, t: 4, w: 21, r: -8 }, depth: 12, fact: "French by birth. Savoir-faire included." },
  { id: "latte", label: "Latte", node: <LatteTop />, m: { l: 4, t: 24, w: 30, r: 0 }, d: { l: 57, t: 15, w: 16, r: 0 }, depth: 22, fact: "Flat white, always. Great ideas need one." },
  { id: "ticket", label: "Event ticket", node: <Ticket />, m: { l: 50, t: 58, w: 46, r: 10 }, d: { l: 74, t: 9, w: 24, r: 18 }, depth: 16, fact: "Every event deserves one beautiful moment people remember." },
  { id: "metro", label: "Paris métro ticket", node: <MetroTicket />, m: null, d: { l: 3, t: 45, w: 14, r: -5 }, depth: 26, fact: "Paris, 2024 — conferences and launches for legal & accounting audiences." },
  { id: "beret", label: "Beret", node: <Beret />, m: { l: 0, t: 76, w: 40, r: -8 }, d: { l: 4, t: 66, w: 21, r: -8 }, depth: 14, fact: "Strasbourg → Lyon → Paris → Melbourne." },
  { id: "flower", label: "Paper flower", node: <HalftoneFlower />, m: { l: 34, t: 72, w: 28, r: 10 }, d: { l: 27, t: 62, w: 17, r: 10 }, depth: 20, fact: "Details are the design." },
  { id: "bean", label: "Coffee bean", node: <CoffeeBean />, m: { l: 78, t: 69, w: 15, r: 14 }, d: { l: 47, t: 68, w: 9, r: 8 }, depth: 28, fact: "Fuelled by coffee, powered by people." },
  { id: "receipt", label: "Café receipt", node: <Receipt />, m: { l: 64, t: 76, w: 28, r: 6 }, d: { l: 71, t: 42, w: 12, r: 5 }, depth: 18, fact: "10+ events, 5 years in comms, 2 languages. Total: priceless." },
  { id: "stamp", label: "Postage stamp", node: <Stamp />, m: null, d: { l: 86, t: 37, w: 11, r: 8 }, depth: 24, fact: "Now based in Melbourne — open to new projects." },
  { id: "polaroid", label: "Polaroid", node: <Polaroid />, m: { l: 6, t: 58, w: 30, r: -8 }, d: { l: 79, t: 64, w: 13, r: -6 }, depth: 12, fact: "Behind every good photo, there's a run-of-show." },
];

const ease = [0.16, 1, 0.3, 1] as const;

function StickerItem({ s, i, mx, my, canDrag, onFact }: { s: Sticker; i: number; mx: MotionValue<number>; my: MotionValue<number>; canDrag: boolean; onFact: (f: string) => void }) {
  const reduce = useReducedMotion();
  const x = useTransform(mx, (v) => v * s.depth);
  const y = useTransform(my, (v) => v * s.depth);
  const vars = {
    "--ml": `${s.m?.l ?? 0}%`,
    "--mt": `${s.m?.t ?? 0}%`,
    "--mw": `${s.m?.w ?? 0}%`,
    "--dl": `${s.d.l}%`,
    "--dt": `${s.d.t}%`,
    "--dw": `${s.d.w}%`,
  } as React.CSSProperties;
  return (
    <motion.div
      className={`absolute left-[var(--ml)] top-[var(--mt)] w-[var(--mw)] lg:left-[var(--dl)] lg:top-[var(--dt)] lg:w-[var(--dw)] ${s.m ? "" : "hidden lg:block"}`}
      style={{ ...vars, x, y, zIndex: 2 + (i % 5) }}
    >
      <motion.button
        type="button"
        aria-label={`${s.label}: ${s.fact}`}
        data-cursor={canDrag ? "Drag" : "Tap"}
        drag={canDrag}
        dragMomentum={false}
        dragElastic={0.15}
        onTap={() => onFact(s.fact)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onFact(s.fact)}
        initial={reduce ? false : { opacity: 0, scale: 0.4, rotate: s.d.r - 30, y: -40 }}
        animate={{ opacity: 1, scale: 1, rotate: s.d.r, y: 0 }}
        whileHover={{ scale: 1.06, rotate: s.d.r + (i % 2 ? 4 : -4) }}
        whileDrag={{ scale: 1.1, zIndex: 50 }}
        transition={{ type: "spring", stiffness: 160, damping: 14, delay: reduce ? 0 : 0.15 + i * 0.07 }}
        className="block w-full touch-pan-y [filter:drop-shadow(0_14px_18px_rgba(0,0,0,.45))]"
      >
        {s.node}
      </motion.button>
    </motion.div>
  );
}

export function WorldHero() {
  const ref = useRef<HTMLElement>(null);
  const [fact, setFact] = useState<string | null>(null);
  const [canDrag, setCanDrag] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    setCanDrag(window.matchMedia("(pointer: fine)").matches);
  }, []);
  useEffect(() => {
    if (!fact) return;
    const t = setTimeout(() => setFact(null), 4000);
    return () => clearTimeout(t);
  }, [fact]);

  return (
    <section
      id="home"
      ref={ref}
      aria-label={`${person.firstName}'s world`}
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#2a1c14] text-[#f5f2ec]"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,rgba(120,70,40,.35),transparent_70%)]" />

      {stickers.map((s, i) => (
        <StickerItem key={s.id} s={s} i={i} mx={smx} my={smy} canDrag={canDrag} onFact={setFact} />
      ))}

      <h1 className="pointer-events-none absolute left-1/2 top-[45%] z-20 w-max -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center lg:top-[48%]">
        <motion.span
          className="relative block font-hand text-[clamp(64px,19vw,110px)] lg:text-[clamp(64px,11vw,170px)] leading-[0.7] text-[#f5f2ec]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.9 }}
        >
          {person.firstName}&apos;s
          <svg viewBox="0 0 24 24" className="absolute -top-[0.12em] left-[43%] h-[0.3em] w-[0.3em]" aria-hidden>
            <path d="M12 2l2.6 6.9 7.4.3-5.8 4.6 2 7.2L12 16.9 5.8 21l2-7.2L2 9.2l7.4-.3z" fill="none" stroke="#f5f2ec" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </motion.span>
        <motion.span
          className="block font-sans text-[clamp(72px,23vw,130px)] lg:text-[clamp(72px,13vw,210px)] font-black lowercase leading-[0.9] tracking-[-0.05em] text-[#fbf8f2] [text-shadow:0_10px_40px_rgba(0,0,0,.45)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 1.1 }}
        >
          w<EspressoO />rld
        </motion.span>
      </h1>

      <AnimatePresence>
        {fact && (
          <motion.p
            role="status"
            className="absolute bottom-16 left-1/2 z-30 w-[min(90vw,460px)] -translate-x-1/2 rounded-2xl bg-[#fbf8f2] px-5 py-3 text-center font-hand text-[22px] leading-tight text-[#2a1c14] shadow-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {fact}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.p
        className="eyebrow absolute bottom-5 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-[#f5f2ec]/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        {canDrag ? "Drag the stickers · scroll" : "Tap the stickers · scroll"} ↓
      </motion.p>
    </section>
  );
}
