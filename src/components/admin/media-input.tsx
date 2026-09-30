"use client";

import { useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { FieldLabel } from "@/components/ui/field";

interface MediaInputProps {
  id: string;
  name: string;
  label: string;
  value?: string;
  hint?: string;
}

export function MediaInput({
  id,
  name,
  label,
  value = "",
  hint,
}: MediaInputProps) {
  const [src, setSrc] = useState(value);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "error"
  >("idle");
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
      setSrc(payload.src);
      setStatus("idle");
    } catch (uploadError) {
      setStatus("error");
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed."
      );
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={id} hint={hint}>
        {label}
      </FieldLabel>
      <input type="hidden" id={id} name={name} value={src} />

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={`${id}-file`}
          className="inline-flex cursor-pointer items-center gap-2 border border-line bg-ink-700 px-4 py-2.5 text-sm text-chalk transition-colors hover:border-flare/60 focus-within:border-flare"
        >
          {status === "uploading" ? (
            <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus size={15} aria-hidden="true" />
          )}
          {status === "uploading" ? "Uploading…" : "Upload image"}
          <input
            id={`${id}-file`}
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

        {src ? (
          <button
            type="button"
            onClick={() => setSrc("")}
            className="inline-flex items-center gap-2 border border-line px-3 py-2.5 text-sm text-muted transition-colors hover:border-flare/60 hover:text-chalk"
          >
            <X size={14} aria-hidden="true" />
            Remove
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs font-medium text-flare-soft" role="alert">
          {error}
        </p>
      ) : null}

      {src ? (
        <div className="relative mt-1 h-32 w-full max-w-xs overflow-hidden border border-line bg-ink-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}
