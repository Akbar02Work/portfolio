# Отчёт изменений (Codex)

Ниже перечислены все изменения, которые я внёс, с причинами и точными фрагментами кода.

## 1) Hero: классы‑якоря для адаптивной настройки + чуть шире контейнер
**Файл:** `My Portfolio Website/src/components/sections/Hero.tsx`  
**Зачем:** нужны отдельные CSS‑крючки для точечной адаптации под разные высоты/ширины; а также на больших экранах композиция смотрелась свободнее.

```tsx
<section
  id="home"
  className="hero-section relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden hero-gradient dark:bg-slate-950"
>
  <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="hero-layout flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="flex-1 space-y-6 text-center md:text-left">
        <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight text-gray-900 dark:text-white">
          ...
        </h1>
        <p className="hero-tagline text-xl text-gray-600 dark:text-slate-300 max-w-lg mx-auto md:mx-0 font-medium">
          ...
        </p>
        <p className="hero-description text-lg text-gray-500 dark:text-slate-400 max-w-lg mx-auto md:mx-0">
          ...
        </p>
        <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4 w-full sm:w-auto">
          ...
        </div>
      </div>
      <div className="flex-1 flex justify-center md:justify-end relative">
        <div className="hero-portrait w-80 h-auto md:w-[380px] relative">
          ...
        </div>
      </div>
    </div>
  </div>
</section>
```

## 2) Hero: корректная высота на больших экранах
**Файл:** `My Portfolio Website/src/index.css`  
**Зачем:** чтобы блок Hero занимал высоту экрана на больших дисплеях, а список TechStack начинался уже после скролла.

```css
.hero-section {
  min-height: 100vh;
}

@supports (height: 100svh) {
  .hero-section {
    min-height: 100svh;
  }
}
```

## 3) Плавное масштабирование на любых ширинах
**Файл:** `My Portfolio Website/src/index.css`  
**Зачем:** чтобы на маленьких экранах всё становилось чуть компактнее, а на больших — немного крупнее, без резких скачков.

```css
.hero-title {
  font-size: clamp(2.6rem, 3.6vw + 2rem, 6.5rem);
  line-height: 1.05;
}

.hero-tagline {
  font-size: clamp(1rem, 0.6vw + 0.9rem, 1.35rem);
}

.hero-description {
  font-size: clamp(0.95rem, 0.55vw + 0.85rem, 1.2rem);
}

@media (min-width: 640px) {
  .hero-portrait {
    width: clamp(300px, 18vw + 100px, 440px);
  }
}

@media (min-width: 768px) {
  .hero-section {
    padding-top: clamp(6rem, 10vh, 9rem);
    padding-bottom: clamp(4rem, 8vh, 8rem);
  }

  .hero-layout {
    gap: clamp(2.5rem, 3.5vw, 4rem);
  }
}
```

## 4) Компактный режим для низкой высоты (dock/taskbar)
**Файл:** `My Portfolio Website/src/index.css`  
**Зачем:** чтобы при низкой высоте окна (например, Chrome с видимым доком) контент не выходил за пределы экрана.

```css
@media (max-height: 820px) and (min-width: 768px) {
  .hero-section {
    padding-top: 6rem;
    padding-bottom: 4rem;
    min-height: auto;
  }

  .hero-layout {
    gap: 2.5rem;
  }

  .hero-title {
    font-size: clamp(3rem, 7vmin, 5.5rem);
    line-height: 1.05;
  }

  .hero-tagline {
    font-size: 1.125rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-cta {
    padding-top: 0.5rem;
    gap: 0.75rem;
  }

  .hero-portrait {
    width: 340px;
  }
}

@media (max-height: 740px) and (min-width: 768px) {
  .hero-section {
    padding-top: 5rem;
    padding-bottom: 3.5rem;
  }

  .hero-layout {
    gap: 2rem;
  }

  .hero-title {
    font-size: clamp(2.75rem, 6.2vmin, 5rem);
  }

  .hero-portrait {
    width: 300px;
  }
}
```
