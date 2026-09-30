export const SITE_NAV = [
  { label: "Programs", href: "/programs" },
  { label: "Schedule", href: "/schedule" },
  { label: "Pricing", href: "/pricing" },
  { label: "First visit", href: "/first-visit" },
  { label: "About", href: "/about" },
] as const;

export const FOOTER_NAV = [
  { label: "Programs", href: "/programs" },
  { label: "Schedule", href: "/schedule" },
  { label: "Membership & pricing", href: "/pricing" },
  { label: "Your first visit", href: "/first-visit" },
  { label: "Coaches", href: "/coaches" },
  { label: "Gallery", href: "/gallery" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Book a trial", href: "/book" },
] as const;

export const MOBILE_NAV = [
  { label: "Home", href: "/" },
  ...FOOTER_NAV,
] as const;

export const PAGE_DESCRIPTIONS: Record<string, string> = {
  "/programs":
    "Boxing, Muay Thai, private coaching and beginner sessions at Knock'ls Boxing Gym in Mactan, Cebu.",
  "/schedule":
    "Opening hours and training schedule for Knock'ls Boxing Gym, Mactan, Cebu.",
  "/pricing":
    "Membership, trial session and private coaching rates at Knock'ls Boxing Gym, Mactan, Cebu.",
  "/first-visit":
    "What to expect on your first visit to Knock'ls Boxing Gym — from message to first round.",
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
