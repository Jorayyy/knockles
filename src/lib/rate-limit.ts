interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(
  bucket: string,
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const id = `${bucket}:${key}`;
  const existing = buckets.get(id);

  if (!existing || existing.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [mapKey, value] of buckets) {
        if (value.resetAt <= now) buckets.delete(mapKey);
      }
    }
    return true;
  }

  existing.count += 1;
  return existing.count <= limit;
}

export function clientKeyFromHeader(value: string | null): string {
  if (!value) return "unknown";
  const first = value.split(",")[0]?.trim();
  return first || "unknown";
}
