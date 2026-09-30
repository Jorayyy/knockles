"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, ImagePlus, LoaderCircle, Trash } from "lucide-react";
import { deleteMediaAction } from "@/app/admin/actions";

interface MediaAssetView {
  id: string;
  name: string;
  mime: string;
  bytes: number;
  createdAt: string;
}

export function MediaUploader() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");

  async function upload(file: File) {
    setStatus("uploading");
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body,
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        src?: string;
        error?: string;
      };
      if (!response.ok || !payload.src) {
        throw new Error(payload.error || "Upload failed.");
      }
      setStatus("idle");
      router.refresh();
    } catch (uploadError) {
      setStatus("error");
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed."
      );
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <label className="inline-flex cursor-pointer items-center gap-2 border border-flare/50 bg-flare/10 px-5 py-3 text-sm font-medium text-flare-soft transition-colors hover:bg-flare/20">
        {status === "uploading" ? (
          <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <ImagePlus size={16} aria-hidden="true" />
        )}
        {status === "uploading" ? "Uploading…" : "Upload image"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
          className="sr-only"
          disabled={status === "uploading"}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }}
        />
      </label>
      <p className="text-xs text-muted-dim">
        PNG, JPG, WebP or GIF · max 4 MB · stored in the database
      </p>
      {error ? (
        <p className="text-xs font-medium text-flare-soft" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaCard({ asset }: { asset: MediaAssetView }) {
  const [copied, setCopied] = useState(false);
  const path = `/api/media/${asset.id}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="border border-line bg-ink-800">
      <div className="relative h-40 w-full overflow-hidden border-b border-line bg-ink-700">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={path} alt={asset.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <p className="truncate text-sm font-medium text-chalk">{asset.name}</p>
        <p className="mt-1 text-xs text-muted-dim">
          {formatBytes(asset.bytes)} · {asset.mime} ·{" "}
          {new Date(asset.createdAt).toLocaleDateString()}
        </p>
        <p className="mt-2 truncate font-mono text-xs text-muted">{path}</p>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs text-muted transition-colors hover:border-flare/60 hover:text-chalk"
          >
            <Copy size={13} aria-hidden="true" />
            {copied ? "Copied" : "Copy path"}
          </button>
          <form
            action={deleteMediaAction.bind(null, asset.id)}
            onSubmit={(event) => {
              if (!window.confirm("Delete this image?")) event.preventDefault();
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs text-muted transition-colors hover:border-flare/60 hover:text-chalk"
            >
              <Trash size={13} aria-hidden="true" />
              Delete
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
