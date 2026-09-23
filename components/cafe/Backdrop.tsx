// Daylight café backdrop drawn as one SVG on a 1600×900 stage.
// Interactive objects sit on top of it as positioned buttons (see CafeScene).

const bags = ["espresso", "filtre", "maison", "décaf"];
const brands = ["LexisNexis", "Pulsalys", "Pimms", "L'atelier", "Spiero", "Strass"];

function Croissant({ x, y, s = 1, r = 0 }: { x: number; y: number; s?: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M-22 4C-18-10 18-10 22 4c-6-3-10-2-12 2-4-5-16-5-20 0-2-4-6-5-12-2z" fill="#d38b3f" />
      <path d="M-10 -5c2 5 2 8 0 10M0 -7c2 5 2 9 0 12M10 -5c2 5 2 8 0 10" stroke="#a9632a" strokeWidth="1.4" fill="none" />
      <path d="M-18 0C-12-8 12-8 18 0" stroke="#f1bf7c" strokeWidth="2" fill="none" opacity=".7" />
    </g>
  );
}

export function Backdrop({ golden }: { golden: boolean }) {
  return (
    <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="bd-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f4ef" />
          <stop offset="1" stopColor="#ebe4d9" />
        </linearGradient>
        <linearGradient id="bd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9f0ee" />
          <stop offset="1" stopColor="#cfdcd4" />
        </linearGradient>
        <linearGradient id="bd-table" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b4630" />
          <stop offset=".35" stopColor="#80563a" />
          <stop offset="1" stopColor="#5a3925" />
        </linearGradient>
        <linearGradient id="bd-counter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6e4a33" />
          <stop offset="1" stopColor="#4d3222" />
        </linearGradient>
        <linearGradient id="bd-chrome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9a9a9e" />
          <stop offset=".3" stopColor="#f2f2f3" />
          <stop offset=".6" stopColor="#c4c4c8" />
          <stop offset="1" stopColor="#8b8b90" />
        </linearGradient>
        <linearGradient id="bd-beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf6" stopOpacity=".75" />
          <stop offset="1" stopColor="#fffdf6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bd-glass" cx=".3" cy=".3" r=".9">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".08" />
        </radialGradient>
        <filter id="bd-dof" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.6" /></filter>
        <filter id="bd-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
        <filter id="bd-leaf" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>

      {/* ---------- Background, slightly out of focus ---------- */}
      <g filter="url(#bd-dof)">
        <rect width="1600" height="580" fill="url(#bd-wall)" />

        {/* Window with greenery */}
        <rect x="0" y="0" width="280" height="560" fill="url(#bd-sky)" />
        <g filter="url(#bd-leaf)">
          <rect x="150" y="60" width="130" height="330" fill="#c9c3b8" />
          {[[40, 120, 70], [120, 60, 60], [60, 260, 90], [200, 200, 60], [20, 380, 80], [150, 330, 70], [230, 420, 60]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={["#7f9f6c", "#98b585", "#6c8d5b", "#a8c196"][i % 4]} opacity=".9" />
          ))}
        </g>
        <g fill="#3a2e26">
          <rect x="268" y="0" width="14" height="560" />
          <rect x="130" y="0" width="10" height="560" />
          <rect x="0" y="235" width="280" height="10" />
          <rect x="0" y="0" width="282" height="10" />
        </g>
        <rect x="0" y="470" width="300" height="18" fill="#e7e0d4" />
        {/* plant on the sill */}
        <g transform="translate(150 470)">
          <path d="M-19 0h38l7-46h-52z" fill="#e8e1d6" />
          <path d="M-24 -46h48v4h-48z" fill="#d8cfc2" />
          {[-60, -35, -10, 15, 40, 65].map((a, i) => (
            <path
              key={a}
              d="M0 -46c-6 -40 -2 -80 4 -110c12 26 10 70 -4 110z"
              fill={i % 2 ? "#5f8a4a" : "#6f9a57"}
              transform={`rotate(${a * 0.6} 0 -46)`}
            />
          ))}
        </g>

        {/* Sun beams */}
        <polygon points="280,0 520,0 980,580 640,580" fill="url(#bd-beam)" opacity={golden ? 0.9 : 0.55} />
        <polygon points="300,120 380,120 760,580 640,580" fill="url(#bd-beam)" opacity={golden ? 0.7 : 0.35} />

        {/* Shelf and coffee bags */}
        {bags.map((b, i) => {
          const x = 560 + i * 112;
          return (
            <g key={b}>
              <path d={`M${x} 300v-96l8-14h64l8 14v96z`} fill="#c9a57c" />
              <path d={`M${x + 8} 190l6-12h52l6 12z`} fill="#b48d63" />
              <rect x={x + 14} y={228} width={52} height={40} rx="3" fill="#1d1a17" />
              <text x={x + 40} y={252} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="#f5f2ec">{b}</text>
            </g>
          );
        })}
        <rect x="530" y="300" width="470" height="12" rx="2" fill="#6b4a33" />
        <rect x="530" y="312" width="470" height="6" fill="#000" opacity=".08" />

        {/* Brand wall */}
        <rect x="1100" y="110" width="270" height="200" rx="6" fill="#6b4a33" />
        <rect x="1110" y="120" width="250" height="180" rx="3" fill="#2b2724" />
        {brands.map((b, i) => (
          <g key={b} transform={`translate(${1124 + (i % 3) * 58} ${136 + Math.floor(i / 3) * 70}) rotate(${(i % 2 ? 2 : -2)})`}>
            <rect width="50" height="54" fill="#f7f4ef" />
            <circle cx="25" cy="-1" r="3" fill="#e0482c" />
            <text x="25" y="31" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fontSize={b.length > 7 ? 7.5 : 9} fill="#121110">{b}</text>
          </g>
        ))}
        <g transform="translate(1300 140) rotate(4)">
          <rect width="48" height="48" fill="#f4d77a" />
          <text x="6" y="18" fontFamily="'Caveat', cursive" fontSize="11" fill="#2b3a67">
            <tspan>ideas →</tspan>
            <tspan x="6" dy="12">experiences</tspan>
          </text>
        </g>

        {/* Back counter */}
        <rect x="250" y="470" width="1350" height="110" fill="url(#bd-counter)" />
        <rect x="250" y="470" width="1350" height="8" fill="#8a6246" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect x={300 + i * 220} y="500" width="200" height="70" fill="none" stroke="#3e281b" strokeOpacity=".5" />
            <circle cx={400 + i * 220} cy="516" r="3" fill="#caa47d" />
          </g>
        ))}

        {/* Espresso machine + grinder */}
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={300 + i * 26} y={310} width="20" height="22" rx="3" fill="#fbfaf7" stroke="#d9d3c8" />
          ))}
          <rect x="290" y="334" width="160" height="136" rx="10" fill="url(#bd-chrome)" />
          <rect x="298" y="344" width="144" height="16" rx="3" fill="#c0392b" opacity=".85" />
          <text x="370" y="356" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="9" fontWeight="700" fill="#fff" letterSpacing="2">BARISTA</text>
          {[330, 410].map((x) => (
            <g key={x}>
              <circle cx={x} cy="382" r="11" fill="#fff" stroke="#999" />
              <circle cx={x} cy="382" r="4" fill="#333" />
              <rect x={x - 14} y="408" width="28" height="12" rx="3" fill="#2b2b2b" />
              <rect x={x - 3} y="420" width="6" height="18" fill="#555" />
            </g>
          ))}
          <rect x="290" y="452" width="160" height="18" fill="#6d6d72" />
          <rect x="474" y="360" width="46" height="110" rx="6" fill="#1f1f1f" />
          <path d="M478 360l6-44h34l6 44z" fill="#6b4630" opacity=".55" />
        </g>

        {/* Pastry case */}
        <g>
          <rect x="1030" y="350" width="240" height="120" rx="4" fill="url(#bd-glass)" stroke="#2b2724" strokeWidth="3" />
          <rect x="1034" y="408" width="232" height="4" fill="#2b2724" />
          {[1060, 1105, 1150, 1195, 1240].map((x, i) => <Croissant key={x} x={x} y={396} s={0.9} r={i % 2 ? 8 : -6} />)}
          {[1072, 1120, 1168, 1216].map((x, i) => <Croissant key={x} x={x} y={452} s={0.95} r={i % 2 ? -8 : 6} />)}
        </g>

        {/* Jars */}
        {[1300, 1330, 1360].map((x, i) => (
          <g key={x}>
            <rect x={x} y={470 - 40 - i * 6} width="22" height={40 + i * 6} rx="4" fill={["#3e2b1f", "#6b4a33", "#1f1b18"][i]} />
          </g>
        ))}
      </g>

      {/* ---------- Table, in focus ---------- */}
      <rect x="0" y="580" width="1600" height="300" fill="url(#bd-table)" />
      {Array.from({ length: 26 }).map((_, i) => (
        <path
          key={i}
          d={`M0 ${592 + i * 11} C 400 ${588 + i * 11 + (i % 3) * 4}, 900 ${600 + i * 11 - (i % 4) * 3}, 1600 ${594 + i * 11}`}
          stroke={i % 3 ? "#4a2f20" : "#a67a55"}
          strokeOpacity={i % 3 ? 0.18 : 0.14}
          strokeWidth={i % 5 ? 1 : 2}
          fill="none"
        />
      ))}
      <rect x="0" y="580" width="1600" height="6" fill="#a47955" opacity=".7" />
      {/* soft window light on the table */}
      <ellipse cx="620" cy="660" rx="520" ry="80" fill="#fff4e2" opacity={golden ? 0.28 : 0.16} filter="url(#bd-soft)" />
      <rect x="0" y="872" width="1600" height="28" fill="#3b2517" />

      {/* Flowers */}
      <g>
        <ellipse cx="1420" cy="702" rx="60" ry="12" fill="#000" opacity=".25" filter="url(#bd-soft)" />
        {[
          [1400, 520, "#f3c6cf"], [1440, 500, "#ffffff"], [1380, 470, "#b79ad6"], [1460, 460, "#f7e3a8"],
          [1420, 440, "#ffffff"], [1350, 520, "#ffffff"], [1485, 520, "#f3c6cf"], [1410, 480, "#e889a4"],
        ].map(([x, y, c], i) => (
          <g key={i}>
            <path d={`M1420 640Q${(Number(x) + 1420) / 2} ${Number(y) + 60} ${x} ${y}`} stroke="#5f8a4a" strokeWidth="2.5" fill="none" />
            <circle cx={x} cy={y} r={i === 7 ? 17 : 12} fill={String(c)} />
            <circle cx={x} cy={y} r="4" fill={i === 7 ? "#c55a78" : "#e9b949"} />
          </g>
        ))}
        {[[1370, 560], [1470, 570], [1395, 590]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="16" ry="6" fill="#6f9a57" transform={`rotate(${i * 40 - 30} ${x} ${y})`} />
        ))}
        <path d="M1385 600h70v88a10 10 0 0 1-10 10h-50a10 10 0 0 1-10-10z" fill="url(#bd-glass)" stroke="#fff" strokeOpacity=".7" />
        <rect x="1388" y="640" width="64" height="55" rx="6" fill="#cfe1dc" opacity=".45" />
      </g>

      {/* Golden hour warmth */}
      <rect width="1600" height="900" fill="#ffb86b" opacity={golden ? 0.12 : 0} style={{ transition: "opacity 1.2s" }} />
    </svg>
  );
}
