import { Phone, MessageCircle } from "lucide-react";
import { getSettings } from "@/lib/content/access";
import { ButtonLink } from "@/components/ui/button";

export async function StickyMobileCTA() {
  const { business, hero, trial } = await getSettings();
  const messenger = hero.secondaryHref || business.messenger;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3 gap-2 p-3">
        <ButtonLink
          href={`tel:${business.phone}`}
          variant="outline"
          size="sm"
          data-track="cta_phone_sticky"
          className="px-2"
        >
          <Phone size={14} aria-hidden="true" />
          Call
        </ButtonLink>
        <ButtonLink
          href={messenger}
          variant="outline"
          size="sm"
          data-track="cta_messenger_sticky"
          className="px-2"
        >
          <MessageCircle size={14} aria-hidden="true" />
          Message
        </ButtonLink>
        <ButtonLink
          href="/book"
          variant="primary"
          size="sm"
          data-track="cta_trial_sticky"
          className="px-2"
        >
          {trial.label.split(" ")[0]}
        </ButtonLink>
      </div>
    </div>
  );
}
