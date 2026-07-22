import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { ProjectStyle } from "@/constants/projectStyles";
import type { ProjectSummary } from "@/data/projectsSummary";
import { buildProjectUrl } from "@/constants/routes";
import { withBase } from "@/lib/urls";
import { sanitizeUrl } from "@/lib/urlSanitizer";

interface EditorialCardProps {
    project: ProjectSummary;
    index: number;
    reversed?: boolean;
    style: ProjectStyle;
}

/** Terminal placeholder — honest preview from real project facts until screenshots land */
const TerminalPlaceholder = () => (
    <div className="h-full w-full bg-neutral-950 p-5 md:p-6 font-mono text-[11px] md:text-caption leading-relaxed text-neutral-400 select-none">
        <p><span className="text-volt">$</span> secbench run --suite jailbreak-25</p>
        <p className="mt-2">→ T.R.I.A.D. defense layers <span className="text-neutral-500">…</span> evaluated</p>
        <p>→ baseline vs protected runs <span className="text-neutral-500">…</span> compared</p>
        <p className="text-volt">✓ report generated — 100% reproducible</p>
    </div>
);

const EditorialCard = ({ project, index, reversed = false, style }: EditorialCardProps) => {
    const IconComponent = style.icon;
    const [imageError, setImageError] = useState(false);
    const normalizedSrc = project.image ? withBase(project.image) : "";
    const imageSrc = sanitizeUrl(normalizedSrc) ?? "";
    const isPlaceholder = imageError || !project.image || /placeholder/i.test(project.image);

    useEffect(() => {
        setImageError(false);
    }, [project.image]);

    const number = String(index + 1).padStart(2, "0");
    const isTerminal = project.media.type === "terminal";

    const mediaImage = !isPlaceholder ? (
        <img
            src={imageSrc}
            alt={project.media.alt}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover"
        />
    ) : null;

    const mediaFrame = isTerminal ? (
        /* Terminal/dashboard frame — 16:10 */
        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-950 shadow-xl">
            <div className="h-9 flex items-center gap-1.5 px-4 bg-neutral-900 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                <span className="ml-3 font-mono text-[11px] text-neutral-500 truncate">
                    ~/{project.slug} — results
                </span>
            </div>
            <div className="relative h-[calc(100%-2.25rem)]">
                {mediaImage ?? <TerminalPlaceholder />}
            </div>
        </div>
    ) : (
        /* Phone frame — 9:19 */
        <div className="relative mx-auto w-44 md:w-52 aspect-[9/19] rounded-[2.2rem] border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 shadow-xl overflow-hidden">
            {mediaImage ?? (
                <div className={`absolute inset-0 ${style.gradient} flex flex-col items-center justify-center gap-3 p-4`}>
                    <IconComponent className="w-10 h-10 text-neutral-500 dark:text-neutral-400" strokeWidth={1} />
                    <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
                        // screenshot coming soon
                    </span>
                </div>
            )}
        </div>
    );

    return (
        <article className="grid md:grid-cols-2 gap-10 md:gap-14 items-center border-b border-neutral-200 dark:border-neutral-800 py-14 md:py-20 last:border-b-0">
            {/* Text block */}
            <div className={`flex flex-col gap-5 ${reversed ? "md:order-2" : ""}`}>
                <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-volt-ink dark:text-volt">{number}</span>
                    <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" aria-hidden="true" />
                    <span className="font-mono text-caption text-neutral-500 dark:text-neutral-400">{project.year}</span>
                </div>

                <h3 className="text-heading-2 text-gray-900 dark:text-white">
                    <Link
                        to={buildProjectUrl(project.slug)}
                        className="hover:text-volt-ink dark:hover:text-volt transition-colors"
                    >
                        {project.title}
                    </Link>
                </h3>

                <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                    {project.role}
                </p>

                <p className="text-body-lg text-gray-600 dark:text-slate-300 max-w-xl">
                    {project.summary}
                </p>

                <dl className="grid grid-cols-3 gap-4 border-t border-neutral-200 dark:border-neutral-800 pt-6 mt-1">
                    {project.metrics.map((metric) => (
                        <div key={metric.label}>
                            <dt className="sr-only">{metric.label}</dt>
                            <dd className="text-heading-3 font-semibold text-gray-900 dark:text-white">
                                {metric.value}
                            </dd>
                            <dd className="text-caption text-neutral-500 dark:text-neutral-400 mt-1">
                                {metric.label}
                            </dd>
                        </div>
                    ))}
                </dl>

                <p className="font-mono text-caption text-neutral-500 dark:text-neutral-400">
                    {project.technologies.join(" · ")}
                </p>

                <Link
                    to={buildProjectUrl(project.slug)}
                    className="group inline-flex items-center gap-1.5 font-medium text-volt-ink dark:text-volt w-fit"
                >
                    View case
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                </Link>
            </div>

            {/* Media block */}
            <Link
                to={buildProjectUrl(project.slug)}
                className={`block ${reversed ? "md:order-1" : ""} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt-ink dark:focus-visible:outline-volt rounded-2xl`}
                aria-label={`Open ${project.title} case study`}
                tabIndex={-1}
            >
                {mediaFrame}
            </Link>
        </article>
    );
};

export default EditorialCard;
