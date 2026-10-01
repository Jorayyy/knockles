import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({
  wordmark,
  tagline,
  className,
  light = false,
  logo,
}: {
  wordmark: string;
  tagline?: string;
  className?: string;
  light?: boolean;
  logo?: string;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 leading-none",
        logo ? "" : "flex-col",
        className
      )}
      aria-label="Knock'ls Boxing Gym — home"
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={44}
          height={44}
          className="h-9 w-9 shrink-0 border border-line object-cover md:h-11 md:w-11"
        />
      ) : null}
      <span className="inline-flex flex-col leading-none">
        <span
          className={cn(
            "u-display text-2xl tracking-[0.02em] transition-colors",
            light
              ? "text-ink group-hover:text-flare"
              : "text-chalk group-hover:text-flare-soft"
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
      </span>
    </Link>
  );
}
