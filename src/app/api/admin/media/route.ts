import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getStore } from "@/lib/db";

export async function GET() {
  const jar = await cookies();
  if (!verifySessionToken(jar.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const assets = await getStore().listMedia();
    return NextResponse.json({
      items: assets.map((asset) => ({
        id: asset.id,
        name: asset.name,
        src: `/api/media/${asset.id}`,
        mime: asset.mime,
        createdAt: asset.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
