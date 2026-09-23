// Original wallpaper in the spirit of a default macOS desktop: soft layered waves of colour.
export function Wallpaper({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id="wp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d2b78" />
          <stop offset=".45" stopColor="#5b4db8" />
          <stop offset=".8" stopColor="#e38c86" />
          <stop offset="1" stopColor="#f6c490" />
        </linearGradient>
        <linearGradient id="wp-w1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3a58c" />
          <stop offset="1" stopColor="#c85f86" />
        </linearGradient>
        <linearGradient id="wp-w2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a6be0" />
          <stop offset="1" stopColor="#4b3ba8" />
        </linearGradient>
        <linearGradient id="wp-w3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3651c9" />
          <stop offset="1" stopColor="#23308a" />
        </linearGradient>
        <linearGradient id="wp-w4" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2466" />
          <stop offset="1" stopColor="#0e1238" />
        </linearGradient>
        <radialGradient id="wp-glow" cx=".72" cy=".38" r=".5">
          <stop offset="0" stopColor="#ffd9b0" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffd9b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#wp-sky)" />
      <rect width="1600" height="1000" fill="url(#wp-glow)" />
      <path d="M0 520C260 430 470 470 700 540S1180 640 1600 470V1000H0Z" fill="url(#wp-w1)" />
      <path d="M0 620C300 540 560 600 820 660S1260 700 1600 590V1000H0Z" fill="url(#wp-w2)" />
      <path d="M0 730C280 670 600 720 880 780S1340 800 1600 720V1000H0Z" fill="url(#wp-w3)" />
      <path d="M0 850C330 800 640 840 940 880S1380 900 1600 850V1000H0Z" fill="url(#wp-w4)" />
      <path d="M0 520C260 430 470 470 700 540S1180 640 1600 470" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="3" />
      <path d="M0 620C300 540 560 600 820 660S1260 700 1600 590" fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="3" />
    </svg>
  );
}
