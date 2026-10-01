"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/lib/content-context";
import type { Stat } from "@/lib/types";

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 900;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setDisplay(Math.round(progress * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="font-mono text-3xl font-semibold sm:text-4xl">
      {display}
      <span className="text-signal-500">{suffix}</span>
    </div>
  );
}

export function StatsBar() {
  const { content } = useContent();
  if (!content) return null;

  return (
    <section className="border-y border-border-light dark:border-border-dark bg-white/60 dark:bg-surface-dark/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-4 sm:gap-0">
        {content.stats.map((stat: Stat, i) => (
          <div
            key={stat.id}
            className={`flex flex-col items-center gap-1 px-4 py-8 text-center ${
              i !== 0 ? "sm:border-l sm:border-border-light sm:dark:border-border-dark" : ""
            }`}
          >
            <Counter value={stat.value} suffix={stat.suffix} />
            <p className="text-xs font-medium uppercase tracking-wide text-ink/60 dark:text-paper/60">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
