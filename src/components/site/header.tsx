import { MessageCircle } from "lucide-react";
import { getSettings } from "@/lib/content/access";
import { SITE_NAV } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";
import { Wordmark } from "./wordmark";

export async function Header() {
  const { business, hero, trial } = await getSettings();
  const messenger = hero.secondaryHref || business.messenger;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/92 backdrop-blur-md supports-[backdrop-filter]:bg-ink/80">
      <div className="u-shell flex h-16 items-center justify-between gap-6 md:h-20">
        <Wordmark
          wordmark={business.wordmark}
          tagline="Boxing Gym"
          logo="/logo.jpg"
        />

        <nav
          className="hidden items-center gap-6 lg:flex xl:gap-7"
          aria-label="Primary navigation"
        >
          {SITE_NAV.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink
            href={messenger}
            variant="outline"
            size="sm"
            className="hidden xl:inline-flex"
            data-track="cta_messenger"
          >
            <MessageCircle size={14} aria-hidden="true" />
            Message us
          </ButtonLink>
          <ButtonLink
            href="/book"
            variant="primary"
            size="sm"
            data-track="cta_trial"
          >
            {trial.label}
          </ButtonLink>
        </div>

        <MobileNav
          wordmark={business.wordmark}
          messenger={messenger}
          phone={business.phone}
          phoneDisplay={business.phoneDisplay || business.phone}
          trialLabel={trial.label}
        />
      </div>
    </header>
  );
}
