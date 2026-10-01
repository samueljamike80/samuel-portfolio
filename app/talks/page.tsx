"use client";

import { SectionPage } from "@/components/section-page";
import { useContent } from "@/lib/content-context";

export default function TalksPage() {
  const { content } = useContent();
  if (!content) return null;
  return (
    <SectionPage
      eyebrow="Speaking"
      title="Talks"
      description="Conference talks, meetups, and workshops."
      items={content.talks}
      emptyLabel="No talks yet — add one from /admin."
    />
  );
}
