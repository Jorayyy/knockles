"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { MOBILE_NAV } from "@/lib/site";
import { Wordmark } from "./wordmark";

export function MobileNav({
  wordmark,
  messenger,
  phone,
  phoneDisplay,
  trialLabel,
}: {
  wordmark: string;
  messenger: string;
  phone: string;
  phoneDisplay: string;
  trialLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        data-track={open ? "nav_close" : "nav_open"}
        className="inline-flex h-11 w-11 items-center justify-center border border-line text-chalk transition-colors hover:border-chalk"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-0 z-50 flex flex-col bg-ink"
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-5 md:h-20">
            <Wordmark wordmark={wordmark} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center border border-line text-chalk"
            >
              <span className="sr-only">Close menu</span>
              <X size={20} />
            </button>
          </div>

          <nav
            className="flex-1 overflow-y-auto px-5 py-6"
            aria-label="Mobile navigation"
          >
            <ul className="grid gap-1">
              {MOBILE_NAV.map((item, index) => (
                <li key={item.href} className="border-b border-line-soft">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    data-track={`nav_${item.label.toLowerCase().replace(/\s+/g, "_")}`}
                    className="flex items-baseline gap-4 py-3.5 transition-colors hover:text-flare-soft"
                  >
                    <span className="u-label w-6 text-muted-dim">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="u-display text-2xl">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid grid-cols-2 gap-3 border-t border-line p-5">
            <ButtonLink
              href={`tel:${phone}`}
              variant="outline"
              size="md"
              data-track="cta_phone"
              className="col-span-1"
            >
              <Phone size={15} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Call</span>
            </ButtonLink>
            <ButtonLink
              href={messenger}
              variant="outline"
              size="md"
              data-track="cta_messenger"
            >
              <MessageCircle size={15} aria-hidden="true" />
              Message
            </ButtonLink>
            <ButtonLink
              href="/book"
              variant="primary"
              size="md"
              data-track="cta_trial"
              className="col-span-2"
            >
              {trialLabel}
            </ButtonLink>
            <p className="col-span-2 text-center text-xs text-muted-dim">
              {phoneDisplay}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
