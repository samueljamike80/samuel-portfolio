"use client";

import { SectionPage } from "@/components/section-page";
import { useContent } from "@/lib/content-context";

export default function BlogPage() {
  const { content } = useContent();
  if (!content) return null;
  return (
    <SectionPage
      eyebrow="Writing"
      title="Blog"
      description="Notes on applied ML, tooling, and things I learn the hard way."
      items={content.blog}
      emptyLabel="No posts yet — publish one from /admin."
    />
  );
}
