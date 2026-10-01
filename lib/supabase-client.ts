"use client";

/**
 * Single shared Supabase client for the browser.
 *
 * Uses the public anon key, which is safe to expose client-side — it can
 * only do what the database's Row Level Security (RLS) policies allow (see
 * supabase/schema.sql). Public visitors can read; only a signed-in admin
 * user can write. Nothing here is a secret.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Falls back to placeholder strings so the client can still be constructed
// (and the app can render a clear setup error) even before .env.local is
// filled in — createClient() throws immediately on an empty URL.
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

// The one admin account this site expects. Only its email matters here —
// there is no password stored in the app anywhere. The actual credential
// check happens on Supabase's servers via supabase.auth.signInWithPassword.
export const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@example.com";

export const CONTENT_TABLE = "site_content";
export const STORAGE_BUCKET = "portfolio-media";
