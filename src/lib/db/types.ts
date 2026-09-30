import type {
  CollectionKey,
  Lead,
  SettingsKey,
  SiteSettings,
  StoredItem,
} from "@/lib/content/types";

export type StoreKind = "postgres" | "file";

export interface ListOptions {
  includeUnpublished?: boolean;
}

export interface Store {
  kind: StoreKind;
  getSettings(): Promise<SiteSettings>;
  saveSetting<K extends SettingsKey>(key: K, value: SiteSettings[K]): Promise<void>;
  listItems<T>(collection: CollectionKey, options?: ListOptions): Promise<StoredItem<T>[]>;
  getItem<T>(collection: CollectionKey, id: string): Promise<StoredItem<T> | null>;
  createItem<T>(
    collection: CollectionKey,
    data: T,
    published?: boolean
  ): Promise<StoredItem<T>>;
  updateItem<T>(
    collection: CollectionKey,
    id: string,
    patch: { data?: T; published?: boolean; sort?: number }
  ): Promise<StoredItem<T>>;
  deleteItem(collection: CollectionKey, id: string): Promise<void>;
  listLeads(): Promise<Lead[]>;
  createLead(lead: Omit<Lead, "id" | "createdAt" | "status">): Promise<Lead>;
  updateLead(id: string, patch: Partial<Pick<Lead, "status">>): Promise<void>;
  deleteLead(id: string): Promise<void>;
}

export class StoreError extends Error {
  hint: string;
  constructor(message: string, hint: string) {
    super(message);
    this.name = "StoreError";
    this.hint = hint;
  }
}
