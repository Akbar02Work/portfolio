import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import type { ProjectStyle } from "@/constants/projectStyles";
import ProjectMediaFrame from "@/components/project/ProjectMediaFrame";
import { ProjectPlatformTabs } from "@/components/project/ProjectPlatformTabs";
import type { ProjectPlatformId } from "@/data/projectCatalog";
import { cn } from "@/lib/utils";

interface ProjectGalleryProps {
    project: Project;
    style: ProjectStyle;
    activePlatform?: ProjectPlatformId;
    onPlatformChange?: (platform: ProjectPlatformId) => void;
}

/** Three copies: [A][B][C] — viewport stays in B; A/C are teleport buffers */
const LOOP_COPIES = 3;

/** Ease-out expo — soft landing after flicks */
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

const ProjectScreenCarousel = ({ project, style }: ProjectGalleryProps) => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const isJumpingRef = useRef(false);
    const animatingToRef = useRef<number | null>(null);
    const scrollAnimFrameRef = useRef<number | null>(null);
    const settleTimerRef = useRef(0);
    const settleRafRef = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeLoopIndex, setActiveLoopIndex] = useState(0);

    const screens = project.screens;
    const total = screens.length;
    const loopCopies = total === 1 ? 1 : LOOP_COPIES;
    const middleStart = total === 1 ? 0 : total;
    const galleryMediaType = screens[0]?.mediaType ?? project.media.type;

    const loopedScreens =
        total === 0
            ? []
            : Array.from({ length: total * loopCopies }, (_, index) => {
                  const realIndex = index % total;
                  const screen = screens[realIndex];
                  if (!screen) {
                      throw new Error(`Missing screen at index ${realIndex}`);
                  }
                  return {
                      ...screen,
                      loopKey: `${screen.id}-loop-${index}`,
                      loopIndex: index,
                      realIndex,
                  };
              });

    const getNodes = (el: HTMLDivElement) =>
        Array.from(el.querySelectorAll<HTMLElement>("[data-loop-index]"));

    const cancelScrollAnimation = useCallback(() => {
        if (scrollAnimFrameRef.current != null) {
            cancelAnimationFrame(scrollAnimFrameRef.current);
            scrollAnimFrameRef.current = null;
        }
        animatingToRef.current = null;
    }, []);

    const cancelScheduledSettle = useCallback(() => {
        window.clearTimeout(settleTimerRef.current);
        if (settleRafRef.current) cancelAnimationFrame(settleRafRef.current);
        settleTimerRef.current = 0;
        settleRafRef.current = 0;
    }, []);

    const runEasedScroll = useCallback(
        (el: HTMLDivElement, nextLeft: number, duration: number) => {
            if (scrollAnimFrameRef.current != null) {
                cancelAnimationFrame(scrollAnimFrameRef.current);
                scrollAnimFrameRef.current = null;
            }

            const startLeft = el.scrollLeft;
            const delta = nextLeft - startLeft;
            if (Math.abs(delta) < 0.5) {
                el.scrollLeft = nextLeft;
                animatingToRef.current = null;
                return;
            }

            const startTime = performance.now();
            const tick = (now: number) => {
                const t = Math.min(1, (now - startTime) / duration);
                el.scrollLeft = startLeft + delta * easeOutExpo(t);
                if (t < 1) {
                    scrollAnimFrameRef.current = requestAnimationFrame(tick);
                    return;
                }
                el.scrollLeft = nextLeft;
                scrollAnimFrameRef.current = null;
                animatingToRef.current = null;
            };

            scrollAnimFrameRef.current = requestAnimationFrame(tick);
        },
        []
    );

    const withFrozenTransitions = useCallback((el: HTMLDivElement, fn: () => void) => {
        const nodes = getNodes(el);
        nodes.forEach((node) => {
            node.style.transition = "none";
        });
        fn();
        void el.offsetHeight;
        requestAnimationFrame(() => {
            nodes.forEach((node) => {
                node.style.transition = "";
            });
        });
    }, []);

    const toMiddleLoopIndex = useCallback(
        (loopIndex: number) => {
            if (total <= 0) return loopIndex;
            return middleStart + (((loopIndex % total) + total) % total);
        },
        [middleStart, total]
    );

    const getCenteredScrollLeft = useCallback((loopIndex: number) => {
        const el = scrollerRef.current;
        if (!el) return null;
        const node = getNodes(el).find(
            (item) => Number(item.dataset.loopIndex) === loopIndex
        );
        if (!node) return null;

        // Layout box only — ignore CSS scale transforms
        return node.offsetLeft + node.offsetWidth / 2 - el.clientWidth / 2;
    }, []);

    const applyActive = useCallback(
        (loopIndex: number) => {
            if (total === 0) return;
            setActiveLoopIndex(loopIndex);
            setActiveIndex(((loopIndex % total) + total) % total);
        },
        [total]
    );

    /** Instant teleport with transitions frozen so scale/image don't flash */
    const jumpToLoopIndex = useCallback(
        (loopIndex: number) => {
            const el = scrollerRef.current;
            const target = toMiddleLoopIndex(loopIndex);
            const nextLeft = getCenteredScrollLeft(target);
            if (!el || nextLeft == null) return;

            cancelScrollAnimation();
            isJumpingRef.current = true;
            animatingToRef.current = null;

            withFrozenTransitions(el, () => {
                el.scrollLeft = nextLeft;
                applyActive(target);
            });

            requestAnimationFrame(() => {
                isJumpingRef.current = false;
            });
        },
        [
            applyActive,
            cancelScrollAnimation,
            getCenteredScrollLeft,
            toMiddleLoopIndex,
            withFrozenTransitions,
        ]
    );

    const findClosestLoopIndexRef = useRef<() => number>(() => middleStart);

    const isLoopWrap = useCallback(
        (fromLoopIndex: number, toLoopIndex: number) => {
            if (total <= 1) return false;
            const fromReal = (((fromLoopIndex % total) + total) % total);
            const toReal = (((toLoopIndex % total) + total) % total);
            return (
                (fromReal === total - 1 && toReal === 0) ||
                (fromReal === 0 && toReal === total - 1)
            );
        },
        [total]
    );

    /** Eased scroll inside the middle copy only — wraps are always instant */
    const animateToLoopIndex = useCallback(
        (loopIndex: number) => {
            const el = scrollerRef.current;
            if (!el || total === 0) return;

            const target = toMiddleLoopIndex(loopIndex);
            let from = findClosestLoopIndexRef.current();
            if (from < total || from >= total * 2) {
                jumpToLoopIndex(from);
                from = toMiddleLoopIndex(from);
            } else {
                from = toMiddleLoopIndex(from);
            }

            if (target === from) {
                applyActive(target);
                return;
            }

            // Full-circle wrap: no animation, just land
            if (isLoopWrap(from, target)) {
                jumpToLoopIndex(target);
                return;
            }

            const nextLeft = getCenteredScrollLeft(target);
            if (nextLeft == null) return;

            animatingToRef.current = target;
            applyActive(target);
            runEasedScroll(
                el,
                nextLeft,
                Math.min(720, Math.max(360, Math.abs(nextLeft - el.scrollLeft) * 0.7))
            );
        },
        [
            applyActive,
            getCenteredScrollLeft,
            isLoopWrap,
            jumpToLoopIndex,
            runEasedScroll,
            toMiddleLoopIndex,
            total,
        ]
    );

    const findClosestLoopIndex = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return middleStart;

        const center = el.scrollLeft + el.clientWidth / 2;
        let closest = middleStart;
        let closestDist = Number.POSITIVE_INFINITY;

        getNodes(el).forEach((node) => {
            const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
            const dist = Math.abs(nodeCenter - center);
            if (dist < closestDist) {
                closestDist = dist;
                closest = Number(node.dataset.loopIndex ?? middleStart);
            }
        });

        return closest;
    }, [middleStart]);

    findClosestLoopIndexRef.current = findClosestLoopIndex;

    /**
     * After a flick: wait until inertia is dead, remap buffer if needed,
     * then ease the nearest photo into center. Always restarts (no "раз через раз").
     */
    const settleToClosest = useCallback(() => {
        if (total <= 1 || isJumpingRef.current) return;

        const el = scrollerRef.current;
        if (!el) return;

        cancelScrollAnimation();

        const closest = findClosestLoopIndex();
        const target = toMiddleLoopIndex(closest);

        if (closest !== target) {
            const fromCenter = getCenteredScrollLeft(closest);
            const toCenter = getCenteredScrollLeft(target);
            if (fromCenter != null && toCenter != null) {
                isJumpingRef.current = true;
                withFrozenTransitions(el, () => {
                    el.scrollLeft = toCenter + (el.scrollLeft - fromCenter);
                    applyActive(target);
                });
                isJumpingRef.current = false;
            } else {
                applyActive(target);
            }
        } else {
            applyActive(target);
        }

        const nextLeft = getCenteredScrollLeft(target);
        if (nextLeft == null) return;

        const delta = Math.abs(nextLeft - el.scrollLeft);
        if (delta < 0.5) return;

        animatingToRef.current = target;
        runEasedScroll(el, nextLeft, Math.min(560, Math.max(280, delta * 1.15)));
    }, [
        applyActive,
        cancelScrollAnimation,
        findClosestLoopIndex,
        getCenteredScrollLeft,
        runEasedScroll,
        toMiddleLoopIndex,
        total,
        withFrozenTransitions,
    ]);

    const settleToClosestRef = useRef(settleToClosest);
    settleToClosestRef.current = settleToClosest;

    /** Debounce until scroll position stays still for a few frames */
    const scheduleSettle = useCallback(() => {
        cancelScheduledSettle();

        settleTimerRef.current = window.setTimeout(() => {
            const el = scrollerRef.current;
            if (!el || isJumpingRef.current) return;

            let stableFrames = 0;
            let lastLeft = el.scrollLeft;

            const checkStill = () => {
                const current = scrollerRef.current;
                if (!current || isJumpingRef.current) return;

                if (Math.abs(current.scrollLeft - lastLeft) < 0.5) {
                    stableFrames += 1;
                    if (stableFrames >= 4) {
                        settleToClosestRef.current();
                        return;
                    }
                } else {
                    stableFrames = 0;
                    lastLeft = current.scrollLeft;
                }

                settleRafRef.current = requestAnimationFrame(checkStill);
            };

            settleRafRef.current = requestAnimationFrame(checkStill);
        }, 48);
    }, [cancelScheduledSettle]);

    useLayoutEffect(() => {
        if (total === 0) return;
        jumpToLoopIndex(middleStart);
    }, [jumpToLoopIndex, middleStart, total]);

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el || total === 0) return;

        const onScroll = () => {
            if (isJumpingRef.current) return;

            // While we ease-settle, ignore scroll churn from our own writes
            if (animatingToRef.current == null) {
                applyActive(findClosestLoopIndex());
                scheduleSettle();
            }
        };

        const onScrollEnd = () => {
            if (isJumpingRef.current) return;
            scheduleSettle();
        };

        const onPointerDown = () => {
            // User took over — cancel pending settle / in-flight ease
            cancelScheduledSettle();
            if (animatingToRef.current != null) {
                cancelScrollAnimation();
            }
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        el.addEventListener("scrollend", onScrollEnd);
        el.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("resize", settleToClosest);

        return () => {
            el.removeEventListener("scroll", onScroll);
            el.removeEventListener("scrollend", onScrollEnd);
            el.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("resize", settleToClosest);
            cancelScheduledSettle();
            cancelScrollAnimation();
        };
    }, [
        applyActive,
        cancelScrollAnimation,
        cancelScheduledSettle,
        findClosestLoopIndex,
        scheduleSettle,
        settleToClosest,
        total,
    ]);

    const step = (direction: -1 | 1) => {
        if (total === 0 || isJumpingRef.current) return;
        if (animatingToRef.current != null) return;

        const closest = toMiddleLoopIndex(findClosestLoopIndex());
        const realIndex = ((closest % total) + total) % total;

        if (direction === 1 && realIndex === total - 1) {
            jumpToLoopIndex(middleStart);
            return;
        }
        if (direction === -1 && realIndex === 0) {
            jumpToLoopIndex(middleStart + total - 1);
            return;
        }

        animateToLoopIndex(closest + direction);
    };

    const focusLoopIndex = (loopIndex: number) => {
        if (total === 0 || isJumpingRef.current) return;
        if (animatingToRef.current != null) return;

        const target = toMiddleLoopIndex(loopIndex);
        if (target === activeLoopIndex) return;

        const from = toMiddleLoopIndex(findClosestLoopIndex());
        if (isLoopWrap(from, target)) {
            jumpToLoopIndex(target);
            return;
        }

        animateToLoopIndex(target);
    };

    const stepRef = useRef(step);
    stepRef.current = step;

    const sectionRef = useRef<HTMLElement>(null);
    const galleryInViewRef = useRef(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || total === 0) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                galleryInViewRef.current = Boolean(entry?.isIntersecting);
            },
            { threshold: 0.25 }
        );
        observer.observe(section);

        const onKeyDown = (event: KeyboardEvent) => {
            if (!galleryInViewRef.current) return;
            if (event.metaKey || event.ctrlKey || event.altKey) return;

            const target = event.target as HTMLElement | null;
            if (
                target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.tagName === "SELECT" ||
                    target.isContentEditable)
            ) {
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                stepRef.current(-1);
                return;
            }
            if (event.key === "ArrowRight") {
                event.preventDefault();
                stepRef.current(1);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            observer.disconnect();
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [total]);

    if (total === 0) {
        return (
            <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 md:pb-24">
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 md:pt-16">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="inline-block h-px w-8 shrink-0 bg-volt-ink dark:bg-volt" aria-hidden="true" />
                        <h2 className="text-heading-2 text-gray-900 dark:text-white">Screens</h2>
                    </div>
                    <p className="font-mono text-caption text-neutral-500 dark:text-neutral-400">
                        // screenshots coming soon
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 md:pt-16">
                <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
                    <div className="flex items-center gap-4 min-w-0">
                        <span className="inline-block h-px w-8 shrink-0 bg-volt-ink dark:bg-volt" aria-hidden="true" />
                        <h2 className="text-heading-2 text-gray-900 dark:text-white">Screens</h2>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <p className="font-mono text-caption tabular-nums text-neutral-500 dark:text-neutral-400 hidden sm:block">
                            <span className="text-gray-900 dark:text-white">
                                {String(activeIndex + 1).padStart(2, "0")}
                            </span>
                            <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">/</span>
                            {String(total).padStart(2, "0")}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => step(-1)}
                                aria-label="Previous screen"
                                className="inline-flex h-10 w-10 items-center justify-center border border-neutral-200 text-gray-900 transition-colors hover:border-volt-ink dark:border-neutral-800 dark:text-white dark:hover:border-volt"
                            >
                                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                            <button
                                type="button"
                                onClick={() => step(1)}
                                aria-label="Next screen"
                                className="inline-flex h-10 w-10 items-center justify-center border border-neutral-200 text-gray-900 transition-colors hover:border-volt-ink dark:border-neutral-800 dark:text-white dark:hover:border-volt"
                            >
                                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            <div className="relative">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20 bg-gradient-to-r from-background to-transparent"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20 bg-gradient-to-l from-background to-transparent"
                />

                <div
                    ref={scrollerRef}
                    tabIndex={0}
                    aria-label="Project screens carousel"
                    onKeyDown={(event) => {
                        if (event.key === "ArrowLeft") {
                            event.preventDefault();
                            step(-1);
                            return;
                        }
                        if (event.key === "ArrowRight") {
                            event.preventDefault();
                            step(1);
                        }
                    }}
                    className="flex gap-7 md:gap-10 overflow-x-auto overscroll-x-contain py-4 outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    style={{
                        paddingInline:
                            galleryMediaType === "browser"
                                ? "max(1.5rem, calc(50% - 24rem))"
                                : "max(1.5rem, calc(50% - 8rem))",
                    }}
                >
                    {loopedScreens.map((screen) => {
                        const isActive = screen.loopIndex === activeLoopIndex;
                        return (
                            <figure
                                key={screen.loopKey}
                                data-loop-index={screen.loopIndex}
                                data-real-index={screen.realIndex}
                                role="button"
                                tabIndex={0}
                                aria-label={`Show screen ${screen.realIndex + 1}`}
                                aria-pressed={isActive}
                                onClick={() => focusLoopIndex(screen.loopIndex)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        focusLoopIndex(screen.loopIndex);
                                    }
                                }}
                                className={cn(
                                    "flex shrink-0 cursor-pointer select-none flex-col gap-4 transition-opacity duration-300 ease-out",
                                    screen.mediaType === "browser"
                                        ? "w-[82vw] max-w-3xl"
                                        : "w-52 sm:w-56 md:w-64",
                                    isActive
                                        ? "z-[1] opacity-100"
                                        : "opacity-45 hover:opacity-70"
                                )}
                            >
                                <div
                                    className={cn(
                                        "rounded-2xl transition-[box-shadow,ring] duration-300",
                                        isActive &&
                                            "ring-1 ring-volt-ink shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:ring-volt"
                                    )}
                                >
                                    <ProjectMediaFrame
                                        image={screen.image}
                                        alt={screen.title || project.media.alt}
                                        style={style}
                                        phoneClassName="w-full"
                                        mediaType={screen.mediaType}
                                        mockup={false}
                                        priority
                                    />
                                </div>
                                <figcaption
                                    className={cn(
                                        "font-mono text-caption text-center transition-colors duration-500 line-clamp-2",
                                        isActive
                                            ? "text-gray-700 dark:text-slate-200"
                                            : "text-neutral-400 dark:text-neutral-600"
                                    )}
                                >
                                    {screen.title}
                                </figcaption>
                            </figure>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const ProjectGallery = ({
    project,
    style,
    activePlatform: controlledPlatform,
    onPlatformChange,
}: ProjectGalleryProps) => {
    const firstPlatform = project.platforms[0];
    const [internalPlatform, setInternalPlatform] = useState<ProjectPlatformId>(
        firstPlatform?.id ?? "android"
    );
    const activePlatform = controlledPlatform ?? internalPlatform;
    const selectPlatform = onPlatformChange ?? setInternalPlatform;

    if (!firstPlatform) {
        return <ProjectScreenCarousel project={project} style={style} />;
    }

    const active =
        project.platforms.find((platform) => platform.id === activePlatform) ??
        firstPlatform;
    const screens = project.screens.filter(
        (screen) => screen.platform === active.id
    );

    return (
        <>
            <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-8">
                <div className="flex flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-mono text-caption uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                            Product surfaces
                        </p>
                        <p className="mt-2 text-body-base text-gray-600 dark:text-slate-300">
                            One product, inspected through each client.
                        </p>
                    </div>
                    <ProjectPlatformTabs
                        platforms={project.platforms}
                        activePlatform={active.id}
                        onSelect={selectPlatform}
                        label={`Choose ${project.title} gallery platform`}
                    />
                </div>
            </section>

            <ProjectScreenCarousel
                key={active.id}
                project={{ ...project, screens }}
                style={style}
            />
        </>
    );
};

export default ProjectGallery;
