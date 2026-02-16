import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProjectScreen } from "@/data/projects";
import type { ProjectStyle } from "@/constants/projectStyles";
import { withBase } from "@/lib/urls";
import { useSwipe } from "@/hooks/useSwipe";

type CarouselScreenProps = {
  screen: ProjectScreen;
  style: ProjectStyle;
  slideDirection: "left" | "right";
};

const CarouselScreen = ({ screen, style, slideDirection }: CarouselScreenProps) => {
  const IconComponent = style.icon;
  const [imageError, setImageError] = useState(false);
  const imageSrc = screen.image ? withBase(screen.image) : "";

  useEffect(() => {
    setImageError(false);
  }, [screen.image]);

  const showIcon = imageError || !screen.image || screen.image.includes("placeholder");

  return (
    <div className={`bg-white dark:bg-slate-800/50 rounded-[2rem] border-2 border-gray-100 dark:border-slate-700/50 overflow-hidden shadow-lg flex flex-col md:flex-row group min-h-[320px] md:min-h-[360px] w-full max-w-[920px] mx-auto ${style.hoverBorder} transition-colors duration-300 ${slideDirection === "left" ? "animate-slide-left" : "animate-slide-right"}`}>
      <div className={`w-full md:w-[44%] flex-none ${style.gradient} relative flex items-center justify-center p-6 md:p-8 min-h-[210px] md:min-h-[300px] order-1`}>
        <div className="relative w-32 md:w-40 aspect-[9/19] rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center">
          {showIcon ? (
            <IconComponent className="w-12 md:w-14 h-12 md:h-14 text-white/40" strokeWidth={1} />
          ) : (
            <img
              src={imageSrc}
              alt={screen.title}
              loading="lazy"
              decoding="async"
              width={900}
              height={1900}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="w-full md:flex-1 min-w-0 p-5 md:p-8 flex flex-col justify-center items-center text-center order-2">
        <h3 className="text-heading-2 mb-4 text-gray-900 dark:text-white">
          {screen.title}
        </h3>
        <p className="mx-auto max-w-2xl text-body-lg text-gray-600 dark:text-slate-300">
          {screen.description}
        </p>
      </div>
    </div>
  );
};

type ProjectCarouselSectionProps = {
  screens: ProjectScreen[];
  currentIndex: number;
  slideDirection: "left" | "right";
  style: ProjectStyle;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (index: number) => void;
};

export const ProjectCarouselSection = ({
  screens,
  currentIndex,
  slideDirection,
  style,
  onNext,
  onPrev,
  onSelectIndex,
}: ProjectCarouselSectionProps) => {
  const activeScreen = screens[currentIndex] ?? screens[0];
  const swipeHandlers = useSwipe({
    onSwipeLeft: onNext,
    onSwipeRight: onPrev,
  });

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {screens.length > 0 && activeScreen ? (
          <div className="relative">
            <div className="max-w-6xl mx-auto flex items-center gap-4 md:gap-8">
              <button
                onClick={onPrev}
                className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full border border-gray-200 dark:border-slate-700 items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800/50"
                aria-label="Previous screen"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div
                className="flex-1 select-none cursor-grab active:cursor-grabbing"
                {...swipeHandlers}
              >
                <CarouselScreen
                  key={activeScreen.id}
                  screen={activeScreen}
                  style={style}
                  slideDirection={slideDirection}
                />
              </div>

              <button
                onClick={onNext}
                className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full border border-gray-200 dark:border-slate-700 items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800/50"
                aria-label="Next screen"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div aria-live="polite" aria-atomic="true" className="sr-only">
              Screen {currentIndex + 1} of {screens.length}: {activeScreen.title}
            </div>

            <div className="flex justify-center gap-2 mt-6 md:mt-8">
              {screens.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                    ? "w-8 bg-gray-900 dark:bg-white"
                    : "w-2 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500"
                    }`}
                  aria-label={`Go to screen ${idx + 1}`}
                />
              ))}
            </div>

            <p className="md:hidden text-center text-caption text-gray-400 mt-4">Swipe to explore screens</p>
          </div>
        ) : (
          <div className="text-center text-gray-500">No preview screens available.</div>
        )}
      </div>
    </section>
  );
};
