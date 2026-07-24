import type { ProjectStyle } from "@/constants/projectStyles";
import { withBase } from "@/lib/urls";

interface ProjectMediaFrameProps {
    image: string;
    alt: string;
    style: ProjectStyle;
    phoneClassName?: string;
    priority?: boolean;
}

const toSourceBase = (path: string) =>
    withBase(path).replace(/\.(png|jpe?g|webp|avif)$/i, "");

const ProjectMediaFrame = ({
    image,
    alt,
    style,
    phoneClassName,
    priority = false,
}: ProjectMediaFrameProps) => {
    const IconComponent = style.icon;
    const hasImage = Boolean(image && !/placeholder/i.test(image));
    const sourceBase = hasImage ? toSourceBase(image) : "";

    return (
        <div
            className={`relative mx-auto aspect-[9/19] overflow-hidden rounded-[2.2rem] border border-neutral-300 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-950 ${phoneClassName ?? "w-44 md:w-64"}`}
        >
            {hasImage ? (
                <picture>
                    <source srcSet={`${sourceBase}.avif`} type="image/avif" />
                    <source srcSet={`${sourceBase}.webp`} type="image/webp" />
                    <img
                        src={`${sourceBase}.png`}
                        alt={alt}
                        loading={priority ? "eager" : "lazy"}
                        decoding="async"
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </picture>
            ) : (
                <div
                    className={`absolute inset-0 ${style.gradient} flex flex-col items-center justify-center gap-3 p-4`}
                >
                    <IconComponent
                        className="h-10 w-10 text-neutral-500 dark:text-neutral-400"
                        strokeWidth={1}
                        aria-hidden="true"
                    />
                    <span className="text-center font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                        // screenshot coming soon
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProjectMediaFrame;
