"use client";

import Image from "next/image";
import { GraduationCap, Mail, MapPin, Target, type LucideIcon } from "lucide-react";
import { useContent } from "@/lib/content-context";
import type { InfoChip } from "@/lib/types";

const ICONS: Record<InfoChip["icon"], LucideIcon> = {
  "map-pin": MapPin,
  "graduation-cap": GraduationCap,
  target: Target,
  mail: Mail,
};

export function About() {
  const { content } = useContent();
  if (!content) return null;
  const { about } = content;

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <p className="eyebrow">About</p>
      <h2 className="section-heading mt-2 max-w-2xl">{about.shortText}</h2>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-3xl border border-border-light dark:border-border-dark lg:mx-0">
          <Image
            src={about.secondaryImage}
            alt="Samuel Charles"
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-base leading-relaxed text-ink/75 dark:text-paper/75 sm:text-lg">
            {about.longText}
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {about.infoChips.map((chip) => {
              const Icon = ICONS[chip.icon];
              return (
                <div
                  key={chip.id}
                  className="card flex items-start gap-3 px-4 py-4"
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-signal-50 dark:bg-signal-700/15 text-signal-600 dark:text-signal-400">
                    <Icon size={16} />
                  </span>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wide text-ink/45 dark:text-paper/45">
                      {chip.label}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium">
                      {chip.value}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
