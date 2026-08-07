export type ProjectMediaType = "phone" | "browser";
export type ProjectPlatformId = "android" | "web" | "ios";

export interface ProjectPlatform {
  id: ProjectPlatformId;
  label: string;
  status: string;
  mediaType: ProjectMediaType;
}

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
  keyFeatures: string[];
  engineeringNote: string;
}

export interface ProjectData {
  published: boolean;
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
  keyFeatures: string[];
  engineeringNote: string;
}

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
    title: "VoiceNotes",
    description:
      "Native Android voice notes that turn short recordings into searchable notes — cloud AI when useful, private on-device transcription when it matters.",
    role: "Product design & Android engineering — solo build",
    year: 2026,
    metrics: [
      { value: "4 modes", label: "cloud + local processing" },
      { value: "BYOK", label: "encrypted on-device keys" },
      { value: "Room", label: "persistent notes + audio" },
    ],
    media: {
      type: "phone",
      alt: "VoiceNotes notes list with generated titles, summaries, and one-tap recording",
    },
    links: {
      github: "https://github.com/Akbar02Work/VoiceNotes",
    },
    gallery: [
      {
        imageUrl: "/projects/voicenotes/screen-01.png",
        caption: "Notes list — structured AI summaries with one-tap record FAB.",
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
      "VoiceNotes turns a short recording into a durable note: playable audio, transcription, generated title, and summary, all kept in a searchable Room-backed library. Cloud processing uses the provider selected by the user; the on-device path keeps Russian transcription on the phone after its model is installed.",
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
      "One-tap AAC recording with visible recording, processing, draft, failure, and retry states",
      "Cloud processing through Gemini, OpenAI, or Groq with separate transcription and summary models",
      "Checksum-verified on-device Russian transcription with sherpa-onnx Zipformer models",
      "Resumable model downloads with size checks, SHA-256 verification, and atomic activation",
      "Room-backed notes with pinned items, searchable summaries, and playable original audio",
      "API keys stored in encrypted preferences and excluded from backup",
      "English and Russian localization with Material 3 dynamic theming",
    ],
    engineeringNote:
      "The processing router keeps cloud providers and local sherpa-onnx inference as separate strategies behind one structured note pipeline. Cloud mode validates the user's key and discovers transcription and summary models; local mode activates only checksum-verified model files. Room persists the note while the original recording stays in the app-private files directory.",
  }),
  createProject({
    title: "Lumingo",
    published: false,
    description:
      "An adaptive language-learning product delivered through a live web experience and a native Android client — with iOS now in development.",
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
          "A native Android client that brings Lumingo's adaptive paths, daily learning flow, and Lumi guidance into a mobile-first experience.",
        role: "Founder · Product direction · Android engineering",
        metrics: [
          { value: "Native", label: "Kotlin client" },
          { value: "RC", label: "release candidate" },
          { value: "Shared", label: "identity + learning state" },
        ],
        overview:
          "Lumingo for Android translates the live product into a native learning client rather than wrapping the website. Learners move through goals, roadmaps, daily activities, Lumi, profile, and settings with the same account and learning state used by the web product.",
        challenge:
          "The Android challenge is preserving product parity without copying web implementation details. Authentication, Convex state, LLM-backed operations, navigation, recovery, and duplicate-action protection all need native lifecycle-aware behavior.",
        stack: [
          "Kotlin",
          "Jetpack Compose",
          "Convex",
          "Clerk",
          "Ktor",
          "Hilt",
        ],
        keyFeatures: [
          "Native Compose flows for goals, adaptive roadmaps, learning days, Lumi, profile, and settings",
          "Shared Clerk identity and Convex learning state across Android and Web",
          "Ktor access to mobile-compatible LLM operations behind explicit API contracts",
          "Lifecycle-aware loading, retry, recovery, and duplicate-action guards",
          "English and Russian experiences aligned with the shared Lumingo design system",
        ],
        engineeringNote:
          "The Android client uses Convex directly for product data and reserves Ktor-backed routes for LLM operations. Web behavior is mapped into explicit mobile contracts before it reaches Compose, keeping native navigation and state ownership independent from the web implementation.",
      },
      {
        id: "web",
        label: "Web",
        status: "Public beta",
        mediaType: "browser",
        summary:
          "The live web product turns a learner's goal, level, and available time into an adaptive language-learning path with Lumi guidance.",
        role: "Founder · Product direction · Web development",
        metrics: [
          { value: "Live", label: "public beta" },
          { value: "2", label: "English + Russian" },
          { value: "Adaptive", label: "goal-based roadmap" },
        ],
        overview:
          "Lumingo Web is the live product surface: onboarding captures a learner's objective and constraints, then the application builds an adaptive roadmap, organizes daily learning, and keeps Lumi connected to the active goal and progress.",
        challenge:
          "The web challenge is coordinating identity, adaptive product state, AI operations, localization, analytics, and rate-limited public delivery as one understandable learning flow. The interface must stay responsive while backend work remains observable and recoverable.",
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
          "Goal onboarding based on intent, current level, pace, and realistic availability",
          "Adaptive roadmaps with weeks, daily nodes, reviews, and visible phase progression",
          "Lumi guidance connected to the learner's active goal and product state",
          "Clerk identity with Convex-backed learning data and reactive product updates",
          "English and Russian localization across the public and authenticated experience",
          "Rate-limited AI operations, product analytics, and production performance telemetry",
        ],
        engineeringNote:
          "The web product uses Next.js and React for the product surface, Convex for reactive application state, and Clerk for identity. OpenAI-backed operations are protected by explicit validation and Upstash rate limits, while PostHog and production telemetry support release decisions.",
      },
      {
        id: "ios",
        label: "iOS",
        status: "In development",
        mediaType: "phone",
        summary:
          "Lumingo for iOS is in development as the next native client, planned around shared product contracts and an experience designed for Apple platforms.",
        role: "Founder · Product direction · iOS planning",
        metrics: [
          { value: "Next", label: "native client" },
          { value: "Planned", label: "Swift + SwiftUI" },
          { value: "Shared", label: "product contracts" },
        ],
        overview:
          "The planned iOS client will extend the same Lumingo account, learning state, adaptive roadmap, and Lumi workflows to Apple devices while treating iOS as a native product surface rather than a visual copy of Android.",
        challenge:
          "The iOS challenge is still ahead: reuse product and API contracts without pretending Compose architecture transfers directly to SwiftUI. Navigation, state ownership, platform conventions, and release validation must be designed natively.",
        stack: [
          "Swift · Planned",
          "SwiftUI · Planned",
        ],
        keyFeatures: [
          "Planned native SwiftUI experience for the core learning loop",
          "Shared identity, learning state, and mobile API contracts",
          "Apple-platform navigation and interaction designed independently from Compose",
          "Release scope gated by Android stabilization and verified product parity",
        ],
        engineeringNote:
          "iOS is planned, not released. The current foundation is the shared product contract: identity, learning state, design tokens, and mobile-compatible APIs. Swift and SwiftUI implementation will begin after the Android release candidate is stabilized.",
      },
    ],
    links: {
    },
    gallery: [
      {
        imageUrl: "/projects/lumingo/android-01.svg",
        caption: "Android goals — the learner's active paths and next action.",
        platform: "android",
        mediaType: "phone",
      },
      {
        imageUrl: "/projects/lumingo/android-02.svg",
        caption: "Android roadmap — a structured week instead of disconnected lessons.",
        platform: "android",
        mediaType: "phone",
      },
      {
        imageUrl: "/projects/lumingo/android-03.svg",
        caption: "Lumi on Android — guidance that stays connected to the learner's goal.",
        platform: "android",
        mediaType: "phone",
      },
      {
        imageUrl: "/projects/lumingo/web-01.svg",
        caption: "Web landing — the public-beta product proposition.",
        platform: "web",
        mediaType: "browser",
      },
      {
        imageUrl: "/projects/lumingo/web-02.svg",
        caption: "Web goal setup — turning intent, level, and available time into constraints.",
        platform: "web",
        mediaType: "browser",
      },
      {
        imageUrl: "/projects/lumingo/web-03.svg",
        caption: "Web roadmap — the adaptive path and current learning week.",
        platform: "web",
        mediaType: "browser",
      },
      {
        imageUrl: "/projects/lumingo/ios-in-development.svg",
        caption: "iOS client — native product experience in development.",
        platform: "ios",
        mediaType: "phone",
      },
    ],
    overview:
      "Lumingo turns a learner's goal, current level, and realistic weekly availability into one adaptive language-learning path. The web product is live in public beta, while the native Android client brings the same goals, roadmap, daily learning flow, and Lumi guidance into a mobile-first experience.",
    challenge:
      "The challenge is maintaining one coherent product across clients without reducing the native app to a web wrapper. Shared product rules, identity, learning state, and AI workflows must stay aligned while Web, Android, and the upcoming iOS client each respect their platform.",
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
      "Goal onboarding that captures intent, current level, pace, and real weekly availability",
      "Adaptive roadmaps with explicit weeks, daily nodes, reviews, and phase transitions",
      "Native Android client for goals, learning days, Lumi, profile, and settings",
      "Shared identity and learning state across Web and Android",
      "Resilient mobile states for recovery, retries, duplicate-action guards, and offline-aware errors",
      "English and Russian product experiences built from one design and content system",
      "Visible iOS expansion path without presenting unfinished work as released",
    ],
    engineeringNote:
      "Lumingo is one product system with multiple clients. The web experience owns public discovery and the full beta workflow; native Android uses Clerk and Convex for identity and product state, with Ktor routes for LLM-backed operations. AI assisted implementation and review, while product direction, architecture choices, validation, and release acceptance remain my responsibility. iOS is the next native client and is currently in development.",
  }),
] as const;

const PROJECT_ORDER = ["lumingo", "voicenotes"] as const;

export const projectsCatalog: CatalogProject[] = projectDefinitions
  .map((project) => ({
    ...project,
    id: 0,
    slug: toProjectSlug(project.title),
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

export type ProjectSlug = string;
