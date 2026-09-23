"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SplitText } from "../ui/Reveal";

type Item = { id: string; x: string; y: string; r: number; w: string; node: React.ReactNode };

function Checklist() {
  const [done, setDone] = useState([true, true, false, false, false]);
  const items = ["Venue walk-through", "AV & sound check", "Badges printed (spelling ×2)", "Speaker brief sent", "Thank-you emails < 24h"];
  return (
    <div className="bg-bone p-5 shadow-xl">
      <p className="eyebrow text-ink/50">Checklist — D-1</p>
      <ul className="mt-3 space-y-1">
        {items.map((t, i) => (
          <li key={t}>
            <label className="flex min-h-9 cursor-pointer items-center gap-3 text-[14px]" onPointerDown={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                className="peer sr-only"
                checked={done[i]}
                onChange={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
              />
              <span className="grid h-5 w-5 place-items-center rounded-[3px] border border-ink/40 text-[12px] text-bone peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                {done[i] ? "✓" : ""}
              </span>
              <span className={done[i] ? "text-ink/40 line-through" : ""}>{t}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-3 font-hand text-[20px] text-accent">{done.filter(Boolean).length}/5 — {done.every(Boolean) ? "ready. breathe." : "keep going"}</p>
    </div>
  );
}

const moodboard = (
  <div className="bg-bone p-3 shadow-xl">
    <div className="grid grid-cols-3 gap-1.5">
      {["#121110", "#e0482c", "#c9a27a", "#e9e3d9", "#8a847b", "#2a2724"].map((c) => (
        <span key={c} className="aspect-square" style={{ background: c }} />
      ))}
    </div>
    <p className="mt-3 font-display text-[26px] italic leading-none">“Warm, confident, never shouty.”</p>
    <p className="eyebrow mt-2 text-ink/50">Moodboard · v3</p>
  </div>
);

const schedule = (
  <div className="bg-ink p-5 text-bone shadow-xl">
    <p className="eyebrow text-accent">Run of show</p>
    <table className="mt-3 w-full text-[13px]">
      <tbody>
        {[
          ["07:30", "Crew in · deliveries"],
          ["09:00", "Doors · coffee (no queue!)"],
          ["09:30", "Opening keynote"],
          ["11:15", "Break-outs A / B"],
          ["12:30", "Lunch · networking"],
          ["16:45", "Wrap · recap filming"],
        ].map(([t, e]) => (
          <tr key={t} className="border-b border-bone/10">
            <td className="py-1.5 pr-4 tabular-nums text-bone/50">{t}</td>
            <td className="py-1.5">{e}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const calendar = (
  <div className="bg-bone p-4 shadow-xl">
    <p className="eyebrow text-ink/50">Content calendar — week 38</p>
    <div className="mt-3 grid grid-cols-5 gap-1 text-center text-[10px]">
      {["M", "T", "W", "T", "F"].map((d, i) => (
        <span key={i} className="text-ink/40">{d}</span>
      ))}
      {["Teaser", "", "Invite", "Speaker", "", "", "Reel", "", "Last seats", "LIVE"].map((c, i) => (
        <span key={i} className={`grid h-10 place-items-center rounded-sm px-0.5 leading-tight ${c === "LIVE" ? "bg-accent text-bone" : c ? "bg-ink/10" : "bg-ink/[0.03]"}`}>
          {c}
        </span>
      ))}
    </div>
  </div>
);

const floorplan = (
  <div className="bg-[#f3efe6] p-4 shadow-xl">
    <p className="eyebrow text-ink/50">Floor plan · Hall B</p>
    <svg viewBox="0 0 220 150" className="mt-2 w-full" fill="none" stroke="#121110" strokeWidth="1">
      <rect x="4" y="4" width="212" height="142" />
      <rect x="70" y="10" width="80" height="18" fill="#e0482c" stroke="none" />
      <text x="110" y="23" textAnchor="middle" fontSize="8" fill="#f5f2ec" stroke="none">STAGE</text>
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => <circle key={`${r}${c}`} cx={40 + c * 28} cy={50 + r * 20} r="5" />),
      )}
      <rect x="10" y="122" width="44" height="18" strokeDasharray="3 2" />
      <text x="32" y="134" textAnchor="middle" fontSize="7" fill="#121110" stroke="none">CHECK-IN</text>
      <rect x="166" y="122" width="44" height="18" strokeDasharray="3 2" />
      <text x="188" y="134" textAnchor="middle" fontSize="7" fill="#121110" stroke="none">COFFEE</text>
      <path d="M110 146v-8" />
    </svg>
  </div>
);

const concept = (
  <div className="bg-accent p-5 text-bone shadow-xl">
    <p className="eyebrow opacity-70">Creative concept</p>
    <p className="mt-2 font-display text-[30px] leading-[0.95] tracking-[-0.03em]">
      “The room <em>is</em> the message.”
    </p>
    <p className="mt-3 text-[12px] opacity-80">Every surface tells part of the story — signage, seating, even the coffee cups.</p>
  </div>
);

const sticky = (text: string, color: string) => (
  <div className="p-4 shadow-lg" style={{ background: color }}>
    <p className="font-hand text-[24px] leading-[1.05] text-ink">{text}</p>
  </div>
);

const production = (
  <div className="border border-ink/30 bg-bone p-4 shadow-xl">
    <p className="eyebrow text-ink/50">Production details</p>
    <ul className="mt-2 space-y-1 text-[12px]">
      <li>▢ Lanyards — recycled, 220 pcs</li>
      <li>▢ Signage — 6 × A1, 2 × roll-up</li>
      <li>▢ Mic — 2 lapel + 1 handheld (+ spare batteries)</li>
      <li>▢ Photographer — shot list sent</li>
    </ul>
  </div>
);

const items: Item[] = [
  { id: "mood", x: "3%", y: "4%", r: -4, w: "250px", node: moodboard },
  { id: "schedule", x: "27%", y: "10%", r: 2, w: "280px", node: schedule },
  { id: "concept", x: "56%", y: "3%", r: -2, w: "250px", node: concept },
  { id: "note1", x: "80%", y: "6%", r: 5, w: "170px", node: sticky("call caterer re: oat milk ☕", "#f4d77a") },
  { id: "check", x: "4%", y: "50%", r: 3, w: "290px", node: <Checklist /> },
  { id: "floor", x: "33%", y: "52%", r: -3, w: "290px", node: floorplan },
  { id: "cal", x: "62%", y: "46%", r: 2, w: "270px", node: calendar },
  { id: "prod", x: "78%", y: "68%", r: -5, w: "230px", node: production },
  { id: "note2", x: "56%", y: "80%", r: -6, w: "160px", node: sticky("plan B is part of plan A", "#f2b8a8") },
];

export function BehindScenes() {
  const board = useRef<HTMLDivElement>(null);
  const [z, setZ] = useState<string[]>(items.map((i) => i.id));
  const [canDrag, setCanDrag] = useState(false);

  useEffect(() => {
    setCanDrag(window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches);
  }, []);

  const front = (id: string) => setZ((s) => [...s.filter((x) => x !== id), id]);

  return (
    <section id="behind" className="relative overflow-hidden bg-paper-2 pb-32 pt-32 md:pt-44" aria-labelledby="behind-title">
      <div className="wrap">
        <div className="mb-10 flex items-center justify-between eyebrow text-ink/50">
          <span>(08) — Behind the scenes</span>
          <span className="hidden sm:inline">{canDrag ? "Drag things around" : "Tick the checklist"}</span>
        </div>
        <h2 id="behind-title" className="font-display text-[clamp(44px,8vw,140px)] font-light uppercase leading-[0.86] tracking-[-0.06em]">
          <SplitText text="The magic is" className="block" />
          <SplitText text="in the details." className="block pl-[8vw] italic normal-case text-accent" delay={0.1} />
        </h2>
        <p className="mt-8 max-w-md text-[17px] leading-relaxed text-ink/70">
          The part nobody photographs. Schedules, checklists, floor plans and sticky notes — the quiet work that makes the loud moment possible.
        </p>
      </div>

      <div
        ref={board}
        className={
          canDrag
            ? "relative mx-[var(--gutter)] mt-14 h-[900px] rounded-sm bg-[radial-gradient(rgb(18_17_16/.12)_1px,transparent_1px)] [background-size:22px_22px]"
            : "wrap relative mt-14 grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {items.map((it, i) => (
          <motion.div
            key={it.id}
            drag={canDrag}
            dragConstraints={board}
            dragElastic={0.08}
            dragMomentum={false}
            onPointerDown={() => front(it.id)}
            whileDrag={{ scale: 1.05, rotate: 0, boxShadow: "0 40px 80px -20px rgba(0,0,0,.35)" }}
            initial={{ opacity: 0, y: 60, rotate: it.r * 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: it.r }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 5) * 0.08 }}
            className={canDrag ? "absolute" : "justify-self-center"}
            style={{
              zIndex: z.indexOf(it.id) + 1,
              width: `min(${it.w}, 100%)`,
              ...(canDrag ? { left: it.x, top: it.y } : {}),
            }}
            data-cursor={canDrag ? "Drag" : undefined}
          >
            {it.node}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
