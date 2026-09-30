import type { CollectionKey, SettingsKey } from "@/lib/content/types";

export type FieldType =
  | "text"
  | "textarea"
  | "checkbox"
  | "select"
  | "number"
  | "email"
  | "url"
  | "date"
  | "image"
  | "hours";

export interface FieldDef {
  name: string;
  label: string;
  type?: FieldType;
  options?: string[];
  hint?: string;
  rows?: number;
  required?: boolean;
}

export interface CollectionSchema {
  label: string;
  singular: string;
  description: string;
  titleField: string;
  fields: FieldDef[];
}

export interface SettingsSection {
  key: SettingsKey;
  label: string;
  description: string;
  fields: FieldDef[];
}

const LEVEL_OPTIONS = ["All levels", "Beginner", "Intermediate", "Advanced"];
const STATUS_OPTIONS = ["Open", "Waitlist", "Full", "Closed"];
const DAY_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const COLLECTION_SCHEMAS: Record<CollectionKey, CollectionSchema> = {
  programs: {
    label: "Programs",
    singular: "program",
    description:
      "Training programs shown on the home page and the programs page.",
    titleField: "name",
    fields: [
      { name: "name", label: "Name", required: true },
      {
        name: "slug",
        label: "Slug",
        hint: "Used in links, e.g. boxing-basics",
      },
      { name: "summary", label: "Summary", type: "textarea", rows: 2 },
      {
        name: "level",
        label: "Level",
        type: "select",
        options: LEVEL_OPTIONS,
      },
      { name: "whoFor", label: "Who it is for", type: "textarea", rows: 3 },
      {
        name: "learns",
        label: "What you learn",
        type: "textarea",
        rows: 4,
        hint: "One item per line",
      },
      { name: "experience", label: "Experience needed", type: "textarea", rows: 2 },
      { name: "focus", label: "Focus areas", type: "textarea", rows: 2 },
    ],
  },
  coaches: {
    label: "Coaches",
    singular: "coach",
    description: "Coach profiles shown on the coaches page.",
    titleField: "name",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "role", label: "Role", hint: "e.g. Head coach" },
      {
        name: "specialties",
        label: "Specialties",
        hint: "Comma separated, e.g. Boxing, Muay Thai",
      },
      { name: "bio", label: "Bio", type: "textarea", rows: 5 },
      { name: "photo", label: "Photo", type: "image" },
    ],
  },
  schedule: {
    label: "Schedule",
    singular: "session",
    description: "Weekly class schedule shown on the schedule page.",
    titleField: "day",
    fields: [
      { name: "day", label: "Day", type: "select", options: DAY_OPTIONS },
      { name: "time", label: "Time", hint: "e.g. 5:00 PM – 6:30 PM" },
      { name: "program", label: "Program" },
      { name: "coach", label: "Coach" },
      { name: "level", label: "Level", type: "select", options: LEVEL_OPTIONS },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
    ],
  },
  plans: {
    label: "Pricing plans",
    singular: "plan",
    description: "Pricing cards shown on the pricing page.",
    titleField: "name",
    fields: [
      { name: "name", label: "Plan name", required: true },
      { name: "price", label: "Price", hint: "e.g. ₱500 or Contact us" },
      { name: "period", label: "Period", hint: "e.g. per session" },
      { name: "note", label: "Note", type: "textarea", rows: 2 },
      {
        name: "features",
        label: "Features",
        type: "textarea",
        rows: 5,
        hint: "One feature per line",
      },
      { name: "highlight", label: "Highlight this plan", type: "checkbox" },
      { name: "cta", label: "Button label", hint: "e.g. Book this plan" },
    ],
  },
  testimonials: {
    label: "Testimonials",
    singular: "testimonial",
    description: "Public reviews shown on the testimonials page.",
    titleField: "author",
    fields: [
      { name: "quote", label: "Quote", type: "textarea", rows: 5, required: true },
      { name: "author", label: "Author", required: true },
      {
        name: "source",
        label: "Source",
        hint: "e.g. Public review",
      },
      { name: "date", label: "Date", type: "date", hint: "YYYY-MM-DD" },
      { name: "rating", label: "Rating (1–5)", type: "number" },
    ],
  },
  faqs: {
    label: "FAQs",
    singular: "question",
    description: "Frequently asked questions shown on the FAQ page.",
    titleField: "question",
    fields: [
      { name: "question", label: "Question", required: true },
      { name: "answer", label: "Answer", type: "textarea", rows: 5, required: true },
      {
        name: "group",
        label: "Group",
        hint: "e.g. First visit, Pricing, Schedule",
      },
    ],
  },
  gallery: {
    label: "Gallery",
    singular: "photo",
    description: "Photos shown on the gallery page.",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "category", label: "Category", hint: "e.g. Gym floor, Classes" },
      { name: "src", label: "Photo", type: "image", required: true },
      {
        name: "alt",
        label: "Alt text",
        hint: "Describe the photo for accessibility",
      },
    ],
  },
};

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    key: "business",
    label: "Business details",
    description:
      "Name, contact details, address, map coordinates, social links and opening hours.",
    fields: [
      { name: "name", label: "Business name", required: true },
      { name: "wordmark", label: "Wordmark", hint: "Short logo text" },
      { name: "tagline", label: "Tagline" },
      { name: "phone", label: "Phone (E.164)", hint: "e.g. +639235594226" },
      { name: "phoneDisplay", label: "Phone (display)" },
      { name: "email", label: "Email", type: "email" },
      { name: "addressLine1", label: "Address line 1" },
      { name: "addressLine2", label: "Address line 2" },
      { name: "city", label: "City" },
      { name: "region", label: "Region" },
      { name: "postal", label: "Postal code" },
      { name: "country", label: "Country" },
      { name: "directionsNote", label: "Directions note", type: "textarea", rows: 2 },
      { name: "latitude", label: "Latitude" },
      { name: "longitude", label: "Longitude" },
      { name: "facebook", label: "Facebook URL", type: "url" },
      { name: "messenger", label: "Messenger URL", type: "url" },
      { name: "instagram", label: "Instagram URL", type: "url" },
      { name: "youtube", label: "YouTube URL", type: "url" },
      { name: "hours", label: "Opening hours", type: "hours" },
      { name: "ratingValue", label: "Rating value", hint: "e.g. 5.0" },
      { name: "ratingCount", label: "Rating count", hint: "e.g. 12" },
    ],
  },
  {
    key: "hero",
    label: "Hero",
    description: "The first screen visitors see on the home page.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", hint: "Small label above the headline" },
      { name: "headline", label: "Headline", required: true },
      { name: "subheadline", label: "Subheadline", type: "textarea", rows: 3 },
      { name: "primaryLabel", label: "Primary button label" },
      { name: "primaryHref", label: "Primary button link" },
      { name: "secondaryLabel", label: "Secondary button label" },
      { name: "secondaryHref", label: "Secondary button link" },
    ],
  },
  {
    key: "home",
    label: "Home page",
    description: "Section headings and copy for the home page.",
    fields: [
      {
        name: "benefits",
        label: "Benefits",
        type: "textarea",
        rows: 5,
        hint: "One per line, format: Title | Description",
      },
      { name: "programsHeading", label: "Programs heading" },
      { name: "programsText", label: "Programs intro", type: "textarea", rows: 2 },
      { name: "environmentHeading", label: "First visit heading" },
      { name: "environmentText", label: "First visit intro", type: "textarea", rows: 2 },
      { name: "proofHeading", label: "Testimonials heading" },
      { name: "proofText", label: "Testimonials intro", type: "textarea", rows: 2 },
      { name: "ctaHeading", label: "Bottom CTA heading" },
      { name: "ctaText", label: "Bottom CTA text", type: "textarea", rows: 2 },
    ],
  },
  {
    key: "about",
    label: "About page",
    description: "Story and values on the about page.",
    fields: [
      { name: "headline", label: "Headline" },
      { name: "lead", label: "Lead paragraph", type: "textarea", rows: 3 },
      { name: "body", label: "Body", type: "textarea", rows: 8, hint: "Separate paragraphs with a blank line" },
      {
        name: "values",
        label: "Values",
        type: "textarea",
        rows: 5,
        hint: "One per line, format: Title | Description",
      },
    ],
  },
  {
    key: "firstVisit",
    label: "First visit page",
    description: "The step-by-step guide for first-time visitors.",
    fields: [
      { name: "headline", label: "Headline" },
      { name: "intro", label: "Intro", type: "textarea", rows: 3 },
      {
        name: "steps",
        label: "Steps",
        type: "textarea",
        rows: 6,
        hint: "One step per line, format: Title | Description",
      },
      { name: "closing", label: "Closing note", type: "textarea", rows: 2 },
    ],
  },
  {
    key: "trial",
    label: "Trial booking",
    description: "Copy used by every booking form and trial CTA.",
    fields: [
      { name: "label", label: "Button label", hint: "e.g. Book a trial session" },
      { name: "headline", label: "Form headline" },
      { name: "intro", label: "Form intro", type: "textarea", rows: 3 },
      {
        name: "successMessage",
        label: "Success message",
        type: "textarea",
        rows: 3,
      },
    ],
  },
  {
    key: "seo",
    label: "SEO",
    description: "Titles, meta description and social preview text.",
    fields: [
      { name: "titleTemplate", label: "Title template", hint: "Use %s for the page name" },
      { name: "description", label: "Meta description", type: "textarea", rows: 3 },
      { name: "keywords", label: "Keywords", hint: "Comma separated" },
      { name: "ogTitle", label: "Social title" },
      { name: "ogDescription", label: "Social description", type: "textarea", rows: 3 },
    ],
  },
  {
    key: "announcement",
    label: "Announcement bar",
    description: "Optional banner shown above the header on every page.",
    fields: [
      { name: "enabled", label: "Show announcement bar", type: "checkbox" },
      { name: "text", label: "Text", type: "textarea", rows: 2 },
      { name: "linkLabel", label: "Link label" },
      { name: "linkHref", label: "Link URL" },
    ],
  },
];

export function parseField(formData: FormData, field: FieldDef): unknown {
  switch (field.type) {
    case "checkbox":
      return formData.get(field.name) === "on";
    case "number": {
      const raw = String(formData.get(field.name) ?? "").trim();
      return raw === "" ? 0 : Number(raw);
    }
    default:
      return String(formData.get(field.name) ?? "").trim();
  }
}

export function parseFields(
  fields: FieldDef[],
  formData: FormData
): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === "hours") continue;
    data[field.name] = parseField(formData, field);
  }
  return data;
}

export function parseHours(formData: FormData): unknown[] {
  const rows: unknown[] = [];
  for (let index = 0; index < 7; index += 1) {
    const day = String(formData.get(`hours.${index}.day`) ?? "");
    if (!day) continue;
    rows.push({
      day,
      open: String(formData.get(`hours.${index}.open`) ?? "").trim(),
      close: String(formData.get(`hours.${index}.close`) ?? "").trim(),
      closed: formData.get(`hours.${index}.closed`) === "on",
    });
  }
  return rows;
}
