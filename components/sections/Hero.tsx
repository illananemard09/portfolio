"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { person } from "@/content/site";
import { MagneticButton } from "../ui/Magnetic";
import { Plate } from "../ui/Plate";
import { useReady } from "../ui/ready";
import { useSmoothScroll } from "../ui/SmoothScroll";

const ease = [0.16, 1, 0.3, 1] as const;

function Letters({ text, delay, className = "" }: { text: string; delay: number; className?: string }) {
  const ready = useReady();
  const reduce = useReducedMotion();
  return (
    <span className={`inline-flex ${className}`} aria-hidden>
      {text.split("").map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.06em] -mb-[0.06em]">
          <motion.span
            data-letter
            className="inline-block [transition:font-weight_.5s_var(--ease-expo),color_.5s]"
            initial={reduce ? false : { y: "105%" }}
            animate={ready ? { y: "0%" } : undefined}
            transition={{ duration: 1.3, ease, delay: delay + i * 0.045 }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ready = useReady();
  const reduce = useReducedMotion();
  const { scrollTo } = useSmoothScroll();

  // Pointer parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const layer = (depth: number) => ({
    x: useTransform(smx, (v) => v * depth),
    y: useTransform(smy, (v) => v * depth),
  });
  const deep = layer(40);
  const mid = layer(-24);
  const near = layer(60);

  // Spotlight position
  const lx = useMotionValue(70);
  const ly = useMotionValue(30);
  const spot = useTransform([lx, ly], ([x, y]) => `radial-gradient(38vmax 38vmax at ${x}% ${y}%, rgb(224 72 44 / .16), transparent 70%)`);

  // Scroll-out
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Variable-weight letters swell near the cursor.
  useEffect(() => {
    if (reduce) return;
    const title = titleRef.current;
    if (!title) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        title.querySelectorAll<HTMLElement>("[data-letter]").forEach((el) => {
          const r = el.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          const w = Math.round(250 + Math.max(0, 1 - d / 320) * 450);
          el.style.fontWeight = String(w);
        });
      });
    };
    const reset = () => title.querySelectorAll<HTMLElement>("[data-letter]").forEach((el) => (el.style.fontWeight = ""));
    window.addEventListener("pointermove", onMove, { passive: true });
    title.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      title.removeEventListener("pointerleave", reset);
    };
  }, [reduce]);

  return (
    <section
      id="home"
      ref={ref}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-paper pt-24"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        mx.set(nx);
        my.set(ny);
        lx.set((nx + 0.5) * 100);
        ly.set((ny + 0.5) * 100);
      }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spot }} />

      {/* Meta row */}
      <motion.div
        className="wrap relative z-10 grid grid-cols-2 gap-4 eyebrow text-ink/60 md:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <span>Portfolio — Vol. 05</span>
        <span className="hidden md:block">Marketing / Communication</span>
        <span className="hidden md:block">Events / Experiences</span>
        <span className="text-right">{person.location.split(",")[0]} ⟶ Worldwide</span>
      </motion.div>

      {/* Floating plate */}
      <motion.div
        className="absolute right-[6vw] top-[15vh] z-0 w-[34vw] max-w-[380px] min-w-[130px] md:right-[12vw] md:top-[14vh] md:w-[22vw]"
        style={{ ...deep, y: plateY }}
        initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
        animate={ready ? { opacity: 1, scale: 1, rotate: 3 } : undefined}
        transition={{ duration: 1.6, ease, delay: 0.6 }}
      >
        <motion.div style={mid} className="aspect-[4/5] overflow-hidden rounded-t-full shadow-[0_40px_80px_-30px_rgba(0,0,0,.45)]">
          <Plate palette={["#1b1a18", "#e0482c", "#e9e3d9"]} motif="rings" />
        </motion.div>
        <p className="mt-3 hidden font-hand text-[18px] text-ink/70 md:block">fig. 01 — the room, before the doors open</p>
      </motion.div>

      {/* Headline */}
      <motion.h1
        ref={titleRef}
        style={{ y: titleY, opacity: fade }}
        className="wrap relative z-10 mt-auto select-none font-display font-light uppercase leading-[0.84] tracking-[-0.055em] text-ink"
        aria-label="Ideas into experiences."
      >
        <span className="flex items-end gap-[2vw] pl-[4vw] text-[clamp(64px,16vw,260px)] md:pl-[9vw]">
          <Letters text="Ideas" delay={0.1} />
          <span className="mb-[0.18em] overflow-hidden">
            <motion.span
              className="block font-display text-[0.32em] normal-case italic tracking-[-0.02em] text-accent"
              initial={reduce ? false : { y: "110%" }}
              animate={ready ? { y: "0%" } : undefined}
              transition={{ duration: 1.2, ease, delay: 0.55 }}
            >
              into
            </motion.span>
          </span>
        </span>
        <span className="block text-[clamp(44px,12.4vw,210px)]">
          <Letters text="Experiences" delay={0.35} />
          <Letters text="." delay={0.9} className="text-accent" />
        </span>
      </motion.h1>

      {/* Ticket */}
      <motion.button
        type="button"
        onClick={() => scrollTo("#work")}
        data-cursor="Enter"
        style={near}
        className="absolute left-[6vw] top-[24vh] z-20 hidden -rotate-6 md:block"
        initial={{ opacity: 0, y: 40 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.2, ease, delay: 1.3 }}
        whileHover={{ rotate: -2, scale: 1.04 }}
        aria-label="Admit one — go to selected work"
      >
        <span className="flex overflow-hidden rounded-md bg-bone text-left shadow-[0_24px_50px_-20px_rgba(0,0,0,.4)]">
          <span className="border-r border-dashed border-ink/30 px-5 py-4">
            <span className="eyebrow block text-accent">Admit one</span>
            <span className="mt-1 block font-display text-[26px] italic leading-none">Your next event</span>
            <span className="eyebrow mt-2 block text-ink/50">Row A · Seat 01 · Doors 19:00</span>
          </span>
          <span className="grid place-items-center px-3 font-display text-[13px] [writing-mode:vertical-rl]">Nº 0001</span>
        </span>
      </motion.button>

      {/* Rotating stamp */}
      <motion.button
        type="button"
        onClick={() => scrollTo("#about")}
        data-cursor="About"
        style={mid}
        className="absolute right-[5vw] top-[58vh] z-20 hidden h-32 w-32 md:block"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={ready ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 1.2, ease, delay: 1.5 }}
        aria-label="Strategic mind, creative execution, memorable experiences — read about me"
      >
        <svg viewBox="0 0 100 100" className="spin-slow h-full w-full">
          <defs><path id="stamp" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs>
          <text className="fill-ink text-[8.2px] uppercase tracking-[0.2em]">
            <textPath href="#stamp">Strategic mind · Creative execution · Memorable experiences ·</textPath>
          </text>
        </svg>
        <span className="absolute inset-0 m-auto h-4 w-4 rounded-full bg-accent" />
      </motion.button>

      {/* Bottom bar */}
      <motion.div
        className="wrap relative z-10 mt-10 grid gap-8 border-t hairline pb-8 pt-6 md:grid-cols-[1.2fr_auto_1fr] md:items-end"
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.2, ease, delay: 1.1 }}
      >
        <p className="max-w-md text-[15px] leading-relaxed text-ink/75">
          <strong className="font-medium text-ink">{person.name}</strong> — {person.role.toLowerCase()}. I turn briefs into
          campaigns, rooms and moments that people talk about afterwards.
        </p>
        <div className="flex flex-wrap gap-3">
          <MagneticButton onClick={() => scrollTo("#work")} cursor="Explore">
            Explore my work <span aria-hidden>↘</span>
          </MagneticButton>
          <MagneticButton variant="ghost" onClick={() => scrollTo("#contact")}>
            Let&apos;s create something
          </MagneticButton>
        </div>
        <button
          type="button"
          onClick={() => scrollTo("#about")}
          className="group flex items-center gap-3 justify-self-start eyebrow text-ink/60 md:justify-self-end"
        >
          <span className="relative block h-10 w-px overflow-hidden bg-ink/15">
            <motion.span
              className="absolute left-0 top-0 block h-1/2 w-px bg-ink"
              animate={reduce ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          Scroll to experience
        </button>
      </motion.div>
    </section>
  );
}
