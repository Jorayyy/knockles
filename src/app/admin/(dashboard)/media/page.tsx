import type { Metadata } from "next";
import { getStore } from "@/lib/db";
import { MediaCard, MediaUploader } from "@/components/admin/media-library";
import { EmptyState } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Media — Admin",
  robots: { index: false, follow: false },
};

export default async function MediaPage() {
  const assets = await getStore().listMedia();
  const views = assets.map((asset) => ({
    id: asset.id,
    name: asset.name,
    mime: asset.mime,
    bytes: Math.floor((asset.data.length * 3) / 4),
    createdAt: asset.createdAt,
  }));

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="u-label text-flare-soft">Media</p>
        <h1 className="u-display mt-3 text-5xl">Image library</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Upload photos here and they appear on the{" "}
          <span className="text-chalk">gallery page</span> straight away (edit or
          remove them under Content → Gallery). Inside content forms, use{" "}
          <span className="text-chalk">Choose from library</span> to reuse any of
          these images — no typing needed.
        </p>
      </header>

      <MediaUploader />

      {views.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {views.map((asset) => (
            <MediaCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No images uploaded"
          text="Upload photos of the gym floor, classes and coaches to use them across the site."
        />
      )}
    </div>
  );
}
