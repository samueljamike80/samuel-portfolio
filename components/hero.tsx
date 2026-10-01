"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileDown } from "lucide-react";
import { useContent } from "@/lib/content-context";

export function Hero() {
  const { content } = useContent();
  if (!content) return null;
  const { hero } = content;

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-light dark:bg-grid-dark bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-16 text-center sm:pt-24">
        <div className="animate-fade-up">
          <div className="relative mx-auto h-32 w-32 sm:h-40 sm:w-40">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-signal-400 to-signal-600 blur-lg opacity-40" />
            <Image
              src={hero.profileImage}
              alt={hero.name}
              fill
              sizes="160px"
              className="relative rounded-full border-4 border-white dark:border-surface-dark object-cover shadow-lg"
              priority
            />
          </div>

          <p className="eyebrow mt-5">{hero.role}</p>
          <h1 className="section-heading mt-3 text-4xl sm:text-6xl">
            {hero.greeting}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-ink/70 dark:text-paper/70 sm:text-lg">
            {hero.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-ink dark:bg-signal-500 px-6 py-3 text-sm font-semibold text-paper dark:text-ink transition hover:opacity-90"
            >
              View Projects
              <ArrowUpRight
                size={16}
                className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <a
              href={hero.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border-light dark:border-border-dark px-6 py-3 text-sm font-semibold transition hover:border-signal-500 hover:text-signal-600 dark:hover:text-signal-400"
            >
              View CV
              <FileDown size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
