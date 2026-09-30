import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path = "") {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.VERCEL_URL?.replace(/^/, "https://") ||
    "http://localhost:3000";
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+63")) {
    const local = digits.slice(3);
    if (local.length === 10) {
      return `+63 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
    }
  }
  return phone;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
