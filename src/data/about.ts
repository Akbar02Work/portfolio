import type { Locale } from "@/i18n/locales";

export type AboutPrinciple = {
  title: string;
  text: string;
};

export type ExperienceEntry = {
  period: string;
  role: string;
  place: string;
  note?: string;
  /** Short badge, e.g. "NDA" for work that cannot be shown publicly. */
  badge?: string;
};

export type AboutContent = {
  bio: string[];
  principles: AboutPrinciple[];
  experience: ExperienceEntry[];
  education: ExperienceEntry[];
  meta: string[];
};

export const aboutContent: Record<Locale, AboutContent> = {
  en: {
    bio: [
      "I'm an Android engineer who owns features end to end — from architecture and API contracts to release validation on real devices.",
      "I care most about the parts users only notice when they break: offline recovery, retries, secure sessions, and AI output that stays reliable.",
    ],
    principles: [
      { title: "Offline-first", text: "The app keeps working without a network and recovers on its own." },
      { title: "AI with a purpose", text: "Models become structured, dependable features — not demos." },
      { title: "Release-ready", text: "Validated on physical devices before anything ships." },
    ],
    experience: [
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
    ],
    education: [
      { period: "2025 — now", role: "Master's degree", place: "BSUIR" },
      {
        period: "2021 — 2025",
        role: "Bachelor's degree",
        place: "TUIT → BSUIR",
      },
    ],
    meta: ["Open to remote opportunities", "Tashkent", "UTC+5"],
  },
  ru: {
    bio: [
      "Я Android-разработчик и веду фичи от начала до конца — от архитектуры и API-контрактов до проверки релиза на реальных устройствах.",
      "Больше всего мне важно то, что пользователь замечает, только когда оно ломается: офлайн-восстановление, повторы запросов, безопасные сессии и стабильный результат от AI.",
    ],
    principles: [
      { title: "Offline-first", text: "Приложение работает без сети и само восстанавливается." },
      { title: "AI по делу", text: "Модели превращаются в надёжные структурированные функции, а не в демо." },
      { title: "Готово к релизу", text: "Проверяю на реальных устройствах, прежде чем что-то уходит в релиз." },
    ],
    experience: [
      {
        period: "2026 — сейчас",
        role: "Android-разработчик",
        place: "Market-R",
        note: "Нативные приложения для касс, ритейла и транспорта — платежи, авторизация, офлайн-восстановление.",
        badge: "NDA",
      },
      {
        period: "2026 — сейчас",
        role: "Основатель",
        place: "Lumingo",
        note: "Адаптивный продукт для изучения языков — Web и Android.",
      },
    ],
    education: [
      { period: "2025 — сейчас", role: "Магистратура", place: "БГУИР" },
      {
        period: "2021 — 2025",
        role: "Бакалавриат",
        place: "ТАТУ → БГУИР",
      },
    ],
    meta: ["Открыт к удалённой работе", "Ташкент", "UTC+5"],
  },
};
