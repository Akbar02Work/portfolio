import { getBusinessUrl } from "./siteConfig";

const businessUrl = getBusinessUrl();

const PROJECT_CATALOG = [
  {
    id: "lumingo",
    published: false,
    index: "01",
    name: "Lumingo",
    glyph: "LU",
    year: "2026",
    role: "Founder · Product Engineer",
    desc: "An adaptive language-learning product built across a live web beta and a native Android client — with iOS in development.",
    tags: ["Product", "Android", "Next.js", "Convex", "AI"],
    href: `${businessUrl}projects/lumingo`,
  },
  {
    id: "voicenotes",
    published: true,
    index: "02",
    name: "VoiceNotes",
    glyph: "VN",
    year: "2026",
    role: "Solo Android Engineer",
    desc: "A native Android voice-to-notes system — cloud providers when useful, verified on-device Russian transcription when privacy matters.",
    tags: ["Kotlin", "Compose", "Gemini", "Groq", "sherpa-onnx"],
    href: "https://github.com/Akbar02Work/VoiceNotes",
  },
  {
    id: "signal",
    published: true,
    index: "03",
    name: "This Lab",
    glyph: "110",
    year: "2026",
    role: "Web · Craft",
    desc: "An experimental signal surface — WebGL atmosphere, kinetic type, pinned storytelling. Proof that craft is part of the product.",
    tags: ["React", "GSAP", "Lenis", "WebGL"],
    href: "#top",
  },
] as const;

export const PROJECTS = PROJECT_CATALOG.filter((project) => project.published).map(
  (project, index) => ({
    ...project,
    index: String(index + 1).padStart(2, "0"),
  })
);

export const STACK = [
  "Kotlin",
  "Java",
  "Jetpack Compose",
  "Coroutines · Flow",
  "MVVM",
  "Clean Architecture",
  "Room",
  "SQLCipher",
  "DataStore",
  "Retrofit · OkHttp",
  "REST APIs",
  "Unit · UI testing",
  "Git · Code review",
] as const;

export const SECTIONS = [
  { id: "top", label: "00", name: "Intro" },
  { id: "manifesto", label: "01", name: "Manifesto" },
  { id: "works", label: "02", name: "Works" },
  { id: "about", label: "03", name: "About" },
  { id: "contact", label: "04", name: "Contact" },
] as const;
