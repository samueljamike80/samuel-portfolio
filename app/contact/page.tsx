"use client";

import { Github, Linkedin, Link as LinkIcon, Mail, MapPin, Twitter } from "lucide-react";
import { useContent } from "@/lib/content-context";

export default function ContactPage() {
  const { content } = useContent();
  if (!content) return null;
  const { contact, social } = content;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="eyebrow">Get in touch</p>
      <h1 className="section-heading mt-2">Contact</h1>
      <p className="mt-3 text-ink/70 dark:text-paper/70">{contact.availability}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href={`mailto:${contact.email}`}
          className="card flex items-center gap-4 px-5 py-5 transition hover:border-signal-500/60"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-signal-50 dark:bg-signal-700/15 text-signal-600 dark:text-signal-400">
            <Mail size={18} />
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink/45 dark:text-paper/45">
              Email
            </p>
            <p className="mt-0.5 text-sm font-medium break-all">{contact.email}</p>
          </div>
        </a>

        <div className="card flex items-center gap-4 px-5 py-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-signal-50 dark:bg-signal-700/15 text-signal-600 dark:text-signal-400">
            <MapPin size={18} />
          </span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink/45 dark:text-paper/45">
              Location
            </p>
            <p className="mt-0.5 text-sm font-medium">{contact.location}</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink/45 dark:text-paper/45">
          Elsewhere
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {social.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border-light dark:border-border-dark px-4 py-2 text-sm transition hover:border-signal-500 hover:text-signal-600 dark:hover:text-signal-400">
              <Linkedin size={15} /> LinkedIn
            </a>
          )}
          {social.github && (
            <a href={social.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border-light dark:border-border-dark px-4 py-2 text-sm transition hover:border-signal-500 hover:text-signal-600 dark:hover:text-signal-400">
              <Github size={15} /> GitHub
            </a>
          )}
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border-light dark:border-border-dark px-4 py-2 text-sm transition hover:border-signal-500 hover:text-signal-600 dark:hover:text-signal-400">
              <Twitter size={15} /> Twitter / X
            </a>
          )}
          {social.linktree && (
            <a href={social.linktree} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border-light dark:border-border-dark px-4 py-2 text-sm transition hover:border-signal-500 hover:text-signal-600 dark:hover:text-signal-400">
              <LinkIcon size={15} /> Linktree
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
