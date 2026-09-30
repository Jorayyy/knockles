import { Clock, MapPin } from "lucide-react";
import { EmptyState } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { BusinessSettings, ScheduleEntry } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function sortSchedule(entries: ScheduleEntry[]) {
  return [...entries].sort((a, b) => {
    const diff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
    if (diff !== 0) return diff;
    return a.time.localeCompare(b.time);
  });
}

export function HoursTable({
  hours,
  light = false,
}: {
  hours: BusinessSettings["hours"];
  light?: boolean;
}) {
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {hours.map((entry) => (
          <tr
            key={entry.day}
            className={cn(
              "border-b last:border-b-0",
              light ? "border-ink/10" : "border-line-soft"
            )}
          >
            <th
              scope="row"
              className={cn(
                "py-3 text-left font-medium",
                light ? "text-ink" : "text-chalk"
              )}
            >
              {entry.day}
            </th>
            <td
              className={cn(
                "py-3 text-right tabular-nums",
                entry.closed
                  ? "text-muted-dim"
                  : light
                    ? "text-ink/70"
                    : "text-muted"
              )}
            >
              {entry.closed
                ? "Closed"
                : `${entry.open} – ${entry.close}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ScheduleTable({ entries }: { entries: ScheduleEntry[] }) {
  const sorted = sortSchedule(entries);

  if (!sorted.length) {
    return (
      <EmptyState
        title="Weekly timetable coming soon"
        text="Class times are confirmed each week. Message the gym on Messenger or call to ask what is running today."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact" variant="primary">
              Ask about this week
            </ButtonLink>
            <ButtonLink href="/first-visit" variant="outline">
              What to expect
            </ButtonLink>
          </div>
        }
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden border border-line md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Weekly training schedule</caption>
          <thead className="bg-ink-700">
            <tr className="u-label text-muted-dim">
              <th scope="col" className="px-5 py-4">
                Day
              </th>
              <th scope="col" className="px-5 py-4">
                Time
              </th>
              <th scope="col" className="px-5 py-4">
                Program
              </th>
              <th scope="col" className="px-5 py-4">
                Coach
              </th>
              <th scope="col" className="px-5 py-4">
                Level
              </th>
              <th scope="col" className="px-5 py-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry, index) => (
              <tr
                key={`${entry.day}-${entry.time}-${index}`}
                className="border-t border-line bg-ink-800 transition-colors hover:bg-ink-700"
              >
                <th scope="row" className="px-5 py-4 font-medium text-chalk">
                  {entry.day}
                </th>
                <td className="px-5 py-4 tabular-nums text-muted">
                  {entry.time}
                </td>
                <td className="px-5 py-4 text-chalk">{entry.program}</td>
                <td className="px-5 py-4 text-muted">
                  {entry.coach || "—"}
                </td>
                <td className="px-5 py-4 text-muted">{entry.level || "—"}</td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "u-label border px-2 py-1",
                      entry.status?.toLowerCase() === "full"
                        ? "border-flare/50 text-flare-soft"
                        : "border-line text-muted"
                    )}
                  >
                    {entry.status || "Open"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {DAY_ORDER.filter((day) =>
          sorted.some((entry) => entry.day === day)
        ).map((day) => (
          <div key={day} className="border border-line bg-ink-800">
            <p className="u-label border-b border-line px-4 py-3 text-flare-soft">
              {day}
            </p>
            <ul>
              {sorted
                .filter((entry) => entry.day === day)
                .map((entry, index) => (
                  <li
                    key={`${entry.time}-${index}`}
                    className="flex items-start justify-between gap-4 border-b border-line-soft px-4 py-3 last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-chalk">
                        {entry.program}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {entry.time}
                        {entry.coach ? ` · ${entry.coach}` : ""}
                        {entry.level ? ` · ${entry.level}` : ""}
                      </p>
                    </div>
                    <span className="u-label shrink-0 text-muted-dim">
                      {entry.status || "Open"}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export function HoursCard({
  hours,
  note,
}: {
  hours: BusinessSettings["hours"];
  note?: string;
}) {
  return (
    <div className="border border-line bg-ink-800 p-6 sm:p-7">
      <div className="flex items-center gap-3">
        <Clock size={16} className="text-flare-soft" aria-hidden="true" />
        <p className="u-label text-muted">Opening hours</p>
      </div>
      <div className="mt-4">
        <HoursTable hours={hours} />
      </div>
      {note ? (
        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-dim">
          <MapPin size={13} className="mt-0.5 shrink-0 text-flare-soft" aria-hidden="true" />
          {note}
        </p>
      ) : null}
    </div>
  );
}
