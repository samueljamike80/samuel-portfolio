"use client";

import { useState } from "react";
import { AlertTriangle, Check, Save } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { ImageField } from "./image-field";
import type { InfoChip, SocialLinks, Stat } from "@/lib/types";

type SaveState = "idle" | "saved" | "error";

// Shown after a form submits, so a write that Supabase silently rejected
// (most commonly: the admin session expired and Row Level Security blocked
// it) is actually visible to the person editing, instead of just quietly
// not saving.
function SaveStatus({ state }: { state: SaveState }) {
  if (state === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-signal-600 dark:text-signal-400">
        <Check size={14} /> Saved
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500">
        <AlertTriangle size={14} /> Couldn't save — you may be signed out, or the connection to Supabase failed. Try signing in again.
      </span>
    );
  }
  return null;
}

function SaveButton({ label = "Save changes" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="inline-flex w-fit items-center gap-1.5 rounded-full bg-ink dark:bg-signal-500 px-5 py-2 text-sm font-semibold text-paper dark:text-ink transition hover:opacity-90"
    >
      <Save size={14} /> {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-paper/50">
        {label}
      </label>
      {children}
    </div>
  );
}

export function HeroEditor() {
  const { content, updateHero } = useContent();
  if (!content) return null;
  const [form, setForm] = useState(content.hero);
  const [status, setStatus] = useState<SaveState>("idle");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus((await updateHero(form)) ? "saved" : "error");
      }}
      className="card flex flex-col gap-4 p-5"
    >
      <h2 className="font-display text-xl font-semibold">Hero section</h2>
      <ImageField
        label="Profile photo"
        value={form.profileImage}
        onChange={(url) => setForm({ ...form, profileImage: url })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Role / title">
          <input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </Field>
      </div>
      <Field label="Greeting headline">
        <input className="input" value={form.greeting} onChange={(e) => setForm({ ...form, greeting: e.target.value })} />
      </Field>
      <Field label="Description">
        <textarea rows={3} className="input resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <Field label="CV URL">
        <input className="input" value={form.cvUrl} onChange={(e) => setForm({ ...form, cvUrl: e.target.value })} placeholder="/cv/resume.pdf or https://…" />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <SaveButton />
        <SaveStatus state={status} />
      </div>
    </form>
  );
}

export function StatsEditor() {
  const { content, updateStats } = useContent();
  if (!content) return null;
  const [stats, setStats] = useState<Stat[]>(content.stats);
  const [status, setStatus] = useState<SaveState>("idle");

  function update(id: string, patch: Partial<Stat>) {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus((await updateStats(stats)) ? "saved" : "error");
      }}
      className="card flex flex-col gap-4 p-5"
    >
      <h2 className="font-display text-xl font-semibold">Stats bar</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.id} className="rounded-xl border border-border-light dark:border-border-dark p-4">
            <Field label="Label">
              <input className="input" value={stat.label} onChange={(e) => update(stat.id, { label: e.target.value })} />
            </Field>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Value">
                <input type="number" className="input" value={stat.value} onChange={(e) => update(stat.id, { value: Number(e.target.value) })} />
              </Field>
              <Field label="Suffix">
                <input className="input" value={stat.suffix || ""} onChange={(e) => update(stat.id, { suffix: e.target.value })} placeholder="+" />
              </Field>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SaveButton />
        <SaveStatus state={status} />
      </div>
    </form>
  );
}

export function AboutEditor() {
  const { content, updateAbout } = useContent();
  if (!content) return null;
  const [form, setForm] = useState(content.about);
  const [status, setStatus] = useState<SaveState>("idle");

  function updateChip(id: string, patch: Partial<InfoChip>) {
    setForm((prev) => ({
      ...prev,
      infoChips: prev.infoChips.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus((await updateAbout(form)) ? "saved" : "error");
      }}
      className="card flex flex-col gap-4 p-5"
    >
      <h2 className="font-display text-xl font-semibold">About me</h2>
      <Field label="Short intro (shown as the section heading)">
        <textarea rows={2} className="input resize-none" value={form.shortText} onChange={(e) => setForm({ ...form, shortText: e.target.value })} />
      </Field>
      <Field label="Full narrative">
        <textarea rows={5} className="input resize-none" value={form.longText} onChange={(e) => setForm({ ...form, longText: e.target.value })} />
      </Field>
      <ImageField label="Secondary photo" value={form.secondaryImage} onChange={(url) => setForm({ ...form, secondaryImage: url })} />

      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-paper/50">
        Info chips
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {form.infoChips.map((chip) => (
          <div key={chip.id} className="rounded-xl border border-border-light dark:border-border-dark p-3">
            <p className="mb-2 text-xs font-semibold text-signal-600 dark:text-signal-400">{chip.label}</p>
            <input className="input" value={chip.value} onChange={(e) => updateChip(chip.id, { value: e.target.value })} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SaveButton />
        <SaveStatus state={status} />
      </div>
    </form>
  );
}

export function SocialEditor() {
  const { content, updateSocial } = useContent();
  if (!content) return null;
  const [form, setForm] = useState<SocialLinks>(content.social);

  const fields: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
    { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/…" },
    { key: "github", label: "GitHub URL", placeholder: "https://github.com/…" },
    { key: "twitter", label: "Twitter / X URL", placeholder: "https://x.com/…" },
    { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/…" },
    { key: "mail", label: "Mail link", placeholder: "mailto:you@email.com" },
    { key: "linktree", label: "Linktree URL", placeholder: "https://linktr.ee/…" },
  ];

  const [status, setStatus] = useState<SaveState>("idle");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus((await updateSocial(form)) ? "saved" : "error");
      }}
      className="card flex flex-col gap-4 p-5"
    >
      <h2 className="font-display text-xl font-semibold">Social links</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.key} label={f.label}>
            <input
              className="input"
              value={form[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            />
          </Field>
        ))}
      </div>
      <p className="text-xs text-ink/45 dark:text-paper/45">
        Leave a field blank to hide that icon from the footer.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <SaveButton />
        <SaveStatus state={status} />
      </div>
    </form>
  );
}

export function ContactEditor() {
  const { content, updateContact } = useContent();
  if (!content) return null;
  const [form, setForm] = useState(content.contact);
  const [status, setStatus] = useState<SaveState>("idle");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus((await updateContact(form)) ? "saved" : "error");
      }}
      className="card flex flex-col gap-4 p-5"
    >
      <h2 className="font-display text-xl font-semibold">Contact page</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email">
          <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Phone (optional)">
          <input className="input" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
      </div>
      <Field label="Location">
        <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      </Field>
      <Field label="Availability note">
        <input className="input" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <SaveButton />
        <SaveStatus state={status} />
      </div>
    </form>
  );
}
