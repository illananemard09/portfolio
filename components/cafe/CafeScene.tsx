"use client";

import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { person } from "@/content/site";
import { useSmoothScroll } from "../ui/SmoothScroll";
import { NotebookOverlay } from "./NotebookOverlay";
import { LaptopScreenPreview, Steam } from "./objects";
import { Desktop } from "./os/Desktop";

const cine = [0.65, 0, 0.35, 1] as const;
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** The café photograph (1680 × 944). The outlines below are traced on this exact image. */
const PHOTO = `${base}/images/cafe.jpg`;

type Act = "laptop" | "coffee" | "mouse" | "notebook" | "sugar" | "flowers" | "espresso" | "pastry";
type Egg = "sugar" | "flowers" | "espresso" | "pastry" | "corner";
const EGGS: Egg[] = ["sugar", "flowers", "espresso", "pastry", "corner"];

// Outlines traced over the photo, in its own pixel space (1680 × 944).
const objects: { act: Act; label: string; d: string }[] = [
  { act: "laptop", label: "Open the laptop", d: "M512 352Q500 352 500 364L494 676L432 780Q426 800 446 802L1058 802Q1080 800 1074 780L1018 676L1012 364Q1012 352 1000 352Z" },
  { act: "coffee", label: "Sip the coffee", d: "M136 650Q140 626 245 626Q352 628 355 650L356 668Q405 662 404 700Q400 735 356 740L354 742Q405 752 404 778Q398 820 248 822Q92 820 90 776Q92 750 138 742Z" },
  { act: "mouse", label: "Click the mouse — it controls the laptop", d: "M1086 712Q1090 694 1140 696Q1210 700 1213 736Q1212 768 1160 768Q1100 764 1086 712Z" },
  { act: "notebook", label: "Read the notebook", d: "M1265 682L1500 674L1680 672L1680 856L1560 850L1278 846Z" },
  { act: "sugar", label: "A sugar packet", d: "M1150 838L1198 806L1338 846L1296 882Z" },
  { act: "flowers", label: "Fresh flowers", d: "M1362 470Q1360 390 1440 392Q1500 360 1560 404Q1632 420 1628 486Q1600 540 1540 540L1548 560Q1560 610 1552 660Q1540 682 1490 682Q1440 682 1430 660Q1424 610 1440 560L1446 540Q1372 530 1362 470Z" },
  { act: "espresso", label: "The espresso machine", d: "M822 140L1100 140Q1112 140 1112 152L1114 340L818 340L816 152Q816 140 822 140Z" },
  { act: "pastry", label: "The croissants", d: "M1335 222L1680 222L1680 378L1335 378Z" },
];

/** `pan` (0 → 1): the camera racks focus onto the table as you scroll in. */
export function CafeScene({ pan }: { pan?: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const { stop, start } = useSmoothScroll();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"table" | "zoom" | "desktop">("table");
  const [osPage, setOsPage] = useState<{ page: string } | null>(null);
  const [notebook, setNotebook] = useState(false);
  const [sips, setSips] = useState(0);
  const [steam, setSteam] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [mouseRun, setMouseRun] = useState(false);
  const [lit, setLit] = useState<Act | null>(null);
  const [intro, setIntro] = useState(false);
  const [found, setFound] = useState<Egg[]>([]);

  // Camera for the laptop zoom.
  const camScale = useMotionValue(1);
  const camX = useMotionValue(0);
  const camY = useMotionValue(0);

  // Scroll-in: from a soft, wider shot to the sharp table.
  const idle = useMotionValue(1);
  const p = pan ?? idle;
  const inScale = useTransform(p, [0, 0.75], [reduce ? 1 : 1.18, 1]);
  const blurPx = useTransform(p, [0, 0.7], [reduce ? 0 : 12, 0]);
  const inBlur = useTransform(blurPx, (v) => (v > 0.05 ? `blur(${v.toFixed(2)}px)` : "none"));
  const [arrived, setArrived] = useState(!pan);
  useMotionValueEvent(p, "change", (v) => {
    const now = v > 0.7;
    if (now && !arrived) setIntro(true);
    setArrived(now);
  });

  const discover = (e: Egg) => setFound((f) => (f.includes(e) ? f : [...f, e]));
  const say = useCallback((m: string) => setBubble(m), []);

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(null), 4200);
    return () => clearTimeout(t);
  }, [bubble]);
  useEffect(() => {
    if (!intro) return;
    const t = setTimeout(() => setIntro(false), 4200);
    return () => clearTimeout(t);
  }, [intro]);

  // On phones the photo is wider than the screen: start centred on the laptop.
  useEffect(() => {
    const el = scrollerRef.current;
    if (el && window.matchMedia("(max-width: 1023px)").matches) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  const openLaptop = useCallback(
    (page: string | null = null) => {
      if (mode !== "table") return;
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
      // Scale about the camera centre, then bring the screen to the middle of the viewport.
      const k = Math.min(window.innerWidth / s.width, window.innerHeight / s.height);
      const ccx = c.left + c.width / 2;
      const ccy = c.top + c.height / 2;
      animate(camScale, k, { duration: 1.3, ease: cine });
      animate(camX, window.innerWidth / 2 - ccx - k * (s.left + s.width / 2 - ccx), { duration: 1.3, ease: cine });
      animate(camY, window.innerHeight / 2 - ccy - k * (s.top + s.height / 2 - ccy), { duration: 1.3, ease: cine }).then(() => setMode("desktop"));
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

  const act = (a: Act) => {
    switch (a) {
      case "laptop":
        openLaptop();
        break;
      case "coffee": {
        const n = sips + 1;
        setSips(n);
        setSteam(true);
        setTimeout(() => setSteam(false), 3000);
        say(n === 1 ? "Take a break. Great ideas need one." : n === 3 ? "Last sip. The best ideas arrive right about now." : "Flat white, obviously.");
        break;
      }
      case "mouse":
        if (mouseRun) return;
        setMouseRun(true);
        setTimeout(() => openLaptop("contact"), reduce ? 0 : 1500);
        break;
      case "notebook":
        setNotebook(true);
        break;
      case "sugar":
        discover("sugar");
        say("Sweet. You notice details — we'd get along.");
        break;
      case "flowers":
        discover("flowers");
        say("Fresh flowers on every event table. Details are the design.");
        break;
      case "espresso":
        discover("espresso");
        say("Double espresso, no sugar. The fuel behind every run-of-show.");
        break;
      case "pastry":
        discover("pastry");
        say("French by birth. Croissant expert by necessity.");
        break;
    }
  };

  const flash = (a: Act) => {
    setLit(a);
    setTimeout(() => setLit((l) => (l === a ? null : l)), 900);
  };

  return (
    <div className="relative bg-[#f3eee6] text-ink">
      {/* Heading — above the photo on phones, over it on desktop */}
      <div
        className={`wrap pointer-events-none relative z-10 pb-6 pt-24 text-center transition-opacity duration-500 lg:absolute lg:inset-x-0 lg:top-0 lg:pb-0 lg:pt-[5vh] ${mode === "table" && arrived ? "" : "lg:opacity-0"}`}
      >
        <p className="eyebrow text-ink/55">(10) — Table 07 · {person.location.split(",")[0]}</p>
        <p className="mx-auto mt-2 max-w-[24ch] font-display text-[clamp(24px,2.4vw,38px)] font-light italic leading-tight lg:[text-shadow:0_1px_18px_rgba(255,250,240,.9)]">
          Everything on this table is clickable.
        </p>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar relative h-[72svh] min-h-[380px] overflow-x-auto overflow-y-hidden overscroll-x-contain lg:h-[100svh] lg:min-h-[620px] lg:overflow-clip"
      >
        <div className="relative aspect-[16/9] h-full lg:absolute lg:left-1/2 lg:top-1/2 lg:h-auto lg:w-[max(100%,calc(100svh*16/9))] lg:-translate-x-1/2 lg:-translate-y-1/2">
          <motion.div ref={cameraRef} className="absolute inset-0 origin-center" style={{ scale: camScale, x: camX, y: camY }}>
            <motion.div className="absolute inset-0 origin-[45%_55%]" style={{ scale: inScale, filter: inBlur }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTO}
                alt="A sunny café table: an open laptop, a latte, a mouse, an open notebook with a pen, flowers, and an espresso machine and croissants behind."
                className="absolute inset-0 h-full w-full select-none object-cover"
                draggable={false}
              />

              {/* The laptop's screen is live */}
              <div ref={screenRef} className="absolute left-[30.18%] top-[39.51%] h-[30.4%] w-[29.58%] overflow-hidden rounded-[2px]" aria-hidden>
                <LaptopScreenPreview cursorTarget={mouseRun} />
              </div>

              <div className="pointer-events-none absolute left-[9.5%] top-[49%] h-[18%] w-[10%]">
                <Steam strong={steam} />
              </div>

              {/* Objects outline themselves on hover, focus or tap */}
              <svg viewBox="0 0 1680 944" preserveAspectRatio="none" className={`cafe-objs absolute inset-0 h-full w-full overflow-visible ${intro ? "is-intro" : ""}`}>
                {objects.map((o) => (
                  <g
                    key={o.act}
                    role="button"
                    tabIndex={0}
                    aria-label={o.label}
                    className={`cafe-obj-path ${lit === o.act ? "is-lit" : ""}`}
                    onClick={() => act(o.act)}
                    onPointerDown={(e) => e.pointerType !== "mouse" && flash(o.act)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        act(o.act);
                      }
                    }}
                  >
                    <path d={o.d} />
                  </g>
                ))}
              </svg>
            </motion.div>

            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_45%,transparent_60%,rgba(40,24,12,.3))]" />
          </motion.div>
        </div>

        {found.length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow absolute right-[var(--gutter)] top-24 z-10 hidden rounded-full bg-white/85 px-3 py-2 text-ink/70 backdrop-blur lg:block"
            aria-live="polite"
          >
            Secrets found {found.length}/{EGGS.length}
          </motion.p>
        )}
      </div>

      <p className="wrap pb-2 pt-3 text-center eyebrow text-ink/45 lg:hidden">
        ← Swipe to explore · {found.length ? `secrets ${found.length}/${EGGS.length}` : "tap the objects"} →
      </p>

      <AnimatePresence>
        {bubble && (
          <motion.div
            role="status"
            className="fixed bottom-[5%] left-1/2 z-[240] w-[min(92vw,480px)] -translate-x-1/2 rounded-2xl bg-white/95 px-5 py-3 text-center font-hand text-[22px] leading-tight text-[#121110] shadow-2xl"
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
            className="fixed inset-0 z-[250] flex flex-col bg-[#e9e2d7]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: 0.4 }}
            role="dialog"
            aria-modal="true"
            aria-label="Illana's laptop"
          >
            <div className="flex items-center justify-between px-4 py-2 text-ink sm:hidden">
              <span className="eyebrow opacity-60">Illana&apos;s laptop</span>
              <button type="button" onClick={closeLaptop} className="eyebrow min-h-11 px-2">← Back to the café</button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center sm:px-[2vmin] sm:pb-[2vmin] sm:pt-16">
              <div className="relative h-full w-full sm:aspect-[16/10] sm:h-auto sm:w-[min(calc(100vw-4vmin),calc((100svh-64px-2vmin)*1.6))]">
                <div className="h-full w-full overflow-hidden sm:rounded-[18px] sm:border-[10px] sm:border-[#0d0d0e] sm:shadow-[0_0_0_1px_#55555a,0_40px_100px_-20px_rgba(60,38,20,.5)]">
                  <Desktop onExit={closeLaptop} initialApp={osPage} />
                </div>
              </div>
              <button
                type="button"
                onClick={closeLaptop}
                className="eyebrow absolute right-4 top-2.5 z-10 hidden min-h-11 rounded-full bg-ink/5 px-4 text-ink backdrop-blur hover:bg-ink/10 sm:block"
              >
                ← Back to the café
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notebook && <NotebookOverlay onClose={() => setNotebook(false)} onSecret={() => discover("corner")} />}
      </AnimatePresence>
    </div>
  );
}
