import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COLLECTION_SCHEMAS } from "@/app/admin/schema";
import { getAllItems } from "@/lib/content/access";
import type { CollectionKey } from "@/lib/content/types";
import { CollectionManager } from "@/components/admin/collection-manager";

interface PageParams {
  params: Promise<{ section: string }>;
}

function resolve(section: string): CollectionKey | null {
  return section in COLLECTION_SCHEMAS ? (section as CollectionKey) : null;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { section } = await params;
  const key = resolve(section);
  const schema = key ? COLLECTION_SCHEMAS[key] : null;
  return {
    title: schema
      ? `${schema.label} — Admin`
      : "Content — Admin",
    robots: { index: false, follow: false },
  };
}

export default async function ContentSectionPage({ params }: PageParams) {
  const { section } = await params;
  const key = resolve(section);
  if (!key) notFound();

  const schema = COLLECTION_SCHEMAS[key];
  const items = await getAllItems<Record<string, unknown>>(key);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="u-label text-flare-soft">Content</p>
        <h1 className="u-display mt-3 text-5xl">{schema.label}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {schema.description} Edits go live on the public site as soon as you
          save them.
        </p>
      </header>

      <CollectionManager collection={key} schema={schema} items={items} />
    </div>
  );
}
