"use client";

import { useId } from "react";

// Original wallpaper in the spirit of a default macOS desktop: glossy silk ribbons over deep blue.
export function Wallpaper({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const u = (n: string) => `url(#${id}-${n})`;
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a1a52" />
          <stop offset=".55" stopColor="#172a86" />
          <stop offset="1" stopColor="#35196f" />
        </linearGradient>
        <linearGradient id={`${id}-r1`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2d6cff" />
          <stop offset=".5" stopColor="#7a5cff" />
          <stop offset="1" stopColor="#e24bb5" />
        </linearGradient>
        <linearGradient id={`${id}-r2`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#16a3ff" />
          <stop offset=".55" stopColor="#3a58ff" />
          <stop offset="1" stopColor="#8a3dff" />
        </linearGradient>
        <linearGradient id={`${id}-r3`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffa36e" />
          <stop offset=".5" stopColor="#ff5fa2" />
          <stop offset="1" stopColor="#a14dff" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".28" />
        </linearGradient>
        <linearGradient id={`${id}-hl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".6" />
          <stop offset=".4" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="60" />
        </filter>
        <filter id={`${id}-soft`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <rect width="1600" height="1000" fill={u("bg")} />
      <ellipse cx="1260" cy="240" rx="440" ry="300" fill="#6a3cff" opacity=".5" filter={u("glow")} />
      <ellipse cx="260" cy="820" rx="520" ry="280" fill="#0aa0ff" opacity=".35" filter={u("glow")} />

      <g filter={u("soft")}>
        {/* back ribbon */}
        <path d="M-100 700C200 520 520 820 860 640S1380 360 1700 480L1700 640C1380 520 1150 820 860 800S250 700 -100 880Z" fill={u("r2")} />
        <path d="M-100 700C200 520 520 820 860 640S1380 360 1700 480L1700 640C1380 520 1150 820 860 800S250 700 -100 880Z" fill={u("shade")} />
        {/* middle ribbon */}
        <path d="M-100 520C260 300 600 600 900 440S1400 180 1700 300L1700 420C1400 320 1180 600 900 600S300 420 -100 660Z" fill={u("r1")} />
        <path d="M-100 520C260 300 600 600 900 440S1400 180 1700 300L1700 420C1400 320 1180 600 900 600S300 420 -100 660Z" fill={u("shade")} />
        {/* front ribbon */}
        <path d="M-100 380C300 200 640 420 960 300S1420 120 1700 200L1700 262C1420 202 1200 420 960 420S320 300 -100 452Z" fill={u("r3")} opacity=".92" />
      </g>

      {/* glossy highlights along the top edges */}
      <path d="M-100 520C260 300 600 600 900 440S1400 180 1700 300L1700 340C1400 230 1180 500 900 500S300 360 -100 580Z" fill={u("hl")} />
      <path d="M-100 700C200 520 520 820 860 640S1380 360 1700 480L1700 520C1380 420 1150 720 860 700S250 610 -100 760Z" fill={u("hl")} opacity=".7" />
      <path d="M-100 380C300 200 640 420 960 300S1420 120 1700 200" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="2" />
    </svg>
  );
}
