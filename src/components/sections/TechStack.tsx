import { techStack } from "@/data/techStack";

const MarqueeRow = ({ id, hidden }: { id: string; hidden?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
        {techStack.map((tech) => (
            <span
                key={`${id}-${tech}`}
                className="flex items-center whitespace-nowrap font-mono text-caption uppercase tracking-[0.18em] text-gray-500 dark:text-slate-400"
            >
                <span className="px-6 md:px-8">{tech}</span>
                <span aria-hidden="true" className="text-volt-ink dark:text-volt select-none">
                    //
                </span>
            </span>
        ))}
    </div>
);

export const TechStack = () => {
    return (
        <section
            aria-label="Tech stack"
            className="marquee w-full border-y border-gray-200 dark:border-slate-800 bg-background/95 py-4 md:py-5 overflow-hidden"
        >
            <h2 className="sr-only">Tech stack</h2>
            <div className="marquee-mask overflow-hidden">
                <div className="marquee-track flex w-max">
                    <MarqueeRow id="a" />
                    <MarqueeRow id="b" hidden />
                </div>
            </div>
        </section>
    );
};
