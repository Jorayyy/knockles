"use client";

import { useActionState, useState } from "react";
import {
  ChevronDown,
  Eye,
  EyeOff,
  LoaderCircle,
  Plus,
  Trash,
} from "lucide-react";
import {
  createItemAction,
  deleteItemAction,
  togglePublishAction,
  updateItemAction,
  type ActionState,
} from "@/app/admin/actions";
import type { CollectionSchema } from "@/app/admin/schema";
import type { CollectionKey, StoredItem } from "@/lib/content/types";
import { SchemaFields } from "@/components/admin/fields";
import { FormMessage } from "@/components/admin/form-message";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const IDLE: ActionState = { ok: false };

function CreateForm({
  collection,
  schema,
}: {
  collection: CollectionKey;
  schema: CollectionSchema;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createItemAction.bind(null, collection),
    IDLE
  );

  if (!open) {
    return (
      <Button type="button" variant="primary" onClick={() => setOpen(true)}>
        <Plus size={15} aria-hidden="true" />
        Add {schema.singular}
      </Button>
    );
  }

  return (
    <form action={formAction} className="border border-flare/40 bg-ink-800 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="u-display text-2xl">New {schema.singular}</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-muted underline underline-offset-4 hover:text-chalk"
        >
          Cancel
        </button>
      </div>
      <div className="mt-6">
        <SchemaFields fields={schema.fields} idPrefix="create" />
      </div>
      <FormMessage state={state} />
      <div className="mt-6 flex gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? (
            <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <Plus size={15} aria-hidden="true" />
          )}
          Add {schema.singular}
        </Button>
      </div>
    </form>
  );
}

function ItemEditor({
  collection,
  schema,
  item,
}: {
  collection: CollectionKey;
  schema: CollectionSchema;
  item: StoredItem<Record<string, unknown>>;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateItemAction.bind(null, collection, item.id),
    IDLE
  );

  const title =
    String(item.data[schema.titleField] ?? "").trim() ||
    `Untitled ${schema.singular}`;

  return (
    <article className="border border-line bg-ink-800">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex items-center gap-3 text-left"
            aria-expanded={open}
          >
            <ChevronDown
              size={16}
              className={cn(
                "shrink-0 text-muted transition-transform",
                open && "rotate-180"
              )}
              aria-hidden="true"
            />
            <span className="font-medium text-chalk">{title}</span>
          </button>
          <span
            className={cn(
              "u-label border px-2 py-1",
              item.published
                ? "border-flare/50 text-flare-soft"
                : "border-line text-muted-dim"
            )}
          >
            {item.published ? "Published" : "Draft"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <form
            action={togglePublishAction.bind(
              null,
              collection,
              item.id,
              !item.published
            )}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs text-muted transition-colors hover:border-flare/60 hover:text-chalk"
            >
              {item.published ? (
                <EyeOff size={14} aria-hidden="true" />
              ) : (
                <Eye size={14} aria-hidden="true" />
              )}
              {item.published ? "Unpublish" : "Publish"}
            </button>
          </form>
          <form
            action={deleteItemAction.bind(null, collection, item.id)}
            onSubmit={(event) => {
              if (!window.confirm(`Delete this ${schema.singular}?`)) {
                event.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs text-muted transition-colors hover:border-flare/60 hover:text-chalk"
            >
              <Trash size={14} aria-hidden="true" />
              Delete
            </button>
          </form>
        </div>
      </div>

      {open ? (
        <form action={formAction} className="border-t border-line p-5 sm:p-6">
          <SchemaFields
            fields={schema.fields}
            values={item.data}
            idPrefix={`item-${item.id}`}
          />

          <label className="mt-5 flex items-center justify-between gap-4 border border-line bg-ink-700 px-4 py-3.5">
            <span className="text-sm text-chalk">Published</span>
            <input
              type="checkbox"
              name="_published"
              defaultChecked={item.published}
              className="h-4 w-4 accent-[#e02b1d]"
            />
          </label>

          <FormMessage state={state} />

          <div className="mt-6 flex items-center gap-3">
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? (
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : null}
              Save changes
            </Button>
            <span className="text-xs text-muted-dim">
              Updated {new Date(item.updatedAt).toLocaleString()}
            </span>
          </div>
        </form>
      ) : null}
    </article>
  );
}

export function CollectionManager({
  collection,
  schema,
  items,
}: {
  collection: CollectionKey;
  schema: CollectionSchema;
  items: StoredItem<Record<string, unknown>>[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <CreateForm collection={collection} schema={schema} />

      {items.length ? (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <ItemEditor
              key={item.id}
              collection={collection}
              schema={schema}
              item={item}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${schema.label.toLowerCase()} yet`}
          text={schema.description}
        />
      )}
    </div>
  );
}
