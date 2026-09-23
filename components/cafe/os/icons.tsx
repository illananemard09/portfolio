// App icons drawn in SVG so they stay crisp at any zoom level.
// They are "inspired by" familiar apps without copying any trademarked artwork.

export type AppId = "safari" | "linkedin" | "portfolio" | "mail" | "notes" | "calendar" | "files";

export const appNames: Record<AppId, string> = {
  safari: "Safari",
  linkedin: "LinkedIn",
  portfolio: "Portfolio",
  mail: "Mail",
  notes: "Notes",
  calendar: "Calendar",
  files: "Files",
};

export function AppIcon({ id, className = "" }: { id: AppId | "trash" | "cta" | "txt" | "folder"; className?: string }) {
  const common = { viewBox: "0 0 64 64", className, "aria-hidden": true } as const;
  switch (id) {
    case "safari":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="ic-saf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5ac8fa" /><stop offset="1" stopColor="#1a6fe0" /></linearGradient>
          </defs>
          <rect x="2" y="2" width="60" height="60" rx="14" fill="#fff" />
          <circle cx="32" cy="32" r="25" fill="url(#ic-saf)" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={i} x1="32" y1="9" x2="32" y2={i % 6 ? 12 : 14} stroke="#fff" strokeWidth="1" opacity=".8" transform={`rotate(${i * 15} 32 32)`} />
          ))}
          <path d="M32 32L46 18L36 36z" fill="#ff3b30" />
          <path d="M32 32L18 46L28 28z" fill="#fff" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="2" y="2" width="60" height="60" rx="14" fill="#0a66c2" />
          <text x="32" y="44" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="32" fill="#fff">in</text>
        </svg>
      );
    case "portfolio":
      return (
        <svg {...common}>
          <rect x="2" y="2" width="60" height="60" rx="14" fill="#121110" />
          <circle cx="44" cy="20" r="6" fill="#e0482c" />
          <text x="30" y="44" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="26" fill="#ece7df">IN</text>
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="ic-mail" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fc3ff" /><stop offset="1" stopColor="#1f7bf2" /></linearGradient>
          </defs>
          <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#ic-mail)" />
          <rect x="12" y="19" width="40" height="27" rx="3" fill="#fff" />
          <path d="M12 21l20 14 20-14" fill="none" stroke="#1f7bf2" strokeWidth="2" />
        </svg>
      );
    case "notes":
      return (
        <svg {...common}>
          <rect x="2" y="2" width="60" height="60" rx="14" fill="#fff" />
          <path d="M2 16a14 14 0 0 1 14-14h32a14 14 0 0 1 14 14v4H2z" fill="#fcc933" />
          {[30, 38, 46].map((y) => <line key={y} x1="12" y1={y} x2="52" y2={y} stroke="#ccc" strokeWidth="1.5" />)}
        </svg>
      );
    case "calendar": {
      const d = new Date();
      return (
        <svg {...common}>
          <rect x="2" y="2" width="60" height="60" rx="14" fill="#fff" />
          <text x="32" y="20" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" fill="#ff3b30">
            {d.toLocaleString("en", { weekday: "short" }).toUpperCase()}
          </text>
          <text x="32" y="49" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="28" fill="#1c1c1e">{d.getDate()}</text>
        </svg>
      );
    }
    case "files":
    case "folder":
      return (
        <svg {...common}>
          {id === "files" && <rect x="2" y="2" width="60" height="60" rx="14" fill="#e9eef5" />}
          <path d="M9 18a4 4 0 0 1 4-4h12l5 5h21a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4z" fill="#5aa9f0" />
          <path d="M9 25h46v22a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4z" fill="#79bdf7" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M16 18h32l-3 38H19z" fill="rgba(255,255,255,.55)" stroke="rgba(0,0,0,.25)" />
          {[24, 32, 40].map((x) => <line key={x} x1={x} y1="24" x2={x} y2="50" stroke="rgba(0,0,0,.2)" />)}
          <rect x="13" y="13" width="38" height="5" rx="2" fill="rgba(255,255,255,.75)" />
        </svg>
      );
    case "cta":
      return (
        <svg {...common}>
          <rect x="4" y="8" width="56" height="48" rx="8" fill="#e0482c" />
          <path d="M20 32h24M36 24l8 8-8 8" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "txt":
      return (
        <svg {...common}>
          <path d="M14 6h26l10 10v42H14z" fill="#fff" stroke="#ccc" />
          <path d="M40 6v10h10" fill="#eee" stroke="#ccc" />
          {[26, 32, 38, 44].map((y) => <line key={y} x1="20" y1={y} x2="44" y2={y} stroke="#bbb" strokeWidth="1.5" />)}
        </svg>
      );
  }
}
