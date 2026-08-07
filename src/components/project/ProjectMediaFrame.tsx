import type { ProjectStyle } from "@/constants/projectStyles";
import { ANDROID_PHONE_FRAME } from "@/constants/phoneMockup";
import type { ProjectMediaType } from "@/data/projectCatalog";
import { withBase } from "@/lib/urls";

interface ProjectMediaFrameProps {
  image: string;
  alt: string;
  style: ProjectStyle;
  phoneClassName?: string;
  priority?: boolean;
  mediaType?: ProjectMediaType;
  /** Phone bezel mockup. Keep on home cards; omit in the case-study carousel. */
  mockup?: boolean;
}

const toSourceBase = (path: string) =>
  withBase(path).replace(/\.(png|jpe?g|webp|avif)$/i, "");

const Screenshot = ({
  image,
  alt,
  priority,
}: {
  image: string;
  alt: string;
  priority: boolean;
}) => {
  if (/\.svg$/i.test(image)) {
    return (
      <img
        src={withBase(image)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  const sourceBase = toSourceBase(image);
  return (
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
};

const EmptyMedia = ({
  style,
  iconLabel,
}: {
  style: ProjectStyle;
  iconLabel: string;
}) => {
  const IconComponent = style.icon;

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 ${style.gradient}`}
    >
      <IconComponent
        className="h-10 w-10 text-neutral-500 dark:text-neutral-400"
        strokeWidth={1}
        aria-hidden="true"
      />
      <span className="text-center font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
        {iconLabel}
      </span>
    </div>
  );
};

const BrowserFrame = ({
  image,
  alt,
  style,
  priority,
  className,
  mockup,
}: {
  image: string;
  alt: string;
  style: ProjectStyle;
  priority: boolean;
  className?: string;
  mockup: boolean;
}) => {
  const hasImage = Boolean(image && !/placeholder/i.test(image));

  if (!mockup) {
    return (
      <div
        className={`relative mx-auto aspect-[16/10] overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-950 ${className ?? "w-full max-w-3xl"}`}
      >
        {hasImage ? (
          <Screenshot image={image} alt={alt} priority={priority} />
        ) : (
          <EmptyMedia style={style} iconLabel="// web preview coming soon" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative mx-auto ${className ?? "w-full max-w-xl"}`}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.24)] dark:border-neutral-700 dark:bg-neutral-950">
        <div
          className="absolute inset-x-0 top-0 z-[1] flex h-[8%] items-center gap-1.5 border-b border-neutral-200 bg-neutral-100 px-3 dark:border-neutral-700 dark:bg-neutral-900"
          aria-hidden="true"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
        </div>
        <div className="absolute inset-x-0 bottom-0 top-[8%] overflow-hidden">
          {hasImage ? (
            <Screenshot image={image} alt={alt} priority={priority} />
          ) : (
            <EmptyMedia style={style} iconLabel="// web preview coming soon" />
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectMediaFrame = ({
  image,
  alt,
  style,
  phoneClassName,
  priority = false,
  mediaType = "phone",
  mockup = true,
}: ProjectMediaFrameProps) => {
  const hasImage = Boolean(image && !/placeholder/i.test(image));
  const { left, top, width, height } = ANDROID_PHONE_FRAME.screenInset;

  if (mediaType === "browser") {
    return (
      <BrowserFrame
        image={image}
        alt={alt}
        style={style}
        priority={priority}
        className={phoneClassName}
        mockup={mockup}
      />
    );
  }

  if (!mockup) {
    return (
      <div
        className={`relative mx-auto aspect-[9/19] overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-950 ${phoneClassName ?? "w-44 md:w-64"}`}
      >
        {hasImage ? (
          <Screenshot image={image} alt={alt} priority={priority} />
        ) : (
          <EmptyMedia style={style} iconLabel="// screenshot coming soon" />
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
          <Screenshot image={image} alt={alt} priority={priority} />
        ) : (
          <EmptyMedia style={style} iconLabel="// screenshot coming soon" />
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
