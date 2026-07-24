# Akbar — Signal Lab

Experimental wow-portfolio maintained as the `creative/` app inside the main
portfolio repository. Its source stays isolated from the Business app while both
ship from one clone.

## Why this exists

A cinematic craft prototype inspired by:
- [specia1ne.com](https://specia1ne.com/) — typographic restraint + reveal systems
- [stabondar.com](https://www.stabondar.com/) — loader, Lenis, page energy
- [otsuka-air.jp](https://otsuka-air.jp/) — WebGL atmosphere

## Stack

- React + Vite + TypeScript
- GSAP ScrollTrigger
- Lenis smooth scroll
- Custom WebGL fragment shader (no Three.js)

## Run

```bash
npm install
npm run dev
```

Open the local URL and scroll slowly. Desktop hits hardest (custom cursor + pin scrub).
