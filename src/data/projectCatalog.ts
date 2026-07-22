export type ProjectMediaType = "phone" | "terminal";

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
  results: string | string[];
  stackAndArchitecture: {
    stack: string[];
    architecture: string;
  };
  keyFeatures: string[];
  roadmap: string;
}

type CatalogProject = ProjectData & {
  id: number;
  slug: string;
  coverImage: string;
};

type CreateProjectInput = Omit<ProjectData, "results" | "roadmap"> & {
  results?: ProjectData["results"];
  roadmap?: ProjectData["roadmap"];
};

const DEFAULT_RESULTS = "Performance tests coming soon";
const DEFAULT_ROADMAP = "Future plans coming soon";

export const createProject = (project: CreateProjectInput): ProjectData => ({
  ...project,
  results: project.results ?? DEFAULT_RESULTS,
  roadmap: project.roadmap ?? DEFAULT_ROADMAP,
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
      { value: "100%", label: "offline-first storage" },
      { value: "1-tap", label: "recording flow" },
      { value: "Gemini", label: "AI summarization" },
    ],
    media: {
      type: "phone",
      alt: "VoiceNotes recording screen with waveform",
    },
    links: {
      github: "https://github.com/Akbar02Work/VoiceNotes",
    },
    gallery: [
      {
        imageUrl: "/projects/voicenotes/placeholder.png",
        caption: "Recording screen with real-time waveform visualization and quick actions.",
      },
    ],
    overview:
      "VoiceNotes captures spoken ideas and turns them into structured, searchable notes. It combines local persistence with AI summarization to reduce review time and improve note retrieval.",
    challenge:
      "Classic voice memo apps store raw audio without structure, making later retrieval expensive. The challenge was to keep capture friction low while producing useful, searchable note artifacts.",
    stackAndArchitecture: {
      stack: ["Kotlin", "Jetpack Compose", "Gemini API", "Room", "MVVM", "Clean Arch"],
      architecture:
        "AI-powered voice recorder that turns chaotic audio into structured notes. Runs offline",
    },
    keyFeatures: [
      "One-tap voice recording with waveform feedback",
      "AI-powered summarization using Google Gemini API",
      "Offline-first note storage using Room",
    ],
  }),
  createProject({
    title: "SecBench-25",
    description:
      "Benchmark framework to evaluate LLM jailbreak resistance and defense-layer effectiveness.",
    role: "Research & framework development — solo",
    year: 2025,
    metrics: [
      { value: "T.R.I.A.D.", label: "defense layers evaluated" },
      { value: "A/B", label: "baseline vs protected runs" },
      { value: "100%", label: "reproducible reports" },
    ],
    media: {
      type: "terminal",
      alt: "SecBench-25 benchmark results dashboard",
    },
    links: {
      github: "https://github.com/Akbar02Work/secbench-25",
    },
    gallery: [
      {
        imageUrl: "/projects/secbench-25/placeholder.png",
        caption: "Benchmark dashboard with attack outcomes and defense effectiveness metrics.",
      },
    ],
    overview:
      "SecBench-25 provides repeatable security evaluation workflows for LLM systems. It compares baseline and protected configurations under adversarial prompt suites.",
    challenge:
      "Teams need evidence-based security validation before shipping LLM features. The challenge was creating deterministic benchmarking that measures attack success and defense impact under consistent conditions.",
    stackAndArchitecture: {
      stack: ["Python", "LangChain", "OpenAI API", "Pytest"],
      architecture:
        "Pipeline-oriented benchmark architecture with attack modules, defense middleware, and metric aggregation for reproducible experiment runs.",
    },
    keyFeatures: [
      "Curated jailbreak attack prompt library",
      "Layered T.R.I.A.D. defense evaluation",
      "Comparative benchmark reports with pass/fail evidence",
    ],
  }),
] as const;

export const projectsCatalog: CatalogProject[] = projectDefinitions.map((project, index) => ({
  ...project,
  id: index + 1,
  slug: toProjectSlug(project.title),
  coverImage: project.gallery[0]?.imageUrl ?? "",
}));

export type ProjectSlug = string;
