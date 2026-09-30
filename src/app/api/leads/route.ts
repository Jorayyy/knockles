import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/db";
import { clientKeyFromHeader, rateLimit } from "@/lib/rate-limit";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  phone: z.string().trim().min(7, "Phone is required").max(30),
  email: z
    .string()
    .trim()
    .max(200)
    .refine(
      (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Enter a valid email"
    )
    .optional()
    .default(""),
  program: z.string().trim().max(100).optional().default(""),
  level: z.string().trim().max(100).optional().default(""),
  preferred: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(1000).optional().default(""),
  source: z.string().trim().max(60).optional().default("website"),
  website: z.string().max(500).optional(),
  startedAt: z.coerce.number().optional(),
});

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const isForm = contentType.includes("application/x-www-form-urlencoded");

  const ip = clientKeyFromHeader(
    request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip")
  );

  if (!rateLimit("lead", ip, 6, 60_000)) {
    if (isForm) {
      return NextResponse.redirect(new URL("/book?error=rate", request.url), {
        status: 303,
      });
    }
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let raw: unknown;
  try {
    if (isForm) {
      const form = await request.formData();
      raw = Object.fromEntries(form.entries());
    } else {
      raw = await request.json();
    }
  } catch {
    if (isForm) {
      return NextResponse.redirect(new URL("/book?error=invalid", request.url), {
        status: 303,
      });
    }
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    if (isForm) {
      return NextResponse.redirect(new URL("/book?error=invalid", request.url), {
        status: 303,
      });
    }
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        error: issue?.message ?? "Please check the form fields.",
        field: issue?.path[0],
      },
      { status: 400 }
    );
  }

  const value = parsed.data;

  const honeypotTriggered = Boolean(value.website && value.website.length > 0);
  const tooFast =
    typeof value.startedAt === "number" && Date.now() - value.startedAt < 1500;

  if (honeypotTriggered || tooFast) {
    if (isForm) {
      return NextResponse.redirect(new URL("/book?sent=1", request.url), {
        status: 303,
      });
    }
    return NextResponse.json({ ok: true });
  }

  try {
    await getStore().createLead({
      name: value.name,
      phone: value.phone,
      email: value.email,
      program: value.program,
      level: value.level,
      preferred: value.preferred,
      message: value.message,
      source: value.source || "website",
    });
  } catch (error) {
    const hint =
      error && typeof error === "object" && "hint" in error
        ? String((error as { hint: string }).hint)
        : "Please try again or message the gym directly.";
    if (isForm) {
      return NextResponse.redirect(new URL("/book?error=store", request.url), {
        status: 303,
      });
    }
    return NextResponse.json({ ok: false, error: hint }, { status: 500 });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "lead.created",
        receivedAt: new Date().toISOString(),
        lead: {
          name: value.name,
          phone: value.phone,
          email: value.email,
          program: value.program,
          level: value.level,
          preferred: value.preferred,
          message: value.message,
          source: value.source,
        },
      }),
    }).catch(() => undefined);
  }

  if (isForm) {
    return NextResponse.redirect(new URL("/book?sent=1", request.url), {
      status: 303,
    });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
