import { render, fireEvent, act } from '@testing-library/react';
import { Projects } from './Projects';
import { Profiler } from 'react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock IntersectionObserver
const observeMock = vi.fn();
const disconnectMock = vi.fn();

beforeAll(() => {
  global.IntersectionObserver = vi.fn(() => ({
    observe: observeMock,
    disconnect: disconnectMock,
    unobserve: vi.fn(),
    takeRecords: vi.fn(),
  })) as any;
});

describe('Projects Component Performance', () => {
    it('throttles rapid scroll events efficiently', async () => {
        vi.useFakeTimers();
        let renderCount = 0;
        const onRender = vi.fn(() => {
            renderCount++;
        });

        const { container } = render(
            <Profiler id="Projects" onRender={onRender}>
                <Projects />
            </Profiler>
        );

        const scrollContainer = container.querySelector('.relative.px-6');

        if (!scrollContainer) {
            throw new Error('Scroll container not found');
        }

        const EVENTS_COUNT = 20; // Reduced count but each triggers render

        // Simulating a scroll where the user scrolls, render happens, scrolls again...
        for (let i = 0; i < EVENTS_COUNT; i++) {
             // Wrap each event in act to ensure updates are processed
             await act(async () => {
                fireEvent.wheel(scrollContainer, { deltaX: 50 });
                vi.advanceTimersByTime(20);
            });
        }

        console.log(`Render count: ${renderCount}`);

        // With throttling (500ms), and total duration 400ms, we expect only 1 update.
        // So renderCount should be approx 2 (1 initial + 1 update).
        // It should definitely be less than the baseline of ~21.
        expect(renderCount).toBeLessThan(10);

        vi.useRealTimers();
    });
});
