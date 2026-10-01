"use client";

import { Github, Instagram, Linkedin, Link as LinkIcon, Mail, Twitter } from "lucide-react";
import { useContent } from "@/lib/content-context";
import type { SocialLinks } from "@/lib/types";

const SOCIAL_ICONS: { key: keyof SocialLinks; label: string; Icon: typeof Github }[] = [
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "github", label: "GitHub", Icon: Github },
  { key: "twitter", label: "Twitter / X", Icon: Twitter },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "mail", label: "Email", Icon: Mail },
  { key: "linktree", label: "Linktree", Icon: LinkIcon },
];

export function Footer() {
  const { content } = useContent();
  if (!content) return null;

  return (
    <footer className="border-t border-border-light dark:border-border-dark">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-between">
        <p className="text-sm text-ink/60 dark:text-paper/60">
          © 2026 Samuel Charles. All rights reserved.
        </p>

        <div className="flex items-center gap-2">
          {SOCIAL_ICONS.map(({ key, label, Icon }) => {
            const url = content.social[key];
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target={key === "mail" ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border-light dark:border-border-dark text-ink/70 dark:text-paper/70 transition hover:border-signal-500 hover:text-signal-500"
              >
                <Icon size={17} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
