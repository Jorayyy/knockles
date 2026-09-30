"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  COOKIE_NAME,
  adminCredentialsConfigured,
  createSessionToken,
  credentialsMatch,
  verifySessionToken,
} from "@/lib/auth/session";
import { getStore, StoreError } from "@/lib/db";
import type {
  CollectionKey,
  Lead,
  SettingsKey,
  SiteSettings,
} from "@/lib/content/types";
import { clientKeyFromHeader, rateLimit } from "@/lib/rate-limit";
import {
  COLLECTION_SCHEMAS,
  SETTINGS_SECTIONS,
  parseFields,
  parseHours,
} from "./schema";

export interface ActionState {
  ok: boolean;
  message?: string;
  error?: string;
}

function messageFrom(error: unknown): string {
  if (error instanceof StoreError) {
    return error.hint || error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) redirect("/admin/login");
}

function safeNext(value: string | null): string {
  if (!value) return "/admin";
  if (!value.startsWith("/") || value.startsWith("//")) return "/admin";
  return value;
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const requestHeaders = await headers();
  const ip = clientKeyFromHeader(
    requestHeaders.get("x-forwarded-for") ?? requestHeaders.get("x-real-ip")
  );

  if (!rateLimit("admin-login", ip, 8, 5 * 60_000)) {
    return {
      ok: false,
      error: "Too many attempts. Wait a few minutes and try again.",
    };
  }

  if (!adminCredentialsConfigured()) {
    return {
      ok: false,
      error:
        "Admin login is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in the environment.",
    };
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!credentialsMatch(username, password)) {
    return { ok: false, error: "Incorrect username or password." };
  }

  const token = createSessionToken();
  if (!token) {
    return {
      ok: false,
      error:
        "Could not create a session. Set SESSION_SECRET (or ADMIN_PASSWORD) in the environment.",
    };
  }

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(safeNext(String(formData.get("next") ?? "")));
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function createItemAction(
  collection: CollectionKey,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const schema = COLLECTION_SCHEMAS[collection];
  if (!schema) return { ok: false, error: "Unknown collection." };

  try {
    const data = parseFields(schema.fields, formData);
    for (const field of schema.fields) {
      if (field.required && !String(data[field.name] ?? "").trim()) {
        return { ok: false, error: `${field.label} is required.` };
      }
    }
    await getStore().createItem(collection, data, true);
    revalidateSite();
    return { ok: true, message: `${schema.singular} added.` };
  } catch (error) {
    return { ok: false, error: messageFrom(error) };
  }
}

export async function updateItemAction(
  collection: CollectionKey,
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const schema = COLLECTION_SCHEMAS[collection];
  if (!schema) return { ok: false, error: "Unknown collection." };

  try {
    const data = parseFields(schema.fields, formData);
    for (const field of schema.fields) {
      if (field.required && !String(data[field.name] ?? "").trim()) {
        return { ok: false, error: `${field.label} is required.` };
      }
    }
    const published = formData.get("_published") === "on";
    await getStore().updateItem(collection, id, { data, published });
    revalidateSite();
    return { ok: true, message: `Changes saved.` };
  } catch (error) {
    return { ok: false, error: messageFrom(error) };
  }
}

export async function deleteItemAction(
  collection: CollectionKey,
  id: string
): Promise<void> {
  await requireAdmin();
  try {
    await getStore().deleteItem(collection, id);
    revalidateSite();
  } catch {
    redirect(`/admin/content/${collection}?error=delete`);
  }
}

export async function togglePublishAction(
  collection: CollectionKey,
  id: string,
  published: boolean
): Promise<void> {
  await requireAdmin();
  try {
    await getStore().updateItem(collection, id, { published });
    revalidateSite();
  } catch {
    redirect(`/admin/content/${collection}?error=publish`);
  }
}

export async function saveSettingsAction(
  key: SettingsKey,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const section = SETTINGS_SECTIONS.find((entry) => entry.key === key);
  if (!section) return { ok: false, error: "Unknown settings section." };

  try {
    const store = getStore();
    const current = (await store.getSettings())[key] as unknown as Record<
      string,
      unknown
    >;
    const next: Record<string, unknown> = {
      ...current,
      ...parseFields(section.fields, formData),
    };
    if (section.fields.some((field) => field.type === "hours")) {
      next.hours = parseHours(formData);
    }
    await store.saveSetting(
      key,
      next as unknown as SiteSettings[SettingsKey]
    );
    revalidateSite();
    return { ok: true, message: `${section.label} saved.` };
  } catch (error) {
    return { ok: false, error: messageFrom(error) };
  }
}

export async function updateLeadStatusAction(
  id: string,
  status: Lead["status"]
): Promise<void> {
  await requireAdmin();
  try {
    await getStore().updateLead(id, { status });
    revalidatePath("/admin/leads");
    revalidateSite();
  } catch {
    redirect("/admin/leads?error=status");
  }
}

export async function deleteLeadAction(id: string): Promise<void> {
  await requireAdmin();
  try {
    await getStore().deleteLead(id);
    revalidatePath("/admin/leads");
  } catch {
    redirect("/admin/leads?error=delete");
  }
}

export async function deleteMediaAction(id: string): Promise<void> {
  await requireAdmin();
  try {
    await getStore().deleteMedia(id);
    revalidatePath("/admin/media");
    revalidateSite();
  } catch {
    redirect("/admin/media?error=delete");
  }
}
