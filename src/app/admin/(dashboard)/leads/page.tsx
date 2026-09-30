import { getStore } from "@/lib/db";
import type { Lead } from "@/lib/content/types";
import { LeadRow } from "@/components/admin/lead-row";
import { EmptyState } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

const STATUS_LABELS: Record<Lead["status"], string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  closed: "Closed",
};

export default async function LeadsPage() {
  const leads = await getStore().listLeads();
  const counts = (Object.keys(STATUS_LABELS) as Lead["status"][]).map(
    (status) => ({
      status,
      label: STATUS_LABELS[status],
      count: leads.filter((lead) => lead.status === status).length,
    })
  );

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="u-label text-flare-soft">Leads</p>
        <h1 className="u-display mt-3 text-5xl">Trial requests</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Every message sent through the booking and contact forms. Update the
          status as you work through them — nothing here is emailed
          automatically.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {counts.map((entry) => (
          <div
            key={entry.status}
            className="border border-line bg-ink-800 px-5 py-4"
          >
            <span className="u-label text-muted-dim">{entry.label}</span>
            <p className="u-display mt-2 text-3xl">{entry.count}</p>
          </div>
        ))}
      </section>

      {leads.length ? (
        <div className="flex flex-col gap-4">
          {leads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No trial requests yet"
          text="When someone submits the booking form on the site, their details land here instantly."
          action={
            <ButtonLink href="/book" variant="outline" size="sm" target="_blank">
              Open the booking page
            </ButtonLink>
          }
        />
      )}
    </div>
  );
}
