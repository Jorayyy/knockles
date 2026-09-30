import { neon } from "@neondatabase/serverless";
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
import { StoreError, type ListOptions, type Store } from "./types";

type Row = Record<string, unknown>;

const COLLECTIONS: CollectionKey[] = [
  "programs",
  "coaches",
  "schedule",
  "plans",
  "testimonials",
  "faqs",
  "gallery",
];

function assertCollection(
  collection: string
): asserts collection is CollectionKey {
  if (!COLLECTIONS.includes(collection as CollectionKey)) {
    throw new StoreError("Unknown collection.", collection);
  }
}

function parseJson<T>(value: unknown): T {
  if (typeof value === "string") return JSON.parse(value) as T;
  return value as T;
}

function mapItem<T>(row: Row): StoredItem<T> {
  return {
    id: String(row.id),
    collection: String(row.collection) as CollectionKey,
    sort: Number(row.sort ?? 0),
    published: Boolean(row.published),
    createdAt: new Date(String(row.created_at ?? Date.now())).toISOString(),
    updatedAt: new Date(String(row.updated_at ?? Date.now())).toISOString(),
    data: parseJson<T>(row.data),
  };
}

const SCHEMA: string[] = [
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    collection TEXT NOT NULL,
    sort INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS items_collection_idx ON items (collection, sort)`,
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    program TEXT NOT NULL DEFAULT '',
    level TEXT NOT NULL DEFAULT '',
    preferred TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new'
  )`,
];

let ready: Promise<void> | null = null;

function fail(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  throw new StoreError(
    "Database request failed.",
    `${message} — check DATABASE_URL and that the Neon database is reachable.`
  );
}

class PostgresStore implements Store {
  kind = "postgres" as const;
  private sql: ReturnType<typeof neon>;

  constructor(url: string) {
    this.sql = neon(url);
  }

  private run(text: string, params: unknown[] = []): Promise<Row[]> {
    return this.sql.query(text, params) as unknown as Promise<Row[]>;
  }

  private async init(): Promise<void> {
    if (ready) return ready;
    ready = (async () => {
      try {
        for (const statement of SCHEMA) await this.run(statement);
        const settingsRows = await this.run(`SELECT key FROM settings`);
        const itemRows = await this.run(`SELECT id FROM items LIMIT 1`);
        if (settingsRows.length === 0 && itemRows.length === 0) {
          await this.seed();
        }
      } catch (error) {
        ready = null;
        fail(error);
      }
    })();
    return ready;
  }

  private async seed(): Promise<void> {
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await this.run(
        `INSERT INTO settings (key, value) VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO NOTHING`,
        [key, JSON.stringify(value)]
      );
    }
    for (const collection of SEEDABLE_COLLECTIONS) {
      const rows = DEFAULT_COLLECTIONS[collection];
      for (const [index, data] of rows.entries()) {
        const id = `seed-${collection}-${index + 1}`;
        await this.run(
          `INSERT INTO items (id, collection, sort, published, data)
           VALUES ($1, $2, $3, true, $4::jsonb)
           ON CONFLICT (id) DO NOTHING`,
          [id, collection, index, JSON.stringify(data)]
        );
      }
    }
  }

  async getSettings(): Promise<SiteSettings> {
    await this.init();
    try {
      const rows = await this.run(`SELECT key, value FROM settings`);
      const stored: Partial<Record<SettingsKey, unknown>> = {};
      for (const row of rows) {
        stored[row.key as SettingsKey] = parseJson<unknown>(row.value);
      }
      const pick = <K extends SettingsKey>(key: K): SiteSettings[K] =>
        ({
          ...DEFAULT_SETTINGS[key],
          ...((stored[key] as object) ?? {}),
        }) as SiteSettings[K];

      return {
        business: pick("business"),
        hero: pick("hero"),
        home: pick("home"),
        about: pick("about"),
        firstVisit: pick("firstVisit"),
        trial: pick("trial"),
        seo: pick("seo"),
        announcement: pick("announcement"),
      };
    } catch (error) {
      fail(error);
    }
  }

  async saveSetting<K extends SettingsKey>(
    key: K,
    value: SiteSettings[K]
  ): Promise<void> {
    await this.init();
    try {
      await this.run(
        `INSERT INTO settings (key, value, updated_at)
         VALUES ($1, $2::jsonb, now())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, JSON.stringify(value)]
      );
    } catch (error) {
      fail(error);
    }
  }

  async listItems<T>(
    collection: CollectionKey,
    options: ListOptions = {}
  ): Promise<StoredItem<T>[]> {
    assertCollection(collection);
    await this.init();
    try {
      const rows = options.includeUnpublished
        ? await this.run(
            `SELECT * FROM items WHERE collection = $1 ORDER BY sort ASC`,
            [collection]
          )
        : await this.run(
            `SELECT * FROM items WHERE collection = $1 AND published = true ORDER BY sort ASC`,
            [collection]
          );
      return rows.map((row) => mapItem<T>(row));
    } catch (error) {
      fail(error);
    }
  }

  async getItem<T>(
    collection: CollectionKey,
    id: string
  ): Promise<StoredItem<T> | null> {
    assertCollection(collection);
    await this.init();
    try {
      const rows = await this.run(
        `SELECT * FROM items WHERE collection = $1 AND id = $2`,
        [collection, id]
      );
      return rows.length ? mapItem<T>(rows[0]) : null;
    } catch (error) {
      fail(error);
    }
  }

  async createItem<T>(
    collection: CollectionKey,
    data: T,
    published = true
  ): Promise<StoredItem<T>> {
    assertCollection(collection);
    await this.init();
    try {
      const id = crypto.randomUUID();
      const rows = await this.run(
        `INSERT INTO items (id, collection, sort, published, data)
         VALUES (
           $1,
           $2,
           (SELECT COALESCE(MAX(sort), -1) + 1 FROM items WHERE collection = $2),
           $3,
           $4::jsonb
         ) RETURNING *`,
        [id, collection, published, JSON.stringify(data)]
      );
      return mapItem<T>(rows[0]);
    } catch (error) {
      fail(error);
    }
  }

  async updateItem<T>(
    collection: CollectionKey,
    id: string,
    patch: { data?: T; published?: boolean; sort?: number }
  ): Promise<StoredItem<T>> {
    assertCollection(collection);
    await this.init();
    try {
      const current = await this.run(
        `SELECT * FROM items WHERE collection = $1 AND id = $2`,
        [collection, id]
      );
      if (!current.length) throw new StoreError("Item not found.", id);
      const existing = mapItem<T>(current[0]);
      const data = patch.data === undefined ? existing.data : patch.data;
      const published =
        patch.published === undefined ? existing.published : patch.published;
      const sort = patch.sort === undefined ? existing.sort : patch.sort;
      const rows = await this.run(
        `UPDATE items
         SET data = $1::jsonb, published = $2, sort = $3, updated_at = now()
         WHERE id = $4 RETURNING *`,
        [JSON.stringify(data), published, sort, id]
      );
      return mapItem<T>(rows[0]);
    } catch (error) {
      if (error instanceof StoreError) throw error;
      fail(error);
    }
  }

  async deleteItem(collection: CollectionKey, id: string): Promise<void> {
    assertCollection(collection);
    await this.init();
    try {
      await this.run(
        `DELETE FROM items WHERE collection = $1 AND id = $2`,
        [collection, id]
      );
    } catch (error) {
      fail(error);
    }
  }

  async listLeads(): Promise<Lead[]> {
    await this.init();
    try {
      const rows = await this.run(
        `SELECT * FROM leads ORDER BY created_at DESC`
      );
      return rows.map((row) => ({
        id: String(row.id),
        createdAt: new Date(String(row.created_at)).toISOString(),
        name: String(row.name),
        phone: String(row.phone),
        email: String(row.email ?? ""),
        program: String(row.program ?? ""),
        level: String(row.level ?? ""),
        preferred: String(row.preferred ?? ""),
        message: String(row.message ?? ""),
        source: String(row.source ?? ""),
        status: row.status as Lead["status"],
      }));
    } catch (error) {
      fail(error);
    }
  }

  async createLead(
    lead: Omit<Lead, "id" | "createdAt" | "status">
  ): Promise<Lead> {
    await this.init();
    try {
      const id = crypto.randomUUID();
      const rows = await this.run(
        `INSERT INTO leads
           (id, name, phone, email, program, level, preferred, message, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING created_at`,
        [
          id,
          lead.name,
          lead.phone,
          lead.email,
          lead.program,
          lead.level,
          lead.preferred,
          lead.message,
          lead.source,
        ]
      );
      return {
        ...lead,
        id,
        status: "new",
        createdAt: new Date(String(rows[0].created_at)).toISOString(),
      };
    } catch (error) {
      fail(error);
    }
  }

  async updateLead(
    id: string,
    patch: Partial<Pick<Lead, "status">>
  ): Promise<void> {
    await this.init();
    try {
      await this.run(`UPDATE leads SET status = $1 WHERE id = $2`, [
        patch.status ?? "new",
        id,
      ]);
    } catch (error) {
      fail(error);
    }
  }

  async deleteLead(id: string): Promise<void> {
    await this.init();
    try {
      await this.run(`DELETE FROM leads WHERE id = $1`, [id]);
    } catch (error) {
      fail(error);
    }
  }
}

export function createPostgresStore(url: string): Store {
  return new PostgresStore(url);
}
