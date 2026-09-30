import { ArrowUpRight, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/section";
import type { Plan, Program, Testimonial } from "@/lib/content/types";
import { formatReviewDate, parseList } from "@/lib/content/access";
import { cn } from "@/lib/utils";

export function ProgramCard({
  program,
  index,
}: {
  program: Program;
  index: number;
}) {
  const learns = parseList(program.learns);
  return (
    <Reveal
      as="article"
      delay={index * 70}
      className="group flex flex-col border border-line bg-ink-800 transition-colors duration-300 hover:border-flare/60"
    >
      <div className="flex items-start justify-between border-b border-line px-6 py-5">
        <span className="u-label text-muted-dim">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Badge tone="line">{program.level}</Badge>
      </div>
      <div className="flex flex-1 flex-col px-6 py-6">
        <h3 className="u-display text-3xl text-chalk transition-colors group-hover:text-flare-soft">
          {program.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {program.summary}
        </p>

        <p className="u-label mt-6 text-muted-dim">Who it is for</p>
        <p className="mt-2 text-sm text-chalk/90">{program.whoFor}</p>

        <p className="u-label mt-5 text-muted-dim">What you learn</p>
        <ul className="mt-2 grid gap-1.5">
          {learns.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm text-muted before:content-['—'] before:text-flare"
            >
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-line px-6 py-4">
        <p className="text-xs text-muted-dim">{program.experience}</p>
      </div>
    </Reveal>
  );
}

export function TestimonialCard({
  testimonial,
  className,
  light = false,
}: {
  testimonial: Testimonial;
  className?: string;
  light?: boolean;
}) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between border p-6 sm:p-7",
        light
          ? "border-ink/15 bg-white/60"
          : "border-line bg-ink-800",
        className
      )}
    >
      <div>
        <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={14}
              className={index < testimonial.rating ? "fill-flare text-flare" : "text-line"}
              aria-hidden="true"
            />
          ))}
        </div>
        <blockquote
          className={cn(
            "mt-4 text-base leading-relaxed",
            light ? "text-ink/80" : "text-chalk/90"
          )}
        >
          “{testimonial.quote}”
        </blockquote>
      </div>
      <figcaption
        className={cn(
          "mt-6 flex items-center justify-between gap-3 border-t pt-4 text-xs",
          light ? "border-ink/10 text-ink/60" : "border-line text-muted-dim"
        )}
      >
        <span className="u-label">{testimonial.author || testimonial.source || "Public review"}</span>
        <span>{formatReviewDate(testimonial.date)}</span>
      </figcaption>
    </figure>
  );
}

export function PlanCard({
  plan,
  index,
  ctaHref = "/book",
}: {
  plan: Plan;
  index: number;
  ctaHref?: string;
}) {
  const features = parseList(plan.features);
  const customPrice = Boolean(plan.price.trim());

  return (
    <Reveal
      as="article"
      delay={index * 70}
      className={cn(
        "flex flex-col border p-7 sm:p-8",
        plan.highlight
          ? "border-flare bg-ink-700"
          : "border-line bg-ink-800"
      )}
    >
      {plan.highlight ? (
        <span className="u-label -mt-3 mb-5 inline-block self-start bg-flare px-2.5 py-1 text-white">
          Most popular
        </span>
      ) : null}

      <h3 className="u-display text-3xl">{plan.name}</h3>

      <div className="mt-5 flex items-end gap-2">
        {customPrice ? (
          <>
            <span className="u-display text-5xl text-flare-soft">
              {plan.price}
            </span>
            {plan.period ? (
              <span className="pb-1.5 text-xs text-muted">{plan.period}</span>
            ) : null}
          </>
        ) : (
          <span className="u-display text-3xl text-chalk">
            Contact us for current rates
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">{plan.note}</p>

      <ul className="mt-6 grid gap-2.5 border-t border-line pt-6">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex gap-3 text-sm text-chalk/90 before:mt-2 before:h-1 before:w-4 before:shrink-0 before:bg-flare before:content-['']"
          >
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-2">
        <ButtonLink
          href={ctaHref}
          variant={plan.highlight ? "primary" : "outline"}
          className="w-full"
          data-track="pricing_cta"
        >
          {plan.cta || "Get in touch"}
          <ArrowUpRight size={15} aria-hidden="true" />
        </ButtonLink>
      </div>
    </Reveal>
  );
}
