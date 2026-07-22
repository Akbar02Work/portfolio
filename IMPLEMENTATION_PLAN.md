# План улучшений портфолио

> Источники: [`PORTFOLIO_AUDITS_CONSOLIDATED.md`](./PORTFOLIO_AUDITS_CONSOLIDATED.md) + [`DESIGN_2026.md`](./DESIGN_2026.md)  
> Дата: 22.07.2026

---

## Роли (жёстко)

| ИИ | Делает | Не делает |
|---|---|---|
| **ИИ 3** | Typecheck, CI, bundle, cache, Sentry, SEO/prerender, a11y-баги логики, данные проектов (Role/Results), иконки/deps, package/README cleanup, тесты под свои изменения | Цвета, типографика, layout секций, моушн, арт-дирекция |
| **ИИ 4** | Всё по `DESIGN_2026.md`: токены, Hero, marquee, карточки, About/Footer UI, detail layout, motion, navbar UX-визуал | Typecheck/CI, vercel cache, Sentry, SEO prerender, bundle script |

**Правило:** у каждой подфазы **ровно один** владелец. Если задача касалась обеих зон — она разбита на `X.a` (ИИ 3) и `X.b` (ИИ 4).

**Решённые расхождения (уже зафиксированы, не обсуждать в работе):**
- Accent = Volt `#BFFF3C` (ИИ 4)
- Карусель → numbered editorial cards (ИИ 4 делает UI)
- Порядок секций: Hero → Projects → About → Contact (ИИ 4 переставляет)
- Footer: `Designed & built by Akbar` (ИИ 4 меняет copy)

---

## Что написали (на пальцах)

Код ок → визуал generic → proof слабый (placeholders, нет метрик) → точечный техдолг (tsc, bundle, SEO). Переписывать с нуля не надо.

---

## Фазы

### Фаза 0 — Детокс

#### 0.a — ИИ 3
| # | Задача |
|---|---|
| 0.a.1 | Theme dropdown: закрытое меню не в a11y tree (`hidden` / условный рендер / `aria-hidden` + `tabIndex`) |
| 0.a.2 | Theme dropdown: выравнивание `right-0` (убрать 2px overflow на project detail) |

**Готово:** меню темы не ловит Tab когда закрыто; detail без горизонтального overflow.

#### 0.b — ИИ 4
| # | Задача |
|---|---|
| 0.b.1 | Стиль карточки по `slug`, не по индексу |
| 0.b.2 | Убрать scroll-jack колесом (`useWheelNavigation`) |
| 0.b.3 | Dark hero mesh + один тёмный фон (пока без полной палитры VOLT — только починить «кашу») |
| 0.b.4 | Синхронизировать `theme-color` |
| 0.b.5 | Почистить мёртвые записи в `projectStyles` |
| 0.b.6 | Footer: убрать «Coded by AI» → `Designed & built by Akbar` |
| 0.b.7 | Hero copy: выровнять позиционирование **Android & AI** (eyebrow/H1) |

**Готово:** визуальные баги с главной убраны; footer и headline ок.

**Порядок:** можно параллельно `0.a` ‖ `0.b`.

---

### Фаза 1 — Quality gates
**Владелец: только ИИ 3**

| # | Задача |
|---|---|
| 1.1 | Починить `tsc --noEmit` |
| 1.2 | Typecheck в CI |
| 1.3 | Bundle-budget = реальный initial (entry + vendor + CSS) |
| 1.4 | Одна icon-библиотека (убрать `react-icons` или lucide — оставить одну) |
| 1.5 | `Cache-Control: immutable` для `/assets/*` в `vercel.json` |
| 1.6 | Sentry — dynamic import только при DSN |
| 1.7 | `package.json` name + README без мёртвых Husky/Prettier |

**Готово:** CI с typecheck; budget честный; deps чище.

---

### Фаза 2 — Токены MONO / VOLT
**Владелец: только ИИ 4**

| # | Задача |
|---|---|
| 2.1 | Палитра light/dark: bg, surface, ink, volt / volt-ink |
| 2.2 | Радиусы: мягкая система, `--radius` = реальность |
| 2.3 | JetBrains Mono (или Geist Mono) + grain + `::selection` volt |
| 2.4 | Убрать мёртвые шрифты из конфига |

**Готово:** один визуальный язык на токенах.

---

### Фаза 3 — Hero + Marquee
**Владелец: только ИИ 4**

| # | Задача |
|---|---|
| 3.1 | Kinetic hero: короткий copy, Available, line breaks |
| 3.2 | Портрет в арке + volt-glow |
| 3.3 | Scroll cue |
| 3.4 | TechStack → marquee (pause on hover, reduced-motion) |

**Готово:** первый экран = brand composition.

---

### Фаза 4 — Проекты как proof

#### 4.a — ИИ 3 (данные и доказательства)
| # | Задача |
|---|---|
| 4.a.1 | Вывести Role / Results / метрики из `projectCatalog` (поля уже есть) |
| 4.a.2 | SecBench: не форсить phone mockup `9:19` в данных/типе карточки (флаг layout или отдельный media type) — **логика/данные**, без финального визуала |
| 4.a.3 | Подготовить слоты путей под скрины `public/projects/<slug>/` (структура + fallback) |

**Готово:** на detail/главной видны роль и результаты из данных; SecBench не обязан быть «телефоном» на уровне модели.

#### 4.b — ИИ 4 (UI проектов)
| # | Задача |
|---|---|
| 4.b.1 | Убрать carousel → numbered editorial cards |
| 4.b.2 | Слоты мокапов + hover-система по `DESIGN_2026.md` |
| 4.b.3 | Порядок секций: Hero → **Projects** → About → Contact |
| 4.b.4 | Визуал SecBench-карточки (не phone, если 4.a дал тип) |
| 4.b.5 | Подставить реальные скрины, когда Акбар закинет файлы |

**Готово:** обе работы видны сразу; UI по MONO/VOLT.

**Порядок:** сначала `4.a` (данные/типы), потом `4.b` (UI опирается на это). Либо `4.a.1` можно параллельно с `4.b.1–4.b.3`, если UI пока читает те же поля.

---

### Фаза 5 — About + Footer
**Владелец: только ИИ 4**

| # | Задача |
|---|---|
| 5.1 | About editorial: метка, stats row, 3 outline-иконки |
| 5.2 | Footer: giant email + copy, mono socials |
| 5.3 | Номерные eyebrow у секций |

**Готово:** журналная структура контакта и about.

---

### Фаза 6 — Project detail + SEO

#### 6.a — ИИ 3
| # | Задача |
|---|---|
| 6.a.1 | Prerender/SSG трёх публичных маршрутов + canonical |
| 6.a.2 | Обновить даты в `sitemap.xml` |
| 6.a.3 | (Опционально) контент engineering note / pipeline в данных — текст в data-файлах |

**Готово:** шаринг `/projects/voicenotes` отдаёт правильные meta с сервера.

#### 6.b — ИИ 4
| # | Задача |
|---|---|
| 6.b.1 | Detail на токенах; gallery-сетка вместо carousel |
| 6.b.2 | Next-project teaser |
| 6.b.3 | UI блока architecture / engineering note (если 6.a.3 дал контент) |

**Готово:** detail выглядит как case study, не как шаблон.

**Порядок:** `6.a` ‖ `6.b` параллельно; `6.b.3` после `6.a.3` если нужен контент.

---

### Фаза 7 — Полировка

#### 7.a — ИИ 3
| # | Задача |
|---|---|
| 7.a.1 | Обновить unit/e2e под изменения данных, SEO, a11y theme |
| 7.a.2 | WebP/AVIF пайплайн / оптимизация ассетов (скрипт или сборка) |
| 7.a.3 | Дробить Navbar по файлам (рефактор структуры, без смены дизайна) |

**Готово:** тесты зелёные; ассеты легче; Navbar читаемый.

#### 7.b — ИИ 4
| # | Задача |
|---|---|
| 7.b.1 | Navbar hide-on-scroll + active underline (визуал/UX) |
| 7.b.2 | Motion: translateY reveals, не только fade |
| 7.b.3 | Магнитные кнопки / scrollbar / 404 polish по `DESIGN_2026.md` |
| 7.b.4 | (Позже, опционально) Engineering notes страница, interactive AI-pipeline UI |

**Готово:** финальный «вау» и шлифовка.

**Порядок:** `7.a.3` (split Navbar) **до** или **сразу после** `7.b.1` — лучше сначала ИИ 3 дробит файлы, потом ИИ 4 вешает hide-on-scroll на уже разбитый Navbar.  
Рекомендация: `7.a.3` → `7.b.1` → остальное `7.a` ‖ `7.b`.

---

## Очередь сессий

```
0.a ‖ 0.b
  → 1 (ИИ 3)
  → 2 (ИИ 4)
  → 3 (ИИ 4)
  → 4.a → 4.b
  → 5 (ИИ 4)
  → 6.a ‖ 6.b
  → 7.a.3 → 7.b + остальное 7.a
```

---

## От тебя (не код)

1. ⚠️ Скрины VoiceNotes (3–4) и SecBench (2–3)
2. ⚠️ Три честные цифры для About
3. Available for work? Локация? Email ок?

---

## Definition of Done

- [ ] Узнаваемый MONO/VOLT за 3 секунды
- [ ] Два проекта с Role/Results + медиа
- [ ] Typecheck в CI, честный bundle, theme a11y
- [ ] Project routes с правильными meta
- [ ] Нет «Coded by AI» на сайте
- [ ] `npm run ci` зелёный
