"use client";

import { useRef, useState } from "react";
import { Download, Lock, LogOut, RotateCcw, Upload } from "lucide-react";
import { useContent } from "@/lib/content-context";
import {
  AboutEditor,
  ContactEditor,
  HeroEditor,
  SocialEditor,
  StatsEditor,
} from "@/components/admin/singleton-editors";
import { ContentSectionEditor } from "@/components/admin/content-section-editor";
import type { SectionKey } from "@/lib/types";

const TABS: { key: string; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "stats", label: "Stats" },
  { key: "social", label: "Social" },
  { key: "contact", label: "Contact" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "certifications", label: "Certifications" },
  { key: "blog", label: "Blog" },
  { key: "research", label: "Research" },
  { key: "community", label: "Community" },
  { key: "talks", label: "Talks" },
  { key: "honors", label: "Honors" },
];

const SECTION_META: Record<
  SectionKey,
  { label: string; subtitleLabel: string }
> = {
  experience: { label: "Experience", subtitleLabel: "Company" },
  projects: { label: "Projects", subtitleLabel: "Category" },
  certifications: { label: "Certifications", subtitleLabel: "Issuer" },
  blog: { label: "Blog posts", subtitleLabel: "Publication" },
  research: { label: "Research", subtitleLabel: "Venue" },
  community: { label: "Community", subtitleLabel: "Role" },
  talks: { label: "Talks", subtitleLabel: "Event" },
  honors: { label: "Honors", subtitleLabel: "Awarded by" },
};

export default function AdminPage() {
  const {
    exportContent,
    importContent,
    resetContent,
    isAdmin,
    authLoading,
    signIn,
    signOut,
  } = useContent();
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [tab, setTab] = useState("hero");
  const importRef = useRef<HTMLInputElement>(null);

  if (authLoading) {
    return null; // avoids a flash of the passcode form while the session check resolves
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto flex max-w-sm flex-col items-center px-6 py-24 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-signal-50 dark:bg-signal-700/15 text-signal-600 dark:text-signal-400">
          <Lock size={18} />
        </span>
        <h1 className="section-heading mt-4 text-2xl">Admin</h1>
        <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">
          Enter your admin passcode to edit site content.
        </p>
        <form
          className="mt-6 flex w-full flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setSigningIn(true);
            setError("");
            const ok = await signIn(pwd);
            setSigningIn(false);
            if (!ok) setError("Incorrect passcode.");
          }}
        >
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="input text-center"
            placeholder="Passcode"
            autoFocus
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            disabled={signingIn}
            className="rounded-full bg-ink dark:bg-signal-500 px-5 py-2.5 text-sm font-semibold text-paper dark:text-ink disabled:opacity-60"
          >
            {signingIn ? "Checking…" : "Unlock"}
          </button>
        </form>
        <p className="mt-6 text-[11px] text-ink/40 dark:text-paper/40">
          This checks against the one admin account set up in your Supabase
          project (see README.md → Setup) — it's real, server-verified
          authentication, not a value stored in this app's code.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Content management</p>
          <h1 className="section-heading mt-1 text-3xl">Admin</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportContent}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-light dark:border-border-dark px-3.5 py-2 text-xs font-medium transition hover:border-signal-500 hover:text-signal-600 dark:hover:text-signal-400"
          >
            <Download size={13} /> Export JSON
          </button>
          <button
            onClick={() => importRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-light dark:border-border-dark px-3.5 py-2 text-xs font-medium transition hover:border-signal-500 hover:text-signal-600 dark:hover:text-signal-400"
          >
            <Upload size={13} /> Import JSON
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importContent(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => {
              if (confirm("Reset all content back to the default seed data?")) {
                resetContent();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-light dark:border-border-dark px-3.5 py-2 text-xs font-medium text-red-500 transition hover:border-red-400"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-light dark:border-border-dark px-3.5 py-2 text-xs font-medium transition hover:border-signal-500 hover:text-signal-600 dark:hover:text-signal-400"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap gap-1.5 border-b border-border-light dark:border-border-dark pb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              tab === t.key
                ? "bg-ink text-paper dark:bg-signal-500 dark:text-ink"
                : "border border-border-light dark:border-border-dark text-ink/60 dark:text-paper/60 hover:border-signal-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "hero" && <HeroEditor />}
        {tab === "about" && <AboutEditor />}
        {tab === "stats" && <StatsEditor />}
        {tab === "social" && <SocialEditor />}
        {tab === "contact" && <ContactEditor />}
        {(Object.keys(SECTION_META) as SectionKey[]).includes(tab as SectionKey) && (
          <ContentSectionEditor
            section={tab as SectionKey}
            label={SECTION_META[tab as SectionKey].label}
            subtitleLabel={SECTION_META[tab as SectionKey].subtitleLabel}
          />
        )}
      </div>
    </section>
  );
}

