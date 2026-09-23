"use client";

import { useId } from "react";

// Original wallpaper in the spirit of a macOS landscape: soft pastel mountains and hills in morning mist.
export function Wallpaper({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const u = (n: string) => `url(#${id}-${n})`;
  const lg = (n: string, stops: [number, string][], x2 = 0, y2 = 1) => (
    <linearGradient id={`${id}-${n}`} x1="0" y1="0" x2={x2} y2={y2}>
      {stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
    </linearGradient>
  );
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        {lg("sky", [[0, "#9fb7e4"], [0.35, "#c9cdea"], [0.62, "#f1d3d6"], [0.8, "#f8dcc6"], [1, "#fbe7d2"]])}
        {lg("far", [[0, "#b6b3dc"], [1, "#d8cde2"]])}
        {lg("mid", [[0, "#8e98cf"], [1, "#b9b3d6"]])}
        {lg("hill1", [[0, "#9fbfa7"], [1, "#7fa592"]])}
        {lg("hill2", [[0, "#6f9a86"], [1, "#517d6f"]])}
        {lg("hill3", [[0, "#436e63"], [1, "#2e5250"]])}
        <radialGradient id={`${id}-sun`} cx=".66" cy=".44" r=".3">
          <stop offset="0" stopColor="#fff6e6" stopOpacity="1" />
          <stop offset=".18" stopColor="#fff1dc" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff1dc" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-mist`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id={`${id}-haze`}>
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      <rect width="1600" height="1000" fill={u("sky")} />
      <rect width="1600" height="1000" fill={u("sun")} />
      <circle cx="1056" cy="440" r="46" fill="#fffaf0" opacity=".9" />

      {/* distant mountains, softened by the air */}
      <g filter={u("haze")}>
        <path d="M0 560C60 520 110 470 150 468S220 510 260 512 340 430 385 424 470 490 520 494 600 440 645 438 720 510 765 512 860 430 905 428 1000 500 1045 502 1140 452 1185 450 1280 515 1325 516 1420 462 1465 460 1560 505 1600 512V1000H0Z" fill={u("far")} opacity=".85" />
        <path d="M0 610C80 570 140 532 185 530S290 590 335 590 430 512 475 510 590 598 640 598 750 542 800 540 910 608 960 608 1070 548 1120 546 1230 598 1280 598 1390 542 1440 540 1560 576 1600 582V1000H0Z" fill={u("mid")} opacity=".9" />
      </g>
      <ellipse cx="800" cy="610" rx="900" ry="46" fill="#fff" opacity=".55" filter={u("mist")} />

      {/* rolling hills */}
      <path d="M0 690C200 630 380 640 560 680S920 720 1120 670 1450 620 1600 650V1000H0Z" fill={u("hill1")} />
      <ellipse cx="700" cy="700" rx="900" ry="40" fill="#fff" opacity=".35" filter={u("mist")} />
      <path d="M0 780C240 720 470 740 700 780S1120 820 1340 770 1520 740 1600 750V1000H0Z" fill={u("hill2")} />
      <path d="M0 880C300 830 600 850 880 880S1380 900 1600 860V1000H0Z" fill={u("hill3")} />

      {/* light catching the ridges */}
      <path d="M0 690C200 630 380 640 560 680S920 720 1120 670 1450 620 1600 650" fill="none" stroke="#fff4e0" strokeOpacity=".45" strokeWidth="2" />
      <path d="M0 780C240 720 470 740 700 780S1120 820 1340 770 1520 740 1600 750" fill="none" stroke="#fff4e0" strokeOpacity=".25" strokeWidth="2" />
    </svg>
  );
}
