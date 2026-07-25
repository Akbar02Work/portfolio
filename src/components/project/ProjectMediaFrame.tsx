import type { ProjectStyle } from "@/constants/projectStyles";
import { ANDROID_PHONE_FRAME } from "@/constants/phoneMockup";
import { withBase } from "@/lib/urls";

interface ProjectMediaFrameProps {
  image: string;
  alt: string;
  style: ProjectStyle;
  phoneClassName?: string;
  priority?: boolean;
  /** Phone bezel mockup. Keep on home cards; omit in the case-study carousel. */
  mockup?: boolean;
}

const toSourceBase = (path: string) =>
  withBase(path).replace(/\.(png|jpe?g|webp|avif)$/i, "");

const Screenshot = ({
  sourceBase,
  alt,
  priority,
}: {
  sourceBase: string;
  alt: string;
  priority: boolean;
}) => (
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
);

const ProjectMediaFrame = ({
  image,
  alt,
  style,
  phoneClassName,
  priority = false,
  mockup = true,
}: ProjectMediaFrameProps) => {
  const IconComponent = style.icon;
  const hasImage = Boolean(image && !/placeholder/i.test(image));
  const sourceBase = hasImage ? toSourceBase(image) : "";
  const { left, top, width, height } = ANDROID_PHONE_FRAME.screenInset;

  if (!mockup) {
    return (
      <div
        className={`relative mx-auto aspect-[9/19] overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-950 ${phoneClassName ?? "w-44 md:w-64"}`}
      >
        {hasImage ? (
          <Screenshot sourceBase={sourceBase} alt={alt} priority={priority} />
        ) : (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 ${style.gradient}`}
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
  }

  return (
    <div
      className={`relative mx-auto ${phoneClassName ?? "w-44 md:w-64"}`}
      style={{ aspectRatio: ANDROID_PHONE_FRAME.aspectRatio }}
    >
      <div
        className="absolute overflow-hidden bg-black"
        style={{
          left: `${left * 100}%`,
          top: `${top * 100}%`,
          width: `${width * 100}%`,
          height: `${height * 100}%`,
          borderRadius: "12% / 5.5%",
        }}
      >
        {hasImage ? (
          <Screenshot sourceBase={sourceBase} alt={alt} priority={priority} />
        ) : (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 ${style.gradient}`}
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

      <img
        src={withBase(ANDROID_PHONE_FRAME.webp)}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        className="pointer-events-none absolute inset-0 h-full w-full select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.5)]"
        onError={(event) => {
          event.currentTarget.src = withBase(ANDROID_PHONE_FRAME.png);
        }}
      />
    </div>
  );
};

export default ProjectMediaFrame;
