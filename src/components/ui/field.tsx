import { cn } from "@/lib/utils";

export const fieldClasses =
  "w-full bg-ink-700 border border-line px-4 py-3 text-sm text-chalk placeholder:text-muted-dim transition-colors focus:border-flare focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flare-soft";

export function FieldLabel({
  htmlFor,
  children,
  hint,
  className,
}: {
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3", className)}>
      <label
        htmlFor={htmlFor}
        className="u-label text-muted"
      >
        {children}
      </label>
      {hint ? <span className="text-xs text-muted-dim">{hint}</span> : null}
    </div>
  );
}

export function TextInput({
  id,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input id={id} className={cn(fieldClasses, className)} {...props} />;
}

export function TextArea({
  id,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      id={id}
      className={cn(fieldClasses, "min-h-28 resize-y", className)}
      {...props}
    />
  );
}

export function Select({
  id,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      id={id}
      className={cn(fieldClasses, "appearance-none pr-10", className)}
      {...props}
    >
      {children}
    </select>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs font-medium text-flare-soft" role="alert">
      {message}
    </p>
  );
}
