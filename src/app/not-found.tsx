import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("/", "Page not found");
}

const LINKS = [
  { href: "/programs", label: "Programs" },
  { href: "/schedule", label: "Schedule" },
  { href: "/pricing", label: "Pricing" },
  { href: "/first-visit", label: "Your first visit" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-line bg-ink">
          <div className="u-shell flex min-h-[70vh] flex-col justify-center py-20 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-flare/50 text-flare-soft">
              <Search size={22} aria-hidden="true" />
            </div>
            <p className="u-label text-flare-soft">404</p>
            <div className="mt-4">
              <SectionHeading
                align="center"
                title="That round was thrown too hard"
                text="The page you are looking for does not exist — pick a round below and keep training."
                className="mx-auto max-w-xl"
              />
            </div>
            <div className="mx-auto mt-8 flex flex-wrap justify-center gap-3">
              {LINKS.map((link) => (
                <ButtonLink
                  key={link.href}
                  href={link.href}
                  variant="outline"
                  size="sm"
                >
                  {link.label}
                </ButtonLink>
              ))}
            </div>
            <div className="mt-8">
              <ButtonLink href="/" variant="primary" data-track="cta_404_home">
                Back to the home page
                <ArrowRight size={15} aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
