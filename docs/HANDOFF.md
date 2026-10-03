# Портфолио Akbar — текущий контекст

Сверено с рабочим деревом 03.10.2026. Это контекст для продолжения работы,
а не журнал изменений или подтверждение состояния опубликованного сайта.
История реализации остаётся в Git. Текущую ветку и изменения проверяйте через
`git status` и `git branch --show-current`, а не по сохранённым хэшам.

## Что читать

- [README](../README.md): запуск, сборка, CI, конфигурация и релиз.
- [Creative](../creative/README.md): отдельное приложение и его ограничения.
- [Lumingo](specs/2026-08-07-lumingo-portfolio-design.md): контракт платформенного кейса.
- [Производительность](audits/2026-09-05-performance-optimization.md): профилировщики,
  сохранённые компромиссы и условия исторических измерений.

## Текущее состояние

- Business: React 18, Vite, TypeScript, Tailwind; главная, кейсы, EN/RU, темы и CV.
- Creative: React 19, GSAP, Lenis, WebGL; отдельная сборка в `creative/`, встроенная
  версия в `public/creative/`. Ниже 901 px показывается мобильный gate.
- Один публичный кейс: **AI Voice Notes**, slug `voicenotes`. Репозиторий приложения:
  `https://github.com/Akbar02Work/AI-Voice-Notes`.
- **Lumingo в разработке и скрыт** (`published: false`). DEV-просмотр:
  `/projects/lumingo?preview=1` или `/ru/projects/lumingo?preview=1`.
  В production эти адреса возвращают 404, включая вариант с `preview=1`.
- EN и RU CV лежат в `public/`; hero выбирает PDF по языку страницы.
  Ссылки из обоих CV на скрытый Lumingo сохранены намеренно по решению владельца.
- Статическая 404 выбирает EN/RU по URL и учитывает сохранённую тему.
  `public/scripts/not-found-init.js` локализует текст, title и ссылку возврата;
  HTTP-статус остаётся 404. Без JavaScript сохраняется английский fallback.
- Отказ копирования телефона показывает сообщение с `role="alert"`. Номер остаётся
  доступен для ручного копирования; предыдущая отметка успеха сбрасывается.
- `/old/` — намеренно публичный архив с запретом индексации, не приватная область.

## Принятые решения

| Область | Что сохранить |
| --- | --- |
| Hero | Имя **Akbar**, рукописное подчёркивание, роль Android Engineer / основатель Lumingo; Contact и Download CV. |
| Визуальный стиль | MONO/VOLT, Geist + Geist Mono, номерные секции, лента стека. Токены и размеры — в CSS/Tailwind, не в старых макетах. |
| Проекты | Порядок каталога Lumingo → AI Voice Notes; публичные номера вычисляются после фильтрации. Цвета продукта остаются в media, интерфейс использует общий Volt. |
| Контакты | Radix Dialog: по центру на десктопе, снизу на мобильном. Telegram → Email → Phone → LinkedIn → GitHub. Email копируется; телефон раскрывается и копируется по нажатию. Соцссылки футера сохраняются. |
| Анимации | Галерея с циклическим переходом; копирование с blur-crossfade. Сохранять keyboard focus и reduced motion. |
| Язык | `/ru` и `/ru/projects/:slug`, обращение на «вы». Язык браузера не вызывает redirect; явный выбор EN/RU запоминается. Переключатель допускает перетаскивание. |
| Альтернативные версии | Три быстрых клика по логотипу на главной открывают диалог выбора Creative / Old; прямого переключателя в меню нет. Creative: desktop-контент английский, мобильный gate русскоязычный. |
| Материалы | Скриншоты AI Voice Notes остаются русскоязычными; демо-видео не требуется. Lumingo не публиковать до нового запроса владельца. |

## Где менять

| Задача | Файлы |
| --- | --- |
| Страницы и секции | `src/pages/`, `src/components/sections/` |
| Navbar, язык, тема | `src/components/layout/navbar/`, `src/hooks/useTheme.tsx` |
| Выбор Creative / Old | `src/components/layout/navbar/HiddenVersionsDialog.tsx`, `src/hooks/useEasterLogo.ts`, `src/constants/siteVersions.ts` |
| Контакты | `src/components/contact/ContactDialog.tsx`, `src/data/contacts.ts`, `src/hooks/useCopyFeedback.ts` |
| Публичность, порядок, платформы | `src/data/projectCatalog.ts`; производные `projects.ts`, `projectsSummary.ts` |
| Русские тексты проектов | `src/data/i18n/projects.ru.ts` |
| About и архитектурные схемы | `src/data/about.ts`, `src/data/architecture.ts` |
| Строки и маршруты EN/RU | `src/i18n/messages.ts`, `locales.ts`, `I18nProvider.tsx`, `useI18n.ts` |
| Кейсы и галерея | `src/components/project/`, `src/hooks/useLoopCarousel.ts`, `src/pages/ProjectDetail.tsx` |
| SEO и маршруты | `src/components/PageSeo.tsx`, `scripts/prerender.ts`, `vite.config.ts`, `vercel.json` |
| 404 | `src/components/NotFoundView.tsx`, `src/pages/NotFound.tsx`, `public/404.html`, `public/scripts/not-found-init.js` |
| Creative | `creative/src/siteData.ts`, `creative/src/components/`, `creative/vite.config.ts` |
| Стили, шрифты | `src/index.css`, `tailwind.config.ts`, `public/fonts/Geist*.woff2` |

## Важные ограничения

- Новые строки интерфейса добавлять в оба словаря EN/RU. Внутренние ссылки строить
  через `localize(...)`; URL платформ — через существующие helpers.
- Данные, импортируемые Vite-конфигурациями, используют относительные импорты.
  В `projectCatalog.ts` и `projects.ru.ts` сохранять расширение `.ts` для Creative.
- При изменении Creative или публичности проектов обновлять embed на Linux/macOS.
  На Windows использовать Business-сборку с сохранённым embed. При расхождении
  сравнить файлы и пересобрать на поддерживаемой платформе; не удалять чужие изменения.
- Gzip-бюджеты: начальный JS/CSS Business и полный JS/CSS Creative — по 150 KiB.
  Тяжёлые зависимости добавлять только при конкретной необходимости.
- Пререндер создаёт метаданные, а не полный SSR. Vite preview не проверяет реальные
  404/headers; для этого есть `scripts/serve-static.mjs`.
- Проверки выбирать по изменению; полный `ci:full` нужен для подготовки релиза.
  В E2E с быстрыми последовательными переходами можно включить reduced motion.
- Не добавлять неподтверждённые метрики, опыт или статусы. Push, merge и deploy
  выполнять только в рамках запроса владельца.

## Осталось без срочности

- Lumingo: перед будущей публикацией подготовить реальные экраны или подписи макетов,
  сверить EN/RU-тексты и статусы Android/Web/iOS, обновить embed и проверить маршруты.
  SVG в `public/projects/lumingo/` сейчас служат черновыми иллюстрациями.
- AI Voice Notes: измеримые показатели можно добавить после замеров на устройстве.
  Методика записана рядом с `TODO(Akbar)` в EN/RU-данных; текущие три пункта описывают
  возможности, а не результаты измерений.
- `profile-navigation.mjs` в обычном режиме ожидает сразу доступную ссылку Creative.
  Его потребуется адаптировать к открытию диалога тремя кликами и выбору версии;
  сейчас документирован сценарий `PERF_FLOW=projects`.

Внешний deployment, переменные Vercel и полный CI подтверждаются отдельно.
Старые результаты тестов и замеров не являются гарантией текущего релиза.
