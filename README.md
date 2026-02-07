# Personal Engineering Portfolio

![Project Status](https://img.shields.io/badge/Status-Live-success)
![Performance](https://img.shields.io/badge/Lighthouse-100%2F100-success)
![Stack](https://img.shields.io/badge/Tech-React%20%7C%20TypeScript%20%7C%20Vite-blue)

## About The Project

This repository houses the source code for my personal portfolio website.
As a **Mobile-First Developer** (specializing in Android/Kotlin), I approached this web project with the same engineering rigor I apply to mobile apps: focusing on performance, smooth animations, and clean architecture.

**Live Demo:** https://www.akbar02work.xyz

---

## Tech Stack & Methodology

This project was built using a **AI-Assisted Development** workflow to maximize efficiency while maintaining strict architectural control.

* **Core:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS (Mobile-first responsive design)
* **Architecture:** Feature-sliced folder structure
* **Tooling:** ESLint, Prettier, Husky (Git hooks)

> **Transparency Note:**
> This project serves as a showcase of my ability to orchestrate modern development tools.
> While the core logic and architecture were validated manually, I utilized AI assistants (LLMs) to accelerate boilerplate generation, CSS styling, and accessibility (a11y) compliance.
> **My role:** Architect, Code Reviewer, & Product Owner.

---

## Key Engineering Features

Even though this is a "simple" portfolio, it implements production-grade patterns:

* **Custom Hooks:**
    * `useCarouselController` — Logic for the project gallery (Pause on hover/visibility change).
    * `useSwipe` — Touch-gesture support for mobile experience (mimicking native Android feel).
    * `useTheme` — System-preference aware dark/light mode without FOUC (Flash of Unstyled Content).
* **Performance:**
    * Lazy loading for heavy assets and routes.
    * IntersectionObserver for performant scroll-spy navigation.
    * No heavy UI libraries (like MUI/AntD) — only clean Tailwind.
* **Architecture:**
    * Strict separation of concerns (Logic in Hooks, UI in Components, Data in Constants).
    * Robust error handling (Error Boundaries, LocalStorage fallback strategies).

---

## Why this matters for Mobile Dev?

I believe that specific platform knowledge (Android) is crucial, but general **Software Engineering principles** are universal.
This project demonstrates my ability to:
1.  Structure complex data flow.
2.  Implement smooth, 60fps animations.
3.  Deliver a finished product (CI/CD via Vercel).

---

## Getting Started

To run this project locally:

```bash
# 1. Clone the repo
git clone [https://github.com/your-username/your-repo.git](https://github.com/your-username/your-repo.git)

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

```

---

## Contact

**Akbar** — Android Engineer

* [LinkedIn](https://www.linkedin.com/in/akbar02work)
* [Telegram](https://t.me/Akbar02Work)
* [Email](mailto:akbar02work@gmail.com)
