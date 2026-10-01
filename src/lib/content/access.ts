import { cache } from "react";
import { getStore } from "@/lib/db";
import type {
  CollectionKey,
  SettingsKey,
  SiteSettings,
  StoredItem,
} from "./types";

export const getSettings = cache(async (): Promise<SiteSettings> => {
  return getStore().getSettings();
});

export const getSetting = cache(
  async <K extends SettingsKey>(key: K): Promise<SiteSettings[K]> => {
    const settings = await getSettings();
    return settings[key];
  }
);

export async function getPublishedItems<T>(
  collection: CollectionKey
): Promise<StoredItem<T>[]> {
  return getStore().listItems<T>(collection);
}

export async function getAllItems<T>(
  collection: CollectionKey
): Promise<StoredItem<T>[]> {
  return getStore().listItems<T>(collection, { includeUnpublished: true });
}

export function parseKeyedLines(value: string): {
  title: string;
  text: string;
}[] {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const entries: { title: string; text: string }[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const separator = line.indexOf("|");

    // Canonical format: "Title | Description" on a single line.
    if (separator !== -1) {
      entries.push({
        title: line.slice(0, separator).trim(),
        text: line.slice(separator + 1).trim(),
      });
      index += 1;
      continue;
    }

    // Legacy format: a title line followed by a description line.
    const text = lines[index + 1] ?? "";
    entries.push({ title: line, text });
    index += text ? 2 : 1;
  }

  return entries;
}

export function parseList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function formatReviewDate(date: string): string {
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
