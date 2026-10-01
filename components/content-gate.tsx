"use client";

import { Database, Loader2 } from "lucide-react";
import { useContent } from "@/lib/content-context";
import type { ReactNode } from "react";

/**
 * Wraps the whole app so nothing renders until content has actually loaded
 * from Supabase. Every component under this gate can assume `content` from
 * useContent() is non-null.
 */
export function ContentGate({ children }: { children: ReactNode }) {
  const { loading, loadError, content } = useContent();

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <Database className="text-red-500" size={28} />
        <p className="max-w-md text-sm text-ink/70 dark:text-paper/70">
          {loadError}
        </p>
      </div>
    );
  }

  if (loading || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-signal-500" size={28} />
      </div>
    );
  }

  return <>{children}</>;
}
