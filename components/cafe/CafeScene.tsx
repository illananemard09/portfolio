"use client";

import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { person } from "@/content/site";
import { useSmoothScroll } from "../ui/SmoothScroll";
import { Backdrop } from "./Backdrop";
import { NotebookOverlay } from "./NotebookOverlay";
import { BurgundyNotebook, Cup, LaptopBase, LaptopScreenPreview, Mouse, Pen, Phone, Steam, Sugar, Sunglasses } from "./objects";
import { Desktop } from "./os/Desktop";

const cine = [0.65, 0, 0.35, 1] as const;

type Egg = "sticker" | "sugar" | "flowers" | "espresso" | "board" | "corner";
const EGGS: Egg[] = ["sticker", "sugar", "flowers", "espresso", "board", "corner"];

/** A clickable object on the table: it outlines itself on hover (see .cafe-obj in globals.css). */
function Hotspot({
  label,
  hint,
  onClick,
  className,
  children,
  z = 2,
}: {
  label: string;
  hint: string;
  onClick: () => void;
  className: string;
  children?: React.ReactNode;
  z?: number;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      title={hint}
      className={`cafe-obj group absolute block rounded-md outline-none ${children ? "" : "cafe-obj--area"} ${className}`}
      style={{ zIndex: z }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}

/** `pan` (0 → 1) lowers the camera from the café ceiling down to the table. */
export function CafeScene({ pan }: { pan?: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const { stop, start } = useSmoothScroll();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"table" | "zoom" | "desktop">("table");
  const [osPage, setOsPage] = useState<{ page: string } | null>(null);
  const [notebook, setNotebook] = useState(false);
  const [coffeeClicks, setCoffeeClicks] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const [penLine, setPenLine] = useState(0);
  const [mouseRun, setMouseRun] = useState(false);
  const [phoneLit, setPhoneLit] = useState(false);
  const [golden, setGolden] = useState(false);
  const [found, setFound] = useState<Egg[]>([]);

  // Camera
  const camScale = useMotionValue(1);
  const camX = useMotionValue(0);
  const camY = useMotionValue(0);

  // Gentle parallax between the café behind and the table in front.
  const px = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 50, damping: 18 });
  const bgX = useTransform(spx, (v) => v * -14);

  const idle = useMotionValue(1);
  const ceilRef = useRef<HTMLDivElement>(null);
  const [ceilH, setCeilH] = useState(0);
  useEffect(() => {
    const el = ceilRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCeilH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const panY = useTransform(pan ?? idle, [0, 0.75], [pan ? ceilH : 0, 0]);
  const [arrived, setArrived] = useState(!pan);
  useMotionValueEvent(pan ?? idle, "change", (v) => setArrived(v > 0.7));

  const discover = (e: Egg) => setFound((f) => (f.includes(e) ? f : [...f, e]));
  const say = useCallback((m: string) => setBubble(m), []);

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(null), 4200);
    return () => clearTimeout(t);
  }, [bubble]);

  // On phones the table is wider than the screen: start centred on the laptop.
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
      const tx = window.innerWidth / 2 - ccx - k * (s.left + s.width / 2 - ccx);
      const ty = window.innerHeight / 2 - ccy - k * (s.top + s.height / 2 - ccy);
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
    const n = coffeeClicks + 1;
    setCoffeeClicks(n);
    if (n === 1) say("Take a break. Great ideas need one.");
    else if (n === 3) say("Last sip. The best ideas arrive right about now.");
    else if (n === 5) { say("Refilled. On the house ☕"); setCoffeeClicks(0); }
    else say(["Flat white, obviously.", "Still warm. Still thinking."][n % 2]);
  };
  const level = coffeeClicks >= 3 ? 0.15 : 1 - coffeeClicks * 0.18;

  const clickMouse = () => {
    if (mouseRun) return;
    setMouseRun(true);
    setTimeout(() => openLaptop("contact"), reduce ? 0 : 1500);
  };

  const clickPhone = () => {
    if (!phoneLit) {
      setPhoneLit(true);
      say(`New message from ${person.firstName}: “Have an idea? Let's make it happen.”`);
    } else {
      setPhoneLit(false);
      openLaptop("contact");
    }
  };

  return (
    <div className="relative bg-[#f3eee6] text-ink">
      {/* Heading — above the table on phones, on the wall on desktop */}
      <div
        className={`wrap pointer-events-none relative z-10 pb-6 pt-24 text-center transition-opacity duration-500 lg:absolute lg:inset-x-0 lg:top-0 lg:pb-0 lg:pt-[6vh] ${mode === "table" && arrived ? "" : "lg:opacity-0"}`}
      >
        <p className="eyebrow text-ink/50">(10) — Table 07 · {person.location.split(",")[0]}</p>
        <p className="mx-auto mt-2 max-w-[22ch] font-display text-[clamp(24px,2.4vw,38px)] font-light italic leading-tight">
          Hover the objects. Everything on this table is clickable.
        </p>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar relative h-[72svh] min-h-[380px] overflow-x-auto overflow-y-hidden overscroll-x-contain lg:h-[100svh] lg:min-h-[620px] lg:overflow-clip"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
        }}
      >
        <motion.div className="relative h-full w-max [--ceil:40svh] lg:absolute lg:inset-0 lg:w-auto lg:[--ceil:75svh]" style={{ y: panY }}>
        {/* The ceiling the camera starts from */}
        <div ref={ceilRef} aria-hidden className="absolute -inset-x-[20%] bottom-full h-[var(--ceil)] bg-[linear-gradient(180deg,#fbf9f5,#f7f4ef)]">
          {["22%", "50%", "78%"].map((l) => (
            <div key={l} className="absolute bottom-0 top-0 w-px" style={{ left: l }}>
              <div className="h-[70%] w-px bg-[#3a2e26]/60" />
              <div className="h-[5vh] w-[9vh] -translate-x-1/2 rounded-t-full bg-[#2b2724]" />
              <div className="absolute left-0 top-[75%] h-[28vh] w-[28vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,214,150,.45),transparent_62%)]" />
            </div>
          ))}
        </div>
        <div className="relative aspect-[16/9] h-full lg:absolute lg:left-1/2 lg:top-1/2 lg:h-auto lg:w-[max(100%,calc(100svh*16/9))] lg:-translate-x-1/2 lg:-translate-y-1/2">
          <motion.div ref={cameraRef} className="absolute inset-0 origin-center" style={{ scale: camScale, x: camX, y: camY }}>
            <motion.div className="absolute -inset-x-[1%] inset-y-0" style={{ x: bgX }}>
              <Backdrop golden={golden} />
            </motion.div>

            {/* Background details that hide a little something */}
            <Hotspot label="The espresso machine" hint="One more?" className="left-[18%] top-[34%] h-[19%] w-[11%]"
              onClick={() => { discover("espresso"); say("Double espresso, no sugar. The fuel behind every run-of-show."); }} z={1} />
            <Hotspot label="The brand wall" hint="Brands" className="left-[68.7%] top-[12%] h-[22%] w-[17%]"
              onClick={() => { discover("board"); say("LexisNexis, Pulsalys, Pimms, L'atelier du Relieur, Spiero, Strass Events — and yours next?"); }} z={1} />
            <Hotspot label="Fresh flowers" hint="Smell" className="left-[84%] top-[47%] h-[31%] w-[10%]"
              onClick={() => { discover("flowers"); say("Fresh flowers on every event table. Details are the design."); }} z={2} />

            {/* Laptop */}
            <div className="absolute left-[35%] top-[31%] w-[30%]" style={{ zIndex: 3 }}>
              <motion.button
                type="button"
                onClick={() => openLaptop()}
                aria-label="Open the MacBook — an interactive desktop"
                className="cafe-obj group relative block w-full rounded-t-[12px] outline-none"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="rounded-t-[min(1.2vw,14px)] bg-[#0d0d0e] p-[1.3%] pb-[2.2%] shadow-[0_24px_60px_-18px_rgba(40,25,10,.55),0_0_0_1px_#55555a]">
                  <div ref={screenRef} className="relative aspect-[16/10] overflow-hidden rounded-[3px]">
                    <LaptopScreenPreview cursorTarget={mouseRun} />
                  </div>
                </div>
              </motion.button>
              <div className="relative -mt-px">
                <LaptopBase />
                <button
                  type="button"
                  aria-label="A sticker on the laptop"
                  data-cursor="Peel"
                  onClick={() => { discover("sticker"); say("Made in Strasbourg. Assembled in Melbourne. Powered by flat whites."); }}
                  className="absolute right-[7%] top-[46%] grid aspect-square w-[5.5%] min-w-[14px] -rotate-12 place-items-center rounded-full bg-[#e0482c] font-display text-[min(1vw,12px)] italic text-[#f5f2ec] shadow transition-transform hover:rotate-12 hover:scale-110"
                >
                  in
                </button>
              </div>
            </div>

            <Hotspot label="Take a sip of coffee" hint="Sip" className="left-[11%] top-[63%] w-[15%]" onClick={clickCoffee} z={4}>
              <div className="relative aspect-[200/170]">
                <div className="pointer-events-none absolute -top-[70%] left-[22%] h-[90%] w-[50%]">
                  <Steam strong={coffeeClicks > 0 && coffeeClicks < 3} />
                </div>
                <Cup level={level} dark />
              </div>
            </Hotspot>

            <Hotspot label="A sugar packet" hint="Sweet" className="left-[27.5%] top-[80%] w-[3.4%] rotate-[14deg]"
              onClick={() => { discover("sugar"); say("Sweet. You're the kind of person who notices details — we'd get along."); }} z={4}>
              <Sugar />
            </Hotspot>

            <Hotspot label="The phone — read the new message" hint={phoneLit ? "Reply" : "Unlock"} className="left-[41%] top-[77%] w-[5.4%] -rotate-[8deg]" onClick={clickPhone} z={5}>
              <Phone lit={phoneLit} />
            </Hotspot>

            <Hotspot label="Sunglasses — switch to golden hour" hint={golden ? "Daylight" : "Golden hour"} className="left-[50%] top-[80%] w-[11%] rotate-[4deg]"
              onClick={() => { setGolden((g) => !g); say(golden ? "Back to daylight." : "Golden hour in Melbourne. The best light for recap photos."); }} z={5}>
              <div className="aspect-[220/90]"><Sunglasses /></div>
            </Hotspot>

            <Hotspot label="Click the mouse — it controls the laptop" hint="Click" className="left-[67%] top-[64%] w-[3.4%] rotate-[8deg]" onClick={clickMouse} z={4}>
              <Mouse />
            </Hotspot>

            <Hotspot label="Open the notebook" hint="Read" className="left-[68%] top-[74%] w-[15%] rotate-[-4deg]" onClick={() => setNotebook(true)} z={4}>
              <BurgundyNotebook />
            </Hotspot>

            <Hotspot label="Pick up the pen" hint="Write" className="left-[83%] top-[80%] w-[11%]" onClick={() => setPenLine((n) => n + 1)} z={5}>
              <motion.div key={penLine} className="rotate-[-38deg]" animate={penLine && !reduce ? { x: [0, 8, -6, 10, 0], y: [0, -3, 2, -2, 0], rotate: [0, -3, 2, -2, 0] } : undefined} transition={{ duration: 1.6 }}>
                <Pen />
              </motion.div>
            </Hotspot>

            {/* Pen writing */}
            <AnimatePresence>
              {penLine > 0 && (
                <motion.p
                  key={penLine}
                  aria-live="polite"
                  className="pointer-events-none absolute left-[60%] top-[90%] z-[6] whitespace-nowrap font-hand text-[min(2vw,30px)] leading-tight text-[#f6ead3] [text-shadow:0_2px_10px_rgba(0,0,0,.5)] [@media(max-width:1023px)]:text-[18px]"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 2.4, ease: "linear" }}
                >
                  {["Every great experience starts with an idea.", "Write it down before it leaves.", "Details are the design."][(penLine - 1) % 3]}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Soft vignette */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_40%,transparent_55%,rgba(60,38,20,.28))]" />
          </motion.div>
        </div>
        </motion.div>

        {found.length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow absolute right-[var(--gutter)] top-24 z-10 hidden rounded-full bg-white/80 px-3 py-2 text-ink/70 backdrop-blur lg:block"
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

      <p className="sr-only">
        A sunny café table seen from {person.firstName}&apos;s seat: a laptop, a notebook, a pen, a coffee, a phone, sunglasses and a mouse. Each object is a button.
      </p>
    </div>
  );
}
