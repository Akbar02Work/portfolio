import { ArrowDown, ArrowRight } from "lucide-react";
import { Fragment } from "react";
import { LocalizedText } from "@/components/ui/LocalizedText";
import type { Locale } from "@/i18n/locales";
import { architectureBySlug, type ArchitectureNode } from "@/data/architecture";
import { useI18n } from "@/i18n/useI18n";

const Node = ({ node, translate, accent = false }: {
  node: ArchitectureNode;
  translate: (locale: Locale) => ArchitectureNode | undefined;
  accent?: boolean;
}) => (
  <div
    className={`rounded-xl border bg-background px-4 py-3.5 ${
      accent ? "border-volt-ink/40 dark:border-volt/40" : "border-neutral-200 dark:border-neutral-800"
    }`}
  >
    <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-volt-ink dark:text-volt"><LocalizedText>{(_, locale) => (translate(locale) ?? node).step}</LocalizedText></p>
    <p className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-gray-900 dark:text-white"><LocalizedText>{(_, locale) => (translate(locale) ?? node).title}</LocalizedText></p>
    <p className="mt-1 text-body-sm leading-snug text-gray-500 dark:text-slate-400"><LocalizedText>{(_, locale) => (translate(locale) ?? node).detail}</LocalizedText></p>
  </div>
);

/** Arrow between stages: horizontal on desktop, vertical on mobile. */
const Connector = () => (
  <div aria-hidden="true" className="flex items-center justify-center text-neutral-400 dark:text-neutral-600">
    <ArrowDown className="h-4 w-4 lg:hidden" strokeWidth={1.75} />
    <ArrowRight className="hidden h-4 w-4 lg:block" strokeWidth={1.75} />
  </div>
);

type ProjectArchitectureProps = {
  slug: string;
};

export const ProjectArchitecture = ({ slug }: ProjectArchitectureProps) => {
  const { locale } = useI18n();
  const diagram = architectureBySlug[slug]?.[locale];
  if (!diagram) return null;

  const stages = [
    ...diagram.before.map((node, index) => ({ kind: "node" as const, node, group: "before" as const, index })),
    { kind: "fork" as const },
    ...diagram.after.map((node, index) => ({ kind: "node" as const, node, group: "after" as const, index })),
  ];

  return (
    <figure aria-label={diagram.label} className="mb-10 md:mb-12">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-3">
        {stages.map((stage, index) => (
          <Fragment key={index}>
            {index > 0 && <Connector />}
            {stage.kind === "node" ? (
              <div className="lg:flex-1 lg:self-center">
                <Node node={stage.node} translate={(language) => architectureBySlug[slug]?.[language][stage.group][stage.index]} />
              </div>
            ) : (
              <div className="flex flex-col gap-2 lg:flex-[1.15]">
                {diagram.branches.map((branch, branchIndex) => (
                  <Fragment key={branchIndex}>
                    {branchIndex > 0 && (
                      <p className="text-center font-mono text-[0.625rem] uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500">
                        <LocalizedText>{(_, language) => architectureBySlug[slug]?.[language].branchJoiner}</LocalizedText>
                      </p>
                    )}
                    <Node node={branch} translate={(language) => architectureBySlug[slug]?.[language].branches[branchIndex]} accent />
                  </Fragment>
                ))}
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <figcaption className="sr-only">{diagram.label}</figcaption>
    </figure>
  );
};
