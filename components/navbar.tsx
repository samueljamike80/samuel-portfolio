"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { NAV_ITEMS } from "@/lib/nav";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border-light dark:border-border-dark bg-paper/80 dark:bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Samuel<span className="text-signal-500">.</span>Charles
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full border border-border-light dark:border-border-dark text-ink dark:text-paper transition hover:border-signal-500 hover:text-signal-500"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 items-center gap-2 rounded-full border border-border-light dark:border-border-dark px-4 text-sm font-medium transition hover:border-signal-500 hover:text-signal-500"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
              Menu
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark shadow-xl shadow-black/5 animate-fade-up"
              >
                {NAV_ITEMS.map((item, i) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className={`flex items-center justify-between px-4 py-3 text-sm font-medium tracking-wide transition hover:bg-signal-50 dark:hover:bg-signal-700/10 hover:text-signal-600 dark:hover:text-signal-400 ${
                        active
                          ? "text-signal-600 dark:text-signal-400"
                          : "text-ink/80 dark:text-paper/80"
                      } ${
                        i !== NAV_ITEMS.length - 1
                          ? "border-b border-border-light/60 dark:border-border-dark/60"
                          : ""
                      }`}
                    >
                      {item.label.toUpperCase()}
                      <span className="font-mono text-[10px] text-ink/30 dark:text-paper/30">
                        0{i + 1}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
