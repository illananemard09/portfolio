"use client";

import { createContext, useContext } from "react";

export type WinKind = "safari" | "mail" | "notes" | "calendar" | "files" | "quicklook" | "preview";

export type OSApi = {
  /** "start" | "linkedin" | "portfolio[/slug]" | "events[/stage]" | "contact" */
  openSafari: (page: string) => void;
  openMail: (draft?: { subject?: string; body?: string }) => void;
  openApp: (id: WinKind) => void;
  quickLook: (file: { name: string; body: string }) => void;
  /** Open one of the CV documents (see docs.tsx) in Preview. */
  openDoc: (id: string) => void;
  toast: (msg: string) => void;
};

export const OSContext = createContext<OSApi | null>(null);

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used inside <Desktop>");
  return ctx;
}
