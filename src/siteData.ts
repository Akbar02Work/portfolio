export const PROJECTS = [
  {
    id: "voicenotes",
    index: "01",
    name: "VoiceNotes",
    glyph: "VN",
    year: "2025",
    role: "Android · AI",
    desc: "Voice capture that becomes structured, searchable notes — Gemini summarization with offline-first Room storage.",
    tags: ["Kotlin", "Compose", "Gemini", "Room", "Clean Arch"],
    href: "https://github.com/Akbar02Work/VoiceNotes",
  },
  {
    id: "signal",
    index: "02",
    name: "This Lab",
    glyph: "110",
    year: "2026",
    role: "Web · Craft",
    desc: "An experimental signal surface — WebGL atmosphere, kinetic type, pinned storytelling. Proof that craft is part of the product.",
    tags: ["React", "GSAP", "Lenis", "WebGL"],
    href: "#top",
  },
] as const;

export const STACK = [
  "Kotlin",
  "Jetpack Compose",
  "Gemini",
  "OpenAI",
  "Clean Architecture",
  "Room",
  "Hilt",
  "Coroutines",
  "Offline-first",
  "LLM → Features",
] as const;

export const SECTIONS = [
  { id: "top", label: "00", name: "Intro" },
  { id: "manifesto", label: "01", name: "Manifesto" },
  { id: "works", label: "02", name: "Works" },
  { id: "about", label: "03", name: "About" },
  { id: "contact", label: "04", name: "Contact" },
] as const;

