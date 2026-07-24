# Дизайн-отчёт и видение 2026 — Portfolio Akbar

> **Статус:** утверждено главным дизайнером (AI). Это единый источник правды по визуалу.
> Все решения помечены `[РЕШЕНИЕ]` — они не требуют согласования, только реализации.
> Дата: 22.07.2026 · Версия: 1.1
>
> **Синхронизация (v1.1):** фазы и роли — в `IMPLEMENTATION_PLAN.md` (он главный по процессу),
> этот документ главный по визуалу. Поправки v1.1:
> 1. Порядок секций: Hero → **Projects → About** → Contact. Нумерация: `01 / Работы`, `02 / Обо мне`, `03 / Контакт`
> 2. Бренд-иконки (Android/Kotlin/Gemini/Compose/OpenAI) — inline-SVG компоненты (`src/components/icons/`), react-icons удаляется после их готовности
> 3. SecBench — НЕ phone-мокап: вариант карточки «терминал/дашборд» (media-слот 16:10, моно-типографика)
> 4. Easter-страница — владелец ИИ-4, проверка в Фазе 7

---

## ЧАСТЬ 1. АУДИТ ТЕКУЩЕГО СОСТОЯНИЯ

### 1.1 Оценки (шкала 10)

| Критерий | Оценка | Вердикт |
|---|---|---|
| Типографика | 8/10 | Системная шкала clamp() — зрелый уровень. Минус: сирота-строка «Android» в hero |
| Цвет и темы | 5/10 | Тёмный hero — грязная сиреневая «каша»; 3 разных тёмных фона на сайте |
| Первое впечатление | 6.5/10 | Чисто, но безлико. Нет статуса, движения, крючка |
| Подача проектов | 4/10 | **Главная проблема.** Все изображения — placeholder.png, иконки на градиентах |
| Контент/сторителлинг | 4.5/10 | About — 2 абзаца. Мета-теги обещают «99.9% crash-free», на странице этого нет |
| Моушн | 6/10 | Только fade-секции. Плавающие иконки About невидимы (opacity 0.18) |
| Консистентность | 5/10 | `--radius: 0` при `rounded-[2rem]` везде; микс gray-*/slate-*; мёртвые шрифты в конфиге |
| Доступность (a11y) | 8.5/10 | Отлично: focus-visible, reduced-motion, aria-live. Сохранить |
| Код | 8/10 | Тесты, константы, хуки. Сохранить |
| **ИТОГО** | **6/10** | «Чистый, но безликий». Фундамент отличный — нужна арт-дирекция |

### 1.2 Подтверждённые баги (исправить в Фазе 0)

1. **Стиль карточки по индексу, не по slug** — `src/components/sections/Projects.tsx:66`:
   `projectStylesList[currentIndex % projectStylesList.length]`. VoiceNotes на главной
   получает фиолетовый градиент + иконку книги от несуществующего quiz-learnwords,
   хотя его стиль — fuchsia + Mic. → Искать стиль по `project.slug` из `projectStylesBySlug`.
2. **Тёмный hero-градиент** — `.hero-gradient` (index.css:203) содержит только светлые
   пастели; поверх `dark:bg-slate-950` даёт грязный серо-сиреневый развод. → Отдельный dark-вариант.
3. **Три тёмных фона**: `slate-950` (главная), `slate-900` (секция Projects), `#0E172A` (детальная). → Один токен.
4. **Sticky TechStack-бар** с backdrop-blur создаёт «размазанное» пятно под навбаром при скролле.
5. **Scroll-jacking**: колесо мыши над каруселью проектов перехватывает скролл страницы (useWheelNavigation). → Удалить.
6. `theme-color` в index.html (`#0f172a`) не совпадает ни с одним реальным фоном.
7. Мёртвый конфиг: 3 из 5 записей `projectStyles.ts` (quiz-learnwords, loyalist, money-manager) — проектов нет.
8. Crimson Pro и SF Mono объявлены в tailwind.config, но никогда не загружаются. Inter — только latin subset.

### 1.3 Что сохраняем (активы бренда)

- Логотип `<AKA_/PORTFOLIO/>` с мигающим `_` — фирменный знак, не трогаем
- Рукописное подчёркивание под именем — разовьём в анимированный штрих
- Типографическую шкалу из tailwind.config.ts
- Всю accessibility-инфраструктуру
- Мобильное меню с крупной типографикой
- Easter-страницу

---

## ЧАСТЬ 2. КОНЦЕПЦИЯ 2026: «MONO / VOLT»

### 2.1 Идея в одном предложении

**Швейцарский монохромный плакат, который бьёт током одним сигнальным цветом.**

Сайт должен выглядеть как editorial-разворот: гигантская типографика, строгая сетка,
номерные секции — и один неоновый акцент, который запоминается мгновенно.
Референс-поле: Awwwards SOTD 2025–2026, верстка «плакат + инженерная точность».

### 2.2 `[РЕШЕНИЕ]` Акцентный цвет: VOLT

```
volt:        #BFFF3C   (основной акцент — заливки, маркеры, glow)
volt-ink:    #65A30D   (текстовый акцент на белом — контраст AA)
volt-dim:    #BFFF3C @ 8–12%  (свечения в тёмной теме)
```

Почему volt, а не синий/фиолетовый:
- Синий — корпоративно и забываемо; фиолетовый — уже занят «AI-клише» 2024 года
- Volt = Android-ДНК без буквального мятного #3DDC84 + тренд Awwwards 2025–26
- На чёрном взрывается, на белом работает как маркер-хайлайтер
- **Никто не забудет «тот ч/б сайт с кислотным акцентом»**

Правила использования (жёстко):
- Акцент ≤ 5% площади экрана. Это специя, не блюдо
- Никогда не использовать volt для длинного текста
- Volt = только: маркеры, хайлайт-штрих, точка статуса, hover-заливки, selection, glow

### 2.3 `[РЕШЕНИЕ]` Цветовая система (убиваем gray/slate-микс)

```css
:root {                     /* LIGHT — «бумага» */
  --bg:        #FAFAF8;     /* тёплый белый, не стерильный */
  --surface:   #FFFFFF;
  --ink:       #0A0A0A;
  --ink-2:     #525252;     /* secondary text */
  --ink-3:     #A3A3A3;     /* captions */
  --line:      #E5E5E2;     /* hairlines */
  --accent:    #BFFF3C;
  --accent-ink:#65A30D;
}
.dark {                     /* DARK — «чернила» */
  --bg:        #0A0A0A;     /* единственный тёмный фон для ВСЕГО сайта */
  --surface:   #141414;
  --ink:       #FAFAF8;
  --ink-2:     #A3A3A3;
  --ink-3:     #525252;
  --line:      #262626;
  --accent:    #BFFF3C;
  --accent-ink:#BFFF3C;
}
```

Все компоненты переводим на токены (`bg-background`, `text-foreground`…),
hardcoded `gray-*/slate-*` классы из разметки уходят. `theme-color` в index.html
синхронизировать: light `#FAFAF8`, dark `#0A0A0A`.

### 2.4 `[РЕШЕНИЕ]` Радиусы: мягкая система (де-факто уже она)

```
--radius: 1rem;   /* базовый */
cards:    24px (rounded-3xl)
media/мокапы: 20px
chips/buttons: full (pill)
```
Брутализм отменяется: сайт де-факто мягкий, фиксируем это в токенах.

### 2.5 `[РЕШЕНИЕ]` Типографика

- Сохранить шкалу из tailwind.config.ts
- Убрать из конфига Crimson Pro и SF Mono (не загружаются — мёртвый вес)
- **Добавить моношрифт** для служебных подписей (eyebrow-строки, номера секций,
  логотип): JetBrains Mono variable (self-hosted, latin, ~30KB woff2).
  Моно + гротеск = инженерная ДНК сайта
- Новый стиль `eyebrow`: mono, 0.75rem, uppercase, tracking 0.14em, цвет ink-3
- Hero H1: исправить переносы — контролируемые строки, без сироты «Android»

### 2.6 `[РЕШЕНИЕ]` Текстура: зерно

Тонкий noise-overlay поверх всего сайта (SVG feTurbulence data-URI, opacity 0.035,
`pointer-events: none`, `mix-blend: overlay`). Убирает «пластиковость» плоских заливок —
главный дешёвый приём дорогих сайтов 2025–26.

### 2.7 `[РЕШЕНИЕ]` Язык движения

```
easing:    cubic-bezier(0.16, 1, 0.3, 1)   /* out-expo — везде */
micro:     200–300ms  (hover, кнопки)
reveal:    600ms      (opacity + translateY 20px, once, stagger 70ms)
marquee:   28s linear infinite
```
- Секции появляются: opacity + translateY(20px) со stagger по детям (не просто fade)
- `prefers-reduced-motion` — полный стоп всего (уже умеем, сохранить)
- Никаких blur-анимаций на скролле (GPU)

---

## ЧАСТЬ 3. ФИРМЕННЫЕ МОМЕНТЫ («вау-точки», ради которых запомнят)

1. **Kinetic Hero** — строки заголовка въезжают каскадом; рукописный штрих под именем
   **рисуется** (SVG stroke-dashoffset) спустя 400ms; за «Developer» — маркер-хайлайтер volt,
   который «подмахивает» с задержкой
2. **Marquee-лента** вместо статичных чипов TechStack: бесконечная строка
   `Kotlin ✳ Jetpack Compose ✳ Gemini ✳ Room…` (✳ — volt), pause on hover. Стыкует hero с контентом
3. **Номерные секции**: `01 / Работы`, `02 / Обо мне`, `03 / Контакт` — eyebrow-подписи слева,
   editorial-сетка. Сайт читается как журнал (порядок: работы раньше биографии — proof first)
4. **Карточки проектов-плакаты**: огромный индекс `01`, мокап телефона, при hover —
   volt-кромка снизу + лёгкий наклон мокапа (rotate 1.5deg), без карусели на десктопе
5. **Гигантский email в футере** во всю ширину (display-уровень), volt-подчёркивание,
   копирование в один клик с тостом
6. **Custom selection**: `::selection { background: #BFFF3C; color: #0A0A0A }`
7. **Точка статуса** в hero: пульсирующая volt-точка + «Available for work» (в тёмной теме — glow)
8. **Логотип** остаётся — мигающий `_` теперь в фирменной моно-гарнитуре

---

## ЧАСТЬ 4. СПЕЦИФИКАЦИЯ ПО СЕКЦИЯМ

### 4.1 Navbar
- Сохранить структуру; фон → `bg/80 + blur` на токенах
- Активный пункт: volt-точка слева или анимированное underline (layout-анимация)
- `[РЕШЕНИЕ]` Поведение: прячется при скролле вниз > 300px, появляется при скролле вверх
  (transform translateY, 300ms out-expo). Освобождает экран для контента
- Dropdown Projects и ThemeMenu — на новые токены, radius 16px

### 4.2 Hero (главный экран)
```
┌ eyebrow:  AKBAR AZIZOV — ANDROID × AI        (mono, ink-3)
┌ H1:       Android                             (display-hero)
│           Developer  ← volt-маркер + hand-stroke draw-in
┌ tagline:  Turning AI models into real Android features
┌ sub:      (текущий текст — ок)
┌ CTA:      [Selected Works] pill ink-fill + [Download CV] outline
│           + magnetic hover на primary
┌ status:   ● Available for work                (volt pulse dot)
└ right:    портрет в арке (rounded-t-full) 20px→
            light: line-бордер + offset-тень volt 8px
            dark:  volt-glow 8% за портретом
```
- Убрать `.hero-gradient`-пастель. Light: чистая бумага + зерно. Dark: radial volt-glow 6% из правого верхнего угла
- Портрет: арка вместо «обрезанного fade». Fade удалить полностью (он и ломал тёмную тему)
- Scroll cue внизу по центру: mono `SCROLL` + hairline 40px с бегущей точкой
- Мобильный: арка сохраняется, текст центр — без изменений логики

### 4.3 TechStack → Marquee
- Удалить sticky-бар (источник blur-бага) и статичные чипы
- Бесконечная лента: mono-шрифт, разделитель `✳` volt, hairline сверху/снизу
- CSS-анимация translateX(-50%), дублированный список, pause on hover, reduced-motion → статика

### 4.4 About (`02 / Обо мне`)
- Сетка: левая колонка — sticky eyebrow-метка секции; правая — контент
- Текст: оставить 2 абзаца, поднять до body-lg, выделить **Kotlin / Compose / Clean Architecture** volt-маркером (mark-эффект)
- `[РЕШЕНИЕ]` Добавить ряд статистики (3 ячейки с hairline-разделителями, числа display-3 volt):
  - `2+` years building Android · `10+` technologies in stack · `99.9%` crash-free target
  - ⚠️ КОНТЕНТ-ЗАДАЧА: Акбар подтверждает/заменяет цифры честными
- Плавающие иконки: сократить до 3 (Android, Kotlin, Gemini), монохромные outline
  (без фирменных цветов — ломают монохром), opacity 0.35, параллакс от скролла вместо drift

### 4.5 Projects (`01 / Работы`)
- **Карусель на десктопе упраздняется.** Вертикальный список карточек-плакатов:
```
┌──────────────────────────────────────────┐
│ 01                          ↗            │
│ VoiceNotes                               │
│ AI-заметки: запись → саммари (summary)   │
│ [мокап 9:19.5]  tags: Kotlin Compose …   │
└──────────────────────────────────────────┘
```
- Каждая карточка: индекс-цифра display-уровня ink-3, заголовок heading-1, слот мокапа
  9:19.5 с placeholder-состоянием «screenshot slot» (готов под реальные экраны),
  теги-chips, стрелка ↗ (hover: поворот 45°)
- Hover карточки: volt hairline-кромка снизу 3px + мокап наклон 1.5deg + тень растёт
- Мобильный: карточки стеком, свайп не нужен — нативный скролл
- Удалить: useWheelNavigation (scroll-jack), автоскролл, «Swipe to explore»
- Исправить баг стиля: `projectStylesBySlug[project.slug] ?? fallbackProjectStyle`
- Почистить projectStyles.ts: оставить только реальные проекты; стиль = volt-детали +
  индивидуальный muted-градиент фона мокапа (не агрессивные violet/fuchsia, а приглушённые тона)
- Кнопка «View all on GitHub ↗» в конце списка

### 4.6 Project Detail
- Фон → единый `--bg` (убить `#0E172A`)
- Хедер: eyebrow `PROJECT 01 — VOICENOTES`, title display-1, meta-строка (год · роль · стек) mono
- Галерея: сетка 2×N мокапов 9:19.5 вместо карусели (все экраны видны сразу — лучше для кейса)
- Overview/Challenge — двухколоночная editorial-сетка с hairline сверху
- Key Features — аккордеон сохранить, иконка `+` поворачивается 45° при открытии
- Next project teaser внизу: `Next: SecBench-25 →` display-3, hover — volt
- ⚠️ Баг контента: «404: Project Not Found» рендерится для `/projects/quiz-learnwords` —
  корректно (проекта нет), но ссылку из меню Projects на несуществующие проекты не давать

### 4.7 Footer (`03 / Контакт`)
```
┌ eyebrow:  03 / КОНТАКТ
┌ display-1: Let's work together
┌ email гигантский (heading-1/display): akbar02work@gmail.com
│   hover: volt-подчёркивание sweep; click: copy + toast «Copied»
┌ соцкнопки: ВСЕ монохромные outline-pills; hover: заливка ink, текст bg
│   (убрать 3 одинаковых синих — брендовые цвета ломают монохром)
└ bottom bar: © 2026 Akbar Azizov · Tashkent/Remote · Designed & coded with AI · Back to top ↑
```
- «Designed by Akbar · Coded by AI» → переместить в bottom bar мелким mono

### 4.8 Дополнительно
- `::selection` volt (см. 3.6)
- Кастомный scrollbar: thin, ink-3 на прозрачном (вместо scrollbar-hide где видим)
- 404-страница: display-404 уже есть в шкале — использовать + volt «4·4»
- PageLoader/ServerLoader: фон на токены

---

## ЧАСТЬ 5. ПЛАН РЕАЛИЗАЦИИ (фазы)

| Фаза | Содержание | Файлы | Эффект |
|---|---|---|---|
| **0. Детокс** | Баги: slug-стиль, dark hero, единый фон, theme-color, scroll-jack, мёртвый конфиг | Projects.tsx, projectStyles.ts, index.css, index.html, ProjectDetail.tsx | Сайт перестаёт «течь» |
| **1. Токены** | Новая палитра MONO/VOLT, радиусы, шрифты (Inter + JetBrains Mono), зерно, selection | index.css, tailwind.config.ts, index.html, шрифты в public/fonts | Единая ДНК |
| **2. Hero** | Арка портрета, kinetic-заголовок, статус, маркер, scroll cue | Hero.tsx, index.css (keyframes) | Первое «вау» |
| **3. Лента** | Marquee вместо TechStack-бара | TechStack.tsx, index.css | Движение и ритм |
| **4. Проекты** | Список-плакаты, слоты мокапов, hover-система, удаление карусели | Projects.tsx, ProjectCard.tsx, useWheelNavigation (del) | Главный прирост |
| **5. About+Footer** | Статистика, метки секций, гигантский email, монохромные соцкнопки | About.tsx, Footer.tsx | Структура журнала |
| **6. Детальные** | Хедер, галерея-сетка, next-teaser | ProjectHeader.tsx, ProjectCarouselSection→Gallery, ProjectDetail.tsx | Кейсы уровня Behance |
| **7. Полировка** | Навбар hide-on-scroll, магнитные кнопки, scrollbar, 404, тесты, e2e | Navbar.tsx, BackToTop.tsx, NotFound.tsx, tests/ | Продакшн-шлифовка |

Каждая фаза = отдельный проверяемый шаг: `npm run ci` (lint + test + build) зелёный,
скриншоты light/dark/mobile до и после.

## ЧАСТЬ 6. КОНТЕНТ-ЗАДАЧИ ДЛЯ АКБАРА (блокеры помечены ⚠️)

1. ⚠️ Скриншоты: VoiceNotes — 3–4 экрана (запись, список, саммари); SecBench — 2–3 (дашборд, отчёт).
   Формат: PNG 9:19.5 (1080×2340+), в `public/projects/<slug>/`
2. ⚠️ Цифры статистики About: подтвердить/заменить 3 значения честными
3. Подтвердить email и статус «Available for work»
4. Локация для футера (Tashkent? Remote?)
5. CV: файл уже есть — ок

---

*Конец отчёта. Реализация идёт строго по фазам; любое отклонение от `[РЕШЕНИЕ]` —
только через явное обсуждение.*
