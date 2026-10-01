"use client";

import { useActionState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import type { SettingsSection } from "@/app/admin/schema";
import { SchemaFields } from "@/components/admin/fields";
import { FormMessage } from "@/components/admin/form-message";
import { Button } from "@/components/ui/button";

const IDLE: ActionState = { ok: false };

export function SettingsForm({
  section,
  initial,
  action,
}: {
  section: SettingsSection;
  initial: Record<string, unknown>;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, IDLE);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <h2 className="u-display text-3xl">{section.label}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {section.description}
        </p>
      </div>

      <SchemaFields
        fields={section.fields}
        values={initial}
        idPrefix={`settings-${section.key}`}
      />

      <FormMessage state={state} />

      <div>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? (
            <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <Save size={15} aria-hidden="true" />
          )}
          Save {section.label.toLowerCase()}
        </Button>
      </div>
    </form>
  );
}
