"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    trackEvent?: (name: string, payload?: Record<string, unknown>) => void;
  }
}

function push(name: string, payload: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
}

export function track(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  push(name, payload);
  window.gtag?.("event", name, payload);
}

export function Analytics() {
  const pathname = usePathname();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-track]"
      );
      if (!target) return;
      const name = target.dataset.track;
      if (!name) return;
      push(name, {
        label: target.dataset.trackLabel ?? undefined,
        href: target.getAttribute("href") ?? undefined,
      });
    };
    document.addEventListener("click", handler);
    window.trackEvent = track;
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    push("page_view", { page_path: pathname });
    window.gtag?.("event", "page_view", { page_path: pathname });
  }, [pathname]);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
      </Script>
    </>
  );
}
