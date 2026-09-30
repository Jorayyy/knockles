import { Eyebrow } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  text,
  children,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-line bg-ink-800 u-noise",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="u-grid-lines absolute inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute -top-24 right-0 h-72 w-72 bg-flare/10 blur-3xl"
      />
      <div className="u-shell relative py-14 md:py-20 lg:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="u-display mt-6 max-w-4xl text-5xl sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {text ? (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {text}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
