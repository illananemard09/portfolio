"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ContactPage, EventsPage, LinkedInPage, PortfolioPage, SearchPage, StartPage } from "./pages";

/** "start" | "linkedin" | "portfolio" | "portfolio/<slug>" | "events" | "events/<key>" | "contact" | "search:<q>" */
export type SafariPage = string;

type Tab = { id: number; history: SafariPage[]; idx: number };

const roots = ["linkedin", "portfolio", "events", "contact"] as const;
const tabTitle = (p: SafariPage) =>
  p.startsWith("linkedin") ? "Illana Nemard | LinkedIn"
  : p.startsWith("portfolio") ? "Work — Illana Nemard"
  : p.startsWith("events") ? "Events — Illana Nemard"
  : p.startsWith("contact") ? "Contact — Let's talk"
  : p.startsWith("search:") ? `${p.slice(7)} — Search`
  : "Favourites";

const favicon = (p: SafariPage) =>
  p.startsWith("linkedin") ? <span className="grid h-4 w-4 place-items-center rounded-[3px] bg-[#0a66c2] text-[9px] font-bold text-white">in</span>
  : p.startsWith("start") || p.startsWith("search") ? <span className="text-[12px]">☆</span>
  : <span className="grid h-4 w-4 place-items-center rounded-[3px] bg-[#121110] font-display text-[9px] italic text-[#ece7df]">IN</span>;

function useHost() {
  const [host, setHost] = useState("illana-nemard");
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    setHost(`${window.location.host}${base}`);
  }, []);
  return host;
}

export function Safari({ request }: { request: { page: SafariPage; n: number } | null }) {
  const host = useHost();
  const nextId = useRef(5);
  const [tabs, setTabs] = useState<Tab[]>(() => roots.map((r, i) => ({ id: i + 1, history: [r], idx: 0 })));
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(0);
  const [editing, setEditing] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  const page = tab?.history[tab.idx] ?? "start";

  const urlOf = (p: SafariPage) =>
    p.startsWith("linkedin") ? "linkedin.com/in/illana-nemard"
    : p === "start" ? ""
    : p.startsWith("search:") ? `search?q=${encodeURIComponent(p.slice(7))}`
    : `${host}/${p}`;

  const flash = () => {
    setLoading((n) => n + 1);
    scroller.current?.scrollTo({ top: 0 });
  };

  const go = (p: SafariPage) => {
    setTabs((ts) => ts.map((t) => (t.id === active ? { ...t, history: [...t.history.slice(0, t.idx + 1), p], idx: t.idx + 1 } : t)));
    flash();
  };

  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  // External requests (dock icons, desktop shortcuts, other apps).
  useEffect(() => {
    if (!request) return;
    const p = request.page;
    const root = p.split("/")[0];
    const ts = tabsRef.current;
    const existing = p === "start" ? undefined : ts.find((t) => t.history[t.idx].split("/")[0] === root || t.history[0] === root);
    if (existing) {
      setActive(existing.id);
      if (existing.history[existing.idx] !== p) {
        setTabs(ts.map((t) => (t.id === existing.id ? { ...t, history: [...t.history.slice(0, t.idx + 1), p], idx: t.idx + 1 } : t)));
      }
    } else {
      const id = nextId.current++;
      setTabs([...ts, { id, history: [p], idx: 0 }]);
      setActive(id);
    }
    setLoading((n) => n + 1);
  }, [request]);

  const back = () => { setTabs((ts) => ts.map((t) => (t.id === active && t.idx > 0 ? { ...t, idx: t.idx - 1 } : t))); flash(); };
  const fwd = () => { setTabs((ts) => ts.map((t) => (t.id === active && t.idx < t.history.length - 1 ? { ...t, idx: t.idx + 1 } : t))); flash(); };
  const newTab = () => {
    const id = nextId.current++;
    setTabs((ts) => [...ts, { id, history: ["start"], idx: 0 }]);
    setActive(id);
  };
  const closeTab = (id: number) => {
    const ts = tabsRef.current;
    const rest = ts.filter((t) => t.id !== id);
    if (!rest.length) {
      const nid = nextId.current++;
      setTabs([{ id: nid, history: ["start"], idx: 0 }]);
      setActive(nid);
      return;
    }
    setTabs(rest);
    if (id === active) setActive(rest[Math.max(0, ts.findIndex((t) => t.id === id) - 1)].id);
  };

  const submitAddress = (raw: string) => {
    const q = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(host.toLowerCase() + "/", "");
    setEditing(null);
    if (!q) return;
    const direct = ["linkedin", "portfolio", "events", "contact", "start"].find((r) => q === r || q.startsWith(r + "/") || q.includes(r));
    go(direct && !q.includes(" ") ? (q.startsWith(direct) ? q : direct) : `search:${raw.trim()}`);
  };

  const [section, slug] = page.split("/");
  const body =
    section === "linkedin" ? <LinkedInPage go={go} />
    : section === "portfolio" ? <PortfolioPage slug={slug} go={go} />
    : section === "events" ? <EventsPage slug={slug} go={go} />
    : section === "contact" ? <ContactPage />
    : page.startsWith("search:") ? <SearchPage q={page.slice(7)} go={go} />
    : <StartPage go={go} />;

  const btn = "grid h-8 w-8 place-items-center rounded-md text-[15px] text-black/60 enabled:hover:bg-black/5 disabled:opacity-30";

  return (
    <div className="absolute inset-0 -top-11 flex flex-col">
      {/* Toolbar lives in the title bar row */}
      <div className="pointer-events-none flex h-11 shrink-0 items-center gap-1 pl-[84px] pr-2 [&>*]:pointer-events-auto">
        <button type="button" className={btn} onClick={back} disabled={tab.idx === 0} aria-label="Back">‹</button>
        <button type="button" className={btn} onClick={fwd} disabled={tab.idx >= tab.history.length - 1} aria-label="Forward">›</button>
        <form
          className="mx-auto flex h-8 w-full max-w-[460px] min-w-0 items-center gap-2 rounded-lg bg-black/[0.06] px-3"
          onSubmit={(e) => { e.preventDefault(); submitAddress(editing ?? ""); }}
        >
          <span className="text-[10px] text-black/40" aria-hidden>{page === "start" || page.startsWith("search:") ? "⌕" : "🔒"}</span>
          <input
            aria-label="Address"
            className="min-w-0 flex-1 bg-transparent text-center text-[12.5px] text-black/80 outline-none placeholder:text-black/40 focus:text-left"
            value={editing ?? urlOf(page)}
            placeholder="Search or enter website name"
            onFocus={(e) => { setEditing(urlOf(page)); requestAnimationFrame(() => e.target.select()); }}
            onChange={(e) => setEditing(e.target.value)}
            onBlur={() => setEditing(null)}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <button type="button" onClick={flash} className="text-[13px] text-black/50 hover:text-black" aria-label="Reload page">↻</button>
        </form>
        <button type="button" className={btn} onClick={() => page.startsWith("linkedin") && window.open("https://www.linkedin.com/in/illana-nemard", "_blank", "noopener")} aria-label="Share">⇪</button>
        <button type="button" className={btn} onClick={newTab} aria-label="New tab">+</button>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Tabs" className="no-scrollbar flex h-9 shrink-0 gap-px overflow-x-auto border-b border-black/10 bg-[#e8e7e5] px-1 pt-1">
        {tabs.map((t) => {
          const p = t.history[t.idx];
          const on = t.id === active;
          return (
            <div
              key={t.id}
              role="tab"
              aria-selected={on}
              tabIndex={0}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(t.id)}
              className={`group relative flex min-w-[120px] max-w-[220px] flex-1 cursor-default items-center gap-2 rounded-t-md px-3 text-[12px] ${on ? "bg-white" : "text-black/60 hover:bg-black/5"}`}
            >
              {favicon(p)}
              <span className="truncate">{tabTitle(p)}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); closeTab(t.id); }}
                aria-label={`Close tab ${tabTitle(p)}`}
                className="ml-auto grid h-5 w-5 shrink-0 place-items-center rounded text-[12px] opacity-0 hover:bg-black/10 group-hover:opacity-100 focus:opacity-100"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Loading bar */}
      <div className="relative h-0.5 shrink-0">
        <AnimatePresence>
          <motion.span
            key={loading}
            className="absolute left-0 top-0 h-full bg-[#1a73e8]"
            initial={{ width: "0%", opacity: 1 }}
            animate={{ width: "100%", opacity: 0 }}
            transition={{ width: { duration: 0.6, ease: "easeOut" }, opacity: { delay: 0.6, duration: 0.2 } }}
          />
        </AnimatePresence>
      </div>

      <div ref={scroller} data-lenis-prevent className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white">
        <AnimatePresence mode="wait">
          <motion.div key={`${active}-${page}-${loading}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {body}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
