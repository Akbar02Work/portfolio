import type { ProjectPlatform, ProjectPlatformId } from "@/data/projectCatalog";
import { cn } from "@/lib/utils";

type ProjectPlatformTabsProps = {
  platforms: ProjectPlatform[];
  activePlatform: ProjectPlatformId;
  onSelect: (platform: ProjectPlatformId) => void;
  label: string;
  className?: string;
};

export const ProjectPlatformTabs = ({
  platforms,
  activePlatform,
  onSelect,
  label,
  className,
}: ProjectPlatformTabsProps) => {
  const active = platforms.find((platform) => platform.id === activePlatform);

  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      <div
        role="tablist"
        aria-label={label}
        className="inline-flex items-center border border-neutral-200 bg-background/90 p-1 dark:border-neutral-700"
      >
        {platforms.map((platform, index) => {
          const selected = platform.id === activePlatform;

          return (
            <button
              key={platform.id}
              type="button"
              role="tab"
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
              className={cn(
                "px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt-ink dark:focus-visible:outline-volt",
                selected
                  ? "bg-volt-ink text-white dark:bg-volt dark:text-black"
                  : "text-neutral-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              {platform.label}
            </button>
          );
        })}
      </div>

      {active ? (
        <p
          aria-live="polite"
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400"
        >
          {active.status}
        </p>
      ) : null}
    </div>
  );
};
