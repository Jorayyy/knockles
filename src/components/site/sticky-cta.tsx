import { Phone, MessageCircle } from "lucide-react";
import { getSettings } from "@/lib/content/access";
import { ButtonLink } from "@/components/ui/button";

export async function StickyMobileCTA() {
  const { business, hero, trial } = await getSettings();
  const messenger = hero.secondaryHref || business.messenger;
  const trialLabel = trial.label.length > 14 ? "Book trial" : trial.label;

  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3 gap-2 p-2.5">
        <ButtonLink
          href={`tel:${business.phone}`}
          variant="outline"
          size="md"
          data-track="cta_phone_sticky"
          className="min-h-11 px-2 text-[0.68rem]"
        >
          <Phone size={15} aria-hidden="true" />
          Call
        </ButtonLink>
        <ButtonLink
          href={messenger}
          variant="outline"
          size="md"
          data-track="cta_messenger_sticky"
          className="min-h-11 px-2 text-[0.68rem]"
        >
          <MessageCircle size={15} aria-hidden="true" />
          Message
        </ButtonLink>
        <ButtonLink
          href="/book"
          variant="primary"
          size="md"
          data-track="cta_trial_sticky"
          className="min-h-11 px-2 text-[0.68rem]"
        >
          {trialLabel}
        </ButtonLink>
      </div>
    </nav>
  );
}
