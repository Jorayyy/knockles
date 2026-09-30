"use client";

import { useActionState } from "react";
import Link from "next/link";
import { LoaderCircle, LogIn } from "lucide-react";
import { loginAction, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  FieldLabel,
  TextInput,
} from "@/components/ui/field";
import { Wordmark } from "@/components/site/wordmark";

const IDLE: ActionState = { ok: false };

export function LoginForm({
  next,
  wordmark,
}: {
  next?: string;
  wordmark: string;
}) {
  const [state, formAction, pending] = useActionState(loginAction, IDLE);

  return (
    <form
      action={formAction}
      className="w-full max-w-md border border-line bg-ink-800 p-8"
    >
      <Wordmark wordmark={wordmark} className="h-8" />
      <h1 className="u-display mt-8 text-4xl">Owner login</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Sign in to edit content, review trial requests and manage the site.
      </p>

      <input type="hidden" name="next" value={next ?? ""} />

      <div className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <TextInput
            id="username"
            name="username"
            autoComplete="username"
            required
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <TextInput
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      {state.error ? (
        <p className="mt-5 border border-flare/50 bg-flare/10 px-4 py-3 text-sm text-flare-soft" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="mt-6">
        <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full">
          {pending ? (
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <LogIn size={16} aria-hidden="true" />
          )}
          Sign in
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-muted-dim">
        <Link href="/" className="underline underline-offset-4 hover:text-muted">
          Back to the website
        </Link>
      </p>
    </form>
  );
}
