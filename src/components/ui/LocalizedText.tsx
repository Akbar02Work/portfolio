import { useEffect, useRef, useState, type ReactNode } from "react";
import { LOCALES, type Locale } from "@/i18n/locales";
import { messages, type Messages } from "@/i18n/messages";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&+?/";
const SCRAMBLE_MS = 300;

/** Visual only: the final, accessible copy lives in the sizing layers below. */
const Scramble = ({ text }: { text: string }) => {
  const [display, setDisplay] = useState(text);
  const previous = useRef(text);

  useEffect(() => {
    if (previous.current === text) return;
    previous.current = text;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const finish = () => {
      cancelAnimationFrame(frame);
      setDisplay(text);
    };
    if (media.matches) {
      finish();
      return;
    }

    const characters = Array.from(text);
    const started = performance.now();
    let lastUpdate = 0;
    const animate = (now: number) => {
      const progress = Math.min((now - started) / SCRAMBLE_MS, 1);
      if (progress === 1) {
        finish();
        return;
      }
      if (now - lastUpdate >= 32) {
        lastUpdate = now;
        const settled = Math.floor(progress * characters.length);
        setDisplay(characters.map((character, index) =>
          index < settled || /[\s\d/·]/u.test(character)
            ? character
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ).join(""));
      }
      frame = requestAnimationFrame(animate);
    };
    const onMotionChange = () => {
      if (media.matches) finish();
    };
    media.addEventListener("change", onMotionChange);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", onMotionChange);
    };
  }, [text]);

  return <span className="locale-text__scramble" aria-hidden="true">{display}</span>;
};

type LocalizedTextProps = {
  /** Text/inline formatting only; interactive elements belong outside this component. */
  children: (copy: Messages, locale: Locale) => ReactNode;
  className?: string;
  scramble?: boolean;
};

/** Both translations size one grid cell, keeping controls and following content still. */
export const LocalizedText = ({ children, className, scramble = false }: LocalizedTextProps) => {
  const { locale } = useI18n();
  const values = LOCALES.map((language) => ({ language, content: children(messages[language], language) }));
  const first = values[0]?.content;
  // Names, numbers and other identical strings need neither duplicate text nor animation.
  if (typeof first === "string" && values.every(({ content }) => content === first)) {
    return <span className={cn("locale-text", className)}>{first}</span>;
  }
  const activeText = values.find(({ language }) => language === locale)?.content;
  const useScramble = scramble && typeof activeText === "string";

  return (
    <span className={cn("locale-text", className)} data-scramble={useScramble || undefined}>
      {values.map(({ language, content }) => (
        <span
          key={language}
          lang={language}
          className="locale-text__value"
          data-active={language === locale}
          aria-hidden={language !== locale || undefined}
        >
          {content}
        </span>
      ))}
      {useScramble && <Scramble text={activeText} />}
    </span>
  );
};
