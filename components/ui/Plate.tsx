import type { Project } from "@/content/site";

type Props = {
  palette: Project["palette"];
  motif: Project["motif"];
  image?: string;
  label?: string;
  className?: string;
};

/**
 * Art-directed "photograph" used until real photography is added.
 * Pure SVG + CSS: soft light, a graphic motif, film grain and vignette.
 */
export function Plate({ palette, motif, image, label, className = "" }: Props) {
  const [bg, fg, tint] = palette;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={{ background: bg }}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${basePath}${image}`} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            <radialGradient id={`l-${motif}-${bg.slice(1)}`} cx="30%" cy="20%" r="80%">
              <stop offset="0" stopColor={tint} stopOpacity=".55" />
              <stop offset="1" stopColor={bg} stopOpacity="0" />
            </radialGradient>
            <filter id={`b-${motif}`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="18" /></filter>
          </defs>
          <rect width="400" height="500" fill={`url(#l-${motif}-${bg.slice(1)})`} />
          {motif === "rings" && (
            <g fill="none" stroke={tint} strokeOpacity=".5">
              {Array.from({ length: 14 }).map((_, i) => (
                <circle key={i} cx="250" cy="300" r={18 + i * 22} strokeWidth={i % 3 === 0 ? 1.4 : 0.6} />
              ))}
              <circle cx="250" cy="300" r="60" fill={fg} stroke="none" filter={`url(#b-${motif})`} opacity=".85" />
              <circle cx="250" cy="300" r="34" fill={fg} stroke="none" />
            </g>
          )}
          {motif === "grid" && (
            <g>
              {Array.from({ length: 9 }).map((_, r) =>
                Array.from({ length: 7 }).map((_, c) => (
                  <rect key={`${r}-${c}`} x={40 + c * 48} y={60 + r * 46} width="22" height="22" rx="11"
                    fill={(r * 7 + c) % 11 === 3 ? fg : "none"} stroke={tint} strokeOpacity=".7" />
                )),
              )}
              <rect x="40" y="20" width="310" height="10" fill={tint} opacity=".8" />
              <circle cx="300" cy="120" r="90" fill={fg} opacity=".12" filter={`url(#b-${motif})`} />
            </g>
          )}
          {motif === "arches" && (
            <g fill="none" stroke={fg} strokeOpacity=".6">
              {Array.from({ length: 5 }).map((_, i) => (
                <path key={i} d={`M${60 + i * 60} 500 V${250 - i * 10} a${28} ${28} 0 0 1 ${56} 0 V500`} strokeWidth="1" />
              ))}
              <path d="M140 500 V200 a60 60 0 0 1 120 0 V500 Z" fill={tint} fillOpacity=".65" stroke="none" />
              <circle cx="200" cy="170" r="16" fill={fg} stroke="none" />
            </g>
          )}
          {motif === "waves" && (
            <g fill="none" stroke={fg} strokeOpacity=".55">
              {Array.from({ length: 16 }).map((_, i) => (
                <path key={i} d={`M-20 ${120 + i * 22} C 80 ${80 + i * 22}, 180 ${170 + i * 22}, 420 ${110 + i * 22}`} strokeWidth=".8" />
              ))}
              <circle cx="110" cy="140" r="46" fill={tint} stroke="none" />
            </g>
          )}
          {motif === "dots" && (
            <g fill={fg}>
              {Array.from({ length: 180 }).map((_, i) => {
                const a = i * 2.4;
                const r = Math.sqrt(i) * 13;
                return <circle key={i} cx={200 + Math.cos(a) * r} cy={250 + Math.sin(a) * r} r={1 + (i % 5) * 0.5} opacity={0.3 + (i % 7) / 10} />;
              })}
            </g>
          )}
        </svg>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgba(0,0,0,.35))]" />
      {label && <span className="eyebrow absolute bottom-4 left-4 opacity-70" style={{ color: fg }}>{label}</span>}
    </div>
  );
}
