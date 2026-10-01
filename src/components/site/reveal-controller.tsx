"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function revealAll() {
  document
    .querySelectorAll<HTMLElement>("[data-reveal]")
    .forEach((node) => node.setAttribute("data-visible", "true"));
}

export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    let observer: IntersectionObserver | null = null;
    let mutation: MutationObserver | null = null;

    const watch = (nodes: HTMLElement[]) => {
      if (!observer) return;
      for (const node of nodes) {
        if (node.getAttribute("data-visible") !== "true") {
          observer.observe(node);
        }
      }
    };

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    watch(Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")));

    mutation = new MutationObserver((records) => {
      const added: HTMLElement[] = [];
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.hasAttribute("data-reveal")) added.push(node);
          added.push(
            ...Array.from(node.querySelectorAll<HTMLElement>("[data-reveal]"))
          );
        }
      }
      watch(added);
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutation?.disconnect();
      observer = null;
      mutation = null;
    };
  }, [pathname]);

  return null;
}
