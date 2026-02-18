VERSION: v0.80

## 1) Какая сейчас версия сайта

- Формальная версия из `package.json`: `0.0.0`.
- Текущая ревизия `main`: `90a9f6b` (`2026-02-05T17:06:11+03:00`).
- Git-тегов и GitHub Releases: нет.
- Практичный формат для вывода на сайте: `v0.0.0+90a9f6b`.

## 2) Полный список push-событий в GitHub

`GitHub Events` вернул 13 push-событий в `refs/heads/main`.

| # | Push time (UTC) | Branch | Head commit | Комментарий |
|---|---|---|---|---|
| 1 | 2026-01-31T08:14:46Z | main | `b215e7e` | refactor architecture + dark mode + SEO |
| 2 | 2026-01-31T12:49:41Z | main | `7d826ec` | responsive + carousel UX |
| 3 | 2026-01-31T15:49:21Z | main | `75b70de` | mobile polish + senior content |
| 4 | 2026-02-01T09:29:03Z | main | `091bc43` | optimize bundle + strict TS + SEO |
| 5 | 2026-02-01T23:55:17Z | main | `b2907fa` | technical audit improvements (v2.0) |
| 6 | 2026-02-01T23:58:15Z | main | `6b4f8e6` | fix manualChunks circular issue |
| 7 | 2026-02-02T00:53:58Z | main | `6fbcb9a` | build optimizations + Playwright E2E |
| 8 | 2026-02-05T06:58:32Z | main | `5c9583f` | blinking underscore in logo/favicon |
| 9 | 2026-02-05T07:26:49Z | main | `993b4c0` | Inter font + test setup restore |
| 10 | 2026-02-05T08:40:58Z | main | `4fe4718` | SEO meta update + theme menu refactor |
| 11 | 2026-02-05T13:31:58Z | main | `c8f8150` | changelog update + placeholder cleanup |
| 12 | 2026-02-05T13:44:47Z | main | `545acfa` | asset rename (`Preview` -> `og-image`) |
| 13 | 2026-02-05T14:06:13Z | main | `90a9f6b` | sync latest changes |

Примечание:
- Первый коммит `d92841a` есть в истории, но отдельного `PushEvent` на него нет (репозиторий создан `2026-01-30T18:22:56Z`, ветка `main` создана `2026-01-30T18:23:05Z`).

## 3) Полный список всех коммитов (24)

### 3.1 Коммиты в `main` (14 шт.)

1. `d92841a` — 2026-01-30 — `feat: initial commit of premium AI portfolio website`
- Добавлено: базовый Vite/React/TS проект, роуты, секции, ассеты, тестовая и UI-база.
- Изменено: нет (initial commit).
- Оптимизировано: базовая стартовая структура.

2. `b215e7e` — 2026-01-31 — `feat: refactor architecture, add dark mode, and optimize SEO`
- Добавлено: секции `Hero/About/Projects/TechStack/Footer`, `useTheme`, `og-image`.
- Изменено: `Index`, `AnimatedSection`, `index.html`.
- Оптимизировано: архитектура страницы и мета-SEO.

3. `7d826ec` — 2026-01-31 — `feat: Enhance portfolio UI/UX with responsive layout and carousel`
- Добавлено: служебный `CHANGES_CODEX.md` (позже удален).
- Изменено: `Hero/Projects/TechStack/index.css`.
- Оптимизировано: адаптив и карусельный UX.

4. `75b70de` — 2026-01-31 — `feat: Polish Mobile UX and Senior Content`
- Добавлено: контентные/визуальные улучшения.
- Изменено: `About/Footer/Hero/Projects/TechStack`, `data/projects.ts`.
- Оптимизировано: mobile UX и подача контента.

5. `091bc43` — 2026-02-01 — `Optimize portfolio: reduce bundle size, enable strict TS, dynamic SEO, cleanup`
- Добавлено: `BackToTop`, `ProjectCard`, `PageLoader`.
- Изменено: SEO/meta, роутинг, стили, данные, конфиги.
- Оптимизировано: бандл, строгий TS, cleanup неиспользуемых частей.

6. `b2907fa` — 2026-02-02 — `chore: release technical audit improvements (v2.0)`
- Добавлено: `ErrorBoundary`, `MainLayout`, `Navbar`, `useSwipe`, новые constants/data split, `src/lib/urls.ts`, адаптированные аватары.
- Изменено: почти весь каркас приложения + theme/scroll/sections.
- Оптимизировано: performance, accessibility, архитектура.

7. `6b4f8e6` — 2026-02-02 — `fix: remove manualChunks config to resolve circular dependency reference error`
- Добавлено: нет.
- Изменено: `vite.config.ts`.
- Оптимизировано: устранение build/runtime ошибки от циклической ссылки.

8. `6fbcb9a` — 2026-02-02 — `build: optimize chunks and add E2E testing infrastructure`
- Добавлено: CI workflow, Playwright config, smoke tests, cycle-check script.
- Изменено: build-конфиги, `App`, `Navbar`, `Hero`, theme/scroll hooks.
- Оптимизировано: DX/CI и стабильность поставки.

9. `5c9583f` — 2026-02-05 — `feat: animate favicon and logo with synced blinking underscore, update footer text`
- Добавлено: `useBlink`, `useDynamicFavicon`, `public/Preview.png`.
- Изменено: `Navbar`, `Footer`, `BackToTop`, стили, `App`.
- Оптимизировано: синхронность визуального брендинга (logo + favicon).

10. `993b4c0` — 2026-02-05 — `refactor: apply recent updates`
- Добавлено: `public/fonts/Inter-latin.woff2`, `src/test/setup.ts`.
- Изменено: `index.html`, `MainLayout`, `index.css`, `vitest.config.ts`.
- Оптимизировано: типографика и тестовая конфигурация.

11. `4fe4718` — 2026-02-05 — `feat: update SEO meta tags and refactor Navbar theme menu`
- Добавлено: `CHANGELOG.md`, `src/hooks/useTheme.tsx`.
- Изменено: `index.html`, `App`, `Navbar`, `Hero`, `useSwipe`, стили.
- Оптимизировано: SEO-метаданные и UX меню темы.

12. `c8f8150` — 2026-02-05 — `docs: update changelog and remove placeholder images`
- Добавлено: нет.
- Изменено: `CHANGELOG.md`.
- Оптимизировано: убраны placeholder PNG в `public/projects`.

13. `545acfa` — 2026-02-05 — `chore: updates`
- Добавлено: нет.
- Изменено: rename `public/Preview.png` -> `public/og-image.png`.
- Оптимизировано: ассет под SEO/OpenGraph имя.

14. `90a9f6b` — 2026-02-05 — `chore: sync latest changes`
- Добавлено: нет.
- Изменено: `index.html`, `src/pages/ProjectDetail.tsx`.
- Оптимизировано: финальная синхронизация SEO/деталей страницы проекта.

### 3.2 Коммиты в дополнительных ветках (10 шт., не в `main`)

1. `442b675` (`origin/audit-report-*`)
- Добавлено: `AUDIT.md`.
- Изменено: нет.
- Оптимизировано: аудит-документация.

2. `beb1fc4` (`origin/perf-route-splitting-*`)
- Добавлено: нет.
- Изменено: `package-lock.json`, `src/App.tsx`.
- Оптимизировано: route code splitting.

3. `eb25dcc` (`origin/palette/add-project-link-*`)
- Добавлено: `.Jules/palette.md`, `pnpm-lock.yaml`.
- Изменено: `Projects.tsx`.
- Оптимизировано: карточки/drag interaction.

4. `3bbe9a1` (`origin/bolt-perf-code-splitting-*`)
- Добавлено: `.jules/bolt.md`, `PageLoader`.
- Изменено: `App.tsx`, `Projects.tsx`.
- Оптимизировано: code splitting и карусель.

5. `8e22872` (`origin/sentinel/csp-enhancement-*`)
- Добавлено: `src/test/security.test.ts`.
- Изменено: `index.html`.
- Оптимизировано: CSP/security.

6. `b938e5c` (`origin/perf-throttle-scroll-projects-*`)
- Добавлено: perf test + `useThrottledCallback`.
- Изменено: `Projects.tsx`.
- Оптимизировано: throttle wheel-scrolling.

7. `edd271a` (`origin/perf-notfound-logging-*`)
- Добавлено: benchmark test для NotFound.
- Изменено: `NotFound.tsx`.
- Оптимизировано: убрать production console logging.

8. `963ddaa` (`origin/palette-back-to-top-*`)
- Добавлено: `BackToTop.tsx` и служебные файлы.
- Изменено: `Index.tsx`.
- Оптимизировано: UX длинных страниц.

9. `171ead3` (`origin/perf-usetoast-optimization-*`)
- Добавлено: нет.
- Изменено: `src/hooks/use-toast.ts`.
- Оптимизировано: стабильность эффекта hook.

10. `3c8ac37` (`origin/vercel/enable-vercel-speed-insights-*`)
- Добавлено: нет.
- Изменено: `package.json`, `package-lock.json`, `src/App.tsx`.
- Оптимизировано: подключение Vercel Speed Insights.

## 4) Детали, на которые стоит обратить внимание на сайте

1. Синхронный мигающий `_` в логотипе и favicon.
- Общий источник состояния: `useBlink` + `useDynamicFavicon`.
- Тайминг: `3s ON / 1s OFF`.

2. Анимации учитывают `prefers-reduced-motion`.
- При reduce-motion underscore фиксируется, лишние анимации отключаются.

3. Favicon рисуется на лету в canvas.
- Цвет подстраивается под тему (`dark/light`), символ меняется между `A_` и `A `.

4. 3 режима темы (Light / Dark / System).
- Сохраняется в `localStorage` ключом `theme-mode`.

5. Scroll-spy в Navbar через `IntersectionObserver` + fallback.
- Активная секция подсвечивается даже на edge-cases (доскролл до низа).

6. Карусели автолистаются каждые 8 секунд.
- Пауза/перезапуск при `visibilitychange`.

7. Swipe и tap-поведение на карточках.
- На мобильном: свайп листает, tap открывает проект.

8. Сохранение позиции скролла между перезагрузками.
- `sessionStorage["scrollY"]`.

9. Sticky Tech Stack bar с offset под фиксированный navbar.

10. Важная деталь для QA/пасхалок:
- В `data/projects*.ts` еще есть ссылки на `/projects/project-placeholder-*.png`, но сами файлы удалены в `c8f8150`.
- Поэтому в карточках/экранах включается fallback (иконки/placeholder-логика).

11. В `index.html` указан `/favicon.svg`, но файл удален.
- Иконка фактически подменяется рантаймом через `useDynamicFavicon`.
12. Вход в пасхалочную страницу скрыт.
- Явная ссылка в футере убрана; вход идет через серию из 5 быстрых кликов по логотипу на главной.

## 5) Все доступные ссылки и где искать пасхалки

### 5.1 Внутренние маршруты сайта

- `/` — главная страница.
- `/projects/voicebrain`
- `/projects/market-r`
- `/projects/llm-security`
- `/projects/loyalist`
- Любой другой путь -> `404`.

Пасхальные места внутри маршрутов:
- Логотип в Navbar: `<Aka_/Portfolio/>` с мигающим `_`.
- Вкладка браузера: динамический favicon `A_`/`A `.
- Страницы проектов: “Coming Soon...” + fallback-иконки как скрытая «заглушка-уровень».

### 5.2 Внешние ссылки (из UI/данных)

- `mailto:akbar02work@gmail.com`
- `https://t.me/Akbar02Work`
- `https://github.com/Akkbar618`
- `https://www.linkedin.com/in/akbar02work`
- `https://play.google.com` (для `loyalist`)

### 5.3 Файловые/служебные ссылки

- `/CV_Akbar_Azizov_Kotlin&Compose_EN.pdf` (Download CV)
- `https://www.akbar02work.xyz/` (канонический URL в meta)
- `https://www.akbar02work.xyz/og-image.png` (OG image в meta)

## 6) Готовый каркас для будущей "пасхалочной" страницы

- `Текущая версия`: `v0.0.0+90a9f6b`.
- `Лента изменений`: блок из раздела 3.1 (main) + отдельный блок "эксперименты в ветках" из 3.2.
- `Скрытые фишки`: пункты 1-3 из раздела 4.
- `Микро-приколы, которые можно добавить`:
  - Показ текущей фазы blink-цикла (`ON/OFF`) в реальном времени.
  - Кнопка "Reveal all hidden links" с подсветкой маршрутов `/projects/*`.
  - Бейдж "Runtime favicon active" (если `document.querySelector('link[rel~="icon"]')` ведет на data URL).

## 7) Локальные черновые обновления (после `90a9f6b`)

1. `src/App.tsx` — подключен скрытый роут пасхалки.
- Добавлено: lazy import страницы `Easter`.
- Изменено: зарегистрирован маршрут `/easter` перед catch-all `*`.
- Оптимизировано: страница грузится отдельно и не утяжеляет основной bundle.

2. `src/components/layout/Navbar.tsx` — скрытый вход в Easter page + корректная активная навигация.
- Добавлено: секретная последовательность (5 кликов по логотипу за 1.6с) с переходом на `/easter`.
- Изменено: active state на detail-роутах теперь вычисляется по `pathname` (`/projects/*` подсвечивает `Projects`, `/easter` не подсвечивает лишнее).
- Оптимизировано: корректнее UX навигации и доступ к пасхалке без явной ссылки в UI.

3. `src/components/layout/MainLayout.tsx` — page-level переключатели layout-элементов.
- Добавлено: пропсы `showFooter` и `showBackToTop` (по умолчанию `true`).
- Изменено: рендер `Footer` и `BackToTop` стал условным.
- Оптимизировано: можно гибко настраивать чистые экраны для специальных страниц (например, 404).

4. `src/pages/Easter.tsx` — полноценная Easter-страница с live-данными и manual report.
- Добавлено: чтение `EASTER_PAGE_CHANGELOG.md` через `?raw` и парсинг `VERSION: ...` из первой строки.
- Изменено: выводятся сразу 2 версии: runtime (`__APP_VERSION__ + __GIT_COMMIT_SHA__`) и manual из changelog.
- Оптимизировано: confetti-интро (328 частиц) и fallback для `prefers-reduced-motion`.

5. `src/index.css` — инфраструктура анимации конфетти.
- Добавлено: классы `.easter-confetti-layer`, `.easter-confetti-piece` и keyframes `easter-confetti-fall`.
- Изменено: частицы получили управляемый drift/rotate через CSS custom properties.
- Оптимизировано: эффекты изолированы и не влияют на кликабельность (`pointer-events: none`).

6. `src/pages/NotFound.tsx` — редизайн 404-страницы под стиль Easter/terminal vibe.
- Добавлено: крупный `404`, контекстный текст с `location.pathname`, новая CTA-кнопка.
- Изменено: подключен `ServerLoader`, отключены footer/back-to-top через `MainLayout` props.
- Оптимизировано: более характерный UX ошибки и лучшее визуальное фокусирование.

7. `src/components/ui/ServerLoader.tsx` — новый визуальный компонент для 404.
- Добавлено: SVG-анимация серверного “лоадера” с частицами и градиентами.
- Изменено: интеграция в центр 404-экрана как основной визуальный акцент.
- Оптимизировано: улучшен storytelling страницы ошибки (не просто текст, а интерактивный индикатор).

8. `vite.config.ts` + `src/vite-env.d.ts` — build-time версия и SHA для UI.
- Добавлено: функции получения `version` из `package.json` и `git rev-parse --short=7 HEAD`.
- Изменено: через `define` экспортируются глобалы `__APP_VERSION__` и `__GIT_COMMIT_SHA__`.
- Оптимизировано: версия на Easter-странице обновляется автоматически и не требует ручной правки.

9. `vercel.json` — конфигурация хостинга для SPA-роутинга.
- Добавлено: правила `rewrites` всех маршрутов на `/index.html`.
- Изменено: нет (новый файл).
- Оптимизировано: исправлена ошибка 404 при прямом переходе по ссылкам (например, `/easter`) на Vercel/Netlify.

## 8) Актуальный апдейт от `2026-02-06` (простыми словами)

> Этот блок новее раздела 7 и отражает текущее состояние локальных изменений перед пушем.

### Что сделано

1. Безопасность на проде усилена.
- В `vercel.json` добавлены security headers: CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- К чему это приведет: меньше шансов на XSS/встраивание сайта в чужой iframe/другие типовые веб-атаки.

2. Скрипт темы вынесен из `index.html` в отдельный файл.
- Теперь используется `public/scripts/theme-init.js`, а не inline-скрипт.
- К чему это приведет: проще поддерживать CSP и меньше хаоса в HTML.

3. Ошибки теперь могут улетать в мониторинг, а не только в консоль.
- Добавлены `@sentry/react`, `src/lib/monitoring.ts`, вызов `initMonitoring()` в `src/main.tsx`.
- `ErrorBoundary` теперь отправляет ошибку через `captureError`.
- К чему это приведет: в проде проще находить реальные падения, а не ловить их вручную.

4. Роуты централизованы.
- Добавлен `src/constants/routes.ts`, строки `"/"`, `"/projects/:slug"`, `"/easter"` убраны из разных мест.
- К чему это приведет: меньше риска сломать навигацию из-за опечатки.

5. Большой рефактор `ProjectDetail`.
- Страница разрезана на части: `ProjectHeader`, `ProjectCarouselSection`, `ProjectDetailsSection`.
- Общая логика карусели вынесена в `useCarouselController`.
- К чему это приведет: код проще читать и безопаснее менять дальше.

6. Карусели на главной и в деталке унифицированы.
- `Projects.tsx` и `ProjectDetail.tsx` используют один контроллер карусели.
- К чему это приведет: одинаковое поведение, меньше багов и дублирования.

7. Сохранение scroll стало легче для браузера.
- В `Index.tsx` запись в storage теперь через throttle + idle callback + pagehide flush.
- К чему это приведет: меньше лишней нагрузки во время скролла, особенно на слабых устройствах.

8. Работа с storage централизована.
- Добавлен `src/lib/storage.ts`, тема и scroll читаются/пишутся через него.
- К чему это приведет: меньше падений из-за прямого доступа к `localStorage/sessionStorage`.

9. Ссылки стали безопаснее.
- Добавлены `urlSanitizer` и allowlist внешних доменов (`externalLinks`).
- Применено в `Footer` и `ProjectHeader`.
- К чему это приведет: случайные/опасные `href` не пройдут в UI.

10. Убран `styled-components` runtime для `ServerLoader`.
- Стили перенесены в `src/index.css`.
- К чему это приведет: чуть легче bundle и проще поддержка стилей.

11. Контент проектов больше не “Coming Soon...”.
- Обновлены `src/data/projectsSummary.ts` и `src/data/projects.ts`.
- Добавлены реальные SVG-экраны в `public/projects/*`.
- К чему это приведет: портфолио выглядит как готовый продукт, а не черновик.

12. Easter-страница улучшена по производительности и тестируемости.
- Парсинг отчета вынесен в `src/lib/easterReport.ts`.
- Конфетти адаптировано под mobile/reduced-motion.
- Добавлены тесты на парсинг версии и fallback.
- К чему это приведет: меньше лагов на телефонах и меньше шансов сломать страницу при правках.

13. Процессы качества подтянуты.
- Добавлены `ci:full`, `check:bundle`, `analyze`, новый CI job, Dependabot, PR template, `CONTRIBUTING.md`, релизные docs.
- К чему это приведет: проще держать проект стабильным и не пропускать регрессии.

### Что проверено перед пушем

- `npm run test` -> passed (`20/20` тестов).
- `npm run build` -> passed.
- `npm run check:bundle` -> passed (entry chunk в лимите `150 KB`).
- `npm run test:e2e tests/e2e/critical-flows.spec.ts` -> passed (`4/4`).

## 9) Пропущенные обновления после `v0.71` (`2026-02-07`)

> Этот блок закрывает изменения из последних пушей в `main`, которые не были добавлены в список выше.

1. `c4330d6` — 2026-02-07 — `Revise README for clarity and project details`
- Добавлено: структурированные разделы и более подробное описание проекта/стека в `README.md`.
- Изменено: переработана подача контента (перестановка и чистка формулировок).
- Оптимизировано: onboarding и понимание проекта при первом открытии репозитория.

2. `8c61332` — 2026-02-07 — `Update README.md`
- Добавлено: точечные уточнения по документации.
- Изменено: финальная редактура `README.md` после крупного ревью.
- Оптимизировано: читабельность и консистентность README.

3. `71258b0` — 2026-02-07 — `chore: update eslint-plugin-react-refresh, sonner, tailwind-merge, vitest`
- Добавлено: нет.
- Изменено: обновлены lockfile-зависимости для dev/tooling пакетов.
- Оптимизировано: стабильность локального CI и инструментов разработки.

4. `7821ba7` — 2026-02-07 — `chore: add LICENSE and update ci script`
- Добавлено: файл `LICENSE`.
- Изменено: в `package.json` скорректирован порядок шагов в `ci:full` (`build/check` перед `test:e2e`).
- Оптимизировано: юридическая прозрачность репозитория и более логичный CI-пайплайн.

5. `7c86584` — 2026-02-07 — `feat: add Vercel Speed Insights for RUM monitoring`
- Добавлено: пакет `@vercel/speed-insights` и рендер `<SpeedInsights />` в `src/App.tsx`.
- Изменено: `package.json` и `package-lock.json`.
- Оптимизировано: сбор полевых метрик производительности (Real User Monitoring) в проде.

6. `35b3ab4` — 2026-02-07 — `feat: replace all projects with real GitHub projects`
- Добавлено: новые проекты и изображения-заглушки: `quiz-learnwords`, `voicenotes`, `secbench`, `money-manager`, обновленный `loyalist`.
- Изменено: `src/data/projects.ts`, `src/data/projectsSummary.ts`, `src/constants/projectStyles.ts`, удалены старые SVG-экраны предыдущих демо-проектов.
- Оптимизировано: портфолио синхронизировано с реальными GitHub-репозиториями и актуальным контентом.

### Быстрый чек для Easter-page

- Актуальный HEAD для runtime-версии: `35b3ab4`.
- Актуальные project routes: `/projects/quiz-learnwords`, `/projects/loyalist`, `/projects/voicenotes`, `/projects/secbench`, `/projects/money-manager`.
- Формулировка про старые demo-проекты (`voicebrain/market-r/llm-security`) в UI больше неактуальна после `35b3ab4`.

## 10) Обновления v0.80: UX Audit & Mobile Polish (2026-02-19)

1. **UX/UI & Desktop Ergonomics Audit**:
   - Проведен детальный аудит "Pixel & Logic".
   - Выявлены и исправлены проблемы с навигацией и доступностью.

2. **Refactoring `Projects.tsx`**:
   - Заменили `div role="link"` на семантический `<Link>`.
   - Улучшили доступность (a11y) и SEO.
   - Исправили конфликт свайпа и ссылок.

3. **Security Hardening**:
   - Внедрена санитайзация URL (`sanitizeUrl`) в карточках проектов и хедере.
   - XSS-защита для внешних ссылок.

4. **Mobile Polish**:
   - Исправлена видимость плавающих иконок в секции `About` (были скрыты, теперь `scale-50`).
   - Иконки адаптированы под мобильные экраны (не перекрывают текст).

5. **General Improvements**:
   - Обмен кнопок GitHub и LinkedIn в футере.
   - Чистка кода и удаление магических чисел.
