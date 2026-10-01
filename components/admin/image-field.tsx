"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { useContent } from "@/lib/content-context";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export function ImageField({ label, value, onChange }: Props) {
  const { uploadImage } = useContent();
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-paper/50">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-ink/5 dark:bg-paper/5">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-ink/30 dark:text-paper/30">
              <ImagePlus size={18} />
            </div>
          )}
          {busy && (
            <div className="absolute inset-0 grid place-items-center bg-white/70 dark:bg-ink/70">
              <Loader2 size={16} className="animate-spin" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste an image URL…"
            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-border-light dark:border-border-dark px-3 py-1.5 text-xs font-medium transition hover:border-signal-500 hover:text-signal-600 dark:hover:text-signal-400"
            >
              Upload image
            </button>
            <span className="text-[11px] text-ink/40 dark:text-paper/40">
              or paste a URL above
            </span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>
    </div>
  );
}
