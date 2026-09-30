import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({
  wordmark,
  tagline,
  className,
  light = false,
}: {
  wordmark: string;
  tagline?: string;
  className?: string;
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex flex-col leading-none", className)}
      aria-label="Knock'ls Boxing Gym — home"
    >
      <span
        className={cn(
          "u-display text-2xl tracking-[0.02em] transition-colors",
          light ? "text-ink group-hover:text-flare" : "text-chalk group-hover:text-flare-soft"
        )}
      >
        {wordmark}
        <span className="text-flare">.</span>
      </span>
      <span
        className={cn(
          "u-label mt-1 text-[0.55rem] tracking-[0.34em]",
          light ? "text-ink/50" : "text-muted-dim"
        )}
      >
        {tagline ?? "Boxing Gym"}
      </span>
    </Link>
  );
}
