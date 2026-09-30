import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  tone = "flare",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "flare" | "muted" | "ink";
}) {
  return (
    <span
      className={cn(
        "u-label inline-flex items-center gap-3",
        tone === "flare" && "text-flare-soft",
        tone === "muted" && "text-muted",
        tone === "ink" && "text-ink/60",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-px w-6",
          tone === "flare" ? "bg-flare" : tone === "ink" ? "bg-ink/40" : "bg-line"
        )}
      />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "dark",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <Eyebrow tone={tone === "light" ? "ink" : "flare"} className="mb-5">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Tag
        className={cn(
          "u-display text-4xl sm:text-5xl lg:text-6xl",
          tone === "light" ? "text-ink" : "text-chalk"
        )}
      >
        {title}
      </Tag>
      {text ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            tone === "light" ? "text-ink/70" : "text-muted"
          )}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  return (
    <Tag
      className={cn("reveal", className)}
      style={{ transitionDelay: `${delay}ms` }}
      data-reveal=""
    >
      {children}
    </Tag>
  );
}
