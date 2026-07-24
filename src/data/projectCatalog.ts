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
      "Android app for voice notes with AI summarization and reliable offline storage.",
    role: "Product design & Android development — solo",
    year: 2025,
    metrics: [
      { value: "Room", label: "local note storage" },
      { value: "1-tap", label: "recording flow" },
      { value: "Gemini", label: "AI summarization" },
    ],
    media: {
      type: "phone",
      alt: "VoiceNotes empty notes list with record button",
    },
    links: {
      github: "https://github.com/Akbar02Work/VoiceNotes",
    },
    gallery: [
      {
        imageUrl: "/projects/voicenotes/screen-01.png",
        caption: "Notes list — empty state with one-tap record FAB.",
      },
      {
        imageUrl: "/projects/voicenotes/screen-02.png",
        caption: "API key setup — choose Gemini or OpenAI and start.",
      },
      {
        imageUrl: "/projects/voicenotes/screen-03.png",
        caption: "Settings — AI provider, keys, and language.",
      },
    ],
    overview:
      "VoiceNotes captures spoken ideas and turns them into structured, searchable notes. It combines local persistence with AI summarization to reduce review time and improve note retrieval.",
    challenge:
      "Classic voice memo apps store raw audio without structure, making later retrieval expensive. The challenge was to keep capture friction low while producing useful, searchable note artifacts.",
    stackAndArchitecture: {
      stack: ["Kotlin", "Jetpack Compose", "Gemini API", "Room", "MVVM", "Clean Arch"],
    },
    keyFeatures: [
      "One-tap voice recording with waveform feedback",
      "AI-powered summarization using Google Gemini API",
      "Structured notes with title, summary, and key points",
      "Offline-first note storage using Room",
      "Searchable notes from chaotic audio captures",
      "Capture now, summarize when the network returns",
    ],
    engineeringNote:
      "On-device audio is transcribed and sent to Gemini for summarization. The raw LLM response is parsed into a structured note — title, summary, key points — before anything is persisted to Room, so the app never stores unstructured model output.",
  }),
] as const;

export const projectsCatalog: CatalogProject[] = projectDefinitions.map((project, index) => ({
  ...project,
  id: index + 1,
  slug: toProjectSlug(project.title),
  coverImage: project.gallery[0]?.imageUrl ?? "",
}));

export type ProjectSlug = string;
