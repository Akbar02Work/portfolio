import type { ProjectPromo } from "@/data/projectCatalog";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/i18n/useI18n";
import { withBase } from "@/lib/urls";
import { useEffect, useRef } from "react";

type ProjectPromoMediaProps = {
    promo: ProjectPromo;
    playable?: boolean;
    className?: string;
};

/** The card and inactive carousel copies stay still and never mount a player. */
export const ProjectPromoMedia = ({ promo, playable = false, className = "w-44 md:w-64" }: ProjectPromoMediaProps) => {
    const { theme } = useTheme();
    const { t } = useI18n();
    const media = promo[theme];
    const playerRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const player = playerRef.current;
        return () => { player?.pause(); };
    }, [media.video, playable]);

    return (
        <div className={`relative mx-auto aspect-[9/19] overflow-hidden rounded-2xl border border-neutral-300 bg-[#edf5f5] shadow-xl dark:border-neutral-700 dark:bg-[#071b1f] ${className}`}>
            {playable ? (
                <video
                    ref={playerRef}
                    key={media.video}
                    src={withBase(media.video)}
                    poster={withBase(media.poster)}
                    controls
                    playsInline
                    preload="none"
                    aria-label={t.project.film}
                    className="h-full w-full cursor-default object-cover"
                >
                    <track kind="captions" src={withBase(promo.captions)} srcLang="en" label="English" />
                    <a href={withBase(media.video)}>{t.project.openVideo}</a>
                </video>
            ) : (
                <img
                    src={withBase(media.poster)}
                    alt={promo.alt}
                    width={720}
                    height={1520}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover"
                />
            )}
        </div>
    );
};
