"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { person } from "@/content/site";
import { MagneticButton } from "../ui/Magnetic";
import { FadeIn } from "../ui/Reveal";
import { CafeScene } from "./CafeScene";

function Word({ w, progress, range }: { w: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.08, 1]);
  const blur = useTransform(progress, range, ["blur(8px)", "blur(0px)"]);
  return (
    <motion.span style={{ opacity, filter: blur }} className="inline-block">
      {w}&nbsp;
    </motion.span>
  );
}

function Line({ text, progress, from, to, className }: { text: string; progress: MotionValue<number>; from: number; to: number; className?: string }) {
  const words = text.split(" ");
  const step = (to - from) / words.length;
  return (
    <p className={className} aria-label={text}>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} w={w} progress={progress} range={[from + i * step, from + (i + 1) * step]} />
        ))}
      </span>
    </p>
  );
}

export function Finale() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const firstOut = useTransform(p, [0.42, 0.52], [1, 0]);
  const firstY = useTransform(p, [0.42, 0.52], ["0%", "-30%"]);
  const secondIn = useTransform(p, [0.5, 0.58], [0, 1]);
  const secondOut = useTransform(p, [0.8, 0.9], [1, 0]);
  const secondOpacity = useTransform([secondIn, secondOut], ([a, b]: number[]) => Math.min(a, b));
  const glow = useTransform(p, [0.7, 1], ["circle(0% at 50% 60%)", "circle(120% at 50% 60%)"]);

  return (
    <section id="contact" aria-labelledby="finale-title" className="relative bg-ink text-bone">
      <h2 id="finale-title" className="sr-only">The final experience — a café table and a laptop</h2>

      <div ref={ref} className="relative h-[280vh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          <motion.div style={{ opacity: firstOut, y: firstY }} className="wrap absolute text-center">
            <Line
              text="The work is never really finished."
              progress={p}
              from={0.05}
              to={0.38}
              className="mx-auto max-w-[16ch] font-display text-[clamp(40px,7vw,120px)] font-light leading-[0.95] tracking-[-0.05em]"
            />
          </motion.div>
          <motion.div style={{ opacity: secondOpacity }} className="wrap absolute text-center">
            <p className="font-display text-[clamp(40px,7vw,120px)] font-light italic leading-[0.95] tracking-[-0.05em] text-accent">
              See you at the next idea.
            </p>
            <p className="eyebrow mt-8 text-bone/50">Pull up a chair ↓</p>
          </motion.div>
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_60%,#6b4630,#2b1c13_60%,#140d09)]"
            style={{ clipPath: glow }}
          />
        </div>
      </div>

      <CafeScene />

      {/* Final contact */}
      <div className="wrap relative bg-[#140d09] pb-10 pt-24">
        <FadeIn>
          <p className="eyebrow text-bone/50">Final call</p>
          <p className="mt-6 font-display text-[clamp(48px,10vw,180px)] font-light uppercase leading-[0.85] tracking-[-0.06em]">
            Have an idea?
            <br />
            <em className="normal-case text-accent">Let&apos;s make it happen.</em>
          </p>
        </FadeIn>
        <div className="mt-12 flex flex-wrap gap-3">
          <MagneticButton href={`mailto:${person.email}`} variant="accent" tone="dark" cursor="Write">
            {person.email}
          </MagneticButton>
          <MagneticButton href={person.linkedin} variant="ghost" tone="dark">
            LinkedIn ↗
          </MagneticButton>
        </div>
        <footer className="mt-28 flex flex-wrap items-end justify-between gap-6 border-t border-bone/15 pt-6 text-[12px] text-bone/50">
          <p suppressHydrationWarning>© {new Date().getFullYear()} {person.name} · {person.location}</p>
          <p className="font-hand text-[20px] text-bone/70">Strategic mind. Creative execution. Memorable experiences.</p>
          <a href="#home" className="uppercase tracking-[0.18em] hover:text-bone">Back to top ↑</a>
        </footer>
      </div>
    </section>
  );
}
