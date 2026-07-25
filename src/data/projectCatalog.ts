export type ProjectMediaType = "phone";

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectData {
  title: string;
  description: string;
  role: string;
  year: number;
  metrics: ProjectMetric[];
  media: {
    type: ProjectMediaType;
    alt: string;
  };
  links: {
    github: string;
  };
  gallery: Array<{
    imageUrl: string;
    caption: string;
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

type CreateProjectInput = Omit<ProjectData, "engineeringNote"> & {
  engineeringNote?: ProjectData["engineeringNote"];
};

const DEFAULT_ENGINEERING_NOTE = "";

export const createProject = (project: CreateProjectInput): ProjectData => ({
  ...project,
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
] as const;

export const projectsCatalog: CatalogProject[] = projectDefinitions.map((project, index) => ({
  ...project,
  id: index + 1,
  slug: toProjectSlug(project.title),
  coverImage: project.gallery[0]?.imageUrl ?? "",
}));

export type ProjectSlug = string;
