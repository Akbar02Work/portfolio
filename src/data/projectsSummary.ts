export type ProjectSummary = {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  image: string;
  technologies: string[];
};

export const projectsSummary = [
  {
    id: 1,
    title: "VoiceNotes",
    slug: "voicenotes",
    subtitle: "AI Voice Notes",
    description:
      "AI-powered voice notes app for Android. Record your thoughts, get instant transcription and smart summaries.",
    image: "/projects/voicenotes/placeholder.png",
    technologies: ["Kotlin", "Jetpack Compose", "Gemini API", "Room"],
  },
  {
    id: 2,
    title: "SecBench-25",
    slug: "secbench",
    subtitle: "LLM Security Benchmark",
    description:
      "Security benchmark framework for evaluating LLM vulnerability to jailbreak attacks and multi-layer defense systems.",
    image: "/projects/secbench/placeholder.png",
    technologies: ["Python", "LangChain", "OpenAI API", "Pytest"],
  },
] as const satisfies ProjectSummary[];

export type ProjectSlug = (typeof projectsSummary)[number]["slug"];
