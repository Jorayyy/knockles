export const SITE_NAV = [
  { label: "Programs", href: "/programs" },
  { label: "Pricing", href: "/pricing" },
  { label: "First visit", href: "/first-visit" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_GROUPS = [
  {
    label: "Train",
    links: [
      { label: "Programs", href: "/programs" },
      { label: "Membership & pricing", href: "/pricing" },
      { label: "Weekly schedule", href: "/schedule" },
      { label: "Your first visit", href: "/first-visit" },
      { label: "Book a session", href: "/book" },
    ],
  },
  {
    label: "The gym",
    links: [
      { label: "About Knock'ls", href: "/about" },
      { label: "Coaches", href: "/coaches" },
      { label: "Gallery", href: "/gallery" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
    ],
  },
] as const;

export const FOOTER_NAV: { label: string; href: string }[] =
  FOOTER_GROUPS.flatMap(
    (group): { label: string; href: string }[] =>
      group.links.map((link) => ({ label: link.label, href: link.href }))
  );

export const MOBILE_NAV = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Pricing", href: "/pricing" },
  { label: "First visit", href: "/first-visit" },
  { label: "Schedule", href: "/schedule" },
  { label: "Gallery", href: "/gallery" },
  { label: "Coaches", href: "/coaches" },
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const PUBLIC_ROUTES = [
  "/",
  "/programs",
  "/pricing",
  "/first-visit",
  "/schedule",
  "/gallery",
  "/coaches",
  "/about",
  "/testimonials",
  "/faq",
  "/contact",
  "/book",
] as const;

export const PAGE_DESCRIPTIONS: Record<string, string> = {
  "/programs":
    "Boxing, Muay Thai, private coaching and beginner sessions at Knock'ls Boxing Gym in Mactan, Cebu.",
  "/schedule":
    "Opening hours and training schedule for Knock'ls Boxing Gym, Mactan, Cebu.",
  "/pricing":
    "Membership, trial session and private coaching rates at Knock'ls Boxing Gym, Mactan, Cebu.",
  "/first-visit":
    "Never boxed before? Here is exactly what happens on your first visit to Knock'ls Boxing Gym in Mactan, Cebu.",
  "/about":
    "Knock'ls Boxing Gym — a coaching-led boxing and Muay Thai gym in Mactan, Cebu.",
  "/coaches":
    "The coaching team at Knock'ls Boxing Gym, Mactan, Cebu.",
  "/gallery":
    "Photos of training, the gym floor and the community at Knock'ls Boxing Gym, Mactan, Cebu.",
  "/testimonials":
    "What members and visitors say about training at Knock'ls Boxing Gym, Mactan, Cebu.",
  "/faq":
    "Answers for first-timers — experience, gear, prices, hours and location at Knock'ls Boxing Gym, Mactan, Cebu.",
  "/contact":
    "Contact Knock'ls Boxing Gym — phone, Messenger, map and directions in Mactan, Cebu.",
  "/book":
    "Book a trial session at Knock'ls Boxing Gym, Mactan, Cebu.",
};
