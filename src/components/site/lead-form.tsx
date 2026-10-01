"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CircleCheckBig, MessageCircle, Phone, Send } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  FieldError,
  FieldLabel,
  Select,
  TextArea,
  TextInput,
} from "@/components/ui/field";
import { track } from "@/components/site/analytics";
import type { TrialSettings } from "@/lib/content/types";

type FormState = {
  name: string;
  phone: string;
  email: string;
  program: string;
  level: string;
  preferred: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  phone: "",
  email: "",
  program: "",
  level: "",
  preferred: "",
  message: "",
};

const LEVELS = [
  "Complete beginner",
  "Trained a little",
  "Regularly training",
  "Competitive / active fighter",
];

function validate(values: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  const phoneDigits = values.phone.replace(/[^\d]/g, "");
  if (phoneDigits.length < 7) {
    errors.phone = "Enter a phone number we can reach you on.";
  }
  if (
    values.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  ) {
    errors.email = "Check the email address format.";
  }
  if (values.message.trim().length > 1000) {
    errors.message = "Message is too long.";
  }
  return errors;
}

export function LeadForm({
  programs,
  trial,
  businessPhone,
  messenger,
  source = "website",
}: {
  programs: string[];
  trial: TrialSettings;
  businessPhone: string;
  messenger: string;
  source?: string;
}) {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const startedAt = useRef<number>(0);
  const startedField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const programOptions = useMemo(
    () => (programs.length ? ["Not sure yet", ...programs] : ["Not sure yet"]),
    [programs]
  );

  function update(key: keyof FormState, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const firstKey = Object.keys(found)[0] as keyof FormState;
      document.getElementById(`lead-${firstKey}`)?.focus();
      return;
    }

    setStatus("submitting");
    setServerError(null);

    try {
      const payload = {
        ...values,
        source,
        startedAt: startedAt.current || undefined,
        website: startedField.current?.value || "",
      };
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("done");
      track("lead_submit_success", { source });
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div
        className="border border-flare/50 bg-ink-700 p-7 sm:p-9"
        role="status"
        aria-live="polite"
      >
        <div className="flex h-12 w-12 items-center justify-center border border-flare/50 text-flare-soft">
          <CircleCheckBig size={22} aria-hidden="true" />
        </div>
        <h2 className="u-display mt-6 text-3xl">Request sent</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          {trial.successMessage}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={messenger} variant="primary" data-track="cta_messenger_confirmation">
            <MessageCircle size={15} aria-hidden="true" />
            Continue on Messenger
          </ButtonLink>
          <ButtonLink href={`tel:${businessPhone}`} variant="outline" data-track="cta_phone_confirmation">
            <Phone size={15} aria-hidden="true" />
            Call the gym
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      action="/api/leads"
      method="POST"
      noValidate
      data-track="lead_form_submit"
      aria-busy={status === "submitting"}
      className="relative border border-line bg-ink-800 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <FieldLabel htmlFor="lead-name">Name *</FieldLabel>
          <TextInput
            id="lead-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "lead-name-error" : undefined}
          />
          <FieldError id="lead-name-error" message={errors.name} />
        </div>

        <div className="grid gap-2">
          <FieldLabel htmlFor="lead-phone">Phone *</FieldLabel>
          <TextInput
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+63"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "lead-phone-error" : undefined}
          />
          <FieldError id="lead-phone-error" message={errors.phone} />
        </div>

        <div className="grid gap-2">
          <FieldLabel htmlFor="lead-email" hint="optional">
            Email
          </FieldLabel>
          <TextInput
            id="lead-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "lead-email-error" : undefined}
          />
          <FieldError id="lead-email-error" message={errors.email} />
        </div>

        <div className="grid gap-2">
          <FieldLabel htmlFor="lead-program">Preferred training</FieldLabel>
          <Select
            id="lead-program"
            name="program"
            value={values.program}
            onChange={(event) => update("program", event.target.value)}
          >
            <option value="">Select an option</option>
            {programOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-2">
          <FieldLabel htmlFor="lead-level">Experience level</FieldLabel>
          <Select
            id="lead-level"
            name="level"
            value={values.level}
            onChange={(event) => update("level", event.target.value)}
          >
            <option value="">Select an option</option>
            {LEVELS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-2">
          <FieldLabel htmlFor="lead-preferred" hint="optional">
            Preferred schedule
          </FieldLabel>
          <TextInput
            id="lead-preferred"
            name="preferred"
            placeholder="e.g. weekday evenings"
            value={values.preferred}
            onChange={(event) => update("preferred", event.target.value)}
          />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <FieldLabel htmlFor="lead-message" hint="optional">
            Message
          </FieldLabel>
          <TextArea
            id="lead-message"
            name="message"
            rows={4}
            placeholder="Tell us what you want to get out of training."
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "lead-message-error" : undefined}
          />
          <FieldError id="lead-message-error" message={errors.message} />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="lead-website">Leave this field empty</label>
        <input
          id="lead-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          ref={startedField}
        />
      </div>

      {serverError ? (
        <p className="mt-5 border border-flare/40 bg-flare/10 px-4 py-3 text-sm text-flare-soft" role="alert">
          {serverError}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-dim">
          We will only use your details to reply about training at Knock&apos;ls.
        </p>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === "submitting"}
          data-track="lead_form_send"
        >
          {status === "submitting" ? (
            "Sending…"
          ) : (
            <>
              <Send size={15} aria-hidden="true" />
              {trial.label}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
