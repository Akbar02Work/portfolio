import { projectsSummary, type ProjectSlug, type ProjectSummary } from "./projectsSummary";

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface ProjectScreen {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Project extends ProjectSummary {
  challenge: string;
  features: ProjectFeature[];
  screens: ProjectScreen[];
  links: {
    github?: string;
    playStore?: string;
  };
}

type ProjectDetails = Pick<Project, "challenge" | "features" | "screens" | "links">;

const projectDetails: Record<ProjectSlug, ProjectDetails> = {
  voicenotes: {
    challenge:
      "Voice recordings are useful but hard to search and organize. The app transforms spoken thoughts into structured, searchable notes with AI-generated summaries.",
    features: [
      {
        title: "One-tap recording",
        description:
          "Start recording instantly with visual feedback and automatic silence detection.",
      },
      {
        title: "AI transcription",
        description:
          "Automatic speech-to-text conversion with support for multiple AI providers (Gemini, OpenAI).",
      },
      {
        title: "Smart summaries",
        description:
          "AI-generated titles and key points for each note, making it easy to find important information.",
      },
    ],
    screens: [
      {
        id: "vn-1",
        title: "Recording Screen",
        description:
          "Main recording interface with waveform visualization and quick actions.",
        image: "/projects/voicenotes/placeholder.png",
      },
    ],
    links: {
      github: "https://github.com/Akbar02Work/VoiceNotes",
    },
  },
  secbench: {
    challenge:
      "As LLMs move into production, teams need systematic ways to test for prompt injection vulnerabilities and evaluate defense effectiveness before incidents reach users.",
    features: [
      {
        title: "Jailbreak attack library",
        description:
          "Curated dataset of adversarial prompts covering multiple attack categories and jailbreak templates.",
      },
      {
        title: "T.R.I.A.D. defense system",
        description:
          "Three-layer defense architecture designed to detect and block malicious inputs before they reach the model.",
      },
      {
        title: "Benchmark reports",
        description:
          "Detailed metrics comparing protected vs unprotected configurations with pass/fail evidence per test case.",
      },
    ],
    screens: [
      {
        id: "sb-1",
        title: "Benchmark Dashboard",
        description:
          "Overview of test results, attack success rates, and defense effectiveness metrics.",
        image: "/projects/secbench/placeholder.png",
      },
    ],
    links: {
      github: "https://github.com/Akbar02Work/secbench-25",
    },
  },
};

export const projects: Project[] = projectsSummary.map((summary) => ({
  ...summary,
  ...projectDetails[summary.slug],
}));
