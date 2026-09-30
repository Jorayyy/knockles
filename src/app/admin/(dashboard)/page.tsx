import Link from "next/link";
import {
  ArrowRight,
  Image as ImageIcon,
  MessageSquare,
  Package,
} from "lucide-react";
import { COLLECTION_SCHEMAS } from "@/app/admin/schema";
import { getStore, storeKind } from "@/lib/db";
import type { CollectionKey, Lead } from "@/lib/content/types";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const COLLECTIONS = Object.keys(COLLECTION_SCHEMAS) as CollectionKey[];

const STATUS_LABELS: Record<Lead["status"], string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  closed: "Closed",
};

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="border border-line bg-ink-800 p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="u-label text-muted-dim">{label}</span>
        <span className="text-muted" aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="u-display mt-4 text-5xl text-flare-soft">{value}</p>
      {hint ? <p className="mt-2 text-xs text-muted-dim">{hint}</p> : null}
    </div>
  );
}

export default async function AdminDashboard() {
  const store = getStore();
  const [leads, itemLists] = await Promise.all([
    store.listLeads(),
    Promise.all(
      COLLECTIONS.map((collection) =>
        store.listItems(collection, { includeUnpublished: true })
      )
    ),
  ]);

  const counts = COLLECTIONS.map((collection, index) => {
    const items = itemLists[index];
    return {
      collection,
      schema: COLLECTION_SCHEMAS[collection],
      total: items.length,
      published: items.filter((item) => item.published).length,
    };
  });

  const publishedTotal = counts.reduce((sum, entry) => sum + entry.published, 0);
  const totalItems = counts.reduce((sum, entry) => sum + entry.total, 0);
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const recent = leads.slice(0, 5);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="u-label text-flare-soft">Dashboard</p>
          <h1 className="u-display mt-3 text-5xl">Knock&apos;ls control room</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Trial requests, content and settings for the whole site. Every save
            publishes instantly to the public pages.
          </p>
        </div>
        <div className="flex gap-3">
          <ButtonLink href="/admin/leads" variant="primary" size="sm">
            <MessageSquare size={14} aria-hidden="true" />
            Review leads
          </ButtonLink>
          <ButtonLink href="/" variant="outline" size="sm" target="_blank">
            View site
            <ArrowRight size={14} aria-hidden="true" />
          </ButtonLink>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total leads"
          value={leads.length}
          hint="All trial requests"
          icon={<MessageSquare size={16} />}
        />
        <StatCard
          label="New leads"
          value={newLeads}
          hint="Waiting for a reply"
          icon={<MessageSquare size={16} />}
        />
        <StatCard
          label="Published items"
          value={`${publishedTotal}/${totalItems}`}
          hint="Across all collections"
          icon={<Package size={16} />}
        />
        <StatCard
          label="Data source"
          value={storeKind() === "postgres" ? "Postgres" : "File"}
          hint={
            storeKind() === "postgres"
              ? "Neon database connected"
              : "Local JSON fallback"
          }
          icon={<ImageIcon size={16} />}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(STATUS_LABELS) as Lead["status"][]).map((status) => (
          <Link
            key={status}
            href="/admin/leads"
            className={cn(
              "border border-line bg-ink-800 px-5 py-4 transition-colors hover:border-flare/60",
              status === "new" && "border-flare/40"
            )}
          >
            <span className="u-label text-muted-dim">
              {STATUS_LABELS[status]}
            </span>
            <p className="u-display mt-2 text-3xl">
              {leads.filter((lead) => lead.status === status).length}
            </p>
          </Link>
        ))}
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="u-label text-flare-soft">Content</p>
            <h2 className="u-display mt-2 text-3xl">What the site shows</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {counts.map((entry) => (
            <Link
              key={entry.collection}
              href={`/admin/content/${entry.collection}`}
              className="group border border-line bg-ink-800 p-5 transition-colors hover:border-flare/60"
            >
              <span className="u-label text-muted-dim">Collection</span>
              <p className="mt-2 font-medium text-chalk group-hover:text-flare-soft">
                {entry.schema.label}
              </p>
              <p className="mt-3 text-sm text-muted">
                {entry.published} published
                {entry.total !== entry.published
                  ? ` · ${entry.total - entry.published} draft`
                  : ""}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="u-label text-flare-soft">Recent activity</p>
            <h2 className="u-display mt-2 text-3xl">Latest leads</h2>
          </div>
          <Link
            href="/admin/leads"
            className="text-sm text-muted underline decoration-flare underline-offset-4 hover:text-chalk"
          >
            View all
          </Link>
        </div>

        <div className="mt-5">
          {recent.length ? (
            <ul className="divide-y divide-line border border-line bg-ink-800">
              {recent.map((lead) => (
                <li
                  key={lead.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-chalk">{lead.name}</p>
                    <p className="mt-1 truncate text-sm text-muted">
                      {lead.phone} · {lead.program || "No program"} ·{" "}
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="u-label border border-line px-2 py-1 text-muted">
                    {STATUS_LABELS[lead.status]}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No leads yet"
              text="Trial requests from the booking forms will show up here."
              action={
                <ButtonLink href="/book" variant="outline" size="sm" target="_blank">
                  Preview the booking form
                </ButtonLink>
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}
