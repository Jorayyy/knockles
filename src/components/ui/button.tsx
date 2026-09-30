import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ink" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-flare text-white border border-flare hover:bg-flare-deep hover:border-flare-deep",
  outline:
    "bg-transparent text-chalk border border-line hover:border-chalk hover:bg-chalk hover:text-ink",
  ink: "bg-ink text-chalk border border-ink hover:bg-ink-700 hover:border-ink-700",
  ghost:
    "bg-transparent text-muted border border-transparent hover:text-chalk hover:border-line",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.7rem]",
  md: "h-11 px-6 text-[0.75rem]",
  lg: "h-13 px-8 text-[0.8rem]",
};

export const buttonClasses = cn(
  "inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.16em] leading-none transition-colors duration-200 select-none",
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-flare-soft",
  "disabled:opacity-50 disabled:pointer-events-none"
);

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      type={type}
      className={cn(buttonClasses, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  href: string;
}) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const classes = cn(buttonClasses, variants[variant], sizes[size], className);

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
