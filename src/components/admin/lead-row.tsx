"use client";

import { useTransition } from "react";
import { Trash } from "lucide-react";
import { deleteLeadAction, updateLeadStatusAction } from "@/app/admin/actions";
import type { Lead } from "@/lib/content/types";
import { Select } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: Lead["status"]; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  { value: "closed", label: "Closed" },
];

export function LeadRow({ lead }: { lead: Lead }) {
  const [pending, startTransition] = useTransition();

  return (
    <article className="border border-line bg-ink-800 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-medium text-chalk">{lead.name}</h2>
            <span
              className={cn(
                "u-label border px-2 py-1",
                lead.status === "new"
                  ? "border-flare/50 text-flare-soft"
                  : "border-line text-muted"
              )}
            >
              {STATUS_OPTIONS.find((option) => option.value === lead.status)
                ?.label ?? lead.status}
            </span>
            <span className="u-label border border-line px-2 py-1 text-muted-dim">
              {lead.source || "website"}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            <a
              href={`tel:${lead.phone.replace(/\s+/g, "")}`}
              className="underline decoration-flare/60 underline-offset-4 hover:text-chalk"
            >
              {lead.phone}
            </a>
            {lead.email ? (
              <a
                href={`mailto:${lead.email}`}
                className="underline decoration-flare/60 underline-offset-4 hover:text-chalk"
              >
                {lead.email}
              </a>
            ) : null}
            <span>
              {lead.program || "No program"} · {lead.level || "No level"}
            </span>
            <span>{new Date(lead.createdAt).toLocaleString()}</span>
          </div>

          {lead.preferred || lead.message ? (
            <div className="mt-3 space-y-1 text-sm leading-relaxed text-chalk/85">
              {lead.preferred ? (
                <p>
                  <span className="u-label text-muted-dim">Preferred:</span>{" "}
                  {lead.preferred}
                </p>
              ) : null}
              {lead.message ? <p>{lead.message}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Select
            aria-label={`Status for ${lead.name}`}
            value={lead.status}
            disabled={pending}
            onChange={(event) => {
              const status = event.target.value as Lead["status"];
              startTransition(() => updateLeadStatusAction(lead.id, status));
            }}
            className="w-40"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <form
            action={deleteLeadAction.bind(null, lead.id)}
            onSubmit={(event) => {
              if (!window.confirm("Delete this lead?")) event.preventDefault();
            }}
          >
            <button
              type="submit"
              aria-label={`Delete lead from ${lead.name}`}
              className="flex h-[46px] w-[46px] items-center justify-center border border-line text-muted transition-colors hover:border-flare/60 hover:text-chalk"
            >
              <Trash size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
