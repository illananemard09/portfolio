"use client";

import { education, keywords, person, projects, roles, toolkit } from "@/content/site";
import { useOS } from "./context";

// Every file on the laptop desktop maps to a piece of the CV.

export type DocKind = "pdf" | "txt" | "vcf";
export type Doc = {
  id: string;
  name: string;
  kind: DocKind;
  title: string;
  subtitle?: string;
  meta?: [string, string][];
  quote?: string;
  sections: { heading: string; text?: string; items?: string[] }[];
  actions?: { label: string; page?: string; href?: string }[];
};

const roleDocs: Doc[] = roles.map((r) => ({
  id: r.file,
  name: r.file,
  kind: "pdf",
  title: r.position,
  subtitle: r.company,
  meta: [
    ["Period", r.period],
    ["Location", r.place],
    ["Sector", r.sector],
  ],
  quote: r.highlight,
  sections: [{ heading: "What I did", items: r.responsibilities }],
  actions: r.caseStudy ? [{ label: "Open the case study", page: `portfolio/${r.caseStudy}` }] : undefined,
}));

export const docs: Doc[] = [
  {
    id: "cv",
    name: "CV_Illana_Nemard.pdf",
    kind: "pdf",
    title: person.name,
    subtitle: person.role,
    meta: [
      ["Based in", person.location],
      ["Email", person.email],
      ["Status", person.visa],
    ],
    sections: [
      {
        heading: "Profile",
        text: "French Event Manager and Communications Specialist with 5+ years across event management, corporate communications, social media, content creation and brand activation. Led 10+ corporate events, conferences and product launches at LexisNexis France.",
      },
      { heading: "Experience", items: roles.map((r) => `${r.period} — ${r.position}, ${r.company} (${r.place})`) },
      { heading: "Education", items: education.map((e) => `${e.period} — ${e.title}, ${e.school}`) },
      { heading: "Languages", items: person.languages.map((l) => `${l.name} — ${l.level}`) },
      { heading: "Tools", text: toolkit.find((t) => t.key === "creative")!.skills.join(" · ") + " · Meta Business Suite · Hootsuite" },
    ],
    actions: [{ label: "View on LinkedIn", href: person.linkedin }],
  },
  {
    id: "about",
    name: "About_me.txt",
    kind: "txt",
    title: "About me",
    sections: [
      {
        heading: "Hello!",
        text: `I'm ${person.firstName}. Made in France, now in Melbourne. Five years across marketing, communications and events — from a bookbinding workshop in Strasbourg to LexisNexis conferences in Paris. I sit between the plan and the room: I build the strategy, write the story, brief the suppliers and stay until the last guest has gone.`,
      },
      { heading: "What I do", items: keywords.map((k) => `${k.word} — ${k.line}`) },
    ],
  },
  {
    id: "contact",
    name: "Contact.vcf",
    kind: "vcf",
    title: person.name,
    subtitle: person.role,
    meta: [
      ["Email", person.email],
      ["LinkedIn", person.linkedinHandle],
      ["Location", person.location],
      ["Availability", person.availability],
    ],
    sections: [],
    actions: [
      { label: "Write an email", href: `mailto:${person.email}` },
      { label: "LinkedIn", href: person.linkedin },
      { label: "Contact form", page: "contact" },
    ],
  },
  ...roleDocs,
  {
    id: "education",
    name: "Education.pdf",
    kind: "pdf",
    title: "Education & certificates",
    sections: [
      { heading: "Degrees", items: education.map((e) => `${e.title} — ${e.school} · ${e.period}`) },
      { heading: "Certificates", items: ["RSA — Responsible Service of Alcohol (Australia)", "Food Handling Certificate (Australia)"] },
    ],
  },
  {
    id: "skills",
    name: "Skills_Toolkit.pdf",
    kind: "pdf",
    title: "Skills & toolkit",
    sections: toolkit.map((t) => ({ heading: t.label, items: t.skills })),
  },
  {
    id: "languages",
    name: "Languages.txt",
    kind: "txt",
    title: "Languages",
    sections: [{ heading: "Spoken & written", items: person.languages.map((l) => `${l.name} — ${l.level}`) }],
  },
];

export const caseStudyFiles = projects.map((p) => ({ name: `${p.client}.case`, slug: p.slug }));

export function DocIcon({ kind, className = "" }: { kind: DocKind; className?: string }) {
  const tag = { pdf: ["PDF", "#e0482c"], txt: ["TXT", "#8a847b"], vcf: ["VCF", "#1a73e8"] }[kind];
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M14 4h26l12 12v44H14z" fill="#fff" stroke="#d0d0d0" />
      <path d="M40 4v12h12" fill="#eee" stroke="#d0d0d0" />
      {kind === "vcf" ? (
        <g>
          <circle cx="33" cy="30" r="7" fill="#c9c9cc" />
          <path d="M21 48c2-8 22-8 24 0" fill="#c9c9cc" />
        </g>
      ) : (
        [24, 30, 36, 42].map((y) => <line key={y} x1="20" y1={y} x2="46" y2={y} stroke="#cfcfd3" strokeWidth="1.6" />)
      )}
      <rect x="10" y="44" width="30" height="12" rx="2" fill={tag[1]} />
      <text x="25" y="53" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="8" fill="#fff">{tag[0]}</text>
    </svg>
  );
}

/** Preview window: renders a CV document as a printed page. */
export function DocView({ doc }: { doc: Doc }) {
  const os = useOS();
  return (
    <div data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain bg-[#e6e4e0] p-3 sm:p-6">
      <article className="mx-auto max-w-[620px] bg-white px-6 py-8 text-[#1d1d1f] shadow-[0_6px_24px_rgba(0,0,0,.15)] sm:px-10 sm:py-10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">{doc.name}</p>
        <h1 className="mt-3 font-display text-[clamp(26px,3.4vw,38px)] font-light leading-[1.02] tracking-[-0.03em]">{doc.title}</h1>
        {doc.subtitle && <p className="mt-1 font-display text-[18px] italic text-[#e0482c]">{doc.subtitle}</p>}
        {doc.meta && (
          <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 border-y border-black/10 py-4 text-[12.5px] sm:grid-cols-2">
            {doc.meta.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-black/40">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {doc.quote && <p className="mt-5 font-hand text-[22px] leading-tight text-[#2b3a67]">“{doc.quote}”</p>}
        {doc.sections.map((s) => (
          <section key={s.heading} className="mt-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">{s.heading}</h2>
            {s.text && <p className="mt-2 text-[13.5px] leading-relaxed text-black/80">{s.text}</p>}
            {s.items && (
              <ul className="mt-2 space-y-1.5 text-[13.5px] leading-snug text-black/80">
                {s.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="text-[#e0482c]">—</span>
                    {it}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
        {doc.actions && (
          <div className="mt-8 flex flex-wrap gap-2">
            {doc.actions.map((a) =>
              a.href ? (
                <a key={a.label} href={a.href} target={a.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="rounded-full bg-[#121110] px-4 py-2 text-[12px] text-white hover:bg-[#e0482c]">
                  {a.label} ↗
                </a>
              ) : (
                <button key={a.label} type="button" onClick={() => os.openSafari(a.page!)} className="rounded-full border border-black/20 px-4 py-2 text-[12px] hover:bg-black/5">
                  {a.label} →
                </button>
              ),
            )}
          </div>
        )}
      </article>
    </div>
  );
}
