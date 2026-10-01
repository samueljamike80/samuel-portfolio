"use client";

import { useState } from "react";
import { AlertTriangle, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { ImageField } from "./image-field";
import type { ContentItem, SectionKey } from "@/lib/types";

const EMPTY: Omit<ContentItem, "id"> = {
  title: "",
  subtitle: "",
  description: "",
  date: "",
  image: "",
  link: "",
  linkLabel: "",
  tags: [],
  featured: false,
};

export function ContentSectionEditor({
  section,
  label,
  subtitleLabel,
}: {
  section: SectionKey;
  label: string;
  subtitleLabel: string;
}) {
  const { content, addItem, updateItem, deleteItem } = useContent();
  if (!content) return null;
  const items = content[section];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ContentItem, "id">>(EMPTY);
  const [tagInput, setTagInput] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saveError, setSaveError] = useState(false);

  function startAdd() {
    setForm(EMPTY);
    setEditingId(null);
    setSaveError(false);
    setShowForm(true);
  }

  function startEdit(item: ContentItem) {
    const { id, ...rest } = item;
    setForm({ ...EMPTY, ...rest });
    setEditingId(id);
    setSaveError(false);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const ok = editingId
      ? await updateItem(section, editingId, form)
      : await addItem(section, form);
    if (!ok) {
      // Most common causes: not signed in as admin (Supabase's Row Level
      // Security silently rejects the write), or a network error. Keep the
      // form open so nothing typed is lost.
      setSaveError(true);
      return;
    }
    setShowForm(false);
    setForm(EMPTY);
    setEditingId(null);
    setSaveError(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{label}</h2>
        {!showForm && (
          <button
            onClick={startAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-signal-500 px-4 py-2 text-sm font-semibold text-ink transition hover:opacity-90"
          >
            <Plus size={15} /> Add {label.replace(/s$/, "")}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="card mt-4 flex flex-col gap-4 p-5"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              {editingId ? "Edit entry" : "New entry"}
            </p>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="text-ink/50 dark:text-paper/50 hover:text-signal-500"
              aria-label="Cancel"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" required>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input"
              />
            </Field>
            <Field label={subtitleLabel}>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="input"
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input resize-none"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date / period">
              <input
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="e.g. 2024 — Present"
                className="input"
              />
            </Field>
            <Field label="External link">
              <input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://…"
                className="input"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Link label">
              <input
                value={form.linkLabel}
                onChange={(e) =>
                  setForm({ ...form, linkLabel: e.target.value })
                }
                placeholder="e.g. View on GitHub"
                className="input"
              />
            </Field>
            <Field label="Tags (press Enter to add)">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault();
                    setForm({
                      ...form,
                      tags: [...(form.tags || []), tagInput.trim()],
                    });
                    setTagInput("");
                  }
                }}
                className="input"
              />
              {form.tags && form.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {form.tags.map((tag, i) => (
                    <span
                      key={tag + i}
                      className="inline-flex items-center gap-1 rounded-full border border-border-light dark:border-border-dark px-2 py-0.5 text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            tags: form.tags?.filter((_, idx) => idx !== i),
                          })
                        }
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>

          <ImageField
            label="Image (optional)"
            value={form.image || ""}
            onChange={(url) => setForm({ ...form, image: url })}
          />

          <label className="flex w-fit items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) =>
                setForm({ ...form, featured: e.target.checked })
              }
              className="h-4 w-4 rounded border-border-light dark:border-border-dark accent-signal-500"
            />
            Feature this entry
          </label>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            {saveError && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500">
                <AlertTriangle size={14} /> Couldn't save — you may be signed out, or the connection to Supabase failed. Try signing in again.
              </span>
            )}
            <button
              type="submit"
              className="rounded-full bg-ink dark:bg-signal-500 px-5 py-2 text-sm font-semibold text-paper dark:text-ink transition hover:opacity-90"
            >
              {editingId ? "Save changes" : "Publish"}
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="card flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                {item.featured && (
                  <Star size={13} className="shrink-0 text-amber-500" fill="currentColor" />
                )}
                {item.title}
              </p>
              <p className="truncate text-xs text-ink/50 dark:text-paper/50">
                {item.subtitle} {item.date ? `· ${item.date}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => startEdit(item)}
                aria-label="Edit"
                className="grid h-8 w-8 place-items-center rounded-full text-ink/60 dark:text-paper/60 hover:bg-signal-50 dark:hover:bg-signal-700/15 hover:text-signal-600 dark:hover:text-signal-400"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => deleteItem(section, item.id)}
                aria-label="Delete"
                className="grid h-8 w-8 place-items-center rounded-full text-ink/60 dark:text-paper/60 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && !showForm && (
          <p className="rounded-2xl border border-dashed border-border-light dark:border-border-dark px-4 py-8 text-center text-sm text-ink/50 dark:text-paper/50">
            Nothing published yet.
          </p>
        )}
      </ul>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-paper/50">
        {label} {required && <span className="text-signal-500">*</span>}
      </label>
      {children}
    </div>
  );
}
