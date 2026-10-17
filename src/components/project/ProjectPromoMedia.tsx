import type { ProjectPromo } from "@/data/projectCatalog";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/i18n/useI18n";
import { withBase } from "@/lib/urls";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type ProjectPromoMediaProps = {
    promo: ProjectPromo;
    playable?: boolean;
    className?: string;
};

type Playback = { time: number; playing: boolean };

const PromoPlayer = ({ video, poster, captions }: { video: string; poster: string; captions: string }) => {
    const { t } = useI18n();
    const playerRef = useRef<HTMLVideoElement>(null);
    const [source, setSource] = useState<{ video: string; resume?: Playback }>({ video });

    useLayoutEffect(() => {
        if (source.video === video) return;
        const player = playerRef.current;
        // Capture before React changes src; the browser resets playback when it changes.
        const resume = source.resume ?? (player && (player.currentTime > 0 || !player.paused)
            ? { time: player.currentTime, playing: !player.paused }
            : undefined);
        setSource({ video, resume });
    }, [video, source]);

    useEffect(() => {
        const player = playerRef.current;
        return () => { player?.pause(); };
    }, []);

    return (
        <video
            ref={playerRef}
            src={withBase(source.video)}
            poster={withBase(poster)}
            controls
            playsInline
            preload={source.resume ? "auto" : "none"}
            aria-label={t.project.film}
            className="h-full w-full cursor-default object-cover"
            onLoadedMetadata={(event) => {
                const resume = source.resume;
                if (!resume) return;
                const player = event.currentTarget;
                player.currentTime = Math.min(resume.time, player.duration);
                if (resume.playing) void player.play().catch(() => { /* Native play remains available. */ });
                setSource({ video: source.video });
            }}
        >
            <track kind="captions" src={withBase(captions)} srcLang="en" label="English" />
            <a href={withBase(video)}>{t.project.openVideo}</a>
        </video>
    );
};

/** The card and inactive carousel copies stay still and never mount a player. */
export const ProjectPromoMedia = ({ promo, playable = false, className = "w-44 md:w-64" }: ProjectPromoMediaProps) => {
    const { theme } = useTheme();
    const media = promo[theme];

    return (
        <div className={`relative mx-auto aspect-[9/19] overflow-hidden rounded-2xl border border-neutral-300 bg-[#edf5f5] shadow-xl dark:border-neutral-700 dark:bg-[#071b1f] ${className}`}>
            {playable ? (
                <PromoPlayer video={media.video} poster={media.poster} captions={promo.captions} />
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
