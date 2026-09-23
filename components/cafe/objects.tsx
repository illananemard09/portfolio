"use client";

// Illustrated desk objects, built from CSS + SVG so they stay sharp and light.
import { motion } from "framer-motion";

export function LaptopScreenPreview({ cursorTarget }: { cursorTarget: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "radial-gradient(120% 90% at 20% 10%, #f07a5f 0%, transparent 45%), radial-gradient(90% 90% at 90% 90%, #2a2724 0%, transparent 60%), linear-gradient(135deg, #e0482c 0%, #7a2c1c 45%, #121110 100%)" }}>
      <div className="absolute inset-x-0 top-0 h-[4%] bg-black/25" />
      <p className="absolute inset-x-0 top-[30%] text-center font-display text-[min(3.6vw,44px)] font-light italic leading-none tracking-[-0.04em] text-white/25">see you at the next idea</p>
      {/* Desktop shortcuts */}
      <div className="absolute right-[3%] top-[9%] flex flex-col items-center gap-[1.5vw]">
        <span className="h-[3.2vw] max-h-10 w-[3.6vw] max-w-11 rounded-[18%] bg-[#e0482c] shadow" />
        <span className="h-[3vw] max-h-9 w-[3.6vw] max-w-11 rounded-[12%] bg-[#79bdf7] shadow" />
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

export function LaptopBase() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "16 / 2.6" }}>
      {/* hinge */}
      <div className="absolute inset-x-[1%] top-0 h-[8%] rounded-b-[40%] bg-gradient-to-b from-[#3a3a3c] to-[#8e8e93]" />
      <div
        className="absolute inset-x-0 bottom-0 top-[6%]"
        style={{
          clipPath: "polygon(4% 0, 96% 0, 100% 100%, 0 100%)",
          background: "linear-gradient(180deg, #b9b9be 0%, #d8d8dc 40%, #c4c4c9 100%)",
        }}
      >
        {/* keyboard */}
        <div
          className="absolute left-[14%] right-[14%] top-[8%] h-[46%]"
          style={{
            clipPath: "polygon(2% 0, 98% 0, 100% 100%, 0 100%)",
            background:
              "repeating-linear-gradient(180deg, transparent 0 16%, #c8c8cd 16% 20%), repeating-linear-gradient(90deg, #2c2c2e 0 5.4%, transparent 5.4% 6.4%)",
          }}
        />
        {/* trackpad */}
        <div className="absolute left-1/2 top-[60%] h-[34%] w-[26%] -translate-x-1/2 rounded-[6%] bg-gradient-to-b from-[#cbcbcf] to-[#bcbcc1] shadow-[inset_0_0_0_1px_rgba(0,0,0,.06)]" />
      </div>
      <div className="absolute inset-x-0 -bottom-[4%] h-[6%] rounded-b-[50%] bg-[#8e8e93]" />
    </div>
  );
}

export function Cup({ level = 1, empty = false }: { level?: number; empty?: boolean }) {
  return (
    <svg viewBox="0 0 200 170" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="cup-coffee" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#c68a57" />
          <stop offset=".55" stopColor="#8b5330" />
          <stop offset="1" stopColor="#4a2a17" />
        </radialGradient>
        <linearGradient id="cup-body" x1="0" x2="1">
          <stop offset="0" stopColor="#d9d3c8" />
          <stop offset=".35" stopColor="#fbf8f2" />
          <stop offset="1" stopColor="#c9c1b4" />
        </linearGradient>
        <filter id="cup-soft"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <ellipse cx="104" cy="120" rx="92" ry="40" fill="#000" opacity=".35" filter="url(#cup-soft)" />
      <ellipse cx="100" cy="110" rx="92" ry="44" fill="#ece6db" />
      <ellipse cx="100" cy="106" rx="70" ry="31" fill="#ddd5c7" />
      <path d="M152 70c26 0 30 34 4 36" fill="none" stroke="url(#cup-body)" strokeWidth="11" strokeLinecap="round" />
      <path d="M40 60v30c0 20 26 32 60 32s60-12 60-32V60z" fill="url(#cup-body)" />
      <ellipse cx="100" cy="60" rx="60" ry="26" fill="#f7f3ec" />
      <ellipse cx="100" cy="62" rx="53" ry="21" fill="#3b2213" />
      {!empty && (
        <motion.g animate={{ scale: level, opacity: level > 0.2 ? 1 : 0 }} transition={{ duration: 0.8 }}>
          <ellipse cx="100" cy="62" rx="51" ry="19.5" fill="url(#cup-coffee)" />
          {/* latte-art heart */}
          <path d="M100 76c-18-9-26-17-22-24 3-5 13-5 18 1l4 4 4-4c5-6 15-6 18-1 4 7-4 15-22 24z" fill="#f3e3cc" opacity=".9" />
          <path d="M100 74V50" stroke="#c68a57" strokeWidth="1.5" opacity=".6" />
        </motion.g>
      )}
    </svg>
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

export function NotebookClosedSpread() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "10 / 7" }}>
      <div className="absolute inset-0 translate-x-[1.5%] translate-y-[2%] rounded-md bg-black/40 blur-md" />
      <div className="absolute inset-0 rounded-md bg-[#1f1b18]" />
      <div className="absolute inset-[3%] flex overflow-hidden rounded-sm">
        <div className="paper-lines relative flex-1 bg-[#f6f1e6] p-[6%] shadow-[inset_-12px_0_18px_-12px_rgba(0,0,0,.35)]">
          <p className="font-hand text-[min(1.5vw,19px)] leading-[1.25] text-[#2b3a67] [@media(max-width:1023px)]:text-[3vw]">
            Ideas — Sept.<br />→ guests write the agenda<br />→ breakfast conference
          </p>
        </div>
        <div className="paper-lines relative flex-1 bg-[#f8f4ea] p-[6%] shadow-[inset_12px_0_18px_-12px_rgba(0,0,0,.25)]">
          <p className="font-hand text-[min(1.5vw,19px)] leading-[1.25] text-[#2b3a67] [@media(max-width:1023px)]:text-[3vw]">
            ☑ AV supplier<br />☐ seating v4<br />☐ thank-yous
          </p>
          <span className="absolute bottom-[8%] right-[8%] h-[16%] w-[16%] rounded-full border-2 border-[#e0482c]/70" />
        </div>
      </div>
      {/* ribbon + elastic */}
      <div className="absolute -bottom-[8%] left-[62%] h-[14%] w-[2.2%] bg-[#e0482c]" style={{ clipPath: "polygon(0 0,100% 0,100% 100%,50% 80%,0 100%)" }} />
      <div className="absolute inset-y-0 right-[7%] w-[1.6%] bg-[#111]" />
    </div>
  );
}

export function Pen() {
  return (
    <div className="relative h-[0.9vw] min-h-[7px] w-full">
      <div className="absolute inset-0 translate-y-[60%] rounded-full bg-black/40 blur-[3px]" />
      <div className="absolute inset-y-0 left-0 right-[8%] rounded-l-full bg-gradient-to-b from-[#3a3633] via-[#121110] to-[#000]" />
      <div className="absolute inset-y-[-10%] left-[4%] w-[28%] rounded-l-full bg-gradient-to-b from-[#f2d6a2] via-[#c9a27a] to-[#8a6a45]" />
      <div className="absolute left-[10%] top-[-35%] h-[35%] w-[26%] rounded-t-sm bg-[#b8905f]" />
      <div className="absolute inset-y-[20%] right-0 w-[9%] bg-gradient-to-b from-[#e7e7e7] to-[#8a8a8a]" style={{ clipPath: "polygon(0 0,100% 45%,100% 55%,0 100%)" }} />
    </div>
  );
}

export function Mouse() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "3 / 5" }}>
      <div className="absolute inset-0 translate-x-[6%] translate-y-[5%] rounded-[50%] bg-black/45 blur-md" />
      <div className="absolute inset-0 rounded-[50%/42%] bg-gradient-to-br from-[#fafafa] via-[#e5e5e7] to-[#a7a7ab]" />
      <div className="absolute left-1/2 top-[6%] h-[34%] w-px -translate-x-1/2 bg-black/15" />
      <div className="absolute left-1/2 top-[14%] h-[12%] w-[9%] -translate-x-1/2 rounded-full bg-black/20" />
    </div>
  );
}

export function Sugar() {
  return (
    <div className="relative grid w-full place-items-center bg-[#f5f0e6] shadow-[2px_4px_8px_rgba(0,0,0,.4)]" style={{ aspectRatio: "5 / 3" }}>
      <div className="absolute inset-x-0 top-0 h-[16%] bg-[repeating-linear-gradient(90deg,#f5f0e6_0_6%,#e2dbcd_6%_12%)]" />
      <span className="font-display text-[min(0.9vw,11px)] italic tracking-[0.1em] text-[#e0482c] [@media(max-width:1023px)]:text-[2.2vw]">sucre</span>
    </div>
  );
}

export function TentCard({ flipped }: { flipped: boolean }) {
  return (
    <div className="relative w-full [perspective:400px]" style={{ aspectRatio: "4 / 3" }}>
      <motion.div
        className="absolute inset-0 grid place-items-center rounded-sm bg-[#121110] text-center text-[#ece7df] shadow-[4px_10px_14px_rgba(0,0,0,.45)] [backface-visibility:hidden]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
      >
        <span>
          <span className="block text-[min(0.7vw,9px)] uppercase tracking-[0.3em] opacity-60 [@media(max-width:1023px)]:text-[1.8vw]">Table</span>
          <span className="block font-display text-[min(2.4vw,30px)] italic leading-none [@media(max-width:1023px)]:text-[6vw]">07</span>
        </span>
      </motion.div>
      <motion.div
        className="absolute inset-0 grid place-items-center rounded-sm bg-[#e0482c] p-[8%] text-center text-[#f5f2ec] [backface-visibility:hidden]"
        initial={{ rotateY: -180 }}
        animate={{ rotateY: flipped ? 0 : -180 }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
      >
        <span className="font-hand text-[min(1.3vw,17px)] leading-tight [@media(max-width:1023px)]:text-[3.4vw]">Reserved for your next idea</span>
      </motion.div>
    </div>
  );
}
