/** Case-study section heading with the short accent rule. */
export const SectionLabel = ({ children }: { children: string }) => (
    <div className="flex items-center gap-4 mb-6">
        <span
            className="inline-block h-px w-8 shrink-0 bg-volt-ink dark:bg-volt"
            aria-hidden="true"
        />
        <h2 className="text-heading-2 text-gray-900 dark:text-white">{children}</h2>
    </div>
);
