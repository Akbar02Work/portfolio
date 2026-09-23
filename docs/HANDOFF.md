# Портфолио Akbar — передача дел (handoff)

> Документ для продолжения работы на другом компьютере или с другим ИИ-ассистентом.
> Сначала прочитай разделы 1–2 и 6: там окружение, принятые решения и подводные камни.
> Задачи — в разделе 4, по порядку приоритета.
> Состояние на 24.09.2026, ветка `polish/business-v2`, последний коммит `146b37b`.

---

## 1. Проект и окружение

- **Репозиторий:** `https://github.com/Akbar02Work/portfolio`
- **Рабочая ветка:** `polish/business-v2`. В ней 12 коммитов поверх `cd3efef` (последнего коммита в `main`). Ветка **ещё не запушена** и **не слита в `main`**.
- **Две версии сайта** в одном репозитории:
  - **Business** (корень репозитория, React + Vite + Tailwind) — основной сайт. Вся работа ниже касается его.
  - **Creative** (`creative/`) — отдельное приложение, desktop-only. Собирается и встраивается в `public/creative/`, в проде живёт по адресу `/creative/`.
- **Хостинг:** Vercel (`vercel.json`: заголовки, rewrites, CSP).
- **Node:** 22.12+ или 24 (проверено на 22.14 и 24).

### Запуск локально

```bash
npm ci
npm --prefix creative ci
npm run build      # Business + уже закоммиченная сборка Creative
npm run preview    # http://localhost:4173
# или режим разработки с автообновлением:
npm run dev        # http://localhost:5173 (переход в Creative в dev не работает)
```

- `npm run build:all` — пересобрать Creative и Business. На Windows **не использовать**, см. раздел 6.
- `npm run dev:pair` (обе версии сразу) рассчитан на Linux/macOS.

### Проверки (должны быть зелёными перед каждым коммитом)

```bash
npm run ci        # линтеры (оба приложения), поиск циклов, TypeScript, unit-тесты (58),
                  # тесты скриптов, сборка, бюджеты размера, drift-проверка Creative
npx playwright install chromium   # один раз
npm run ci:full   # то же + браузерные E2E (36 тестов)
```

---

## 2. Принятые решения (не менять без согласия владельца)

Владелец явно выбрал всё перечисленное. Не «улучшать» это без спроса.

| Тема | Решение |
|---|---|
| Hero | Вариант «B»: крупное **«Akbar»** с рукописным подчёркиванием, под ним серым «Android Engineer, founder of **Lumingo**.». Фамилия в заголовке не нужна: владелец считает её шумом. |
| Описание под заголовком | Одна строка: «Kotlin & Compose. Offline-first apps with AI features — from architecture to release.» |
| Кнопки hero | Залитая **Contact** (открывает окно контактов) + контурная **Download CV** |
| Логотип | Остаётся **`<AKA_/PORTFOLIO/>`** с мигающим `_`. Вариант `akbar_` рассмотрен и отклонён. |
| Шрифты | **Geist** (основной) + **Geist Mono** (моно-подписи) на обоих языках. Inter и JetBrains Mono удалены. |
| Бегущая строка стека | Оставить: владельцу нравится. |
| Сетка Works | Оставить как есть. Подсказку «Click a project…» убрали. |
| Заголовки Overview/Challenge в кейсе | Есть, оставить. |
| Контакты | Окно (Radix Dialog): на десктопе по центру, на мобильном шторкой снизу. Открывается кнопкой в hero и пунктом **Contact в меню** (на любой странице). Порядок: Telegram, Email (клик копирует), Phone (скрыт до «Show number», клик показывает **и сразу копирует**), LinkedIn, GitHub. **Футер не трогать**: кнопки соцсетей в нём оставить. |
| Анимация копирования | **Старая версия**: blur-crossfade + keyframe-«резинка» (`.copy-swap` / `.copy-rubber` в `src/index.css`, компонент `CopySwap`). Версию со spring/linear() владелец отклонил как «перебор». |
| Меню темы | Открывается при наведении, клик закрепляет. |
| Переключатель языка | **Старый вид** (сегменты EN/RU, белая подложка). Логика как в iOS: подложку можно тянуть мышью, при отпускании применяется язык, над которым она остановилась. Подложка **жёстко ограничена** своей дорожкой. «Стеклянный» вид отклонён. |
| Русская версия | Отдельные URL: `/ru`, `/ru/projects/:slug`. По языку браузера **никого не перенаправлять**. Явный выбор в переключателе запоминается (localStorage `locale`) и применяется один раз при следующем заходе на EN-адрес. Обращение на «вы». Термины Kotlin, Compose, offline-first, AI — по-английски. Имя «Akbar» — латиницей. |
| Creative | Переключатель Business/Creative из меню **убран**. **3 клика по логотипу → сразу `/creative/`** (без промежуточного экрана). Creative остаётся **только на английском**. Страница пасхалки и CHANGELOG удалены. |
| CV | Пока только английское. Русского CV нет, владелец сделает сам позже (задача T5). |
| Скриншоты кейса | Остаются русскоязычными. Переснимать в EN не нужно. |
| Демо-видео | Не делать: владелец не хочет записывать. |

---

## 3. Что сделано (по коммитам, от старых к новым)

1. **`66b0180` Apply 2026-09-05 portfolio audit fixes.** Закоммичен ранее незакоммиченный аудит: SEO/PageSeo, генерация sitemap, устойчивость к запрету localStorage, навигация на планшете, клавиатура и фокус, reduced motion, ленивый Creative, E2E и так далее. Подробности в `docs/audits/2026-09-05-portfolio-audit.md`.
2. **`0f33f34` Hero.** Новый заголовок, кнопки Contact + Download CV, арка за фото без размытого пятна, исправлено сжатие контейнера hero. Новый стиль шрифта `display-role` в `tailwind.config.ts`.
3. **`9e792f2` Окно контактов.** `src/components/contact/ContactDialog.tsx`, данные в `src/data/contacts.ts`. Номер собирается только в момент клика, чтобы его не было в HTML. Хук `src/hooks/useCopyFeedback.ts`.
4. **`5e90b69` Contact в меню** открывает окно на любой странице. «Contact» убран из подсветки разделов при скролле (scroll-spy).
5. **`6e4cb8c` About.**
   - Вместо счётчиков («1 yr 8 mo», «1 shipped project») — таймлайн **Experience**: Market-R (NDA) и Lumingo. Плюс **Education** (БГУИР, бакалавриат и магистратура).
   - Три принципа с номерами 01–03 вместо иконок.
   - Короткое био.
   - Строка «Tashkent / UTC+5 / RU · EN · UZ».
   - Контент лежит в `src/data/about.ts`.
6. **`b012ca5` Русская версия.**
   - Своя лёгкая i18n в `src/i18n/`: `locales.ts`, `messages.ts` (EN/RU и тест на совпадение структуры), `I18nProvider.tsx`, `useI18n.ts`.
   - Все ссылки локализуются. Маршруты `/ru` пререндерятся с `lang="ru"`, `og:locale`, hreflang (+ x-default) и записями в sitemap.
   - Русский текст кейса VoiceNotes — `src/data/i18n/projects.ru.ts`.
   - Кириллические подмножества шрифтов.
7. **`be30b4f` Polish.**
   - Убрана подсказка в Works.
   - Неактивные скриншоты галереи стали заметнее (75% вместо 45%, лёгкое уменьшение).
   - Обновлён запасной meta description в `index.html`, обновлён README.
8. **`e4ccdff` Windows.** `scripts/embed-creative.mjs` запускает npm через `npm_execpath` (раньше на Windows падало с `spawnSync npm ENOENT`).
9. **`0f65f75` + `aff0aab` Правки владельца.**
   - Переключатель Business/Creative убран, 3 клика по логотипу ведут сразу в Creative.
   - Перетаскиваемый переключатель языка с ограничением дорожкой.
   - Меню темы открывается при наведении.
   - Галерея: переход 6→1 и 1→6 анимируется через соседнюю копию цикла, easing ease-out cubic вместо expo. Быстрые нажатия «вперёд/назад» подхватывают текущую анимацию, а не игнорируются.
   - Удалены страница пасхалки, `CHANGELOG.md`, `src/lib/easterReport.ts`.
10. **`52223cd` Шрифты Geist + Geist Mono** (Fontsource 5.3.0, OFL). Анимация копирования возвращена к старой версии. Временная панель выбора дизайна удалена.
11. **`146b37b` Кейс и превью.**
    - Схема архитектуры VoiceNotes: `src/components/project/ProjectArchitecture.tsx`, данные в `src/data/architecture.ts`.
    - Новые картинки для соцсетей: `public/og-image.png` (EN) и `public/og-image-ru.png` (RU, используется на `/ru`).
    - `npm run build` больше не пересобирает Creative.
    - В коде оставлены TODO по метрикам VoiceNotes.

---

## 4. Задачи

### T1. Выложить ветку (приоритет: высокий)

1. `git push -u origin polish/business-v2`.
2. Открыть превью Vercel для ветки. Проверить на десктопе и телефоне:
   - `/`, `/ru`, `/projects/voicenotes`, `/ru/projects/voicenotes`;
   - окно контактов (клик по email копирует; «Show number» показывает и копирует номер);
   - перетаскивание переключателя EN/RU, меню темы при наведении;
   - галерею в кейсе (листание, переход 6→1);
   - 3 клика по логотипу ведут на `/creative/`, а из Creative кнопка Business возвращает назад;
   - тёмную тему.
3. Если всё в порядке — слить ветку в `main` (PR или merge). Прод деплоится из `main`.

**Готово, когда:** прод `https://www.akbar02work.xyz` показывает новую версию, `/ru` отдаёт 200.

### T2. Обновить кэш превью ссылок (после T1)

Telegram и LinkedIn кэшируют старую картинку превью.
- **Telegram:** бот **@WebpageBot**, отправить ему `https://www.akbar02work.xyz/` и `https://www.akbar02work.xyz/ru`.
- **LinkedIn:** Post Inspector — `https://www.linkedin.com/post-inspector/`.

### T3. Метрики VoiceNotes (когда будут замеры)

Сейчас в карточке и кейсе «4 modes / BYOK / Room». Это не совсем метрики. В коде есть TODO с предложениями:
- `src/data/projectCatalog.ts`: комментарий `TODO(Akbar)` над `metrics` у VoiceNotes;
- `src/data/i18n/projects.ru.ts`: такой же TODO с русскими подписями (порядок тот же).

Предлагаемые метрики и как замерить:
1. **«~X s — to transcribe 30 s of speech on-device».** Включить локальный режим и авиарежим, записать 30 секунд, засечь время от «стоп» до появления расшифровки. Взять среднее по 3 попыткам и записать модель телефона.
2. **«X MB — offline Russian ASR model, downloaded once».** Размер скачиваемой модели: в настройках приложения или по файлам в приватной папке.
3. **«X MB — release APK».** `./gradlew assembleRelease` → размер `app/build/outputs/apk/release/*.apk`, или download size в Play Console для AAB.

Шаги:
1. Заменить `metrics` в обоих файлах.
2. Удалить TODO-комментарии.
3. Запустить `npm run ci`. Если тест `src/data/__tests__/projects.test.ts` проверяет старые значения, обновить его.

### T4. Опубликовать кейс Lumingo (когда продукт будет готов)

Данные кейса уже есть в `src/data/projectCatalog.ts` (`published: false`). Там три платформы: Android (RC), Web (public beta), iOS (in development). Сейчас скриншоты — SVG-заглушки в `public/projects/lumingo/*.svg`.

Шаги:
1. **Скриншоты.** Заменить заглушки реальными: Android → phone, Web → browser. Пути задаются в `gallery` у Lumingo. PNG можно прогнать через `npm run optimize:images`: скрипт создаёт webp/avif.
2. **iOS.** Решить с владельцем: оставить вкладку «In development» или убрать платформу `ios` из `platforms` и `gallery`.
3. **Проверить тексты кейса** (EN): статусы, метрики, stack, claims. Ничего не выдумывать, только то, что подтвердит владелец.
4. **Перевод.** Добавить Lumingo в `src/data/i18n/projects.ru.ts`: description, role, metrics, mediaAlt, galleryCaptions, overview, challenge, keyFeatures, engineeringNote и `platforms.{android,web,ios}` (status, summary, role, metrics, overview, challenge, stack, keyFeatures, engineeringNote). Тип — `ProjectTranslation` в `projectCatalog.ts`.
5. **Опубликовать:** `published: true`. Порядок проектов задаётся в `PROJECT_ORDER`: сейчас Lumingo идёт первым.
6. **Схема архитектуры (по желанию).** Добавить `lumingo` в `src/data/architecture.ts`. Формат как у VoiceNotes: `before` / `branches` / `after`, EN и RU.
7. **Creative.** Каталог влияет на встроенную Creative-версию. Пересобрать её на Linux/macOS (`npm run build:creative`) и закоммитить `public/creative/`, иначе CI упадёт на drift-проверке. В `creative/src/siteData.ts` уже есть карточка Lumingo со ссылкой на `/projects/lumingo`.
8. **Обновить тесты**, которые сейчас проверяют, что Lumingo скрыт:
   - `tests/e2e/critical-flows.spec.ts` → «keeps hidden Lumingo content out of public routes»;
   - `tests/e2e/release.spec.ts` → `/projects/lumingo` в списке 404 и `sitemap not.toContain`;
   - `tests/e2e/i18n.spec.ts` → `/ru/projects/lumingo` 404 и sitemap;
   - `tests/e2e/smoke.spec.ts` → `Lumingo … toHaveCount(0)`;
   - `tests/e2e/creative.spec.ts` → `heading Lumingo toHaveCount(0)`;
   - `src/__tests__/smoke.test.tsx` → `queryByRole heading Lumingo toBeNull`;
   - `src/data/__tests__/projects.test.ts` → «keeps Lumingo data intact while excluding it from public collections».
9. **Hero (по желанию).** Сделать «Lumingo» в заголовке ссылкой на кейс: `src/components/sections/Hero.tsx`, span с Lumingo.
10. **CV.** В PDF уже есть ссылка на `https://www.akbar02work.xyz/projects/lumingo`. После публикации она заработает, CV менять не нужно.
11. Прогнать `npm run ci:full`.

**Готово, когда:** `/projects/lumingo` и `/ru/projects/lumingo` отдают 200 и есть в sitemap. Карточка видна в Works, в меню Projects и в Creative. Все тесты зелёные.

### T5. Русское CV (когда владелец его сделает)

1. Положить файл в `public/`, например `public/CV_Akbar_Azizov_Kotlin&Compose_RU.pdf`.
2. В `src/components/sections/Hero.tsx` сейчас жёстко прописан `withBase("/CV_Akbar_Azizov_Kotlin&Compose_EN.pdf")` и `download="Akbar_Azizov_CV.pdf"`. Сделать путь зависимым от языка: например, добавить в `src/i18n/messages.ts` поле `hero.cvHref` для EN и RU (структуры словарей должны совпадать, это проверяет тест), или завести map по `locale` из `useI18n()`.
3. Проверить, что файл отдаётся на `/ru` (E2E: `request.get(href)` → 200).

### T6. Проверить факты и тексты с владельцем (быстро, но важно)

- `src/data/about.ts`:
  - строка **«RU · EN · UZ»** (языки добавлены по предположению, владелец ещё не подтвердил);
  - био и три принципа написаны по CV: это должен быть голос владельца;
  - периоды «2026 — now».
- `src/i18n/messages.ts` (RU) и `src/data/i18n/projects.ru.ts`: русские тексты писал ИИ, владельцу стоит вычитать.

### T7. Идеи на потом (не обязательно, только по желанию владельца)

- Поддержка `npm run dev:pair` на Windows. Сейчас скрипт использует группы процессов POSIX.
- Прогонять E2E в Firefox и WebKit локально: `npx playwright install firefox webkit`, затем `npx playwright test --browser=firefox` / `--browser=webkit`. Раньше все 3 движка были зелёные.
- Скрипт генерации OG-картинок из шаблона. Сейчас PNG сделаны вручную: 1200×630, Geist, фото `public/avatar.png`, лаймовая арка.

---

## 5. Карта кода (где что лежит)

| Что | Где |
|---|---|
| Страницы | `src/pages/Index.tsx`, `ProjectDetail.tsx`, `NotFound.tsx` |
| Секции главной | `src/components/sections/` — `Hero`, `TechStack` (бегущая строка), `Projects`, `About`, `Footer` |
| Навбар | `src/components/layout/Navbar.tsx`, `navbar/DesktopNav.tsx`, `MobileMenu.tsx`, `LanguageSwitch.tsx`, `ThemeMenu.tsx`, `LogoMark.tsx`, `navigation.ts` |
| Контакты | `src/components/contact/ContactDialog.tsx`, `src/data/contacts.ts`, `src/components/ui/CopySwap.tsx`, `src/hooks/useCopyFeedback.ts` |
| Кейс проекта | `src/components/project/*` (галерея — `ProjectGallery.tsx`, схема — `ProjectArchitecture.tsx`) |
| Данные проектов | `src/data/projectCatalog.ts` (EN, флаг `published`), `src/data/i18n/projects.ru.ts` (RU), `projects.ts` / `projectsSummary.ts` (производные, `*ByLocale`) |
| About | `src/data/about.ts` (EN + RU) |
| Схемы архитектуры | `src/data/architecture.ts` |
| i18n | `src/i18n/locales.ts` (`localizePath`, `stripLocale`, `OG_IMAGE`), `messages.ts` (все строки интерфейса EN/RU), `I18nProvider.tsx`, `useI18n.ts` |
| SEO | `src/components/PageSeo.tsx` (клиент), `scripts/prerender.ts` + `vite.config.ts` (пререндер мета-тегов, hreflang, sitemap) |
| Пасхалка (3 клика) | `src/hooks/useEasterLogo.ts` (`clicksRequired = 3`, `onUnlock` в `Navbar.tsx` → `getCreativeUrl()`) |
| Стили и шрифты | `src/index.css` (@font-face Geist, анимации), `tailwind.config.ts` (fontFamily, `display-hero`, `display-role`), `public/fonts/Geist*.woff2` |
| Vercel | `vercel.json` (rewrites для `/ru`, `/ru/projects/:slug`, `/projects/:slug`; CSP) |
| Тесты | unit: `src/**/__tests__`; E2E: `tests/e2e/*.spec.ts` |

---

## 6. Подводные камни (прочитать ИИ-ассистенту обязательно)

1. **Windows и `public/creative/`.** На Windows сборка Creative даёт другие хэши файлов. Поэтому `npm run build` Creative больше не пересобирает. **Не коммитить изменения `public/creative/`, сделанные на Windows.** Если они появились: `git restore public/creative && git clean -fd public/creative`. Пересобирать Creative только на Linux/macOS (`npm run build:creative`) и только при изменениях в `creative/` или флагов публикации проектов. CI (`check:creative-drift`) сравнивает побайтно.
2. **Два словаря должны совпадать.** Любая новая строка интерфейса добавляется **в оба** словаря в `src/i18n/messages.ts` (en и ru). Тест `src/i18n/__tests__/locales.test.ts` проверяет, что структуры одинаковые.
3. **Ссылки внутри сайта** всегда оборачивать в `localize(...)` из `useI18n()`, иначе с `/ru` будет выкидывать на английскую версию.
4. **Импорты в файлах данных**, которые используются в `vite.config.ts` и `creative/vite.config.ts` (`projectCatalog.ts`, `i18n/projects.ru.ts`, `siteMetadata.ts`, `i18n/locales.ts`, `i18n/messages.ts`): только **относительные** пути, а в `projectCatalog.ts` и `projects.ru.ts` — с расширением **`.ts`**. Алиас `@/` там не работает, а Creative компилирует их с `moduleResolution: nodenext`.
5. **TypeScript строгий** (`noUncheckedIndexedAccess`): доступ по индексу возвращает `T | undefined`.
6. **Бюджет размера:** начальный JS+CSS Business ≤ **150 KB gzip**. Сейчас около 131 KB. Тяжёлые библиотеки (например i18next или framer-motion) не добавлять.
7. **Анимация перехода между страницами** («шторка») игнорирует клики, пока идёт. В E2E, где подряд несколько переходов, включать `page.emulateMedia({ reducedMotion: "reduce" })`.
8. **Правка файлов:** не переформатировать файлы целиком. Например, `vercel.json` оформлен вручную, `JSON.stringify` испортит форматирование и раздует diff.
9. **Коммиты:** маленькие и по одной теме, с понятным описанием. Ничего не пушить в `main` напрямую без подтверждения владельца.
10. **Факты:** в тексты сайта (метрики, статусы, опыт) не добавлять ничего, чего не подтвердил владелец.
