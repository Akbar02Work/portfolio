import type { Locale } from "../i18n/locales.ts";
import { projectTranslationsRu } from "./i18n/projects.ru.ts";

export type ProjectMediaType = "phone" | "browser";
export type ProjectPlatformId = "android" | "web" | "ios";

export interface ProjectPlatform {
  id: ProjectPlatformId;
  label: string;
  status: string;
  mediaType: ProjectMediaType;
}

/** A case feature: a plain line, or a short title with one sentence of detail. */
export type ProjectFeatureCopy = string | { title: string; description: string };

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectPlatformContent extends ProjectPlatform {
  summary: string;
  role: string;
  metrics: ProjectMetric[];
  overview: string;
  challenge: string;
  stack: string[];
  keyFeatures: ProjectFeatureCopy[];
  engineeringNote: string;
}

export interface ProjectData {
  published: boolean;
  /** Stable public identifier when the display title changes. */
  slug?: string;
  title: string;
  description: string;
  role: string;
  year: number;
  metrics: ProjectMetric[];
  media: {
    type: ProjectMediaType;
    alt: string;
  };
  platforms?: ProjectPlatformContent[];
  links: {
    github?: string;
    website?: string;
  };
  gallery: Array<{
    imageUrl: string;
    caption: string;
    platform?: ProjectPlatformId;
    mediaType?: ProjectMediaType;
  }>;
  overview: string;
  challenge: string;
  stackAndArchitecture: {
    stack: string[];
  };
  keyFeatures: ProjectFeatureCopy[];
  engineeringNote: string;
}

/** Localized copy for one project; every field falls back to English. */
export type ProjectTranslation = Partial<
  Pick<ProjectData, "description" | "role" | "metrics" | "overview" | "challenge" | "keyFeatures" | "engineeringNote">
> & {
  mediaAlt?: string;
  galleryCaptions?: string[];
  platforms?: Partial<
    Record<
      ProjectPlatformId,
      Partial<Pick<ProjectPlatformContent, "status" | "summary" | "role" | "metrics" | "overview" | "challenge" | "stack" | "keyFeatures" | "engineeringNote">>
    >
  >;
};

type CatalogProject = ProjectData & {
  id: number;
  slug: string;
  coverImage: string;
};

type CreateProjectInput = Omit<ProjectData, "engineeringNote" | "published"> & {
  engineeringNote?: ProjectData["engineeringNote"];
  published?: ProjectData["published"];
};

const DEFAULT_ENGINEERING_NOTE = "";

export const createProject = (project: CreateProjectInput): ProjectData => ({
  ...project,
  published: project.published ?? true,
  engineeringNote: project.engineeringNote ?? DEFAULT_ENGINEERING_NOTE,
});

const toProjectSlug = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const projectDefinitions = [
  createProject({
    slug: "voicenotes",
    title: "AI Voice Notes",
    description:
      "Native Android voice notes that turn short recordings into searchable notes — cloud AI when useful, private on-device transcription when it matters.",
    role: "Product design & Android engineering — solo build",
    year: 2026,
    // TODO(Akbar): replace with measured numbers when you have them (keep 3 items).
    // Suggested metrics — measure, then swap the values in and delete this note:
    //   { value: "~X s", label: "to transcribe 30 s of speech on-device" }
    //     Local mode, airplane mode on, record a 30 s clip, time from "stop" to the
    //     transcript appearing; average 3 runs, note the phone model.
    //   { value: "X MB", label: "offline Russian ASR model, downloaded once" }
    //     Size of the model the app downloads (Settings → offline model, or the
    //     files in the app's private storage).
    //   { value: "X MB", label: "release APK" }
    //     ./gradlew assembleRelease → app/build/outputs/apk/release/*.apk size
    //     (or the download size shown in Play Console for an AAB).
    // Russian labels live in src/data/i18n/projects.ru.ts (same order).
    metrics: [
      { value: "Offline", label: "Russian ASR on device" },
      { value: "Resume", label: "verified model downloads" },
      { value: "Keys", label: "encrypted on device" },
    ],
    media: {
      type: "phone",
      alt: "AI Voice Notes notes list with generated titles, summaries, and one-tap recording",
    },
    links: {
      github: "https://github.com/Akbar02Work/AI-Voice-Notes",
    },
    gallery: [
      {
        imageUrl: "/projects/voicenotes/screen-01.png",
        caption: "Notes list — structured AI summaries and a one-tap record button.",
      },
      {
        imageUrl: "/projects/voicenotes/screen-02.png",
        caption: "Processing — live status while a new recording is summarized.",
      },
      {
        imageUrl: "/projects/voicenotes/screen-03.png",
        caption: "Note detail — playback, summary, and full transcription.",
      },
      {
        imageUrl: "/projects/voicenotes/screen-04.png",
        caption: "Cloud setup — choose Gemini, OpenAI, or Groq while keeping the provider key on-device.",
      },
      {
        imageUrl: "/projects/voicenotes/screen-05.png",
        caption: "Model selection — discover separate transcription and summary models for the active provider.",
      },
      {
        imageUrl: "/projects/voicenotes/screen-06.png",
        caption: "Settings — provider, model catalog, theme, language, and offline model controls.",
      },
    ],
    overview:
      "AI Voice Notes turns a short recording into a durable note: playable audio, transcription, generated title, and summary, all kept in a searchable Room-backed library. Cloud processing uses the provider selected by the user; the on-device path keeps Russian transcription on the phone after its model is installed.",
    challenge:
      "The product challenge was not simply calling an AI API. It was designing one reliable flow across recording, processing, failure, retry, provider and model selection, and offline inference—without making privacy or network availability an afterthought.",
    stackAndArchitecture: {
      stack: [
        "Kotlin",
        "Jetpack Compose",
        "sherpa-onnx",
        "Gemini API",
        "OpenAI API",
        "Groq API",
        "Room",
        "WorkManager",
        "Hilt",
      ],
    },
    keyFeatures: [
      {
        title: "Nothing is lost without a network",
        description:
          "Every recording is saved before processing starts. A network failure leaves a draft that reprocesses itself when the connection returns; any other error keeps the audio with a one-tap retry.",
      },
      {
        title: "Fully on-device mode",
        description:
          "Russian speech is transcribed on the phone by an INT8 Zipformer model through sherpa-onnx, and the title and summary are extracted locally. Once the model is installed, no network is needed.",
      },
      {
        title: "Model downloads that cannot break the app",
        description:
          "Downloads resume with HTTP Range requests, every file is checked against its SHA-256, and a new model replaces the old one only after it fully verifies.",
      },
      {
        title: "Bring your own provider",
        description:
          "Gemini, OpenAI or Groq: the app validates the key, finds compatible models and keeps transcription and summary models separate. Keys are encrypted and excluded from backup.",
      },
    ],
    engineeringNote:
      "Recording, processing and storage are separate stages. The processing router picks a strategy for each note — a cloud provider or local sherpa-onnx inference — and every strategy returns the same structured result: title, summary and transcript. Room stores that result while the original audio stays in app-private storage, so a failed note can always be reprocessed from its source file.",
  }),
  createProject({
    title: "Lumingo",
    published: false,
    description:
      "Language learning built around your goal, level, and available time — with a personal learning path and guidance from Lumi.",
    role: "Founder · Product direction · Android & Web development",
    year: 2026,
    metrics: [
      { value: "Web", label: "public beta" },
      { value: "Android", label: "release candidate" },
      { value: "iOS", label: "in development" },
    ],
    media: {
      type: "phone",
      alt: "Lumingo adaptive learning roadmap shown across Android, Web, and iOS",
    },
    platforms: [
      {
        id: "android",
        label: "Android",
        status: "Release candidate",
        mediaType: "phone",
        summary:
          "A language-learning app for Android with a personal learning path, daily activities, and guidance from Lumi.",
        role: "Founder · Product direction · Android engineering",
        metrics: [
          { value: "Native", label: "Kotlin client" },
          { value: "RC", label: "release candidate" },
          { value: "Shared", label: "identity + learning state" },
        ],
        overview:
          "Learners follow a plan built around their goal, level, and available time. The native Android client brings together daily activities, reviews, and Lumi guidance, using the same account and learning progress as the web product. The interface is available in English and Russian.",
        challenge:
          "Bring the web product's learning flow to Android while handling the app lifecycle, loading failures, and repeated actions. Account access, progress, and AI operations need to stay consistent across both clients.",
        stack: [
          "Kotlin",
          "Jetpack Compose",
          "Convex",
          "Clerk",
          "Ktor",
          "Hilt",
        ],
        keyFeatures: [
          {
            title: "A clear daily plan",
            description:
              "Goals, weekly roadmaps, daily activities, and reviews form one learning flow in the native Compose interface.",
          },
          {
            title: "Lumi in context",
            description:
              "Lumi's guidance stays connected to the learner's active goal and learning progress.",
          },
          {
            title: "One account across clients",
            description:
              "Android and Web share the same account and learning state through Clerk and Convex.",
          },
          {
            title: "Recovery when something fails",
            description:
              "Loading, retries, and recovery respect the Android lifecycle, with guards against duplicate actions.",
          },
        ],
        engineeringNote:
          "Compose owns native navigation and screen state. The client uses Convex directly for learning data, Clerk for identity, and Ktor routes for LLM operations. Explicit mobile API contracts keep shared product behavior separate from the web implementation.",
      },
      {
        id: "web",
        label: "Web",
        status: "Public beta",
        mediaType: "browser",
        summary:
          "A web app for language learning with a plan tailored to your goal, level, and available time, plus guidance from Lumi.",
        role: "Founder · Product direction · Web development",
        metrics: [
          { value: "Live", label: "public beta" },
          { value: "2", label: "English + Russian" },
          { value: "Adaptive", label: "goal-based roadmap" },
        ],
        overview:
          "The web product is available in public beta. Onboarding captures the learner's goal, level, and schedule, then builds an adaptive roadmap with daily activities and reviews. Lumi provides guidance connected to that plan. The interface is available in English and Russian.",
        challenge:
          "Turn onboarding, an adaptive roadmap, and AI guidance into one clear learning flow. The interface needs to stay responsive while backend operations are validated, rate-limited, and observable during the public beta.",
        stack: [
          "TypeScript",
          "Next.js",
          "React",
          "Convex",
          "Clerk",
          "OpenAI",
          "Upstash",
          "PostHog",
        ],
        keyFeatures: [
          {
            title: "A plan around your goal",
            description:
              "Onboarding uses the learner's goal, current level, pace, and available time to shape the learning path.",
          },
          {
            title: "A clear daily plan",
            description:
              "The adaptive roadmap organizes weeks, daily activities, and reviews, with visible progress between phases.",
          },
          {
            title: "Lumi in context",
            description:
              "Lumi's guidance stays connected to the learner's active goal and learning progress.",
          },
          {
            title: "One account across clients",
            description:
              "Clerk and Convex keep identity and learning state shared with Android, while reactive updates keep the web interface current.",
          },
        ],
        engineeringNote:
          "Next.js and React render the interface, Convex manages reactive learning state, and Clerk handles identity. OpenAI operations use explicit validation and Upstash rate limits. PostHog and performance telemetry help evaluate the public beta.",
      },
      {
        id: "ios",
        label: "iOS",
        status: "In development",
        mediaType: "phone",
        summary:
          "A native iOS client in development, planned to bring Lumingo's learning paths and Lumi guidance to Apple devices.",
        role: "Founder · Product direction · iOS planning",
        metrics: [
          { value: "Next", label: "native client" },
          { value: "Planned", label: "Swift + SwiftUI" },
          { value: "Shared", label: "product contracts" },
        ],
        overview:
          "The planned iOS client will bring goals, roadmaps, daily activities, and Lumi to Apple devices. It will use the same account and learning state as Web and Android, with navigation and interactions designed for iOS.",
        challenge:
          "Reuse shared product and API contracts while designing navigation, state ownership, and interactions for SwiftUI. Implementation and release validation are still ahead.",
        stack: [
          "Swift · Planned",
          "SwiftUI · Planned",
        ],
        keyFeatures: [
          {
            title: "Daily learning",
            description:
              "Goals, roadmaps, daily activities, and Lumi guidance are planned for the native SwiftUI client.",
          },
          {
            title: "A shared account",
            description:
              "The client is planned to use the existing identity, learning state, and mobile API contracts.",
          },
          {
            title: "Native iOS interactions",
            description:
              "Navigation and screen state will be designed around Apple platform conventions and SwiftUI.",
          },
          {
            title: "Release readiness",
            description:
              "Implementation will begin after the Android release candidate is stabilized. Product parity will need to be verified before an iOS release.",
          },
        ],
        engineeringNote:
          "Swift and SwiftUI are the planned stack. Existing identity, learning state, design tokens, and mobile API contracts provide the foundation. Native implementation is scheduled after Android stabilization; the iOS client has not been released.",
      },
    ],
    links: {
      website: "https://lumingo.me",
    },
    gallery: [
      {
        imageUrl: "/projects/lumingo/android-01.svg",
        caption: "Android — active goals and the next learning activity.",
        platform: "android",
        mediaType: "phone",
      },
      {
        imageUrl: "/projects/lumingo/android-02.svg",
        caption: "Android — the weekly roadmap and daily activities.",
        platform: "android",
        mediaType: "phone",
      },
      {
        imageUrl: "/projects/lumingo/android-03.svg",
        caption: "Android — Lumi guidance connected to the learner's goal.",
        platform: "android",
        mediaType: "phone",
      },
      {
        imageUrl: "/projects/lumingo/web-01.svg",
        caption: "Web — the public-beta landing page.",
        platform: "web",
        mediaType: "browser",
      },
      {
        imageUrl: "/projects/lumingo/web-02.svg",
        caption: "Web — setting a goal, level, and learning schedule.",
        platform: "web",
        mediaType: "browser",
      },
      {
        imageUrl: "/projects/lumingo/web-03.svg",
        caption: "Web — the adaptive roadmap and current learning week.",
        platform: "web",
        mediaType: "browser",
      },
      {
        imageUrl: "/projects/lumingo/ios-in-development.svg",
        caption: "iOS — native client in development; final screens are still ahead.",
        platform: "ios",
        mediaType: "phone",
      },
    ],
    overview:
      "Lumingo turns a learner's goal, level, and weekly availability into an adaptive plan with daily activities, reviews, and Lumi guidance. Web and Android share the same account and learning progress. The web product is in public beta, Android is a release candidate, and iOS is in development.",
    challenge:
      "Keep learning rules, account access, progress, and AI workflows consistent across clients while giving each platform its own navigation, state handling, and recovery behavior.",
    stackAndArchitecture: {
      stack: [
        "Kotlin",
        "Jetpack Compose",
        "Next.js",
        "Convex",
        "Clerk",
        "Ktor",
        "Hilt",
      ],
    },
    keyFeatures: [
      {
        title: "A plan around your goal",
        description:
          "The learner's goal, level, pace, and available time shape a roadmap with weekly activities and reviews.",
      },
      {
        title: "Lumi in context",
        description:
          "Lumi's guidance stays connected to the learner's active goal and learning progress.",
      },
      {
        title: "One account across clients",
        description:
          "Web and Android share identity and learning state, with interfaces available in English and Russian.",
      },
      {
        title: "Native learning on Android",
        description:
          "Compose brings goals, daily activities, and Lumi into a native client with retry, recovery, and duplicate-action guards.",
      },
    ],
    engineeringNote:
      "Web and Android share Clerk identity and Convex learning data. Android uses Ktor routes for LLM operations and owns its Compose navigation and screen state. AI assisted implementation and review; I own product direction, architecture, validation, and release decisions. iOS is the next planned native client.",
  }),
] as const;

const PROJECT_ORDER = ["lumingo", "voicenotes"] as const;

export const projectsCatalog: CatalogProject[] = projectDefinitions
  .map((project) => ({
    ...project,
    id: 0,
    slug: project.slug ?? toProjectSlug(project.title),
    coverImage: project.gallery[0]?.imageUrl ?? "",
  }))
  .sort(
    (left, right) =>
      PROJECT_ORDER.indexOf(left.slug as (typeof PROJECT_ORDER)[number]) -
      PROJECT_ORDER.indexOf(right.slug as (typeof PROJECT_ORDER)[number])
  )
  .map((project, index) => ({
    ...project,
    id: index + 1,
  }));

export const publicProjectsCatalog = projectsCatalog.filter(
  (project) => project.published
);

const translationsByLocale: Record<Locale, Record<string, ProjectTranslation>> = {
  en: {},
  ru: projectTranslationsRu,
};

const localizeProject = (project: CatalogProject, locale: Locale): CatalogProject => {
  const translation = translationsByLocale[locale][project.slug];
  if (!translation) return project;
  const { mediaAlt, galleryCaptions, platforms, ...fields } = translation;

  return {
    ...project,
    ...fields,
    media: { ...project.media, alt: mediaAlt ?? project.media.alt },
    gallery: project.gallery.map((item, index) => ({
      ...item,
      caption: galleryCaptions?.[index] ?? item.caption,
    })),
    platforms: project.platforms?.map((platform) => ({
      ...platform,
      ...(platforms?.[platform.id] ?? {}),
    })),
  };
};

export const projectsCatalogByLocale: Record<Locale, CatalogProject[]> = {
  en: projectsCatalog,
  ru: projectsCatalog.map((project) => localizeProject(project, "ru")),
};

export const publicProjectsCatalogByLocale: Record<Locale, CatalogProject[]> = {
  en: publicProjectsCatalog,
  ru: projectsCatalogByLocale.ru.filter((project) => project.published),
};
