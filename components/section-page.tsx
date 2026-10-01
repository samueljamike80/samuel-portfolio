"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ContentItem } from "@/lib/types";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  items: ContentItem[];
  emptyLabel: string;
};

export function SectionPage({ eyebrow, title, description, items, emptyLabel }: Props) {
  const sorted = [...items].sort(
    (a, b) => Number(!!b.featured) - Number(!!a.featured)
  );

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="section-heading mt-2">{title}</h1>
      <p className="mt-3 max-w-2xl text-ink/70 dark:text-paper/70">
        {description}
      </p>

      {sorted.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-border-light dark:border-border-dark px-6 py-16 text-center text-sm text-ink/50 dark:text-paper/50">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {sorted.map((item) => (
            <article
              key={item.id}
              className="card group flex flex-col overflow-hidden transition hover:border-signal-500/60"
            >
              {item.image && (
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="400px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                {item.featured && (
                  <span className="mb-2 w-fit rounded-full bg-signal-50 dark:bg-signal-700/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-signal-600 dark:text-signal-400">
                    Featured
                  </span>
                )}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold leading-snug">
                    {item.title}
                  </h3>
                  {item.date && (
                    <span className="shrink-0 font-mono text-xs text-ink/45 dark:text-paper/45">
                      {item.date}
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <p className="mt-0.5 text-sm font-medium text-signal-600 dark:text-signal-400">
                    {item.subtitle}
                  </p>
                )}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70 dark:text-paper/70">
                  {item.description}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border-light dark:border-border-dark px-2.5 py-1 text-[11px] text-ink/60 dark:text-paper/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-ink dark:text-paper transition hover:text-signal-600 dark:hover:text-signal-400"
                  >
                    {item.linkLabel || "Learn more"}
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
