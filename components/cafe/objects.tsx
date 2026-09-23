"use client";

// Live overlays drawn on top of the café photo.
import { motion } from "framer-motion";
import { Wallpaper } from "./os/Wallpaper";

export function LaptopScreenPreview({ cursorTarget }: { cursorTarget: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#1d2b78]">
      <Wallpaper className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-x-0 top-0 h-[4%] bg-black/25" />
      {/* Desktop shortcuts */}
      <div className="absolute right-[3%] top-[9%] flex flex-col items-center gap-[1.5vw]">
        <span className="h-[2.4vw] max-h-8 w-[2.8vw] max-w-9 rounded-[18%] bg-[#e0482c] shadow" />
        <span className="h-[2.6vw] max-h-9 w-[2.2vw] max-w-8 rounded-[8%] bg-white shadow" />
        <span className="h-[2.6vw] max-h-9 w-[2.2vw] max-w-8 rounded-[8%] bg-white shadow" />
      </div>
      {/* Mini dock */}
      <div className="absolute bottom-[3%] left-1/2 flex h-[9%] -translate-x-1/2 items-center gap-[0.6vw] rounded-[20%/50%] bg-white/25 px-[1%]">
        {["#fff", "#0a66c2", "#121110", "#1f7bf2", "#fcc933", "#fff", "#79bdf7"].map((c, i) => (
          <span key={i} className="aspect-square h-[70%] rounded-[22%]" style={{ background: c }} />
        ))}
      </div>
      {/* Remote cursor driven by the physical mouse */}
      <motion.svg
        viewBox="0 0 12 18"
        className="absolute h-[7%] drop-shadow"
        initial={false}
        animate={cursorTarget ? { left: ["45%", "70%", "93%"], top: ["60%", "35%", "14%"] } : { left: "45%", top: "60%" }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        aria-hidden
      >
        <path d="M1 1v14l4-4 3 6 2-1-3-6h5z" fill="#fff" stroke="#000" strokeWidth=".8" />
      </motion.svg>
      {cursorTarget && (
        <motion.span
          className="absolute right-[3.5%] top-[9%] h-[3.2vw] w-[3.6vw] rounded-full border-2 border-white"
          initial={{ scale: 0.4, opacity: 1 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        />
      )}
      <div className="absolute inset-x-0 bottom-[18%] text-center">
        <span className="rounded-full bg-black/35 px-[1.4%] py-[0.6%] text-[min(1.1vw,12px)] uppercase tracking-[0.2em] text-white/85 backdrop-blur">Click to open</span>
      </div>
      {/* Screen glare */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.14)_0%,transparent_35%)]" />
    </div>
  );
}

export function Steam({ strong }: { strong: boolean }) {
  return (
    <svg viewBox="0 0 100 120" className="h-full w-full overflow-visible" aria-hidden>
      {[30, 50, 70].map((x, i) => (
        <motion.path
          key={x}
          d={`M${x} 110c-10-14 10-22 0-36s10-22 0-36`}
          fill="none"
          stroke="#fff"
          strokeWidth={strong ? 5 : 3}
          strokeLinecap="round"
          style={{ filter: "blur(3px)" }}
          animate={{ y: [10, -30], opacity: [0, strong ? 0.55 : 0.22, 0], scaleY: [0.8, 1.2] }}
          transition={{ duration: strong ? 2 : 3.6, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}
