"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NavLink } from "@/content/site";

/** A desktop menu item that opens a list of links on hover or click. */
export function NavDropdown({ label, links }: { label: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking anywhere else on the page.
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        // Pointing at the button already opened it, so a mouse click or tap keeps it open; the keyboard
        // (Enter or Space, where detail is 0) toggles it.
        onClick={(e) => setOpen((o) => (e.detail === 0 ? !o : true))}
        className="flex items-center gap-1 text-muted hover:text-foreground"
      >
        {label}
        <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        // The top padding keeps the list open while the pointer moves down onto it.
        <div className="absolute left-1/2 top-full z-20 -translate-x-1/2 pt-3">
          <div className="flex w-64 flex-col rounded-lg border border-border bg-surface p-2 shadow-lg">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded px-3 py-2 hover:bg-background">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
