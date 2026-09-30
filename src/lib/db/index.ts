import "server-only";

import { jsonStore } from "./json-store";
import { createPostgresStore } from "./pg-store";
import type { Store } from "./types";

let instance: Store | null = null;

export function getStore(): Store {
  if (instance) return instance;
  const url = process.env.DATABASE_URL;
  instance = url ? createPostgresStore(url) : jsonStore;
  return instance;
}

export function storeKind(): "postgres" | "file" {
  return process.env.DATABASE_URL ? "postgres" : "file";
}

export { StoreError } from "./types";
export type { Store } from "./types";
