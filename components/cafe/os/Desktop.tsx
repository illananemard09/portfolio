"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { person } from "@/content/site";
import { Calendar, Files, Mail, Notes, QuickLook } from "./Apps";
import { OSContext, useOS as useOSApi, type OSApi, type WinKind } from "./context";
import { DocIcon, docs, DocView, type Doc } from "./docs";
import { AppIcon, appNames, type AppId } from "./icons";
import { Safari, type SafariPage } from "./Safari";
import { Window } from "./Window";

type Win = { id: WinKind; z: number; min: boolean; max: boolean };

const titles: Record<WinKind, string> = {
  safari: "Safari",
  mail: "Mail",
  notes: "Notes",
  calendar: "Calendar",
  files: "Files",
  quicklook: "Quick Look",
  preview: "Preview",
};

function Clock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 10000);
    return () => clearInterval(i);
  }, []);
  return (
    <span className="tabular-nums">
      {t.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}&nbsp;&nbsp;
      {t.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

function DockItem({ id, mouseX, running, onClick, label, compact }: { id: AppId | "trash"; mouseX: MotionValue<number>; running?: boolean; onClick: () => void; label: string; compact?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const dist = useTransform(mouseX, (v) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? v - (r.left + r.width / 2) : Infinity;
  });
  const size = useSpring(useTransform(dist, [-140, 0, 140], [48, 76, 48], { clamp: true }), { stiffness: 400, damping: 28 });
  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      style={compact ? { width: 38, height: 38 } : { width: size, height: size }}
      whileTap={{ y: -14 }}
      className="group relative flex shrink-0 items-end"
    >
      <AppIcon id={id} className="h-full w-full drop-shadow-[0_4px_8px_rgba(0,0,0,.3)]" />
      <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100 sm:block">
        {label}
      </span>
      {running && <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/80" />}
    </motion.button>
  );
}

export function Desktop({ onExit, initialApp }: { onExit: () => void; initialApp?: { page: SafariPage } | null }) {
  const root = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [wins, setWins] = useState<Win[]>([]);
  const zRef = useRef(10);
  const [safariReq, setSafariReq] = useState<{ page: SafariPage; n: number } | null>(null);
  const [draft, setDraft] = useState<{ subject?: string; body?: string; n: number } | null>(null);
  const [look, setLook] = useState<{ name: string; body: string } | null>(null);
  const [doc, setDoc] = useState<Doc | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 1000, h: 640 });
  const mouseX = useMotionValue(Infinity);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setSize({ w: width, h: height });
      setCompact(width < 720);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const open = useCallback((id: WinKind) => {
    const nz = ++zRef.current;
    setWins((ws) =>
      ws.some((w) => w.id === id)
        ? ws.map((w) => (w.id === id ? { ...w, z: nz, min: false } : w))
        : [...ws, { id, z: nz, min: false, max: false }],
    );
  }, []);

  const api: OSApi = {
    openSafari: (page) => {
      setSafariReq({ page, n: Date.now() });
      open("safari");
    },
    openMail: (d) => {
      setDraft({ ...d, n: Date.now() });
      open("mail");
    },
    openApp: open,
    quickLook: (f) => {
      setLook(f);
      open("quicklook");
    },
    toast: (m) => setToastMsg(m),
    openDoc: (id) => {
      const d = docs.find((x) => x.id === id);
      if (!d) return;
      setDoc(d);
      open("preview");
    },
  };

  useEffect(() => {
    if (initialApp) {
      setSafariReq({ page: initialApp.page, n: Date.now() });
      open("safari");
    }
  }, [initialApp, open]);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 3200);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const close = (id: WinKind) => setWins((ws) => ws.filter((w) => w.id !== id));
  const minimize = (id: WinKind) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)));
  const maximize = (id: WinKind) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, max: !w.max } : w)));
  const focus = (id: WinKind) => {
    const w = wins.find((x) => x.id === id);
    if (w && w.z === zRef.current) return;
    open(id);
  };

  const visible = wins.filter((w) => !w.min);
  const top = visible.reduce<Win | null>((a, w) => (!a || w.z > a.z ? w : a), null);
  const activeName = top ? titles[top.id] : "Finder";

  const place = (i: number, w: number, h: number) => ({
    x: Math.max(8, Math.min(size.w - w - 8, (size.w - w) / 2 + (i - 2) * 34)),
    y: Math.max(36, Math.min(size.h - h - 90, 44 + i * 22)),
    w: Math.min(w, size.w - 16),
    h: Math.min(h, size.h - 120),
  });
  const geom: Record<WinKind, { x: number; y: number; w: number; h: number }> = {
    safari: place(2, Math.min(980, size.w * 0.86), Math.min(640, size.h * 0.82)),
    mail: place(1, 760, 480),
    notes: place(0, 640, 440),
    calendar: place(3, 700, 480),
    files: place(4, 680, 420),
    quicklook: place(5, 420, 360),
    preview: place(1, Math.min(700, size.w * 0.7), Math.min(600, size.h * 0.8)),
  };

  const content: Record<WinKind, React.ReactNode> = {
    safari: null,
    mail: <Mail draft={draft} />,
    notes: <Notes />,
    calendar: <Calendar />,
    files: <Files />,
    quicklook: look ? <QuickLook file={look} /> : null,
    preview: doc ? <DocView doc={doc} /> : null,
  };

  const dockApps: AppId[] = ["safari", "linkedin", "portfolio", "mail", "notes", "calendar", "files"];
  const launch = (id: AppId) => {
    if (id === "linkedin") api.openSafari("linkedin");
    else if (id === "portfolio") api.openSafari("portfolio");
    else if (id === "safari") {
      if (wins.some((w) => w.id === "safari")) open("safari");
      else api.openSafari("start");
    } else open(id);
  };

  return (
    <OSContext.Provider value={api}>
      <div
        ref={root}
        tabIndex={-1}
        className="relative h-full w-full overflow-hidden outline-none font-[-apple-system,BlinkMacSystemFont,'Helvetica_Neue',sans-serif] text-[13px]"
        style={{
          background:
            "radial-gradient(120% 90% at 20% 10%, #f07a5f 0%, transparent 45%), radial-gradient(90% 90% at 90% 90%, #2a2724 0%, transparent 60%), linear-gradient(135deg, #e0482c 0%, #7a2c1c 45%, #121110 100%)",
        }}
      >
        {/* Wallpaper wordmark */}
        <p aria-hidden className="pointer-events-none absolute inset-x-0 top-[30%] text-center font-display text-[clamp(40px,9vw,120px)] font-light italic leading-none tracking-[-0.05em] text-white/15">
          see you at the next idea
        </p>

        {/* Menu bar */}
        {!compact && (
          <div className="absolute inset-x-0 top-0 z-[500] flex h-7 items-center gap-5 bg-black/25 px-4 text-[12.5px] text-white backdrop-blur-xl">
            <button type="button" onClick={() => api.toast("✦ Illana OS — handmade in HTML, CSS & a lot of coffee.")} aria-label="About this desktop" className="text-[14px]">✦</button>
            <span className="font-semibold">{activeName}</span>
            {["File", "Edit", "View", "Window", "Help"].map((m) => (
              <button key={m} type="button" className="hidden opacity-90 md:inline" onClick={() => m === "Help" ? api.openMail({ subject: "Help! I have an idea" }) : api.toast(`${m} — nothing to ${m.toLowerCase()} here, just ideas.`)}>{m}</button>
            ))}
            <span className="ml-auto flex items-center gap-4">
              <svg aria-label="Wi-Fi connected" viewBox="0 0 20 14" className="h-3 w-4" fill="currentColor"><path d="M10 13.5l2.4-2.9a3.6 3.6 0 0 0-4.8 0zM4.9 7.4l1.6 1.9a5.4 5.4 0 0 1 7 0l1.6-1.9a7.9 7.9 0 0 0-10.2 0zM1.8 3.7l1.6 1.9a10.3 10.3 0 0 1 13.2 0l1.6-1.9a12.8 12.8 0 0 0-16.4 0z" /></svg>
              <span aria-label="Battery full" className="flex items-center gap-1">100% <span className="inline-block h-2.5 w-5 rounded-[3px] border border-white/80 p-px"><span className="block h-full w-full rounded-[1px] bg-white" /></span></span>
              <Clock />
            </span>
          </div>
        )}

        {/* Desktop icons — every file is a piece of the CV */}
        <DesktopIcons compact={compact} height={size.h} bounds={root} onOpenFolder={() => open("files")} />

        {/* Windows */}
        <AnimatePresence>
          {wins.map((w) => (
            <Window
              minimized={w.min}
              key={w.id}
              title={w.id === "preview" && doc ? doc.name : titles[w.id]}
              active={top?.id === w.id}
              z={w.z}
              compact={compact}
              maximized={w.max}
              initial={geom[w.id]}
              bounds={root}
              onFocus={() => focus(w.id)}
              onClose={() => close(w.id)}
              onMinimize={() => minimize(w.id)}
              onMaximize={() => maximize(w.id)}
              toolbar={w.id === "safari" ? <span /> : undefined}
            >
              {w.id === "safari" ? <Safari request={safariReq} /> : content[w.id]}
            </Window>
          ))}
        </AnimatePresence>

        {/* Dock */}
        <div className="absolute inset-x-0 bottom-2 z-[400] flex justify-center px-2">
          <div
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={`no-scrollbar flex max-w-full items-end ${compact ? "h-[54px] gap-1.5" : "h-[64px] gap-2"} overflow-x-auto rounded-2xl border border-white/20 bg-white/20 px-2 pb-2 backdrop-blur-2xl sm:overflow-visible`}
          >
            {dockApps.map((id) => (
              <DockItem
                key={id}
                id={id}
                label={appNames[id]}
                compact={compact}
                mouseX={mouseX}
                running={id === "safari" ? wins.some((w) => w.id === "safari") : wins.some((w) => w.id === id)}
                onClick={() => launch(id)}
              />
            ))}
            <span className="mx-1 h-10 w-px self-center bg-white/30" />
            <DockItem id="trash" label="Back to the café" mouseX={mouseX} onClick={onExit} compact={compact} />
          </div>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              role="status"
              className="absolute right-3 top-10 z-[600] w-[min(320px,calc(100%-24px))] rounded-xl border border-white/20 bg-white/80 p-3 text-[12.5px] text-black shadow-xl backdrop-blur-xl"
              initial={{ x: 360, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 360, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <p className="font-semibold">Notification</p>
              <p className="mt-0.5 text-black/75">{toastMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </OSContext.Provider>
  );
}

function DesktopIcons({ compact, height, bounds, onOpenFolder }: { compact: boolean; height: number; bounds: React.RefObject<HTMLDivElement | null>; onOpenFolder: () => void }) {
  const os = useOSApi();
  const items: { key: string; label: string; icon: React.ReactNode; run: () => void }[] = [
    { key: "cta", label: "Let's work together", icon: <AppIcon id="cta" className="h-12 w-12 drop-shadow" />, run: () => os.openSafari("contact") },
    ...docs.slice(0, 3).map((d) => ({ key: d.id, label: d.name, icon: <DocIcon kind={d.kind} className="h-12 w-12 drop-shadow" />, run: () => os.openDoc(d.id) })),
    { key: "cases", label: "Case studies", icon: <AppIcon id="folder" className="h-12 w-12 drop-shadow" />, run: onOpenFolder },
    ...docs.slice(3).map((d) => ({ key: d.id, label: d.name, icon: <DocIcon kind={d.kind} className="h-12 w-12 drop-shadow" />, run: () => os.openDoc(d.id) })),
  ];
  // macOS-style: fill columns from the top-right corner.
  const rows = Math.max(3, Math.floor((height - 36 - 90) / 92));
  return (
    <div className={compact ? "no-scrollbar absolute inset-x-2 bottom-[70px] top-3 z-[1] grid auto-rows-min grid-cols-4 gap-y-3 overflow-y-auto" : "absolute inset-0 z-[1]"}>
      {items.map((d, i) => (
        <motion.button
          key={d.key}
          type="button"
          drag={!compact}
          dragConstraints={bounds}
          dragMomentum={false}
          onTap={d.run}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && d.run()}
          className={`group flex w-[88px] flex-col items-center gap-1 justify-self-center text-center text-white ${compact ? "" : "absolute"}`}
          style={compact ? undefined : { right: 12 + Math.floor(i / rows) * 96, top: 36 + (i % rows) * 92 }}
          title={d.label}
        >
          <span className="grid h-14 w-14 place-items-center rounded-lg transition-colors group-hover:bg-white/15 group-focus-visible:bg-white/25">{d.icon}</span>
          <span className="line-clamp-2 break-words rounded px-1 text-[11px] leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,.7)] group-focus-visible:bg-[#1a73e8]">{d.label.replace(/_/g, "_\u200b")}</span>
        </motion.button>
      ))}
    </div>
  );
}
