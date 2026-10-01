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

  if (!lines.length) return [];

  // Canonical format is "Title | Description" on a single line.
  const allPipeDelimited = lines.every((line) => line.includes("|"));

  if (allPipeDelimited) {
    return lines.map((line) => {
      const [title, ...rest] = line.split("|");
      return { title: title.trim(), text: rest.join("|").trim() };
    });
  }

  // Legacy format alternates a title line and a description line.
  const entries: { title: string; text: string }[] = [];
  for (let index = 0; index < lines.length; index += 2) {
    const [title, ...rest] = lines[index].split("|");
    entries.push({
      title: title.trim(),
      text: (rest.join("|").trim() || lines[index + 1]?.trim() || "").trim(),
    });
    if (rest.length === 0 && lines[index + 1]) index += 1;
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
