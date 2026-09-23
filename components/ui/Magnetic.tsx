"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

export function Magnetic({ children, strength = 0.35, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

type BtnProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "ghost" | "accent";
  tone?: "light" | "dark";
  className?: string;
  cursor?: string;
};

/** Pill button with a liquid fill on hover, wrapped in a magnetic field. */
export function MagneticButton({ children, href, onClick, variant = "solid", tone = "light", className = "", cursor }: BtnProps) {
  const base =
    "group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-[13px] font-medium uppercase tracking-[0.16em] transition-colors duration-500";
  const styles = {
    solid: tone === "light" ? "bg-ink text-bone" : "bg-bone text-ink",
    ghost: tone === "light" ? "border border-ink/25 text-ink" : "border border-bone/30 text-bone",
    accent: "bg-accent text-bone",
  }[variant];
  const fill = variant === "accent" ? "bg-ink" : variant === "ghost" ? (tone === "light" ? "bg-ink" : "bg-bone") : "bg-accent";
  const hoverText = variant === "ghost" ? (tone === "light" ? "group-hover:text-bone" : "group-hover:text-ink") : "";
  const inner = (
    <>
      <span className={`absolute inset-0 translate-y-[101%] rounded-full ${fill} transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0`} />
      <span className={`relative z-10 flex items-center gap-3 transition-colors duration-500 ${hoverText}`}>{children}</span>
    </>
  );
  return (
    <Magnetic>
      {href ? (
        <a href={href} onClick={onClick} className={`${base} ${styles} ${className}`} data-cursor={cursor}>
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`} data-cursor={cursor}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
