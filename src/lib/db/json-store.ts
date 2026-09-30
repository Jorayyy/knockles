import { promises as fs } from "node:fs";
import path from "node:path";
import {
  DEFAULT_COLLECTIONS,
  DEFAULT_SETTINGS,
  SEEDABLE_COLLECTIONS,
} from "@/lib/content/defaults";
import type {
  CollectionKey,
  Lead,
  SettingsKey,
  SiteSettings,
  StoredItem,
} from "@/lib/content/types";
import { StoreError, type ListOptions, type MediaAsset, type Store } from "./types";

interface FileState {
  settings: Partial<SiteSettings>;
  collections: Partial<Record<CollectionKey, StoredItem<unknown>[]>>;
  leads: Lead[];
  media: MediaAsset[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "content.json");

function now() {
  return new Date().toISOString();
}

function seedState(): FileState {
  const collections: FileState["collections"] = {};
  for (const collection of SEEDABLE_COLLECTIONS) {
    collections[collection] = DEFAULT_COLLECTIONS[collection].map(
      (data, index) => ({
        id: `seed-${collection}-${index + 1}`,
        collection,
        sort: index,
        published: true,
        createdAt: now(),
        updatedAt: now(),
        data,
      })
    );
  }
  return { settings: {}, collections, leads: [], media: [] };
}

let cache: FileState | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function readState(): Promise<FileState> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    cache = JSON.parse(raw) as FileState;
    cache.media = cache.media ?? [];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      throw new StoreError(
        "Could not read the local content file.",
        `Unexpected error reading ${DATA_FILE}: ${String(error)}`
      );
    }
    cache = seedState();
  }
  return cache;
}

async function writeState(state: FileState) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${DATA_FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(state, null, 2), "utf8");
    await fs.rename(tmp, DATA_FILE);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      throw new StoreError(
        "This deployment does not allow writing files.",
        "Set DATABASE_URL (Neon Postgres) so content and leads persist in production."
      );
    }
    throw new StoreError(
      "Could not save changes.",
      `Unexpected error writing ${DATA_FILE}: ${String(error)}`
    );
  }
}

function serialize<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

function mergeSettings(next: Partial<SiteSettings>): SiteSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...next,
    business: { ...DEFAULT_SETTINGS.business, ...(next.business ?? {}) },
    hero: { ...DEFAULT_SETTINGS.hero, ...(next.hero ?? {}) },
    home: { ...DEFAULT_SETTINGS.home, ...(next.home ?? {}) },
    about: { ...DEFAULT_SETTINGS.about, ...(next.about ?? {}) },
    firstVisit: { ...DEFAULT_SETTINGS.firstVisit, ...(next.firstVisit ?? {}) },
    trial: { ...DEFAULT_SETTINGS.trial, ...(next.trial ?? {}) },
    seo: { ...DEFAULT_SETTINGS.seo, ...(next.seo ?? {}) },
    announcement: {
      ...DEFAULT_SETTINGS.announcement,
      ...(next.announcement ?? {}),
    },
  };
}

class JsonStore implements Store {
  kind = "file" as const;

  async getSettings(): Promise<SiteSettings> {
    const state = await readState();
    return mergeSettings(state.settings);
  }

  saveSetting<K extends SettingsKey>(key: K, value: SiteSettings[K]) {
    return serialize(async () => {
      const state = await readState();
      state.settings = { ...state.settings, [key]: value };
      await writeState(state);
    });
  }

  async listItems<T>(
    collection: CollectionKey,
    options: ListOptions = {}
  ): Promise<StoredItem<T>[]> {
    const state = await readState();
    const items = (state.collections[collection] ?? []) as StoredItem<T>[];
    const visible = options.includeUnpublished
      ? items
      : items.filter((item) => item.published);
    return [...visible].sort((a, b) => a.sort - b.sort);
  }

  async getItem<T>(
    collection: CollectionKey,
    id: string
  ): Promise<StoredItem<T> | null> {
    const items = await this.listItems<T>(collection, {
      includeUnpublished: true,
    });
    return items.find((item) => item.id === id) ?? null;
  }

  createItem<T>(collection: CollectionKey, data: T, published = true) {
    return serialize(async () => {
      const state = await readState();
      const items = (state.collections[collection] ?? []) as StoredItem<T>[];
      const item: StoredItem<T> = {
        id: crypto.randomUUID(),
        collection,
        sort: items.length,
        published,
        createdAt: now(),
        updatedAt: now(),
        data,
      };
      state.collections = {
        ...state.collections,
        [collection]: [...items, item] as StoredItem<unknown>[],
      };
      await writeState(state as FileState);
      return item;
    });
  }

  updateItem<T>(
    collection: CollectionKey,
    id: string,
    patch: { data?: T; published?: boolean; sort?: number }
  ) {
    return serialize(async () => {
      const state = await readState();
      const items = (state.collections[collection] ?? []) as StoredItem<T>[];
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) throw new StoreError("Item not found.", id);
      const updated: StoredItem<T> = {
        ...items[index],
        ...patch,
        updatedAt: now(),
      };
      items[index] = updated;
      state.collections = {
        ...state.collections,
        [collection]: items as StoredItem<unknown>[],
      };
      await writeState(state as FileState);
      return updated;
    });
  }

  deleteItem(collection: CollectionKey, id: string) {
    return serialize(async () => {
      const state = await readState();
      const items = (state.collections[collection] ?? []) as StoredItem<unknown>[];
      state.collections = {
        ...state.collections,
        [collection]: items.filter((item) => item.id !== id),
      };
      await writeState(state);
    });
  }

  async listLeads(): Promise<Lead[]> {
    const state = await readState();
    return [...state.leads].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }

  createLead(lead: Omit<Lead, "id" | "createdAt" | "status">) {
    return serialize(async () => {
      const state = await readState();
      const record: Lead = {
        ...lead,
        id: crypto.randomUUID(),
        createdAt: now(),
        status: "new",
      };
      state.leads = [record, ...state.leads];
      await writeState(state);
      return record;
    });
  }

  updateLead(id: string, patch: Partial<Pick<Lead, "status">>) {
    return serialize(async () => {
      const state = await readState();
      state.leads = state.leads.map((lead) =>
        lead.id === id ? { ...lead, ...patch } : lead
      );
      await writeState(state);
    });
  }

  deleteLead(id: string) {
    return serialize(async () => {
      const state = await readState();
      state.leads = state.leads.filter((lead) => lead.id !== id);
      await writeState(state);
    });
  }

  async listMedia(): Promise<MediaAsset[]> {
    const state = await readState();
    return [...(state.media ?? [])].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }

  async getMedia(id: string): Promise<MediaAsset | null> {
    const state = await readState();
    return state.media.find((asset) => asset.id === id) ?? null;
  }

  saveMedia(input: { name: string; mime: string; data: string }) {
    return serialize(async () => {
      const state = await readState();
      const asset: MediaAsset = {
        id: crypto.randomUUID(),
        name: input.name,
        mime: input.mime,
        data: input.data,
        createdAt: now(),
      };
      state.media = [asset, ...(state.media ?? [])];
      await writeState(state);
      return asset;
    });
  }

  deleteMedia(id: string) {
    return serialize(async () => {
      const state = await readState();
      state.media = (state.media ?? []).filter((asset) => asset.id !== id);
      await writeState(state);
    });
  }
}

export const jsonStore = new JsonStore();
