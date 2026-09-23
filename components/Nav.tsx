"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { nav, person } from "@/content/site";
import { useSmoothScroll } from "./ui/SmoothScroll";

function MelbourneClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-AU", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Australia/Melbourne" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>MEL {time}</span>;
}

export function Nav() {
  const { scrollTo, stop, start } = useSmoothScroll();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400);
  });

  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (open) stop();
    else start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, stop, start]);

  const go = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollTo(`#${id}`));
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[120] text-white mix-blend-difference"
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="wrap flex items-center justify-between py-5" aria-label="Main">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); go("home"); }}
            className="font-display text-[22px] italic leading-none tracking-tight"
            aria-label={`${person.name}, back to top`}
          >
            Illana<span className="not-italic">.</span>N
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={(e) => { e.preventDefault(); go(n.id); }}
                  className="group relative block overflow-hidden py-1 text-[12px] uppercase tracking-[0.18em]"
                  aria-current={active === n.id ? "true" : undefined}
                >
                  <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">{n.label}</span>
                  <span className="absolute inset-x-0 top-full block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full font-display italic normal-case tracking-normal text-[14px]">{n.label}</span>
                  {active === n.id && <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-0 h-px w-full bg-white" />}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5 text-[12px] uppercase tracking-[0.18em]">
            <span className="hidden sm:inline tabular-nums opacity-70"><MelbourneClock /></span>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="relative flex h-11 items-center gap-3 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className="relative block h-3 w-6">
                <span className={`absolute left-0 h-px w-full bg-white transition-all duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-full bg-white transition-all duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[110] flex flex-col justify-between bg-ink text-bone lg:hidden"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          >
            <ul className="wrap mt-28 space-y-1">
              {nav.map((n, i) => (
                <li key={n.id} className="overflow-hidden">
                  <motion.a
                    href={`#${n.id}`}
                    onClick={(e) => { e.preventDefault(); go(n.id); }}
                    className="flex items-baseline gap-4 py-1 font-display text-[clamp(44px,13vw,84px)] font-light leading-[1] tracking-[-0.04em]"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.8, delay: 0.25 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="eyebrow text-accent">0{i + 1}</span>
                    <span className={active === n.id ? "italic" : ""}>{n.label}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="wrap flex flex-wrap justify-between gap-4 border-t border-bone/15 py-6 text-[13px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.7 } }}
              exit={{ opacity: 0 }}
            >
              <a href={`mailto:${person.email}`} className="underline-offset-4 hover:underline">{person.email}</a>
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
