export const aboutBio = [
  "I'm an Android engineer who owns features end to end — from architecture and API contracts to release validation on real devices.",
  "I care most about the parts users only notice when they break: offline recovery, retries, secure sessions, and AI output that stays reliable.",
];

export type AboutPrinciple = {
  title: string;
  text: string;
};

export const aboutPrinciples: AboutPrinciple[] = [
  {
    title: "Offline-first",
    text: "The app keeps working without a network and recovers on its own.",
  },
  {
    title: "AI with a purpose",
    text: "Models become structured, dependable features — not demos.",
  },
  {
    title: "Release-ready",
    text: "Validated on physical devices before anything ships.",
  },
];

export type ExperienceEntry = {
  period: string;
  role: string;
  place: string;
  note?: string;
  /** Short badge, e.g. "NDA" for work that cannot be shown publicly. */
  badge?: string;
};

export const experience: ExperienceEntry[] = [
  {
    period: "2026 — now",
    role: "Android Engineer",
    place: "Market-R",
    note: "Native apps for cashbox, retail & transport — payments, auth, offline recovery.",
    badge: "NDA",
  },
  {
    period: "2026 — now",
    role: "Founder",
    place: "Lumingo",
    note: "Adaptive language-learning product across Web and Android.",
  },
];

export const education: ExperienceEntry[] = [
  { period: "2025 — now", role: "Master's degree", place: "BSUIR" },
  { period: "2023 — 2025", role: "Bachelor's degree", place: "BSUIR" },
];

export const aboutMeta = ["Tashkent", "UTC+5", "RU · EN · UZ"];
