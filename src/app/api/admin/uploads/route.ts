import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getStore } from "@/lib/db";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
];

function sanitizeName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "image";
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "image";
}

export async function POST(request: Request) {
  const jar = await cookies();
  if (!verifySessionToken(jar.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PNG, JPG, WebP, AVIF or GIF." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 4 MB." },
      { status: 413 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await getStore().saveMedia({
      name: sanitizeName(file.name),
      mime: file.type,
      data: buffer.toString("base64"),
    });
    const src = `/api/media/${asset.id}`;
    const target = String(form.get("target") ?? "gallery");

    if (target === "gallery") {
      const title =
        asset.name
          .replace(/\.[^.]+$/, "")
          .replace(/[_-]+/g, " ")
          .trim() || "Photo";
      await getStore().createItem(
        "gallery",
        { title, category: "Uploads", src, alt: title },
        true
      );
      revalidatePath("/", "layout");
    }

    return NextResponse.json({ ok: true, src });
  } catch (error) {
    const hint =
      error && typeof error === "object" && "hint" in error
        ? String((error as { hint: string }).hint)
        : "Upload failed.";
    return NextResponse.json({ error: hint }, { status: 500 });
  }
}
