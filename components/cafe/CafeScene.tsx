"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { person } from "@/content/site";
import { useSmoothScroll } from "../ui/SmoothScroll";
import { NotebookOverlay } from "./NotebookOverlay";
import { Cup, LaptopBase, LaptopScreenPreview, Mouse, NotebookClosedSpread, Pen, Steam, Sugar, TentCard } from "./objects";
import { Desktop } from "./os/Desktop";

const cine = [0.65, 0, 0.35, 1] as const;

// Warm and cool bokeh lights seen through the café window (deterministic, so SSR matches).
const bokeh = Array.from({ length: 34 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: r(1) * 100, y: r(2) * 70, s: 14 + r(3) * 60, warm: r(4) > 0.3, o: 0.25 + r(5) * 0.5, d: r(6) * 6 };
});

type Egg = "sticker" | "sugar" | "card" | "corner";
const EGGS: Egg[] = ["sticker", "sugar", "card", "corner"];

function Hotspot({
  label,
  hint,
  onClick,
  className,
  children,
  glow,
  z = 1,
}: {
  label: string;
  hint: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
  glow?: boolean;
  z?: number;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      data-cursor={hint}
      className={`group absolute block rounded-md outline-offset-4 ${className}`}
      style={{ zIndex: z }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {children}
      {glow && (
        <span aria-hidden className="pointer-events-none absolute -inset-2 animate-pulse rounded-lg ring-1 ring-[#f6c78b]/50" />
      )}
      <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-[#121110]/85 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#ece7df] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 lg:block">
        {hint}
      </span>
    </motion.button>
  );
}

export function CafeScene() {
  const reduce = useReducedMotion();
  const { stop, start } = useSmoothScroll();
  const sceneRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"table" | "zoom" | "desktop">("table");
  const [osPage, setOsPage] = useState<{ page: string } | null>(null);
  const [notebook, setNotebook] = useState(false);
  const [coffeeClicks, setCoffeeClicks] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const [penLine, setPenLine] = useState(0);
  const [mouseRun, setMouseRun] = useState(false);
  const [card, setCard] = useState(false);
  const [found, setFound] = useState<Egg[]>([]);
  const [touched, setTouched] = useState(false);

  // Camera
  const camScale = useMotionValue(1);
  const camX = useMotionValue(0);
  const camY = useMotionValue(0);

  // Pointer parallax on the background
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 50, damping: 18 });
  const spy = useSpring(py, { stiffness: 50, damping: 18 });
  const bgX = useTransform(spx, (v) => v * -24);
  const bgY = useTransform(spy, (v) => v * -12);
  const tableX = useTransform(spx, (v) => v * 10);
  const tableY = useTransform(spy, (v) => v * 6);

  const discover = (e: Egg) => setFound((f) => (f.includes(e) ? f : [...f, e]));
  const say = useCallback((m: string) => setBubble(m), []);

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(null), 4200);
    return () => clearTimeout(t);
  }, [bubble]);

  const openLaptop = useCallback(
    (page: string | null = null) => {
      if (mode !== "table") return;
      setTouched(true);
      setOsPage(page ? { page } : null);
      const cam = cameraRef.current;
      const scr = screenRef.current;
      if (!cam || !scr || reduce) {
        setMode("desktop");
        return;
      }
      setMode("zoom");
      const c = cam.getBoundingClientRect();
      const s = scr.getBoundingClientRect();
      const k = Math.min((c.width * 0.98) / s.width, (c.height * 0.98) / s.height);
      const tx = -k * (s.left + s.width / 2 - (c.left + c.width / 2));
      const ty = -k * (s.top + s.height / 2 - (c.top + c.height / 2));
      animate(camScale, k, { duration: 1.3, ease: cine });
      animate(camX, tx, { duration: 1.3, ease: cine });
      animate(camY, ty, { duration: 1.3, ease: cine }).then(() => setMode("desktop"));
    },
    [mode, reduce, camScale, camX, camY],
  );

  const closeLaptop = useCallback(() => {
    setMode("table");
    setMouseRun(false);
    const d = reduce ? 0 : 1.1;
    animate(camScale, 1, { duration: d, ease: cine });
    animate(camX, 0, { duration: d, ease: cine });
    animate(camY, 0, { duration: d, ease: cine });
  }, [reduce, camScale, camX, camY]);

  // Lock page scroll while the laptop or notebook is open.
  useEffect(() => {
    if (mode === "desktop" || notebook) {
      stop();
      return () => start();
    }
  }, [mode, notebook, stop, start]);

  useEffect(() => {
    if (mode !== "desktop") return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "Escape" && !t.closest("input, textarea")) closeLaptop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, closeLaptop]);

  const clickCoffee = () => {
    setTouched(true);
    const n = coffeeClicks + 1;
    setCoffeeClicks(n);
    if (n === 1) say("Take a break. Great ideas need one.");
    else if (n === 3) say("Last sip. The best ideas arrive right about now.");
    else if (n === 5) { say("Refilled. On the house ☕"); setCoffeeClicks(0); }
    else say(["Flat white, obviously.", "Still warm. Still thinking."][n % 2]);
  };
  const level = coffeeClicks >= 3 ? 0.15 : 1 - coffeeClicks * 0.18;

  const clickPen = () => {
    setTouched(true);
    setPenLine((n) => n + 1);
  };

  const clickMouse = () => {
    setTouched(true);
    if (mouseRun) return;
    setMouseRun(true);
    setTimeout(() => openLaptop("contact"), reduce ? 0 : 1500);
  };

  const pos = {
    // Mobile first, then the desktop composition from lg.
    laptop: "left-[6%] top-[23%] w-[88%] md:left-[15%] md:top-[22%] md:w-[70%] lg:left-[29%] lg:top-[7%] lg:w-[42%]",
    cup: "left-[60%] top-[70%] w-[34%] md:left-[66%] md:top-[68%] md:w-[26%] lg:left-[75%] lg:top-[45%] lg:w-[14%]",
    notebook: "left-[3%] top-[60%] w-[56%] -rotate-[8deg] md:top-[63%] md:w-[44%] lg:left-[3%] lg:top-[52%] lg:w-[26%] lg:-rotate-[10deg]",
    pen: "left-[24%] top-[86%] w-[40%] rotate-[-22deg] md:left-[22%] md:top-[88%] md:w-[30%] lg:left-[18%] lg:top-[82%] lg:w-[17%] lg:rotate-[-28deg]",
    mouse: "left-[83%] top-[59%] w-[11%] rotate-[8deg] md:left-[87%] md:top-[56%] md:w-[7%] lg:left-[74%] lg:top-[72%] lg:w-[4.4%] lg:rotate-[10deg]",
    sugar: "left-[76%] top-[90%] w-[12%] rotate-[18deg] md:left-[82%] md:top-[91%] md:w-[9%] lg:left-[88%] lg:top-[73%] lg:w-[4.5%]",
    card: "left-[64%] top-[59%] w-[15%] md:left-[3%] md:top-[48%] md:w-[10%] lg:left-[8%] lg:top-[31%] lg:w-[7%]",
  };

  return (
    <div
      ref={sceneRef}
      className="relative h-[100svh] min-h-[620px] overflow-clip bg-[#140d09] text-[#ece7df]"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <motion.div ref={cameraRef} className="absolute inset-0 origin-center" style={{ scale: camScale, x: camX, y: camY }}>
        {/* Café interior, softly out of focus */}
        <motion.div aria-hidden className="absolute -inset-x-[4%] top-[-4%] h-[48%] lg:h-[46%]" style={{ x: bgX, y: bgY }}>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#2b1c13,#3a2519_60%,#24170f)]" />
          {/* window */}
          <div className="absolute inset-x-[12%] top-[8%] bottom-[8%] overflow-hidden rounded-t-[40px] bg-[linear-gradient(180deg,#1c2433,#3b3a45_55%,#6b4a38)] [filter:blur(2.5px)]">
            {bokeh.map((b, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: b.s,
                  height: b.s,
                  opacity: b.o,
                  background: b.warm ? "radial-gradient(circle, #ffd59a, rgba(255,170,90,.2) 60%, transparent 70%)" : "radial-gradient(circle, #cfe3ff, rgba(140,180,255,.15) 60%, transparent 70%)",
                }}
                animate={reduce ? undefined : { opacity: [b.o, b.o * 0.5, b.o] }}
                transition={{ duration: 4 + b.d, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
            {/* mullions */}
            <div className="absolute inset-y-0 left-1/3 w-2 bg-[#20140d]" />
            <div className="absolute inset-y-0 left-2/3 w-2 bg-[#20140d]" />
            <div className="absolute inset-x-0 top-[42%] h-2 bg-[#20140d]" />
          </div>
          {/* pendant lamps */}
          {["18%", "82%"].map((l) => (
            <div key={l} className="absolute top-0" style={{ left: l }}>
              <div className="mx-auto h-[6vh] w-px bg-black/60" />
              <div className="h-[3.2vh] w-[6vh] -translate-x-1/2 rounded-t-full bg-[#1a120c]" />
              <div className="absolute left-0 top-[8vh] h-[30vh] w-[30vh] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(255,196,120,.55),transparent_60%)]" />
            </div>
          ))}
          {/* shelf silhouette */}
          <div className="absolute bottom-[10%] left-0 h-[3%] w-[14%] bg-[#1a100a]" />
          <div className="absolute bottom-[13%] left-[3%] flex gap-2">
            {[0, 1, 2].map((i) => <span key={i} className="h-[2.4vh] w-[2vh] rounded-b-md bg-[#d9cfbf]/40" />)}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div aria-hidden className="absolute inset-x-0 bottom-0 top-[40%] lg:top-[36%]" style={{ x: tableX, y: tableY }}>
          <div className="wood absolute -inset-x-[30%] bottom-[-40%] top-0 origin-top [transform:perspective(900px)_rotateX(38deg)]" />
          <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[#a57a58]/70 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_40%_30%,rgba(255,200,140,.18),transparent_70%)]" />
        </motion.div>

        {/* Objects */}
        <motion.div className="absolute inset-0" style={{ x: tableX, y: tableY }}>
          {/* Small vase, purely decorative */}
          <div aria-hidden className="absolute left-[86%] top-[22%] hidden w-[4%] lg:block">
            <div className="mx-auto h-[9vh] w-px rotate-6 bg-[#4f6b3a]" />
            <div className="absolute left-[40%] top-0 h-[2vh] w-[1.4vh] rotate-[30deg] rounded-full bg-[#6c8a4c]" />
            <div className="absolute left-[55%] top-[2.5vh] h-[2vh] w-[1.4vh] -rotate-[30deg] rounded-full bg-[#6c8a4c]" />
            <div className="h-[7vh] w-full rounded-b-[40%] rounded-t-md bg-gradient-to-r from-[#bdb3a3] via-[#efe8dc] to-[#a89e8e] shadow-[6px_12px_18px_rgba(0,0,0,.45)]" />
          </div>

          <Hotspot label="Table card — flip it" hint="Flip" className={pos.card} onClick={() => { setCard((c) => !c); discover("card"); setTouched(true); }} z={2}>
            <TentCard flipped={card} />
          </Hotspot>

          {/* Laptop */}
          <div className={`absolute ${pos.laptop}`} style={{ zIndex: 3 }}>
            <motion.button
              type="button"
              onClick={() => openLaptop()}
              aria-label="Open the MacBook — an interactive desktop"
              data-cursor="Open"
              className="group relative block w-full rounded-t-[14px] outline-offset-4"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="rounded-t-[1.6vw] bg-[#0d0d0e] p-[1.3%] pb-[2.2%] shadow-[0_30px_80px_-10px_rgba(0,0,0,.7),0_0_0_1px_#3a3a3c] lg:rounded-t-[14px]">
                <div ref={screenRef} className="relative aspect-[16/10] overflow-hidden rounded-[3px] [box-shadow:0_0_60px_rgba(240,122,95,.35)]">
                  <LaptopScreenPreview cursorTarget={mouseRun} />
                </div>
              </div>
              {!touched && <span aria-hidden className="pointer-events-none absolute -inset-3 animate-pulse rounded-2xl ring-1 ring-[#f6c78b]/50" />}
            </motion.button>
            <div className="relative -mt-px">
              <LaptopBase />
              <button
                type="button"
                aria-label="A sticker on the laptop"
                data-cursor="Peel"
                onClick={() => { discover("sticker"); say("Made in Strasbourg. Assembled in Melbourne. Powered by flat whites."); }}
                className="absolute right-[7%] top-[46%] grid aspect-square w-[5.5%] min-w-[22px] -rotate-12 place-items-center rounded-full bg-[#e0482c] font-display text-[min(1vw,12px)] italic text-[#f5f2ec] shadow transition-transform hover:rotate-12 hover:scale-110 [@media(max-width:1023px)]:text-[2.4vw]"
              >
                in
              </button>
            </div>
          </div>

          <Hotspot label="Open the notebook" hint="Read" className={pos.notebook} onClick={() => { setNotebook(true); setTouched(true); }} z={4}>
            <NotebookClosedSpread />
          </Hotspot>

          <Hotspot label="Pick up the pen" hint="Write" className={pos.pen} onClick={clickPen} z={6}>
            <motion.div key={penLine} animate={penLine && !reduce ? { x: [0, 8, -6, 10, 0], y: [0, -3, 2, -2, 0], rotate: [0, -3, 2, -2, 0] } : undefined} transition={{ duration: 1.6 }}>
              <Pen />
            </motion.div>
          </Hotspot>

          <Hotspot label="Take a sip of coffee" hint="Sip" className={pos.cup} onClick={clickCoffee} z={5}>
            <div className="relative aspect-[200/170]">
              <div className="pointer-events-none absolute -top-[70%] left-[22%] h-[90%] w-[50%]">
                <Steam strong={coffeeClicks > 0 && coffeeClicks < 3} />
              </div>
              <Cup level={level} />
            </div>
          </Hotspot>

          <Hotspot label="Click the mouse — it controls the laptop" hint="Click" className={pos.mouse} onClick={clickMouse} z={5}>
            <Mouse />
          </Hotspot>

          <Hotspot label="A sugar packet" hint="Tear" className={pos.sugar} onClick={() => { discover("sugar"); say("Sweet. You're the kind of person who notices details — we'd get along."); }} z={5}>
            <Sugar />
          </Hotspot>

          {/* Pen writing */}
          <AnimatePresence>
            {penLine > 0 && (
              <motion.p
                key={penLine}
                aria-live="polite"
                className="pointer-events-none absolute left-[4%] top-[50%] z-[7] w-[60%] font-hand text-[clamp(20px,2.2vw,34px)] leading-tight text-[#f6ead3] [text-shadow:0_2px_12px_rgba(0,0,0,.6)] lg:left-[30%] lg:top-[84%] lg:w-auto"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 2.4, ease: "linear" }}
              >
                {["Every great experience starts with an idea.", "Write it down before it leaves.", "Details are the design."][(penLine - 1) % 3]}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Light & vignette */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_40%,rgba(0,0,0,.65))]" />
      </motion.div>

      {/* Scene UI */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-[var(--gutter)] pt-20 transition-opacity duration-500 ${mode === "table" ? "" : "opacity-0"}`}>
        <div>
          <p className="eyebrow text-[#ece7df]/60">(10) — Table 07</p>
          <p className="mt-2 max-w-[18ch] font-display text-[clamp(22px,2.4vw,36px)] font-light italic leading-tight">
            Everything on this table is clickable.
          </p>
        </div>
        {found.length > 0 && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow rounded-full border border-[#ece7df]/20 px-3 py-2 text-[#ece7df]/70" aria-live="polite">
            Secrets found {found.length}/{EGGS.length}
          </motion.p>
        )}
      </div>

      <AnimatePresence>
        {bubble && (
          <motion.div
            role="status"
            className="absolute bottom-[6%] left-1/2 z-20 w-[min(92%,460px)] -translate-x-1/2 rounded-full bg-[#ece7df] px-5 py-3 text-center font-hand text-[22px] leading-tight text-[#121110] shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {bubble}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The laptop, full size */}
      <AnimatePresence>
        {mode === "desktop" && (
          <motion.div
            className="fixed inset-0 z-[250] flex flex-col bg-[#0b0706]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: 0.4 }}
            role="dialog"
            aria-modal="true"
            aria-label="Illana's laptop"
          >
            <div className="flex items-center justify-between px-4 py-2 text-[#ece7df] sm:hidden">
              <span className="eyebrow opacity-60">Illana&apos;s laptop</span>
              <button type="button" onClick={closeLaptop} className="eyebrow min-h-11 px-2">← Back to the café</button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center sm:px-[2vmin] sm:pb-[2vmin] sm:pt-16">
              <div className="relative h-full w-full sm:aspect-[16/10] sm:h-auto sm:w-[min(calc(100vw-4vmin),calc((100svh-64px-2vmin)*1.6))]">
                <div className="h-full w-full overflow-hidden sm:rounded-[18px] sm:border-[10px] sm:border-[#0d0d0e] sm:shadow-[0_0_0_1px_#3a3a3c,0_40px_120px_rgba(0,0,0,.7)]">
                  <Desktop onExit={closeLaptop} initialApp={osPage} />
                </div>
              </div>
              <button
                type="button"
                onClick={closeLaptop}
                className="eyebrow absolute right-4 top-2.5 z-10 hidden min-h-11 rounded-full bg-[#ece7df]/10 px-4 text-[#ece7df] backdrop-blur hover:bg-[#ece7df]/20 sm:block"
              >
                ← Back to the café
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notebook && (
          <NotebookOverlay
            onClose={() => setNotebook(false)}
            onSecret={() => discover("corner")}
          />
        )}
      </AnimatePresence>

      <p className="sr-only">
        An illustrated café table seen from {person.firstName}&apos;s seat: a laptop, a notebook, a pen, a coffee and a mouse. Each object is a button.
      </p>
    </div>
  );
}
