import { getStore } from "@/lib/db";

interface MediaParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: MediaParams) {
  const { id } = await params;
  if (!/^[A-Za-z0-9-]{1,64}$/.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const asset = await getStore().getMedia(id);
  if (!asset) {
    return new Response("Not found", { status: 404 });
  }

  const bytes = Buffer.from(asset.data, "base64");
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": asset.mime,
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${asset.name}"`,
    },
  });
}
