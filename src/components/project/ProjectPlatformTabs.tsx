import type { ProjectPlatform, ProjectPlatformId } from "@/data/projectCatalog";
import { slidingIndicatorTransition, useSlidingIndicator } from "@/hooks/useSlidingIndicator";
import { cn } from "@/lib/utils";
import { LocalizedText } from "@/components/ui/LocalizedText";
import type { Locale } from "@/i18n/locales";

type ProjectPlatformTabsProps = {
  platforms: ProjectPlatform[];
  activePlatform: ProjectPlatformId;
  onSelect: (platform: ProjectPlatformId) => void;
  label: string;
  className?: string;
  showStatus?: boolean;
  localizeStatus?: (platform: ProjectPlatformId, locale: Locale) => string | undefined;
};

export const ProjectPlatformTabs = ({
  platforms,
  activePlatform,
  onSelect,
  label,
  className,
  showStatus = true,
  localizeStatus,
}: ProjectPlatformTabsProps) => {
  const active = platforms.find((platform) => platform.id === activePlatform);
  const { rootRef, indicatorRef } = useSlidingIndicator(activePlatform, {
    itemsKey: platforms.map((platform) => platform.id).join(","),
  });

  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      <div
        ref={rootRef}
        role="tablist"
        aria-label={label}
        className="relative isolate inline-flex items-center border border-neutral-200 bg-background/90 p-1 dark:border-neutral-700"
      >
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className={cn("pointer-events-none absolute left-0 top-0 bg-volt-ink dark:bg-volt opacity-0", slidingIndicatorTransition)}
        />
        {platforms.map((platform, index) => {
          const selected = platform.id === activePlatform;

          return (
            <button
              key={platform.id}
              type="button"
              role="tab"
              data-indicator-value={platform.id}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              aria-label={`${platform.label} — ${platform.status}`}
              onClick={() => onSelect(platform.id)}
              onKeyDown={(event) => {
                let nextIndex: number;
                if (event.key === "ArrowRight") nextIndex = (index + 1) % platforms.length;
                else if (event.key === "ArrowLeft") nextIndex = (index - 1 + platforms.length) % platforms.length;
                else if (event.key === "Home") nextIndex = 0;
                else if (event.key === "End") nextIndex = platforms.length - 1;
                else return;
                event.preventDefault();
                const next = platforms[nextIndex];
                if (!next) return;
                onSelect(next.id);
                event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
              }}
              className="relative z-10 shrink-0 whitespace-nowrap bg-transparent px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt-ink dark:focus-visible:outline-volt"
            >
              {platform.label}
              <span
                aria-hidden="true"
                data-indicator-label=""
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center justify-center text-white dark:text-black",
                  selected ? "[clip-path:inset(0)]" : "[clip-path:inset(0_100%_0_0)]",
                )}
              >
                {platform.label}
              </span>
            </button>
          );
        })}
      </div>

      {showStatus && active ? (
        <p
          aria-live="polite"
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400"
        >
          <LocalizedText>{(_, locale) => localizeStatus?.(active.id, locale) ?? active.status}</LocalizedText>
        </p>
      ) : null}
    </div>
  );
};
