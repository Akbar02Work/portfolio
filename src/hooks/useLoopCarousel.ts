import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** Three copies: [A][B][C] — viewport stays in B; A/C are teleport buffers */
export const LOOP_COPIES = 3;

/**
 * Ease-out cubic: starts at ~3× average speed (expo started at ~7×, which read
 * as a jolt) and lands softly; also keeps motion continuous when a new step
 * re-targets an animation that is still running.
 */
const easeOutCubic = (t: number) => (t >= 1 ? 1 : 1 - (1 - t) ** 3);

/** Duration grows gently with distance so long hops don't feel rushed. */
const stepDuration = (distance: number) => Math.min(780, Math.max(460, 380 + distance * 0.55));

const getNodes = (el: HTMLElement) =>
    Array.from(el.querySelectorAll<HTMLElement>("[data-loop-index]"));

/** Pixels a mouse must travel before a press turns into a drag. */
const DRAG_THRESHOLD = 5;
/** Release speed (px/ms) that counts as a flick to the neighbour. */
const FLICK_VELOCITY = 0.35;

/**
 * Infinite, centre-snapping horizontal carousel. Render `total * loopCopies`
 * items, each with `data-loop-index`, inside the element bound to
 * `scrollerRef`. Touch and trackpad use native scrolling; a mouse can drag.
 */
export const useLoopCarousel = <T extends HTMLElement = HTMLDivElement>(total: number) => {
    const loopCopies = total === 1 ? 1 : LOOP_COPIES;
    const middleStart = total === 1 ? 0 : total;

    const scrollerRef = useRef<T>(null);
    const isJumpingRef = useRef(false);
    const isDraggingRef = useRef(false);
    const animatingToRef = useRef<number | null>(null);
    const scrollAnimFrameRef = useRef<number | null>(null);
    const settleTimerRef = useRef(0);
    const settleRafRef = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeLoopIndex, setActiveLoopIndex] = useState(0);

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
        (el: HTMLElement, nextLeft: number, duration: number, onDone?: () => void) => {
            if (scrollAnimFrameRef.current != null) {
                cancelAnimationFrame(scrollAnimFrameRef.current);
                scrollAnimFrameRef.current = null;
            }

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                el.scrollLeft = nextLeft;
                animatingToRef.current = null;
                onDone?.();
                return;
            }

            const startLeft = el.scrollLeft;
            const delta = nextLeft - startLeft;
            if (Math.abs(delta) < 0.5) {
                el.scrollLeft = nextLeft;
                animatingToRef.current = null;
                onDone?.();
                return;
            }

            const startTime = performance.now();
            const tick = (now: number) => {
                const t = Math.min(1, (now - startTime) / duration);
                el.scrollLeft = startLeft + delta * easeOutCubic(t);
                if (t < 1) {
                    scrollAnimFrameRef.current = requestAnimationFrame(tick);
                    return;
                }
                el.scrollLeft = nextLeft;
                scrollAnimFrameRef.current = null;
                animatingToRef.current = null;
                onDone?.();
            };

            scrollAnimFrameRef.current = requestAnimationFrame(tick);
        },
        []
    );

    const withFrozenTransitions = useCallback((el: HTMLElement, fn: () => void) => {
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

    /**
     * Seamless wrap: ease into the neighbouring loop copy (e.g. screen 6 → the
     * next copy's screen 1), then silently re-centre on the middle copy.
     */
    const animateThroughBuffer = useCallback(
        (loopIndex: number) => {
            const el = scrollerRef.current;
            const nextLeft = getCenteredScrollLeft(loopIndex);
            if (!el || nextLeft == null) return;

            cancelScrollAnimation();
            animatingToRef.current = loopIndex;
            applyActive(loopIndex);
            runEasedScroll(
                el,
                nextLeft,
                stepDuration(Math.abs(nextLeft - el.scrollLeft)),
                () => {
                    const middle = toMiddleLoopIndex(loopIndex);
                    if (middle === loopIndex) return;
                    const middleLeft = getCenteredScrollLeft(middle);
                    if (middleLeft == null) return;
                    isJumpingRef.current = true;
                    withFrozenTransitions(el, () => {
                        el.scrollLeft = middleLeft;
                        applyActive(middle);
                    });
                    requestAnimationFrame(() => {
                        isJumpingRef.current = false;
                    });
                }
            );
        },
        [
            applyActive,
            cancelScrollAnimation,
            getCenteredScrollLeft,
            runEasedScroll,
            toMiddleLoopIndex,
            withFrozenTransitions,
        ]
    );

    /**
     * Moves the viewport from a buffer copy to the same spot in the middle copy
     * without any visible change (keeps the current sub-item offset).
     */
    const rebaseToMiddle = useCallback(
        (loopIndex: number) => {
            const el = scrollerRef.current;
            const middle = toMiddleLoopIndex(loopIndex);
            if (!el || middle === loopIndex) return middle;
            const from = getCenteredScrollLeft(loopIndex);
            const to = getCenteredScrollLeft(middle);
            if (from == null || to == null) return middle;
            isJumpingRef.current = true;
            withFrozenTransitions(el, () => {
                el.scrollLeft += to - from;
                applyActive(middle);
            });
            requestAnimationFrame(() => {
                isJumpingRef.current = false;
            });
            return middle;
        },
        [applyActive, getCenteredScrollLeft, toMiddleLoopIndex, withFrozenTransitions]
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

            // Wrap to the neighbour: ease through the adjacent loop copy
            if (isLoopWrap(from, target)) {
                const fromReal = ((from % total) + total) % total;
                animateThroughBuffer(fromReal === total - 1 ? from + 1 : from - 1);
                return;
            }

            const nextLeft = getCenteredScrollLeft(target);
            if (nextLeft == null) return;

            animatingToRef.current = target;
            applyActive(target);
            runEasedScroll(
                el,
                nextLeft,
                stepDuration(Math.abs(nextLeft - el.scrollLeft))
            );
        },
        [
            animateThroughBuffer,
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
                if (!isDraggingRef.current) scheduleSettle();
            }
        };

        const onScrollEnd = () => {
            if (isJumpingRef.current || isDraggingRef.current) return;
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
        if (total === 0) return;
        if (total === 1) return;

        // Rapid presses re-target the running animation instead of being
        // ignored: continue from where it is heading, not from where it is.
        const base = animatingToRef.current ?? findClosestLoopIndex();
        cancelScheduledSettle();
        cancelScrollAnimation();
        const middle = rebaseToMiddle(base);
        // The neighbour may sit in a buffer copy (6 → 1); it is re-centred on
        // the middle copy once the animation lands.
        animateThroughBuffer(middle + direction);
    };

    const focusLoopIndex = (loopIndex: number) => {
        if (total === 0 || isJumpingRef.current) return;
        if (animatingToRef.current != null) return;

        const target = toMiddleLoopIndex(loopIndex);
        if (target === activeLoopIndex) return;

        const from = toMiddleLoopIndex(findClosestLoopIndex());
        if (isLoopWrap(from, target)) {
            // The visible neighbour across the seam is one step away in loop space.
            const fromReal = ((from % total) + total) % total;
            jumpToLoopIndex(from);
            animateThroughBuffer(fromReal === total - 1 ? from + 1 : from - 1);
            return;
        }

        animateToLoopIndex(target);
    };

    const stepRef = useRef(step);
    stepRef.current = step;

    /** Mouse drag: move with the pointer, then settle or flick to a neighbour. */
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el || total <= 1) return;

        let pointerId: number | null = null;
        let startX = 0;
        let startLeft = 0;
        let startLoop = 0;
        let lastX = 0;
        let lastTime = 0;
        let velocity = 0;
        let moved = false;

        const swallowClick = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };

        const onPointerDown = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            pointerId = event.pointerId;
            startX = lastX = event.clientX;
            lastTime = event.timeStamp;
            startLeft = el.scrollLeft;
            startLoop = findClosestLoopIndexRef.current();
            velocity = 0;
            moved = false;
        };

        const onPointerMove = (event: PointerEvent) => {
            if (pointerId !== event.pointerId) return;
            const dx = event.clientX - startX;
            if (!moved) {
                if (Math.abs(dx) < DRAG_THRESHOLD) return;
                moved = true;
                isDraggingRef.current = true;
                el.setPointerCapture(event.pointerId);
                el.dataset.dragging = "true";
                cancelScheduledSettle();
                cancelScrollAnimation();
            }
            const dt = Math.max(1, event.timeStamp - lastTime);
            velocity = (event.clientX - lastX) / dt;
            lastX = event.clientX;
            lastTime = event.timeStamp;
            el.scrollLeft = startLeft - dx;
        };

        const onPointerUp = (event: PointerEvent) => {
            if (pointerId !== event.pointerId) return;
            pointerId = null;
            if (!moved) return;
            isDraggingRef.current = false;
            delete el.dataset.dragging;
            // The click that ends a drag must not open or select a card.
            el.addEventListener("click", swallowClick, { capture: true, once: true });
            window.setTimeout(() => el.removeEventListener("click", swallowClick, { capture: true }), 80);

            const stale = event.timeStamp - lastTime > 90;
            if (!stale && Math.abs(velocity) > FLICK_VELOCITY && findClosestLoopIndexRef.current() === startLoop) {
                stepRef.current(velocity < 0 ? 1 : -1);
            } else {
                settleToClosestRef.current();
            }
        };

        const preventNativeDrag = (event: DragEvent) => event.preventDefault();

        el.addEventListener("pointerdown", onPointerDown);
        el.addEventListener("pointermove", onPointerMove);
        el.addEventListener("pointerup", onPointerUp);
        el.addEventListener("pointercancel", onPointerUp);
        el.addEventListener("dragstart", preventNativeDrag);
        return () => {
            el.removeEventListener("pointerdown", onPointerDown);
            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerup", onPointerUp);
            el.removeEventListener("pointercancel", onPointerUp);
            el.removeEventListener("dragstart", preventNativeDrag);
            el.removeEventListener("click", swallowClick, { capture: true });
            isDraggingRef.current = false;
        };
    }, [cancelScheduledSettle, cancelScrollAnimation, total]);

    return {
        scrollerRef,
        activeIndex,
        activeLoopIndex,
        loopCopies,
        middleStart,
        step,
        focusLoopIndex,
    };
};
