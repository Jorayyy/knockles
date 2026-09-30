"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  className,
  children,
  onClick,
  dataTrack,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  dataTrack?: string;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      data-track={dataTrack}
      className={cn(
        "relative text-[0.8rem] font-medium tracking-wide transition-colors",
        active ? "text-chalk" : "text-muted hover:text-chalk",
        className
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-2 left-0 h-px w-full origin-left bg-flare transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0"
        )}
      />
    </Link>
  );
}
