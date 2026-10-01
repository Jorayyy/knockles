"use client";

import { CircleAlert, CircleCheckBig } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export function FormMessage({ state }: { state: ActionState }) {
  if (!state.error && !state.message) return null;
  const ok = state.ok;

  return (
    <p
      className={cn(
        "flex items-start gap-2 border px-4 py-3 text-sm",
        ok
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
          : "border-flare/50 bg-flare/10 text-flare-soft"
      )}
      role={ok ? "status" : "alert"}
    >
      {ok ? (
        <CircleCheckBig size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
      ) : (
        <CircleAlert size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
      )}
      <span>{ok ? state.message : state.error}</span>
    </p>
  );
}
