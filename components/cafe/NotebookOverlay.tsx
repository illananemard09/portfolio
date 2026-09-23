"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { notebookPages, secretIdea } from "@/content/site";

export function NotebookOverlay({ onClose, onSecret }: { onClose: () => void; onSecret: () => void }) {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [secret, setSecret] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const last = notebookPages.length - 1;

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") turn(1);
      if (e.key === "ArrowLeft") turn(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const turn = (d: number) => {
    setDir(d);
    setPage((p) => Math.min(last, Math.max(0, p + d)));
  };

  const p = notebookPages[page];

  return (
    <motion.div
      className="fixed inset-0 z-[260] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Illana's notebook"
    >
      <motion.div
        className="relative w-full max-w-[560px] [perspective:1400px]"
        initial={{ y: 80, rotate: -6, scale: 0.9 }}
        animate={{ y: 0, rotate: -1.5, scale: 1 }}
        exit={{ y: 80, rotate: -6, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -inset-3 rounded-lg bg-[#1f1b18] shadow-[0_40px_80px_-20px_rgba(0,0,0,.7)]" />
        <div className="relative min-h-[440px] overflow-hidden rounded-sm bg-[#f6f1e6]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={page}
              custom={dir}
              className="paper-lines absolute inset-0 origin-left px-8 pb-10 pt-8 [backface-visibility:hidden] sm:px-12"
              initial={{ rotateY: dir > 0 ? 70 : -70, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: dir > 0 ? -70 : 70, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
            >
              <span className="absolute inset-y-0 left-6 w-px bg-[#e0482c]/40" />
              <p className="font-hand text-[34px] leading-[1] text-[#e0482c]">{p.title}</p>
              <ul className="mt-5 space-y-[3px] font-hand text-[24px] leading-[28px] text-[#2b3a67]">
                {p.lines.map((l, i) => (
                  <motion.li key={l} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.12 }}>
                    {l}
                  </motion.li>
                ))}
              </ul>
              {page === last && (
                <button
                  type="button"
                  onClick={() => { setSecret(true); onSecret(); }}
                  aria-label="Lift the folded corner"
                  className="absolute bottom-0 right-0 h-14 w-14"
                  style={{ background: "linear-gradient(135deg, transparent 50%, #e3dccd 50%, #cfc6b3 100%)", boxShadow: "-3px -3px 6px rgba(0,0,0,.08)" }}
                />
              )}
              <AnimatePresence>
                {secret && page === last && (
                  <motion.div
                    className="absolute inset-x-6 bottom-6 rounded-sm bg-[#fdf6c9] p-4 shadow-lg"
                    initial={{ opacity: 0, rotate: 8, y: 30 }}
                    animate={{ opacity: 1, rotate: -2, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="font-hand text-[16px] text-[#e0482c]">secret idea — don&apos;t tell anyone</p>
                    <p className="font-hand text-[22px] leading-tight text-[#2b3a67]">{secretIdea}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative mt-6 flex items-center justify-between text-[#ece7df]">
          <button type="button" onClick={() => turn(-1)} disabled={page === 0} className="min-h-11 px-3 text-[12px] uppercase tracking-[0.16em] disabled:opacity-30">← Prev</button>
          <span className="font-hand text-[20px]">{page + 1} / {notebookPages.length}</span>
          <button type="button" onClick={() => turn(1)} disabled={page === last} className="min-h-11 px-3 text-[12px] uppercase tracking-[0.16em] disabled:opacity-30">Next →</button>
        </div>
        <button ref={closeRef} type="button" onClick={onClose} className="absolute -right-2 -top-12 min-h-11 px-3 text-[12px] uppercase tracking-[0.16em] text-[#ece7df]">
          Close ✕
        </button>
      </motion.div>
    </motion.div>
  );
}
