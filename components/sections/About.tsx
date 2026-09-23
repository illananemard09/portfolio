"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { keywords, milestones, person } from "@/content/site";
import { FadeIn, SplitText } from "../ui/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;
const equation = ["Strategy", "Creativity", "Communication", "Experiences"];

export function About() {
  const [kw, setKw] = useState(0);
  const [ms, setMs] = useState(milestones.length - 1);

  return (
    <section id="about" className="relative bg-paper pb-28 pt-32 md:pt-44" aria-labelledby="about-title">
      <div className="wrap">
        <div className="mb-14 flex items-center justify-between eyebrow text-ink/50">
          <span>(01) — About</span>
          <span>{person.origin} ⟶ Australia</span>
        </div>

        <h2 id="about-title" className="font-display text-[clamp(44px,8.4vw,150px)] font-light uppercase leading-[0.88] tracking-[-0.05em]">
          <SplitText text="A strategic mind" className="block" />
          <span className="block pl-[8vw]">
            <SplitText text="with an" className="italic normal-case text-accent" delay={0.2} />{" "}
            <SplitText text="event mindset." delay={0.3} />
          </span>
        </h2>

        {/* The equation */}
        <FadeIn className="mt-16 flex flex-wrap items-center gap-x-4 gap-y-3 border-y hairline py-6">
          {equation.map((w, i) => (
            <span key={w} className="flex items-center gap-4">
              <span className="font-display text-[clamp(22px,2.6vw,38px)] italic">{w}</span>
              {i < equation.length - 1 && (
                <motion.span
                  className="text-accent"
                  whileInView={{ rotate: 180 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease, delay: 0.2 + i * 0.15 }}
                  aria-hidden
                >
                  +
                </motion.span>
              )}
            </span>
          ))}
          <span className="ml-auto eyebrow text-ink/50">= Experiences people remember</span>
        </FadeIn>

        <div className="mt-20 grid gap-16 md:grid-cols-12">
          <FadeIn className="md:col-span-5">
            <p className="text-[clamp(18px,1.6vw,22px)] leading-[1.55] text-ink/85">
              Five years across marketing, communications and event management — from a bookbinding workshop in Strasbourg to
              LexisNexis conferences in Paris, and now Melbourne. I sit in the space between the plan and the room: I build the
              strategy, write the story, brief the suppliers and stay until the last guest has gone.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t hairline pt-6 text-[14px]">
              <div>
                <dt className="eyebrow text-ink/50">Based in</dt>
                <dd className="mt-2">{person.location}</dd>
              </div>
              <div>
                <dt className="eyebrow text-ink/50">Education</dt>
                <dd className="mt-2">Master — Communication, Advertising &amp; Digital Strategy</dd>
              </div>
              <div>
                <dt className="eyebrow text-ink/50">Languages</dt>
                <dd className="mt-2">{person.languages.map((l) => l.name).join(" · ")}</dd>
              </div>
              <div>
                <dt className="eyebrow text-ink/50">Status</dt>
                <dd className="mt-2">{person.visa}</dd>
              </div>
            </dl>
          </FadeIn>

          {/* Interactive keywords */}
          <div className="md:col-span-7">
            <p className="eyebrow mb-4 text-ink/50">Hover or tap a word</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1" role="list">
              {keywords.map((k, i) => (
                <li key={k.word}>
                  <button
                    type="button"
                    onMouseEnter={() => setKw(i)}
                    onFocus={() => setKw(i)}
                    onClick={() => setKw(i)}
                    aria-pressed={kw === i}
                    data-cursor="Read"
                    className={`group relative font-display text-[clamp(34px,5.2vw,84px)] uppercase leading-[1] tracking-[-0.04em] transition-all duration-700 ease-[var(--ease-expo)] ${
                      kw === i ? "italic text-accent" : "text-ink/25 hover:text-ink/60"
                    }`}
                  >
                    {k.word}
                    <sup className="eyebrow ml-1 align-top text-[10px] not-italic text-ink/40">0{i + 1}</sup>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-8 min-h-[92px] border-l-2 border-accent pl-6" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.p
                  key={kw}
                  className="max-w-lg text-[clamp(17px,1.5vw,21px)] leading-relaxed"
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease }}
                >
                  {keywords[kw].line}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Evolution timeline */}
        <div className="mt-32">
          <div className="flex items-end justify-between gap-6">
            <h3 className="font-display text-[clamp(28px,3.4vw,52px)] font-light leading-none tracking-[-0.03em]">
              An <em>evolution</em>, not a CV.
            </h3>
            <p className="eyebrow hidden text-ink/50 sm:block">Select a year</p>
          </div>

          <div className="relative mt-12">
            <div className="absolute left-0 right-0 top-[7px] h-px bg-ink/15" />
            <motion.div
              className="absolute left-0 top-[7px] h-px bg-accent"
              animate={{ width: `${(ms / (milestones.length - 1)) * 100}%` }}
              transition={{ duration: 0.9, ease }}
            />
            <ol className="relative flex justify-between" role="tablist" aria-label="Career milestones">
              {milestones.map((m, i) => (
                <li key={m.year}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={ms === i}
                    onClick={() => setMs(i)}
                    onMouseEnter={() => setMs(i)}
                    className="group flex flex-col items-center gap-3 px-1"
                  >
                    <span
                      className={`block h-[15px] w-[15px] rounded-full border transition-all duration-500 ${
                        i <= ms ? "border-accent bg-accent" : "border-ink/30 bg-paper"
                      } ${ms === i ? "scale-125 ring-4 ring-accent/20" : ""}`}
                    />
                    <span className={`font-display text-[clamp(16px,2vw,28px)] tabular-nums transition-colors ${ms === i ? "text-ink" : "text-ink/40"}`}>
                      {m.year}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 grid min-h-[130px] gap-6 md:grid-cols-12" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={ms}
                className="md:col-span-8 md:col-start-3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.55, ease }}
              >
                <p className="font-display text-[clamp(30px,4vw,60px)] italic leading-none tracking-[-0.03em]">{milestones[ms].title}</p>
                <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink/75">{milestones[ms].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
