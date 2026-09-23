"use client";

import { useState } from "react";
import { education, journey, person, projects, roles, toolkit } from "@/content/site";
import { Plate } from "../../ui/Plate";

type Go = { go: (p: string) => void };

/* ---------------- Favourites ---------------- */
export function StartPage({ go }: Go) {
  const favs = [
    { p: "linkedin", label: "LinkedIn", bg: "#0a66c2", t: "in" },
    { p: "portfolio", label: "Portfolio", bg: "#121110", t: "IN" },
    { p: "events", label: "Events", bg: "#e0482c", t: "✦" },
    { p: "contact", label: "Contact", bg: "#c9a27a", t: "@" },
  ];
  return (
    <div className="min-h-full bg-[#f5f5f7] px-6 py-10 sm:px-12">
      <p className="text-[20px] font-bold text-black/80">Favourites</p>
      <div className="mt-5 grid grid-cols-4 gap-5 sm:max-w-md">
        {favs.map((f) => (
          <button key={f.p} type="button" onClick={() => go(f.p)} className="group flex flex-col items-center gap-2">
            <span className="grid aspect-square w-full max-w-16 place-items-center rounded-xl text-[20px] font-bold text-white shadow-sm transition-transform group-hover:scale-105" style={{ background: f.bg }}>
              {f.t}
            </span>
            <span className="text-[11px] text-black/70">{f.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-10 text-[20px] font-bold text-black/80">Reading list</p>
      <ul className="mt-3 divide-y divide-black/10 rounded-xl bg-white sm:max-w-md">
        {projects.map((p) => (
          <li key={p.slug}>
            <button type="button" onClick={() => go(`portfolio/${p.slug}`)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-black/[0.03]">
              <span className="h-10 w-10 shrink-0 overflow-hidden rounded-md"><Plate palette={p.palette} motif={p.motif} image={p.image} /></span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium">{p.title}</span>
                <span className="block text-[11px] text-black/50">{p.client}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- LinkedIn-inspired profile ---------------- */
export function LinkedInPage({ go }: Go) {
  const card = "rounded-lg border border-black/10 bg-white";
  return (
    <div className="min-h-full bg-[#f4f2ee] font-[-apple-system,'Segoe_UI',Roboto,sans-serif] text-[#191919]">
      <div className="flex h-12 items-center gap-3 border-b border-black/10 bg-white px-4">
        <span className="grid h-8 w-8 place-items-center rounded bg-[#0a66c2] text-[15px] font-bold text-white">in</span>
        <span className="hidden h-8 flex-1 max-w-xs items-center rounded bg-[#edf3f8] px-3 text-[12px] text-black/50 sm:flex">⌕ Search</span>
        <span className="ml-auto text-[11px] text-black/50">LinkedIn-inspired preview</span>
      </div>
      <div className="mx-auto grid max-w-4xl gap-3 p-3 sm:p-5 md:grid-cols-[1fr_260px]">
        <div className="grid gap-3">
          <section className={`${card} overflow-hidden`}>
            <div className="h-28 bg-[linear-gradient(120deg,#121110,#e0482c_60%,#c9a27a)] sm:h-36" />
            <div className="px-5 pb-5">
              <div className="-mt-12 grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-[#121110] font-display text-[34px] italic text-[#ece7df] sm:h-28 sm:w-28">IN</div>
              <h1 className="mt-3 text-[22px] font-semibold leading-tight">{person.name}</h1>
              <p className="mt-1 text-[14px] leading-snug">Event Manager · Marketing & Communications Specialist · FR / EN · Creating experiences people remember</p>
              <p className="mt-2 text-[12px] text-black/55">{person.location} · <button type="button" onClick={() => go("contact")} className="font-semibold text-[#0a66c2] hover:underline">Contact info</button></p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#0a66c2] px-4 py-1.5 text-[14px] font-semibold text-white hover:bg-[#004182]">
                  View on LinkedIn ↗
                </a>
                <button type="button" onClick={() => go("contact")} className="rounded-full border border-[#0a66c2] px-4 py-1.5 text-[14px] font-semibold text-[#0a66c2] hover:bg-[#0a66c2]/10">
                  Message
                </button>
                <button type="button" onClick={() => go("portfolio")} className="rounded-full border border-black/40 px-4 py-1.5 text-[14px] font-semibold text-black/70 hover:bg-black/5">
                  Portfolio
                </button>
              </div>
              <div className="mt-4 rounded-md bg-[#edf3f8] p-3 text-[12px]">
                <strong>Open to work</strong>
                <p className="text-black/70">Event Manager, Marketing & Communications roles · Melbourne & remote</p>
              </div>
            </div>
          </section>

          <section className={`${card} p-5`}>
            <h2 className="text-[18px] font-semibold">About</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-black/80">
              French Event Manager and Communications Specialist with 5+ years across event management, corporate communications, social media, content creation and brand activation. At LexisNexis France I led the end-to-end delivery of 10+ corporate events, conferences and product launches. Now in Melbourne, bringing French savoir-faire and Australian hospitality experience to every guest experience.
            </p>
          </section>

          <section className={`${card} p-5`}>
            <h2 className="text-[18px] font-semibold">Experience</h2>
            <ul className="mt-3 divide-y divide-black/10">
              {roles.map((r) => (
                <li key={r.company} className="flex gap-3 py-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded bg-[#e9e5df] text-[14px] font-bold text-black/60">{r.company[0]}</span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold">{r.position}</p>
                    <p className="text-[13px]">{r.company}</p>
                    <p className="text-[12px] text-black/55">{r.period} · {r.place}</p>
                    <p className="mt-1 text-[13px] text-black/75">{r.responsibilities[0]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${card} p-5`}>
            <h2 className="text-[18px] font-semibold">Education</h2>
            <ul className="mt-3 space-y-3">
              {education.map((e) => (
                <li key={e.title}>
                  <p className="text-[14px] font-semibold">{e.school}</p>
                  <p className="text-[13px]">{e.title}</p>
                  <p className="text-[12px] text-black/55">{e.period}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="grid content-start gap-3">
          <section className={`${card} p-4`}>
            <h2 className="text-[15px] font-semibold">Languages</h2>
            {person.languages.map((l) => (
              <p key={l.name} className="mt-2 text-[13px]"><strong>{l.name}</strong><br /><span className="text-black/55">{l.level}</span></p>
            ))}
          </section>
          <section className={`${card} p-4`}>
            <h2 className="text-[15px] font-semibold">Top skills</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {toolkit.flatMap((t) => t.skills.slice(0, 1)).map((s) => (
                <span key={s} className="rounded-full border border-black/15 px-2 py-0.5 text-[12px]">{s}</span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Portfolio ---------------- */
export function PortfolioPage({ slug, go }: Go & { slug?: string }) {
  const p = projects.find((x) => x.slug === slug);
  if (p) {
    return (
      <article className="min-h-full bg-[#ece7df] text-[#121110]">
        <div className="relative h-56 sm:h-72">
          <Plate palette={p.palette} motif={p.motif} image={p.image} />
          <button type="button" onClick={() => go("portfolio")} className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[12px]">← All work</button>
        </div>
        <div className="px-5 py-8 sm:px-10">
          <p className="eyebrow text-[#e0482c]">{p.client} · {p.year}</p>
          <h1 className="mt-2 font-display text-[clamp(30px,5vw,54px)] font-light leading-[0.95] tracking-[-0.04em]">{p.title}</h1>
          <div className="mt-6 grid grid-cols-3 gap-3 border-y border-black/10 py-4">
            {p.stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-[32px] font-light leading-none">{s.value}{s.suffix}</p>
                <p className="mt-1 text-[11px] leading-tight text-black/60">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-6">
            {p.steps.map((s, i) => (
              <section key={s.label} className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-6">
                <h2 className="font-display text-[20px] italic">0{i + 1} — {s.label}</h2>
                <p className="text-[14px] leading-relaxed text-black/80">{s.text}</p>
              </section>
            ))}
          </div>
          <button type="button" onClick={() => go("contact")} className="mt-10 rounded-full bg-[#121110] px-5 py-3 text-[12px] uppercase tracking-[0.14em] text-[#f5f2ec]">
            Start a project like this →
          </button>
        </div>
      </article>
    );
  }
  return (
    <div className="min-h-full bg-[#ece7df] px-5 py-8 text-[#121110] sm:px-10">
      <p className="eyebrow text-black/50">Selected work</p>
      <h1 className="mt-2 font-display text-[clamp(36px,6vw,64px)] font-light uppercase leading-[0.9] tracking-[-0.05em]">
        Ideas into <em className="normal-case text-[#e0482c]">experiences</em>
      </h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {projects.map((p) => (
          <button key={p.slug} type="button" onClick={() => go(`portfolio/${p.slug}`)} className="group text-left">
            <span className="block aspect-[4/5] overflow-hidden rounded-sm">
              <span className="block h-full w-full transition-transform duration-700 group-hover:scale-105">
                <Plate palette={p.palette} motif={p.motif} image={p.image} label={p.place} />
              </span>
            </span>
            <span className="mt-2 block text-[11px] uppercase tracking-[0.14em] text-black/50">{p.client}</span>
            <span className="block font-display text-[19px] leading-tight group-hover:italic">{p.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Events ---------------- */
export function EventsPage({ slug, go }: Go & { slug?: string }) {
  const stage = journey.find((j) => j.key === slug);
  const eventProjects = projects.filter((p) => p.slug !== "atelier-du-relieur");
  return (
    <div className="min-h-full bg-[#121110] px-5 py-8 text-[#f5f2ec] sm:px-10">
      <p className="eyebrow text-[#e0482c]">Events / Experiences</p>
      <h1 className="mt-2 font-display text-[clamp(34px,6vw,60px)] font-light leading-[0.92] tracking-[-0.04em]">
        From concept <em>to the last guest out.</em>
      </h1>
      <ol className="mt-8 flex flex-wrap gap-2">
        {journey.map((j, i) => (
          <li key={j.key}>
            <button
              type="button"
              onClick={() => go(`events/${j.key}`)}
              className={`rounded-full border px-3 py-1.5 text-[12px] ${slug === j.key ? "border-[#e0482c] bg-[#e0482c]" : "border-white/20 hover:border-white/60"}`}
            >
              {String(i + 1).padStart(2, "0")} {j.label}
            </button>
          </li>
        ))}
      </ol>
      {stage ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-sm border border-[#e0482c]/60 p-4">
            <p className="eyebrow text-[#e0482c]">Creative</p>
            <p className="mt-2 text-[14px]">{stage.creative}</p>
          </div>
          <div className="rounded-sm border border-white/20 p-4">
            <p className="eyebrow text-white/60">Operational</p>
            <p className="mt-2 text-[14px]">{stage.operational}</p>
          </div>
          <p className="text-[12px] text-white/60 sm:col-span-2">Includes: {stage.items.join(" · ")}</p>
        </div>
      ) : (
        <p className="mt-6 text-[14px] text-white/70">Pick a stage above to see both sides of the work.</p>
      )}
      <h2 className="mt-10 eyebrow text-white/50">Event case studies</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {eventProjects.map((p) => (
          <button key={p.slug} type="button" onClick={() => go(`portfolio/${p.slug}`)} className="group flex gap-3 rounded-sm border border-white/10 p-3 text-left hover:border-white/40">
            <span className="h-20 w-16 shrink-0 overflow-hidden rounded-sm"><Plate palette={p.palette} motif={p.motif} image={p.image} /></span>
            <span>
              <span className="block text-[11px] uppercase tracking-[0.14em] text-white/50">{p.client} · {p.place}</span>
              <span className="mt-1 block font-display text-[18px] leading-tight group-hover:italic">{p.title}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Contact ---------------- */
export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const field = "w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#e0482c] focus:ring-2 focus:ring-[#e0482c]/20";

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim();
    const topic = String(f.get("topic") || "");
    const msg = String(f.get("message") || "").trim();
    if (!name || !email || !msg) return setErr("Please fill in your name, email and message.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("That email address doesn't look quite right.");
    setErr(null);
    const body = `${msg}\n\n— ${name} (${email})`;
    window.location.href = `mailto:${person.email}?subject=${encodeURIComponent(`${topic} — ${name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div className="min-h-full bg-[#ece7df] px-5 py-8 text-[#121110] sm:px-10">
      <p className="eyebrow text-black/50">Contact</p>
      <h1 className="mt-2 font-display text-[clamp(34px,6vw,64px)] font-light uppercase leading-[0.9] tracking-[-0.05em]">
        Have an idea? <br />
        <em className="normal-case text-[#e0482c]">Let&apos;s make it happen.</em>
      </h1>
      <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4 text-[14px]">
          <a href={`mailto:${person.email}`} className="block rounded-md bg-white p-4 hover:bg-white/70">
            <span className="block text-[11px] uppercase tracking-[0.14em] text-black/50">Email</span>
            {person.email}
          </a>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="block rounded-md bg-white p-4 hover:bg-white/70">
            <span className="block text-[11px] uppercase tracking-[0.14em] text-black/50">LinkedIn</span>
            {person.linkedinHandle} ↗
          </a>
          <p className="rounded-md border border-black/10 p-4 text-[13px] text-black/60">{person.location}<br />{person.visa}</p>
        </div>
        {sent ? (
          <div className="grid place-items-center rounded-md bg-white p-8 text-center">
            <p className="font-display text-[28px] italic">Merci !</p>
            <p className="mt-2 text-[14px] text-black/60">Your mail app should be opening with your message. If it didn&apos;t, write to {person.email}.</p>
            <button type="button" onClick={() => setSent(false)} className="mt-4 text-[12px] underline">Write another</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-[12px] text-black/60">Name<input name="name" autoComplete="name" className={`${field} mt-1`} /></label>
              <label className="block text-[12px] text-black/60">Email<input name="email" type="email" autoComplete="email" className={`${field} mt-1`} /></label>
            </div>
            <label className="block text-[12px] text-black/60">
              What's it about?
              <select name="topic" className={`${field} mt-1`} defaultValue="An event">
                <option>An event</option>
                <option>A campaign</option>
                <option>A role in my team</option>
                <option>Just a coffee</option>
              </select>
            </label>
            <label className="block text-[12px] text-black/60">Message<textarea name="message" rows={4} className={`${field} mt-1 resize-none`} /></label>
            {err && <p role="alert" className="text-[12px] text-[#c1351d]">{err}</p>}
            <button type="submit" className="w-full rounded-full bg-[#121110] py-3 text-[12px] uppercase tracking-[0.16em] text-[#f5f2ec] hover:bg-[#e0482c]">
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------------- Search ---------------- */
export function SearchPage({ q, go }: Go & { q: string }) {
  const results = [
    { p: "portfolio", t: "Selected work — Illana Nemard", d: "Case studies across events, marketing and communication." },
    { p: "events", t: "Events / Experiences", d: "Concept → Strategy → Planning → Production → Experience → Results." },
    { p: "linkedin", t: "Illana Nemard | LinkedIn", d: "Event Manager · Marketing & Communications · Melbourne." },
    { p: "contact", t: "Contact — Let's talk", d: "Have an idea? Let's make it happen." },
  ];
  return (
    <div className="min-h-full bg-white px-6 py-8">
      <p className="text-[13px] text-black/50">Results for “{q}”</p>
      <p className="mt-1 text-[12px] text-black/40">The internet is big. This laptop only knows one person well:</p>
      <ul className="mt-6 space-y-5">
        {results.map((r) => (
          <li key={r.p}>
            <button type="button" onClick={() => go(r.p)} className="text-left">
              <span className="block text-[18px] text-[#1a0dab] hover:underline">{r.t}</span>
              <span className="block text-[13px] text-black/60">{r.d}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
