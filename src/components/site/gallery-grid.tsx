"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/content/types";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") {
        setActiveIndex((index) =>
          index === null ? index : (index + 1) % visible.length
        );
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          index === null
            ? index
            : (index - 1 + visible.length) % visible.length
        );
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [activeIndex, visible.length]);

  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeIndex !== null) closeRef.current?.focus();
  }, [activeIndex]);

  return (
    <div>
      {categories.length > 1 ? (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "u-label border px-4 py-2.5 transition-colors",
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

      <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {visible.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            data-track="gallery_open"
            className="group relative block w-full break-inside-avoid overflow-hidden border border-line bg-ink-800 text-left"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={image.src}
                alt={image.alt || image.title || "Gym photo"}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="u-display text-lg text-chalk">
                {image.title || image.category}
              </span>
              <span className="u-label text-flare-soft">View</span>
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && visible[activeIndex] ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
          className="fixed inset-0 z-50 flex flex-col bg-ink/97 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
            <p className="u-label text-muted">
              {activeIndex + 1} / {visible.length}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setActiveIndex(null)}
              className="inline-flex h-10 w-10 items-center justify-center border border-line text-chalk transition-colors hover:border-chalk"
            >
              <span className="sr-only">Close preview</span>
              <X size={18} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center p-4 sm:p-8">
            <Image
              src={visible[activeIndex].src}
              alt={visible[activeIndex].alt || visible[activeIndex].title || "Gym photo"}
              fill
              sizes="100vw"
              className="object-contain"
              priority
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
              className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-sm text-chalk transition-colors hover:border-chalk"
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
              className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-sm text-chalk transition-colors hover:border-chalk"
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
