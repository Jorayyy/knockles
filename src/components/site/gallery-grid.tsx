"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/content/types";
import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const image of images) {
      if (image.category?.trim()) set.add(image.category.trim());
    }
    return ["All", ...Array.from(set)];
  }, [images]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visible = useMemo(
    () =>
      activeCategory === "All"
        ? images
        : images.filter(
            (image) => (image.category || "").trim() === activeCategory
          ),
    [images, activeCategory]
  );

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) =>
          index === null ? index : (index + 1) % visible.length
        );
        return;
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          index === null
            ? index
            : (index - 1 + visible.length) % visible.length
        );
        return;
      }
      if (event.key !== "Tab") return;

      const panel = dialogRef.current;
      const focusables = panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
        : [];
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [activeIndex, visible.length, close]);

  return (
    <div>
      {categories.length > 1 ? (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter gallery by category"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "u-label min-h-11 border px-4 py-2.5 transition-colors",
                activeCategory === category
                  ? "border-flare bg-flare text-white"
                  : "border-line text-muted hover:border-chalk hover:text-chalk"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {visible.map((image, index) => {
          const lead = index === 0 && visible.length > 2;
          return (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActiveIndex(index);
              }}
              data-track="gallery_open"
              aria-label={`View photo: ${image.alt || image.title || index + 1}`}
              className={cn(
                "group relative block w-full overflow-hidden border border-line bg-ink-800 text-left",
                lead
                  ? "col-span-2 aspect-[16/9] lg:col-span-3"
                  : "aspect-[4/3]"
              )}
            >
              <MediaImage
                src={image.src}
                alt={image.alt || image.title || "Gym photo"}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="u-display text-lg text-chalk">
                  {image.title || image.category}
                </span>
                <span className="u-label text-flare-soft">View</span>
              </span>
            </button>
          );
        })}
      </div>

      {activeIndex !== null && visible[activeIndex] ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
          className="fixed inset-0 z-50 flex flex-col bg-ink/97 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
            <p className="u-label text-muted">
              <span aria-hidden="true">
                {activeIndex + 1} / {visible.length}
              </span>
              <span className="sr-only">
                Photo {activeIndex + 1} of {visible.length}
              </span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="inline-flex h-11 w-11 items-center justify-center border border-line text-chalk transition-colors hover:border-chalk"
            >
              <span className="sr-only">Close preview</span>
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center p-4 sm:p-8">
            <MediaImage
              src={visible[activeIndex].src}
              alt={
                visible[activeIndex].alt ||
                visible[activeIndex].title ||
                "Gym photo"
              }
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (activeIndex - 1 + visible.length) % visible.length
                )
              }
              className="inline-flex min-h-11 items-center gap-2 border border-line px-4 py-2.5 text-sm text-chalk transition-colors hover:border-chalk"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Prev
            </button>
            <p className="u-display truncate text-lg text-chalk">
              {visible[activeIndex].title || visible[activeIndex].category}
            </p>
            <button
              type="button"
              onClick={() => setActiveIndex((activeIndex + 1) % visible.length)}
              className="inline-flex min-h-11 items-center gap-2 border border-line px-4 py-2.5 text-sm text-chalk transition-colors hover:border-chalk"
            >
              Next
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
