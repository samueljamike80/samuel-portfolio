"use client";

/**
 * Dynamic content layer — backed entirely by Supabase.
 *
 * - DATA: one row in the `site_content` Postgres table (id = 1, a single
 *   `data jsonb` column holding the whole SiteContent object). Every
 *   visitor's browser reads the same row, so content and images are
 *   identical everywhere — that's the fix for "different in every browser."
 * - IMAGES: uploaded straight to the `portfolio-media` Storage bucket from
 *   the browser, and referenced by their public URL. No image data is ever
 *   stored inline in the database or in localStorage.
 * - WRITE ACCESS: enforced by Postgres Row Level Security (see
 *   supabase/schema.sql), not by anything in this file. Row Level Security
 *   policies restrict INSERT/UPDATE/DELETE to signed-in ("authenticated")
 *   Supabase users — so even a visitor who opens devtools and calls
 *   Supabase directly with the public anon key still cannot write. Public
 *   SELECT is allowed so the site itself and everyone reading it works with
 *   no login.
 *
 * See supabase/schema.sql and README.md for the one-time setup: creating
 * the table, storage bucket, and admin user in your Supabase project.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ADMIN_EMAIL, CONTENT_TABLE, STORAGE_BUCKET, isSupabaseConfigured, supabase } from "./supabase-client";
import seedContent from "@/data/site-content.json";
import type {
  ContentItem,
  SectionKey,
  SiteContent,
  SocialLinks,
  Stat,
} from "./types";

type ContentContextValue = {
  content: SiteContent | null;
  loading: boolean;
  loadError: string | null;

  // Auth (gates writes; reads are always public)
  isAdmin: boolean;
  authLoading: boolean;
  signIn: (password: string) => Promise<boolean>;
  signOut: () => Promise<void>;

  // Section CRUD (experience, projects, certifications, blog, research,
  // community, talks, honors). Each resolves to true if the write actually
  // succeeded (e.g. blocked by RLS if not signed in, or a network error).
  addItem: (section: SectionKey, item: Omit<ContentItem, "id">) => Promise<boolean>;
  updateItem: (section: SectionKey, id: string, patch: Partial<ContentItem>) => Promise<boolean>;
  deleteItem: (section: SectionKey, id: string) => Promise<boolean>;

  // Singleton content blocks
  updateHero: (patch: Partial<SiteContent["hero"]>) => Promise<boolean>;
  updateAbout: (patch: Partial<SiteContent["about"]>) => Promise<boolean>;
  updateSocial: (patch: Partial<SocialLinks>) => Promise<boolean>;
  updateContact: (patch: Partial<SiteContent["contact"]>) => Promise<boolean>;
  updateStats: (stats: Stat[]) => Promise<boolean>;

  // Utilities
  uploadImage: (file: File) => Promise<string>;
  exportContent: () => void;
  importContent: (file: File) => Promise<void>;
  resetContent: () => Promise<boolean>;
  refresh: () => Promise<void>;
};

const ContentContext = createContext<ContentContextValue | undefined>(
  undefined
);

function makeId() {
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // ---- Load content -------------------------------------------------

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setLoadError(
        "Supabase isn't configured yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see README.md), then restart the dev server."
      );
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const { data, error } = await supabase
        .from(CONTENT_TABLE)
        .select("data")
        .eq("id", 1)
        .single();

      if (error) throw error;
      setContent(data.data as SiteContent);
    } catch (err) {
      console.error("Failed to load content from Supabase:", err);
      setLoadError(
        "Couldn't load content from Supabase. Confirm the site_content table exists and is seeded (see supabase/schema.sql), and that your .env.local keys are correct."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ---- Auth: track the signed-in admin session -----------------------

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
      setAuthLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });
    return !error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // ---- Writes ----------------------------------------------------------
  //
  // Every mutation follows the same shape: apply optimistically to local
  // state so the UI feels instant, persist to Supabase, and roll back to
  // the last known-good state if the write is rejected (most commonly
  // because the admin session has expired and RLS blocks the write).

  const persist = useCallback(
    async (next: SiteContent) => {
      const previous = content;
      setContent(next);
      try {
        const { error } = await supabase
          .from(CONTENT_TABLE)
          .update({ data: next, updated_at: new Date().toISOString() })
          .eq("id", 1);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Failed to save content to Supabase:", err);
        if (previous) setContent(previous);
        return false;
      }
    },
    [content]
  );

  const addItem: ContentContextValue["addItem"] = useCallback(
    async (section, item) => {
      if (!content) return false;
      return persist({
        ...content,
        [section]: [...content[section], { ...item, id: makeId() }],
      });
    },
    [content, persist]
  );

  const updateItem: ContentContextValue["updateItem"] = useCallback(
    async (section, id, patch) => {
      if (!content) return false;
      return persist({
        ...content,
        [section]: content[section].map((it) =>
          it.id === id ? { ...it, ...patch } : it
        ),
      });
    },
    [content, persist]
  );

  const deleteItem: ContentContextValue["deleteItem"] = useCallback(
    async (section, id) => {
      if (!content) return false;
      return persist({
        ...content,
        [section]: content[section].filter((it) => it.id !== id),
      });
    },
    [content, persist]
  );

  const updateHero: ContentContextValue["updateHero"] = useCallback(
    async (patch) => {
      if (!content) return false;
      return persist({ ...content, hero: { ...content.hero, ...patch } });
    },
    [content, persist]
  );

  const updateAbout: ContentContextValue["updateAbout"] = useCallback(
    async (patch) => {
      if (!content) return false;
      return persist({ ...content, about: { ...content.about, ...patch } });
    },
    [content, persist]
  );

  const updateSocial: ContentContextValue["updateSocial"] = useCallback(
    async (patch) => {
      if (!content) return false;
      return persist({ ...content, social: { ...content.social, ...patch } });
    },
    [content, persist]
  );

  const updateContact: ContentContextValue["updateContact"] = useCallback(
    async (patch) => {
      if (!content) return false;
      return persist({
        ...content,
        contact: { ...content.contact, ...patch },
      });
    },
    [content, persist]
  );

  const updateStats: ContentContextValue["updateStats"] = useCallback(
    async (stats) => {
      if (!content) return false;
      return persist({ ...content, stats });
    },
    [content, persist]
  );

  // ---- Image uploads -> Supabase Storage --------------------------------
  //
  // Downsized client-side (keeps the bucket small and uploads fast), then
  // uploaded directly to the `portfolio-media` bucket. Storage policies
  // (see supabase/schema.sql) make the bucket publicly readable but only
  // writable by a signed-in admin, mirroring the database policy above.

  const MAX_DIMENSION = 1600;
  const JPEG_QUALITY = 0.82;

  const uploadImage: ContentContextValue["uploadImage"] = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = async () => {
            try {
              const scale = Math.min(
                1,
                MAX_DIMENSION / Math.max(img.width, img.height)
              );
              const canvas = document.createElement("canvas");
              canvas.width = Math.round(img.width * scale);
              canvas.height = Math.round(img.height * scale);
              const ctx = canvas.getContext("2d");
              if (!ctx) throw new Error("Canvas unsupported");
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

              const blob: Blob = await new Promise((res, rej) =>
                canvas.toBlob(
                  (b) => (b ? res(b) : rej(new Error("Could not encode image"))),
                  "image/jpeg",
                  JPEG_QUALITY
                )
              );

              const path = `uploads/${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}.jpg`;

              const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(path, blob, {
                  contentType: "image/jpeg",
                  upsert: false,
                });
              if (uploadError) throw uploadError;

              const { data } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(path);
              resolve(data.publicUrl);
            } catch (err) {
              reject(err);
            }
          };
          img.onerror = () => reject(new Error("Could not read that image file."));
          img.src = reader.result as string;
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      }),
    []
  );

  // ---- Export / import (backup convenience, unrelated to storage layer) --

  const exportContent: ContentContextValue["exportContent"] = useCallback(() => {
    if (!content) return;
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-content.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  const importContent: ContentContextValue["importContent"] = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const parsed = JSON.parse(reader.result as string) as SiteContent;
            const ok = await persist(parsed);
            if (!ok) throw new Error("Supabase rejected the import — are you signed in?");
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      }),
    [persist]
  );

  const resetContent: ContentContextValue["resetContent"] = useCallback(async () => {
    // Resets the Supabase row back to the JSON seed. Requires being signed
    // in, same as any other write (RLS enforces this).
    return persist(seedContent as SiteContent);
  }, [persist]);

  const value = useMemo(
    () => ({
      content,
      loading,
      loadError,
      isAdmin,
      authLoading,
      signIn,
      signOut,
      addItem,
      updateItem,
      deleteItem,
      updateHero,
      updateAbout,
      updateSocial,
      updateContact,
      updateStats,
      uploadImage,
      exportContent,
      importContent,
      resetContent,
      refresh,
    }),
    [
      content,
      loading,
      loadError,
      isAdmin,
      authLoading,
      signIn,
      signOut,
      addItem,
      updateItem,
      deleteItem,
      updateHero,
      updateAbout,
      updateSocial,
      updateContact,
      updateStats,
      uploadImage,
      exportContent,
      importContent,
      resetContent,
      refresh,
    ]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
