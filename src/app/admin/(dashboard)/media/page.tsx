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
          Upload photos once, then use their path in coach profiles and the
          gallery. Images are stored in the database and served from{" "}
          <span className="font-mono text-muted">/api/media/&lt;id&gt;</span>.
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
