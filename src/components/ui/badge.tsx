import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "line",
  className,
}: {
  children: React.ReactNode;
  tone?: "line" | "flare" | "ink";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "u-label inline-flex items-center border px-2.5 py-1.5",
        tone === "line" && "border-line text-muted",
        tone === "flare" && "border-flare/50 text-flare-soft",
        tone === "ink" && "border-ink/20 text-ink/70",
        className
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  text,
  action,
  className,
  light = false,
}: {
  title: string;
  text?: string;
  action?: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "u-hatch border p-8 sm:p-12 text-center",
        light ? "border-ink/15 bg-ink/5" : "border-line bg-ink-800",
        className
      )}
    >
      <p
        className={cn(
          "u-display text-2xl sm:text-3xl",
          light ? "text-ink" : "text-chalk"
        )}
      >
        {title}
      </p>
      {text ? (
        <p
          className={cn(
            "mx-auto mt-3 max-w-md text-sm leading-relaxed",
            light ? "text-ink/70" : "text-muted"
          )}
        >
          {text}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
