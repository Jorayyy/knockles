"use client";

import type { FieldDef } from "@/app/admin/schema";
import { MediaInput } from "@/components/admin/media-input";
import { FieldLabel, Select, TextArea, TextInput } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const HOUR_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface HoursRow {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

function HoursEditor({ value }: { value: HoursRow[] | undefined }) {
  return (
    <div className="flex flex-col gap-3">
      {HOUR_DAYS.map((day, index) => {
        const row = value?.[index];
        const dayName = row?.day ?? day;
        const closed = row?.closed ?? false;
        return (
          <div
            key={day}
            className={cn(
              "grid grid-cols-[1fr] gap-3 border border-line bg-ink-700 p-4 sm:grid-cols-[7rem_1fr_1fr_auto] sm:items-center",
              closed && "opacity-70"
            )}
          >
            <div>
              <span className="u-label text-muted">{dayName}</span>
              <input type="hidden" name={`hours.${index}.day`} value={dayName} />
            </div>
            <TextInput
              id={`hours-${index}-open`}
              name={`hours.${index}.open`}
              defaultValue={row?.open ?? ""}
              placeholder="1:00 PM"
              aria-label={`${dayName} opening time`}
            />
            <TextInput
              id={`hours-${index}-close`}
              name={`hours.${index}.close`}
              defaultValue={row?.close ?? ""}
              placeholder="8:15 PM"
              aria-label={`${dayName} closing time`}
            />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                name={`hours.${index}.closed`}
                defaultChecked={closed}
                className="h-4 w-4 accent-[#e02b1d]"
              />
              Closed
            </label>
          </div>
        );
      })}
    </div>
  );
}

function SchemaField({
  field,
  id,
  value,
}: {
  field: FieldDef;
  id: string;
  value: unknown;
}) {
  if (field.type === "hours") {
    return (
      <div className="flex flex-col gap-3">
        <FieldLabel hint={field.hint}>{field.label}</FieldLabel>
        <HoursEditor value={value as HoursRow[] | undefined} />
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <MediaInput
        id={id}
        name={field.name}
        label={field.label}
        value={typeof value === "string" ? value : ""}
        hint={field.hint}
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <label
        htmlFor={id}
        className="flex items-center justify-between gap-4 border border-line bg-ink-700 px-4 py-3.5"
      >
        <span className="text-sm text-chalk">{field.label}</span>
        <input
          id={id}
          name={field.name}
          type="checkbox"
          defaultChecked={Boolean(value)}
          className="h-4 w-4 accent-[#e02b1d]"
        />
      </label>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={id} hint={field.hint}>
        {field.label}
      </FieldLabel>
      {field.type === "textarea" ? (
        <TextArea
          id={id}
          name={field.name}
          rows={field.rows ?? 4}
          required={field.required}
          defaultValue={typeof value === "string" ? value : ""}
          placeholder={field.hint}
        />
      ) : field.type === "select" ? (
        <Select
          id={id}
          name={field.name}
          defaultValue={
            typeof value === "string" && value
              ? value
              : (field.options?.[0] ?? "")
          }
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ) : (
        <TextInput
          id={id}
          name={field.name}
          type={
            field.type === "number"
              ? "number"
              : field.type === "email"
                ? "email"
                : field.type === "url"
                  ? "url"
                  : field.type === "date"
                    ? "date"
                    : "text"
          }
          required={field.required}
          defaultValue={typeof value === "string" ? value : ""}
          placeholder={field.hint}
          min={field.min}
          max={field.max}
        />
      )}
    </div>
  );
}

export function SchemaFields({
  fields,
  values,
  idPrefix = "field",
}: {
  fields: FieldDef[];
  values?: Record<string, unknown>;
  idPrefix?: string;
}) {
  return (
    <div className="grid gap-5">
      {fields.map((field) => (
        <SchemaField
          key={field.name}
          field={field}
          id={`${idPrefix}-${field.name}`}
          value={values?.[field.name]}
        />
      ))}
    </div>
  );
}
