"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { campaigns, marketingCapabilities, marketingStats } from "@/content/site";
import { Counter } from "../ui/Counter";
import { FadeIn, SplitText } from "../ui/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;
const phases = ["brief", "idea", "strategy", "execution", "impact"] as const;

/** A fake social post "screenshot", built in HTML so it stays crisp and editable. */
function MockPost({ i }: { i: number }) {
  const c = campaigns[i];
  const accents = ["#e0482c", "#121110", "#c9a27a", "#8a847b"];
  return (
    <div className="w-full max-w-[320px] rounded-xl bg-bone p-3 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,.5)]">
      <div className="flex items-center gap-2">
        <span className="h-7 w-7 rounded-full" style={{ background: accents[i % 4] }} />
        <span className="text-[12px] font-medium">illana.nemard <span className="font-normal text-ink/50">· case notes</span></span>
        <span className="ml-auto text-[16px] leading-none">···</span>
      </div>
      <div className="relative mt-3 aspect-square overflow-hidden rounded-md" style={{ background: accents[i % 4] }}>
        <p className="absolute inset-0 grid place-items-center p-6 text-center font-display text-[30px] italic leading-[1] tracking-[-0.03em] text-bone">
          {c.title}
        </p>
        <span className="absolute bottom-3 left-3 eyebrow text-bone/70">{c.channel.split(" · ")[0]}</span>
      </div>
      <div className="mt-3 flex gap-3 text-[18px]" aria-hidden>
        <span>♡</span><span>◌</span><span>↗</span>
        <span className="ml-auto">⌑</span>
      </div>
      <p className="mt-1 text-[12px] text-ink/70"><strong className="text-ink">{c.client}</strong> {c.idea}</p>
    </div>
  );
}

export function Marketing() {
  const [cIdx, setCIdx] = useState(0);
  const [phase, setPhase] = useState<(typeof phases)[number]>("brief");
  const c = campaigns[cIdx];

  return (
    <section id="marketing" className="relative overflow-hidden bg-paper pb-32 pt-32 md:pt-44" aria-labelledby="marketing-title">
      <div className="wrap">
        <div className="mb-10 flex items-center justify-between eyebrow text-ink/50">
          <span>(04) — Marketing / Communication</span>
          <span>Brief → Impact</span>
        </div>
        <h2 id="marketing-title" className="font-display text-[clamp(48px,10vw,180px)] font-light uppercase leading-[0.84] tracking-[-0.06em]">
          <SplitText text="Marketing /" className="block" />
          <SplitText text="Communication" className="block italic normal-case text-accent" delay={0.15} />
        </h2>
      </div>

      {/* Capability ticker */}
      <div className="mt-16 border-y hairline py-5" aria-label="Capabilities">
        <div className="flex w-max marquee-track [--dur:55s]">
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {marketingCapabilities.map((m) => (
                <li key={m} className="flex items-center gap-8 pr-8 font-display text-[clamp(26px,3vw,46px)] font-light tracking-[-0.03em]">
                  {m}
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="wrap mt-16 grid grid-cols-2 gap-y-10 md:grid-cols-4">
        {marketingStats.map((s, i) => (
          <FadeIn key={s.label} delay={i * 0.08} className="border-l hairline pl-5">
            <Counter value={s.value} suffix={s.suffix} className="font-display text-[clamp(56px,7vw,112px)] font-light leading-none tracking-[-0.05em]" />
            <p className="mt-2 max-w-[22ch] text-[13px] text-ink/60">{s.label}</p>
          </FadeIn>
        ))}
      </div>

      {/* Case archive */}
      <div className="wrap mt-28 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-ink/50">The archive</p>
          <ul className="mt-6 border-t hairline" role="tablist" aria-label="Campaigns">
            {campaigns.map((cm, i) => (
              <li key={cm.client} className="border-b hairline">
                <button
                  type="button"
                  role="tab"
                  aria-selected={cIdx === i}
                  onClick={() => { setCIdx(i); setPhase("brief"); }}
                  className="group flex w-full items-baseline gap-4 py-5 text-left"
                  data-cursor="Open"
                >
                  <span className="eyebrow text-ink/40">0{i + 1}</span>
                  <span>
                    <span className={`block font-display text-[clamp(22px,2vw,30px)] leading-tight tracking-[-0.02em] transition-all duration-500 ${cIdx === i ? "italic text-accent" : "group-hover:translate-x-2"}`}>
                      {cm.title}
                    </span>
                    <span className="mt-1 block text-[12px] text-ink/50">{cm.client} · {cm.channel}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10 rounded-sm bg-ink p-6 text-bone md:grid-cols-[1fr_auto] md:p-10 lg:col-span-8">
          <div className="flex min-h-[340px] flex-col">
            <div className="flex flex-wrap gap-1" role="tablist" aria-label="Campaign phases">
              {phases.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={phase === p}
                  onClick={() => setPhase(p)}
                  className={`min-h-10 rounded-full px-3 text-[11px] uppercase tracking-[0.14em] transition-colors ${phase === p ? "bg-accent text-bone" : "text-bone/50 hover:text-bone"}`}
                >
                  {p}
                  {i < phases.length - 1 && <span className="ml-2 opacity-40">→</span>}
                </button>
              ))}
            </div>
            <div className="mt-auto pt-10" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div key={`${cIdx}-${phase}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease }}>
                  <p className="eyebrow text-accent">{c.client} — {phase}</p>
                  <p className="mt-4 font-display text-[clamp(26px,3vw,46px)] font-light leading-[1.1] tracking-[-0.03em]">{c[phase]}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 h-px w-full bg-bone/15">
                <motion.div className="h-px bg-accent" animate={{ width: `${((phases.indexOf(phase) + 1) / phases.length) * 100}%` }} transition={{ duration: 0.6, ease }} />
              </div>
            </div>
          </div>
          <div className="hidden justify-self-center md:block">
            <AnimatePresence mode="wait">
              <motion.div key={cIdx} initial={{ opacity: 0, rotate: 6, y: 30 }} animate={{ opacity: 1, rotate: -2, y: 0 }} exit={{ opacity: 0, rotate: -8, y: -30 }} transition={{ duration: 0.7, ease }}>
                <MockPost i={cIdx} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
