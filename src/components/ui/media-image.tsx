import Image from "next/image";
import { cn } from "@/lib/utils";

function isLocal(src: string) {
  return src.startsWith("/") || src.startsWith("data:");
}

export function MediaImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  fill = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  if (!src) return null;

  if (isLocal(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={80}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- owner-supplied remote URLs are not run through the optimizer
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn(
        fill ? "absolute inset-0 h-full w-full object-cover" : "object-cover",
        className
      )}
    />
  );
}
