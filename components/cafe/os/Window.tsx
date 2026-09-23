"use client";

import { motion, useDragControls, useMotionValue } from "framer-motion";
import { useEffect, type RefObject } from "react";

type Props = {
  title: string;
  active: boolean;
  z: number;
  compact: boolean;
  maximized: boolean;
  minimized?: boolean;
  initial: { x: number; y: number; w: number; h: number };
  bounds: RefObject<HTMLDivElement | null>;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  dark?: boolean;
};

/** A draggable OS window with working traffic-light controls. */
export function Window({ title, active, z, compact, maximized, minimized = false, initial, bounds, onFocus, onClose, onMinimize, onMaximize, toolbar, children, dark }: Props) {
  const controls = useDragControls();
  const full = compact || maximized;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    if (full) { x.set(0); y.set(0); }
  }, [full, x, y]);

  return (
    <motion.section
      role="dialog"
      aria-label={title}
      drag={!full}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={bounds}
      dragElastic={0.05}
      onPointerDownCapture={onFocus}
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      animate={minimized ? { opacity: 0, scale: 0.2, y: 600, transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] } } : { opacity: 1, scale: 1, y: 0 }}
      aria-hidden={minimized || undefined}
      inert={minimized || undefined}
      exit={{ opacity: 0, scale: 0.6, y: 200, transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] } }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`absolute flex flex-col overflow-hidden border shadow-[0_30px_70px_-15px_rgba(0,0,0,.55)] ${
        dark ? "border-white/10 bg-[#1e1e1e] text-white" : "border-black/10 bg-white text-[#1d1d1f]"
      } ${full ? "rounded-none sm:rounded-[10px]" : "rounded-[10px]"}`}
      style={
        full
          ? { x, y, zIndex: z, left: 0, top: compact ? 0 : 28, right: 0, bottom: compact ? 64 : 76, width: "auto", height: "auto" }
          : { x, y, zIndex: z, left: initial.x, top: initial.y, width: initial.w, height: initial.h }
      }
    >
      <header
        onPointerDown={(e) => !full && controls.start(e)}
        onDoubleClick={onMaximize}
        className={`relative flex h-11 shrink-0 select-none items-center gap-3 border-b px-3 ${
          dark ? "border-white/10 bg-[#2a2a2a]" : "border-black/10 bg-[#f3f2f1]"
        } ${full ? "" : "cursor-grab active:cursor-grabbing"}`}
      >
        <div className="group/tl flex items-center gap-2">
          {[
            { c: "#ff5f57", l: "Close", f: onClose, g: "×" },
            { c: "#febc2e", l: "Minimise", f: onMinimize, g: "–" },
            { c: "#28c840", l: maximized ? "Restore" : "Maximise", f: onMaximize, g: "+" },
          ].map((b) => (
            <button
              key={b.l}
              type="button"
              aria-label={`${b.l} ${title}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={b.f}
              className="relative grid h-[13px] w-[13px] place-items-center rounded-full text-[10px] font-bold leading-none text-black/60 before:absolute before:-inset-2 before:content-['']"
              style={{ background: active ? b.c : dark ? "#555" : "#d1d0ce" }}
            >
              <span className="opacity-0 transition-opacity group-hover/tl:opacity-100">{b.g}</span>
            </button>
          ))}
        </div>
        {toolbar ?? <p className={`absolute inset-x-24 truncate text-center text-[13px] font-semibold ${dark ? "text-white/70" : "text-black/70"}`}>{title}</p>}
      </header>
      <div className="relative min-h-0 flex-1">{children}</div>
    </motion.section>
  );
}
