"use client";

import { SectionPage } from "@/components/section-page";
import { useContent } from "@/lib/content-context";

export default function HonorsPage() {
  const { content } = useContent();
  if (!content) return null;
  return (
    <SectionPage
      eyebrow="Recognition"
      title="Honors & Awards"
      description="Awards and recognitions along the way."
      items={content.honors}
      emptyLabel="No honors yet — add one from /admin."
    />
  );
}
