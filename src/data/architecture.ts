import type { Locale } from "@/i18n/locales";

export type ArchitectureNode = {
  /** Mono caption, e.g. "01 · Capture". */
  step: string;
  title: string;
  detail: string;
};

export type ArchitectureDiagram = {
  label: string;
  /** Linear stages before the fork. */
  before: ArchitectureNode[];
  /** Alternative strategies chosen per note. */
  branches: ArchitectureNode[];
  branchJoiner: string;
  /** Linear stages after the fork. */
  after: ArchitectureNode[];
};

/** Processing diagrams per project slug; only cases with a diagram appear here. */
export const architectureBySlug: Record<string, Record<Locale, ArchitectureDiagram>> = {
  voicenotes: {
    en: {
      label: "AI Voice Notes processing architecture",
      before: [
        { step: "01 · Capture", title: "Recording", detail: "AAC in app-private storage" },
        { step: "02 · Route", title: "Processing router", detail: "Picks a strategy per note" },
      ],
      branches: [
        { step: "Cloud", title: "Gemini · OpenAI · Groq", detail: "User's own key, encrypted on device" },
        { step: "On-device", title: "sherpa-onnx Zipformer", detail: "Russian ASR, checksum-verified model" },
      ],
      branchJoiner: "or",
      after: [
        { step: "03 · Structure", title: "Structured note", detail: "Title, summary, full transcript" },
        { step: "04 · Store", title: "Room library", detail: "Searchable, pinned, original audio" },
      ],
    },
    ru: {
      label: "Архитектура обработки AI Voice Notes",
      before: [
        { step: "01 · Запись", title: "Запись", detail: "AAC в приватной папке приложения" },
        { step: "02 · Маршрут", title: "Роутер обработки", detail: "Выбирает стратегию для заметки" },
      ],
      branches: [
        { step: "Облако", title: "Gemini · OpenAI · Groq", detail: "Ключ пользователя, зашифрован на устройстве" },
        { step: "На устройстве", title: "sherpa-onnx Zipformer", detail: "Русская речь, модель с проверкой контрольной суммы" },
      ],
      branchJoiner: "или",
      after: [
        { step: "03 · Структура", title: "Заметка", detail: "Заголовок, саммари, полная расшифровка" },
        { step: "04 · Хранение", title: "Библиотека Room", detail: "Поиск, закрепление, исходное аудио" },
      ],
    },
  },
};
