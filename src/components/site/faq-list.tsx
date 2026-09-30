import { Plus } from "lucide-react";
import type { Faq } from "@/lib/content/types";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) {
    return (
      <p className="text-muted">
        Questions are being updated — message the gym and we will answer directly.
      </p>
    );
  }

  return (
    <div className="border-t border-line">
      {faqs.map((faq, index) => (
        <details key={faq.question} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-start gap-4 py-5 text-left transition-colors hover:text-flare-soft sm:gap-6">
            <span className="u-label mt-1.5 w-6 shrink-0 text-muted-dim">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="u-display flex-1 text-xl leading-snug sm:text-2xl">
              {faq.question}
            </span>
            <Plus
              size={18}
              aria-hidden="true"
              className="mt-1 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45"
            />
          </summary>
          <div className="pb-6 pl-10 pr-8 sm:pl-14">
            <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              {faq.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
