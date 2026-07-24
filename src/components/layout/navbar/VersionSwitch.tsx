import { getCreativeUrl } from "@/constants/siteVersions";

type VersionSwitchProps = {
  className?: string;
};

export const VersionSwitch = ({ className = "" }: VersionSwitchProps) => {
  const creativeUrl = getCreativeUrl();

  return (
    <div
      role="group"
      aria-label="Site version"
      className={`inline-flex items-center gap-0.5 rounded-lg border border-gray-200/90 dark:border-gray-800/90 bg-gray-50/80 dark:bg-slate-900/60 p-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] ${className}`}
    >
      <span
        aria-current="page"
        className="px-2.5 py-1.5 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white font-semibold shadow-sm shadow-black/5"
      >
        Business
      </span>
      <a
        href={creativeUrl}
        className="px-2.5 py-1.5 rounded-md text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        Creative
      </a>
    </div>
  );
};
