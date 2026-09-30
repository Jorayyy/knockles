export type CollectionKey =
  | "programs"
  | "coaches"
  | "schedule"
  | "plans"
  | "testimonials"
  | "faqs"
  | "gallery";

export interface StoredItem<T = Record<string, unknown>> {
  id: string;
  collection: CollectionKey;
  sort: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  data: T;
}

export interface Program {
  name: string;
  slug: string;
  summary: string;
  level: string;
  whoFor: string;
  learns: string;
  experience: string;
  focus: string;
}

export interface Coach {
  name: string;
  role: string;
  specialties: string;
  bio: string;
  photo: string;
}

export interface ScheduleEntry {
  day: string;
  time: string;
  program: string;
  coach: string;
  level: string;
  status: string;
}

export interface Plan {
  name: string;
  price: string;
  period: string;
  note: string;
  features: string;
  highlight: boolean;
  cta: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  source: string;
  date: string;
  rating: number;
}

export interface Faq {
  question: string;
  answer: string;
  group: string;
}

export interface GalleryImage {
  title: string;
  category: string;
  src: string;
  alt: string;
}

export interface Hour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface BusinessSettings {
  name: string;
  wordmark: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  directionsNote: string;
  latitude: string;
  longitude: string;
  facebook: string;
  messenger: string;
  instagram: string;
  youtube: string;
  hours: Hour[];
  ratingValue: string;
  ratingCount: string;
}

export interface HeroSettings {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface HomeSettings {
  benefits: string;
  programsHeading: string;
  programsText: string;
  environmentHeading: string;
  environmentText: string;
  proofHeading: string;
  proofText: string;
  ctaHeading: string;
  ctaText: string;
}

export interface AboutSettings {
  headline: string;
  lead: string;
  body: string;
  values: string;
}

export interface FirstVisitSettings {
  headline: string;
  intro: string;
  steps: string;
  closing: string;
}

export interface TrialSettings {
  label: string;
  headline: string;
  intro: string;
  successMessage: string;
}

export interface SeoSettings {
  titleTemplate: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
}

export interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  linkLabel: string;
  linkHref: string;
}

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  program: string;
  level: string;
  preferred: string;
  message: string;
  source: string;
  status: "new" | "contacted" | "booked" | "closed";
}

export interface SiteSettings {
  business: BusinessSettings;
  hero: HeroSettings;
  home: HomeSettings;
  about: AboutSettings;
  firstVisit: FirstVisitSettings;
  trial: TrialSettings;
  seo: SeoSettings;
  announcement: AnnouncementSettings;
}

export type SettingsKey = keyof SiteSettings;
