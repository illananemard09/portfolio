"use client";

import { useEffect, useMemo, useState } from "react";
import { notebookPages, person, projects, secretIdea } from "@/content/site";
import { useOS } from "./context";
import { DocIcon, docs } from "./docs";
import { AppIcon } from "./icons";

const scroll = "min-h-0 overflow-y-auto overscroll-contain";

/* ---------------- Mail ---------------- */
const inbox = [
  {
    from: person.name,
    subject: "Welcome to my desk ☕",
    time: "08:02",
    body: `Hi there,\n\nIf you're reading this, you found the laptop. Thank you for exploring.\n\nEverything here is real HTML — the windows move, the tabs work, and the Compose button will open your own mail app with a message addressed to me.\n\nI'm ${person.availability.toLowerCase()}. Tell me about your event, your campaign or your team.\n\nÀ bientôt,\n${person.firstName}`,
  },
  {
    from: "Run of show",
    subject: "Reminder: doors at 09:00, coffee at 08:55",
    time: "Yesterday",
    body: "Crew in 07:30. Deliveries 07:45. Sound check 08:15.\nCoffee station open five minutes before doors — nobody should queue for coffee.",
  },
  {
    from: "Future you",
    subject: "Re: that idea you had",
    time: "Mon",
    body: "It's a good one. Write it down, then send it to Illana.",
  },
];

export function Mail({ draft }: { draft: { subject?: string; body?: string; n: number } | null }) {
  const [sel, setSel] = useState(0);
  const [compose, setCompose] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!draft) return;
    setCompose(true);
    setSubject(draft.subject ?? "");
    setBody(draft.body ?? "");
  }, [draft]);

  const send = () => {
    window.location.href = `mailto:${person.email}?subject=${encodeURIComponent(subject || "Hello Illana")}&body=${encodeURIComponent(body)}`;
    setCompose(false);
  };

  const m = inbox[sel];
  return (
    <div className="absolute inset-0 grid grid-cols-[minmax(0,1fr)] sm:grid-cols-[230px_1fr]">
      <aside className={`${scroll} hidden border-r border-black/10 bg-[#f6f5f4] sm:block`}>
        <div className="flex items-center justify-between p-3">
          <span className="text-[12px] font-semibold text-black/50">Inbox</span>
          <button type="button" onClick={() => setCompose(true)} className="rounded-md bg-[#1a73e8] px-2 py-1 text-[11px] font-semibold text-white">Compose</button>
        </div>
        {inbox.map((x, i) => (
          <button key={x.subject} type="button" onClick={() => { setSel(i); setCompose(false); }} className={`block w-full border-b border-black/5 px-3 py-2.5 text-left ${sel === i && !compose ? "bg-[#1a73e8] text-white" : "hover:bg-black/5"}`}>
            <span className="flex justify-between text-[12px] font-semibold"><span className="truncate">{x.from}</span><span className="opacity-60">{x.time}</span></span>
            <span className="block truncate text-[12px]">{x.subject}</span>
          </button>
        ))}
      </aside>
      <div className={`${scroll} flex flex-col p-5`}>
        {compose ? (
          <form className="flex h-full flex-col gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <p className="text-[12px] text-black/50">To: <span className="rounded bg-[#1a73e8]/10 px-1.5 py-0.5 text-[#1a73e8]">{person.email}</span></p>
            <input aria-label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="border-b border-black/10 py-2 text-[14px] outline-none" />
            <textarea aria-label="Message" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Tell me about your idea…" className="min-h-[140px] flex-1 resize-none py-2 text-[14px] outline-none" />
            <div className="flex gap-2">
              <button type="submit" className="rounded-md bg-[#1a73e8] px-4 py-2 text-[12px] font-semibold text-white">Send ↗</button>
              <button type="button" onClick={() => setCompose(false)} className="rounded-md px-3 py-2 text-[12px] text-black/60 hover:bg-black/5">Discard</button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-3 flex gap-2 sm:hidden">
              {inbox.map((x, i) => (
                <button key={i} type="button" onClick={() => setSel(i)} className={`rounded-full px-2 py-1 text-[11px] ${sel === i ? "bg-[#1a73e8] text-white" : "bg-black/5"}`}>{x.from.split(" ")[0]}</button>
              ))}
              <button type="button" onClick={() => setCompose(true)} className="ml-auto rounded-full bg-[#1a73e8] px-2 py-1 text-[11px] text-white">Compose</button>
            </div>
            <p className="text-[18px] font-semibold">{m.subject}</p>
            <p className="mt-1 text-[12px] text-black/50">From {m.from} · {m.time}</p>
            <p className="mt-5 whitespace-pre-line text-[14px] leading-relaxed">{m.body}</p>
            <button type="button" onClick={() => { setSubject(`Re: ${m.subject}`); setBody(""); setCompose(true); }} className="mt-6 self-start rounded-md border border-black/15 px-3 py-1.5 text-[12px] hover:bg-black/5">
              ↩ Reply
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Notes ---------------- */
export function Notes() {
  const [notes, setNotes] = useState(() => [
    ...notebookPages.map((p) => ({ title: p.title, text: p.lines.join("\n"), mine: false })),
    { title: "Your note", text: "", mine: true },
  ]);
  const [sel, setSel] = useState(0);
  const n = notes[sel];
  return (
    <div className="absolute inset-0 grid grid-cols-[120px_1fr] bg-[#fbfaf7] sm:grid-cols-[200px_1fr]">
      <aside className={`${scroll} border-r border-black/10 bg-[#f3f1ec]`}>
        {notes.map((x, i) => (
          <button key={i} type="button" onClick={() => setSel(i)} className={`block w-full border-b border-black/5 px-3 py-2.5 text-left ${sel === i ? "bg-[#fcc933]/60" : "hover:bg-black/5"}`}>
            <span className="block truncate text-[12.5px] font-semibold">{x.title}</span>
            <span className="block truncate text-[11px] text-black/50">{x.text.split("\n")[0] || "Write something…"}</span>
          </button>
        ))}
      </aside>
      <div className="flex min-h-0 flex-col p-5">
        <p className="text-[11px] text-black/40">{n.mine ? "Only you can see this — it disappears when you leave." : "Notes · Illana"}</p>
        <p className="mt-1 text-[20px] font-bold">{n.title}</p>
        <textarea
          aria-label={n.title}
          readOnly={!n.mine}
          value={n.text}
          onChange={(e) => setNotes((ns) => ns.map((x, i) => (i === sel ? { ...x, text: e.target.value } : x)))}
          placeholder="An idea for Illana? Jot it here, then hit “Send to Illana”."
          className="mt-3 min-h-0 flex-1 resize-none bg-transparent text-[14px] leading-relaxed outline-none"
        />
        {n.mine && <SendNote text={n.text} />}
      </div>
    </div>
  );
}

function SendNote({ text }: { text: string }) {
  const os = useOS();
  return (
    <button type="button" disabled={!text.trim()} onClick={() => os.openMail({ subject: "An idea from your desk", body: text })} className="self-start rounded-md bg-[#fcc933] px-3 py-1.5 text-[12px] font-semibold disabled:opacity-40">
      Send to Illana →
    </button>
  );
}

/* ---------------- Calendar ---------------- */
export function Calendar() {
  const os = useOS();
  const today = useMemo(() => new Date(), []);
  const [offset, setOffset] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const view = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const startDay = (view.getDay() + 6) % 7;
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

  // Relative events so the calendar always looks alive.
  const events = useMemo(() => {
    const d = (n: number) => { const x = new Date(today); x.setDate(x.getDate() + n); return x; };
    const nextFriday = d(((5 - today.getDay() + 7) % 7) || 7);
    return [
      { date: d(0), title: "Portfolio visit — that's you 👋", color: "#e0482c", action: undefined },
      { date: nextFriday, title: "Coffee with you? ☕", color: "#c9a27a", action: "coffee" },
      { date: d(12), title: "Next idea — kick-off", color: "#1a73e8", action: "idea" },
      { date: d(21), title: "Event day (yours?)", color: "#28a745", action: "event" },
    ];
  }, [today]);

  const key = (x: Date) => `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
  const byDay = new Map<string, typeof events>();
  events.forEach((e) => byDay.set(key(e.date), [...(byDay.get(key(e.date)) ?? []), e]));
  const ev = events.find((e) => e.title === picked);

  return (
    <div className="absolute inset-0 flex flex-col bg-white">
      <div className="flex items-center gap-2 border-b border-black/10 px-4 py-2">
        <p className="text-[18px] font-bold">{view.toLocaleString("en-AU", { month: "long" })} <span className="font-normal text-black/50">{view.getFullYear()}</span></p>
        <div className="ml-auto flex gap-1">
          <button type="button" onClick={() => setOffset((o) => o - 1)} className="rounded px-2 py-1 hover:bg-black/5" aria-label="Previous month">‹</button>
          <button type="button" onClick={() => setOffset(0)} className="rounded border border-black/15 px-2 py-1 text-[12px]">Today</button>
          <button type="button" onClick={() => setOffset((o) => o + 1)} className="rounded px-2 py-1 hover:bg-black/5" aria-label="Next month">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-black/10 text-center text-[11px] text-black/50">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d} className="py-1">{d}</span>)}
      </div>
      <div className={`${scroll} grid flex-1 grid-cols-7 auto-rows-fr`}>
        {Array.from({ length: startDay }).map((_, i) => <span key={`e${i}`} className="border-b border-r border-black/5 bg-black/[0.015]" />)}
        {Array.from({ length: days }).map((_, i) => {
          const date = new Date(view.getFullYear(), view.getMonth(), i + 1);
          const isToday = key(date) === key(today);
          return (
            <div key={i} className="min-h-[54px] border-b border-r border-black/5 p-1 text-[11px]">
              <span className={`inline-grid h-5 w-5 place-items-center rounded-full ${isToday ? "bg-[#e0482c] text-white" : ""}`}>{i + 1}</span>
              {byDay.get(key(date))?.map((e) => (
                <button key={e.title} type="button" onClick={() => setPicked(e.title)} className="mt-0.5 block w-full truncate rounded px-1 text-left text-[10px] text-white" style={{ background: e.color }}>
                  {e.title}
                </button>
              ))}
            </div>
          );
        })}
      </div>
      {ev && (
        <div className="flex flex-wrap items-center gap-3 border-t border-black/10 bg-[#f6f5f4] px-4 py-3">
          <span className="h-3 w-3 rounded-full" style={{ background: ev.color }} />
          <p className="text-[13px]"><strong>{ev.title}</strong> · {ev.date.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}</p>
          {ev.action && (
            <button
              type="button"
              onClick={() => os.openMail({ subject: ev.action === "coffee" ? "Coffee? ☕" : ev.action === "event" ? "About our event" : "I have an idea", body: "" })}
              className="ml-auto rounded-md bg-[#121110] px-3 py-1.5 text-[12px] text-white"
            >
              Accept invite →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Files ---------------- */
type FileItem = { name: string; kind: "folder" | "txt" | "case" | "pdf" | "vcf"; run: () => void };

export function Files() {
  const os = useOS();
  const [place, setPlace] = useState<"Recents" | "CV & experience" | "Case studies" | "Moodboards">("Case studies");
  const [sel, setSel] = useState<string | null>(null);

  const cases: FileItem[] = projects.map((p) => ({ name: `${p.client}.case`, kind: "case", run: () => os.openSafari(`portfolio/${p.slug}`) }));
  const lists: Record<string, FileItem[]> = {
    Recents: [
      { name: "Case studies", kind: "folder", run: () => setPlace("Case studies") },
      { name: "Moodboards", kind: "folder", run: () => setPlace("Moodboards") },
      { name: "CV & experience", kind: "folder", run: () => setPlace("CV & experience") },
      { name: "secret.txt", kind: "txt", run: () => os.quickLook({ name: "secret.txt", body: `Shh. An idea I haven't used yet:\n\n“${secretIdea}”\n\nIf you want to make it real, you know where to find me.` }) },
    ],
    "Case studies": cases,
    "CV & experience": docs.map((d) => ({ name: d.name, kind: d.kind, run: () => os.openDoc(d.id) })),
    Moodboards: [
      { name: "warm-confident.txt", kind: "txt", run: () => os.quickLook({ name: "warm-confident.txt", body: "Palette: ink, bone, vermilion, caramel.\nType: one serif with character, one quiet sans.\nFeeling: a well-lit room five minutes before the doors open." }) },
      { name: "never-shouty.txt", kind: "txt", run: () => os.quickLook({ name: "never-shouty.txt", body: "Confidence is quiet. Invitations should whisper, not shout.\nWhitespace is a guest too." }) },
    ],
  };

  return (
    <div className="absolute inset-0 grid grid-cols-[110px_1fr] sm:grid-cols-[170px_1fr]">
      <aside className="border-r border-black/10 bg-[#f3f2f1]/90 p-2 text-[12.5px]">
        <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase text-black/40">Favourites</p>
        {(["Recents", "CV & experience", "Case studies", "Moodboards"] as const).map((p) => (
          <button key={p} type="button" onClick={() => setPlace(p)} className={`block w-full rounded-md px-2 py-1.5 text-left ${place === p ? "bg-black/10" : "hover:bg-black/5"}`}>{p}</button>
        ))}
      </aside>
      <div className={`${scroll} p-4`}>
        <p className="mb-4 text-[13px] font-semibold">{place}</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] gap-3">
          {lists[place].map((f) => (
            <button
              key={f.name}
              type="button"
              onClick={() => (sel === f.name ? f.run() : setSel(f.name))}
              onDoubleClick={f.run}
              className="group flex flex-col items-center gap-1 rounded-md p-2 text-center"
            >
              <span className={`grid h-14 w-14 place-items-center rounded-md ${sel === f.name ? "bg-black/10" : ""}`}>
                {f.kind === "folder" ? <AppIcon id="folder" className="h-12 w-12" />
                  : f.kind === "txt" && !f.name.startsWith("Lang") && !f.name.startsWith("About") ? <AppIcon id="txt" className="h-12 w-12" />
                  : f.kind === "case" ? <span className="grid h-12 w-10 place-items-center rounded-sm bg-[#e0482c] text-[10px] font-bold text-white">CASE</span>
                  : <DocIcon kind={f.kind === "txt" ? "txt" : f.kind === "vcf" ? "vcf" : "pdf"} className="h-12 w-12" />}
              </span>
              <span className={`max-w-full break-words rounded px-1 text-[11px] leading-tight ${sel === f.name ? "bg-[#1a73e8] text-white" : ""}`}>{f.name}</span>
            </button>
          ))}
        </div>
        <p className="mt-6 text-[11px] text-black/40">Tip: click once to select, again to open.</p>
      </div>
    </div>
  );
}

/* ---------------- Quick Look ---------------- */
export function QuickLook({ file }: { file: { name: string; body: string } }) {
  return (
    <div className={`${scroll} absolute inset-0 bg-[#fffdf7] p-6`}>
      <p className="text-[11px] uppercase tracking-[0.14em] text-black/40">{file.name}</p>
      <p className="mt-4 whitespace-pre-line font-hand text-[22px] leading-snug text-[#233]">{file.body}</p>
    </div>
  );
}
