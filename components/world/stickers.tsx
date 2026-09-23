// Hand-drawn "sticker" illustrations for the Illana's world collage.
// Each is a self-contained SVG so it scales cleanly at any size.

import { world } from "@/content/site";

export function NameTag() {
  return (
    <svg viewBox="0 0 300 190" className="h-full w-full overflow-visible" aria-hidden>
      <rect x="4" y="4" width="292" height="182" rx="10" fill="#d6372a" />
      <rect x="4" y="4" width="292" height="182" rx="10" fill="url(#nt-shine)" />
      <defs>
        <linearGradient id="nt-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nt-tape" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9e9ec" />
          <stop offset=".5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9d9de" />
        </linearGradient>
      </defs>
      <text x="150" y="44" textAnchor="middle" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="34" letterSpacing="4" fill="#fff">HELLO</text>
      <text x="150" y="64" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="12" letterSpacing="2" fill="#fff">MY NAME IS</text>
      <rect x="14" y="76" width="272" height="96" rx="3" fill="url(#nt-tape)" />
      <path d="M14 90l272-6M14 150l272 8" stroke="#000" strokeOpacity=".05" strokeWidth="8" />
      <text
        x="150"
        y="140"
        textAnchor="middle"
        fontFamily="var(--font-caveat), 'Marker Felt', cursive"
        fontWeight="600"
        fontSize="50"
        fill="#161514"
        transform="rotate(-3 150 130)"
      >
        {world.stickers.nameTag.toUpperCase()}
      </text>
    </svg>
  );
}

export function Lanyard() {
  return (
    <svg viewBox="0 0 140 330" className="h-full w-full overflow-visible" aria-hidden>
      <path d="M56 0v150M84 0v150" stroke="#1b1a18" strokeWidth="14" />
      <path d="M56 0v150M84 0v150" stroke="#e0482c" strokeWidth="4" strokeDasharray="10 8" />
      <rect x="54" y="140" width="32" height="26" rx="5" fill="#b7b7bc" />
      <circle cx="70" cy="176" r="10" fill="none" stroke="#9a9aa0" strokeWidth="5" />
      <g transform="rotate(-6 70 250)">
        <rect x="14" y="186" width="112" height="140" rx="10" fill="#fbf8f2" />
        <rect x="14" y="186" width="112" height="34" rx="10" fill="#121110" />
        <rect x="14" y="206" width="112" height="14" fill="#121110" />
        <text x="70" y="209" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="13" letterSpacing="2" fill="#f5f2ec">ALL ACCESS</text>
        <circle cx="70" cy="250" r="20" fill="#e0482c" />
        <text x="70" y="257" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="18" fill="#fff">IN</text>
        <text x="70" y="288" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="12" fill="#121110">Illana N.</text>
        <text x="70" y="302" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" letterSpacing="2" fill="#8a847b">STAFF · EVENTS</text>
        {Array.from({ length: 22 }).map((_, i) => (
          <rect key={i} x={30 + i * 3.8} y="309" width={i % 3 ? 1.4 : 2.4} height="10" fill="#121110" />
        ))}
      </g>
    </svg>
  );
}

export function Croissant() {
  // Segments from the tips inwards so the middle one sits on top.
  const segs = [
    { cx: 40, cy: 142, rx: 30, ry: 18, r: -48 },
    { cx: 262, cy: 142, rx: 30, ry: 18, r: 48 },
    { cx: 88, cy: 112, rx: 44, ry: 32, r: -28 },
    { cx: 214, cy: 112, rx: 44, ry: 32, r: 28 },
    { cx: 151, cy: 92, rx: 56, ry: 46, r: 0 },
  ];
  return (
    <svg viewBox="0 0 300 200" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="cr-seg" cx=".45" cy=".3" r=".75">
          <stop offset="0" stopColor="#f7c77a" />
          <stop offset=".55" stopColor="#dd8f3c" />
          <stop offset="1" stopColor="#9c5220" />
        </radialGradient>
      </defs>
      <ellipse cx="152" cy="168" rx="128" ry="16" fill="#1a0f09" opacity=".35" />
      <path d="M22 152C60 170 240 170 280 152C250 140 60 140 22 152z" fill="#b8692a" />
      {segs.map((g, i) => (
        <g key={i} transform={`rotate(${g.r} ${g.cx} ${g.cy})`}>
          <ellipse cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry} fill="url(#cr-seg)" stroke="#8a4a1a" strokeWidth="2" />
          {[-0.45, 0, 0.45].map((k) => (
            <path
              key={k}
              d={`M${g.cx + k * g.rx} ${g.cy - g.ry * 0.85}Q${g.cx + k * g.rx * 1.25} ${g.cy} ${g.cx + k * g.rx} ${g.cy + g.ry * 0.85}`}
              stroke="#a55a22"
              strokeOpacity=".55"
              strokeWidth="2"
              fill="none"
            />
          ))}
          <ellipse cx={g.cx - g.rx * 0.25} cy={g.cy - g.ry * 0.45} rx={g.rx * 0.35} ry={g.ry * 0.18} fill="#fff4dc" opacity=".45" />
        </g>
      ))}
      {Array.from({ length: 26 }).map((_, i) => (
        <circle key={i} cx={70 + ((i * 53) % 170)} cy={70 + ((i * 37) % 60)} r="1.2" fill="#fff8e8" opacity=".75" />
      ))}
    </svg>
  );
}

export function LatteTop() {
  return (
    <svg viewBox="0 0 260 230" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="lt-crema" cx=".5" cy=".5" r=".55">
          <stop offset="0" stopColor="#c68a57" />
          <stop offset=".7" stopColor="#9a5f33" />
          <stop offset="1" stopColor="#5e3519" />
        </radialGradient>
        <linearGradient id="lt-cup" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3f8f93" />
          <stop offset="1" stopColor="#1e5a5e" />
        </linearGradient>
      </defs>
      <path d="M200 120c40-4 56 30 34 52" stroke="url(#lt-cup)" strokeWidth="18" fill="none" strokeLinecap="round" />
      <circle cx="120" cy="115" r="108" fill="url(#lt-cup)" />
      <circle cx="120" cy="115" r="92" fill="#f4efe6" />
      <circle cx="120" cy="115" r="84" fill="url(#lt-crema)" />
      {/* rosetta */}
      <g fill="#fbf1e2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${120 - 36 + i * 3} ${150 - i * 17}c18 -12 54 -12 ${72 - i * 6} 0c-18 8 -${54 - i * 6} 8 -${72 - i * 6} 0z`} opacity={0.95 - i * 0.04} />
        ))}
        <path d="M120 60v98" stroke="#fbf1e2" strokeWidth="3" />
        <circle cx="120" cy="58" r="8" />
      </g>
    </svg>
  );
}

export function Ticket() {
  return (
    <svg viewBox="0 0 340 160" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <mask id="tk-notch">
          <rect width="340" height="160" fill="#fff" />
          {[0, 340].map((x) => [30, 80, 130].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="10" fill="#000" />))}
        </mask>
      </defs>
      <g mask="url(#tk-notch)">
        <rect width="340" height="160" rx="6" fill="#eaa598" />
        <rect x="14" y="14" width="312" height="132" rx="4" fill="none" stroke="#b5374e" strokeWidth="2" />
        <rect x="20" y="20" width="300" height="120" rx="3" fill="none" stroke="#b5374e" strokeWidth="1" strokeDasharray="4 3" />
        <path d="M262 14v132" stroke="#b5374e" strokeWidth="1.5" strokeDasharray="5 4" />
      </g>
      <text x="140" y="68" textAnchor="middle" fontFamily="'Cooper Black', Georgia, serif" fontWeight="700" fontSize="26" fill="#b5374e" transform="rotate(-8 140 80)">It&apos;s a</text>
      <text x="140" y="104" textAnchor="middle" fontFamily="'Cooper Black', Georgia, serif" fontWeight="700" fontSize="30" fill="#b5374e" transform="rotate(-8 140 80)">Beautiful Event</text>
      <text x="296" y="80" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill="#b5374e" transform="rotate(90 296 80)">Nº 0907</text>
      <text x="40" y="136" fontFamily="Arial, sans-serif" fontSize="9" letterSpacing="2" fill="#b5374e">ADMIT ONE</text>
    </svg>
  );
}

export function MetroTicket() {
  return (
    <svg viewBox="0 0 200 130" className="h-full w-full overflow-visible" aria-hidden>
      <rect width="200" height="130" rx="6" fill="#f3ead2" />
      <rect x="0" y="92" width="200" height="16" fill="#5c3b1e" />
      <text x="16" y="34" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="20" fill="#1b4f8a">MÉTRO</text>
      <text x="16" y="52" fontFamily="Arial, sans-serif" fontSize="10" letterSpacing="3" fill="#1b4f8a">PARIS · 1 VOYAGE</text>
      <text x="16" y="80" fontFamily="'Courier New', monospace" fontSize="10" fill="#6b5a45">14.03.2024  08:52</text>
      <circle cx="170" cy="36" r="18" fill="none" stroke="#1b4f8a" strokeWidth="3" />
      <text x="170" y="42" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="18" fill="#1b4f8a">M</text>
      <text x="16" y="124" fontFamily="Arial, sans-serif" fontSize="8" fill="#6b5a45">EVENT DAY — DON&apos;T BE LATE</text>
    </svg>
  );
}

export function Beret() {
  return (
    <svg viewBox="0 0 280 180" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="br-dome" cx=".4" cy=".3" r=".8">
          <stop offset="0" stopColor="#a43347" />
          <stop offset=".6" stopColor="#7c1f31" />
          <stop offset="1" stopColor="#551322" />
        </radialGradient>
      </defs>
      <ellipse cx="146" cy="160" rx="118" ry="12" fill="#000" opacity=".25" />
      <path d="M14 108C10 50 90 18 150 20C224 22 272 60 266 104C262 138 200 150 140 150C74 150 18 140 14 108z" fill="url(#br-dome)" />
      <path d="M40 130C80 150 210 152 244 128C240 146 196 158 140 158C86 158 46 148 40 130z" fill="#4a101d" />
      <path d="M142 20c-2-10 4-16 10-14" stroke="#551322" strokeWidth="6" strokeLinecap="round" fill="none" />
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={40 + ((i * 47) % 210)} cy={40 + ((i * 29) % 90)} r="1" fill="#fff" opacity=".08" />
      ))}
      <path d="M50 70C90 40 170 32 220 56" stroke="#fff" strokeOpacity=".12" strokeWidth="10" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function HalftoneFlower() {
  return (
    <svg viewBox="0 0 230 230" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <pattern id="hf-dots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="2.4" fill="#d6456c" />
        </pattern>
        <pattern id="hf-dots2" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.2" fill="#d6456c" />
        </pattern>
      </defs>
      <path d="M40 30L120 8 206 40 224 122 190 206 104 224 20 186 6 104z" fill="#f4ebdc" />
      {[0, 90, 180, 270].map((a) => (
        <g key={a} transform={`rotate(${a + 20} 115 116)`}>
          <path d="M115 116C80 90 76 40 115 26C154 40 150 90 115 116z" fill="#f6c9d4" />
          <path d="M115 116C80 90 76 40 115 26C154 40 150 90 115 116z" fill="url(#hf-dots2)" />
          <path d="M115 110C98 90 96 60 115 44C134 60 132 90 115 110z" fill="url(#hf-dots)" />
        </g>
      ))}
      <circle cx="115" cy="116" r="9" fill="#b0284f" />
    </svg>
  );
}

export function CoffeeBean() {
  return (
    <svg viewBox="0 0 140 180" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="cb-g" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#8f5a36" />
          <stop offset=".6" stopColor="#5e3620" />
          <stop offset="1" stopColor="#3a2013" />
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="90" rx="58" ry="80" fill="url(#cb-g)" />
      <path d="M72 14C44 48 98 90 64 124C56 134 58 152 70 168" stroke="#2a150b" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M72 14C44 48 98 90 64 124" stroke="#a5704a" strokeWidth="2" fill="none" opacity=".6" transform="translate(6 0)" />
      <ellipse cx="46" cy="52" rx="10" ry="22" fill="#fff" opacity=".12" />
    </svg>
  );
}

export function Receipt() {
  const items = world.stickers.receipt;
  return (
    <svg viewBox="0 0 170 290" className="h-full w-full overflow-visible" aria-hidden>
      <path
        d={`M0 0h170v270${Array.from({ length: 17 })
          .map((_, i) => `l-5 ${i % 2 ? 8 : -8}`)
          .join("")}l-${170 - 17 * 5} 0z`}
        fill="#fbfaf6"
      />
      <path d="M0 40h170" stroke="#000" strokeOpacity=".04" strokeWidth="30" />
      <g fontFamily="'Courier New', ui-monospace, monospace" fill="#2a2724">
        <text x="85" y="26" textAnchor="middle" fontWeight="700" fontSize="13">CAFÉ TABLE 07</text>
        <text x="85" y="42" textAnchor="middle" fontSize="9">Collins St · Melbourne VIC</text>
        <text x="85" y="56" textAnchor="middle" fontSize="9">24/09/2026 · 08:55</text>
        <text x="12" y="74" fontSize="9">--------------------------</text>
        {items.map(([a, b], i) => (
          <g key={a}>
            <text x="12" y={92 + i * 17} fontSize="10">1× {a}</text>
            <text x="158" y={92 + i * 17} textAnchor="end" fontSize="10">{b}</text>
          </g>
        ))}
        <text x="12" y={98 + items.length * 17} fontSize="9">--------------------------</text>
        <text x="12" y={116 + items.length * 17} fontWeight="700" fontSize="11">TOTAL</text>
        <text x="158" y={116 + items.length * 17} textAnchor="end" fontWeight="700" fontSize="11">PRICELESS</text>
        <text x="85" y={140 + items.length * 17} textAnchor="middle" fontSize="8">MERCI · SEE YOU SOON</text>
      </g>
      {Array.from({ length: 34 }).map((_, i) => (
        <rect key={i} x={22 + i * 3.8} y="250" width={i % 4 ? 1.3 : 2.6} height="14" fill="#2a2724" />
      ))}
    </svg>
  );
}

export function Stamp() {
  const perf = Array.from({ length: 14 });
  return (
    <svg viewBox="0 0 180 220" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <mask id="st-perf">
          <rect width="180" height="220" fill="#fff" />
          {perf.map((_, i) => (
            <g key={i}>
              <circle cx={i * 13.8} cy="0" r="5" fill="#000" />
              <circle cx={i * 13.8} cy="220" r="5" fill="#000" />
              <circle cx="0" cy={i * 17} r="5" fill="#000" />
              <circle cx="180" cy={i * 17} r="5" fill="#000" />
            </g>
          ))}
        </mask>
        <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c28b" />
          <stop offset="1" stopColor="#e0482c" />
        </linearGradient>
      </defs>
      <g mask="url(#st-perf)">
        <rect width="180" height="220" fill="#fbf6ec" />
        <rect x="14" y="14" width="152" height="150" fill="url(#st-sky)" />
        <circle cx="120" cy="70" r="22" fill="#fff4d8" opacity=".9" />
        {/* Eiffel tower */}
        <path d="M46 164L60 90h8l14 74h-8l-6-20h-8l-6 20z M60 90l4-40 4 40 M56 120h16" fill="#3b2517" stroke="#3b2517" strokeWidth="2" strokeLinejoin="round" />
        {/* Melbourne skyline */}
        <path d="M96 164v-46h10v-14h8v14h8v-30h10v30h8v46z" fill="#5a2a1c" />
        <text x="90" y="186" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="12" letterSpacing="1" fill="#3b2517">PARIS → MELBOURNE</text>
        <text x="90" y="204" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fill="#8a847b">2025 · $1.50</text>
      </g>
      <g stroke="#2b3a67" strokeOpacity=".5" fill="none" strokeWidth="2">
        <circle cx="30" cy="40" r="26" />
        <path d="M60 30q20-10 40 0t40 0t40 0M60 44q20-10 40 0t40 0t40 0M60 58q20-10 40 0t40 0t40 0" />
      </g>
    </svg>
  );
}

export function Polaroid({ image }: { image?: string }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <div className="relative w-full bg-[#fbfaf7] p-[7%] pb-[24%] shadow-[0_18px_40px_-10px_rgba(0,0,0,.6)]" style={{ aspectRatio: "5 / 6" }}>
      <div className="relative h-full w-full overflow-hidden bg-[#1b1a18]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${base}${image}`} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 200 180" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <defs>
              <linearGradient id="pl-beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffe6b8" stopOpacity=".8" />
                <stop offset="1" stopColor="#ffe6b8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="200" height="180" fill="#1d1712" />
            <polygon points="40,0 56,0 110,120 60,120" fill="url(#pl-beam)" />
            <polygon points="150,0 164,0 150,120 100,120" fill="url(#pl-beam)" />
            <rect x="40" y="96" width="120" height="26" fill="#e0482c" />
            <text x="100" y="114" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="13" fill="#fff">Welcome</text>
            {Array.from({ length: 14 }).map((_, i) => (
              <circle key={i} cx={8 + i * 14.5} cy={162 + (i % 2) * 4} r="9" fill="#0d0a08" />
            ))}
          </svg>
        )}
      </div>
      <p className="absolute inset-x-0 bottom-[6%] text-center font-hand text-[clamp(12px,1.3vw,20px)] text-[#2b3a67]">Paris, 2024 ✦</p>
    </div>
  );
}

export function EspressoO() {
  return (
    <svg viewBox="0 0 100 100" className="inline-block h-[0.74em] w-[0.74em] align-baseline" aria-hidden>
      <circle cx="50" cy="50" r="48" fill="#f5f2ec" />
      <circle cx="50" cy="50" r="38" fill="#6b3d1f" />
      <circle cx="50" cy="50" r="38" fill="url(#eo-g)" />
      <defs>
        <radialGradient id="eo-g" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#d6995c" />
          <stop offset="1" stopColor="#6b3d1f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M50 70c-12-7-17-12-14-17 2-3 8-3 11 1l3 3 3-3c3-4 9-4 11-1 3 5-2 10-14 17z" fill="#f7ead6" />
    </svg>
  );
}
