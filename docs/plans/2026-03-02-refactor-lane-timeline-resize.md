# Refactor Lane Timeline Resize Handling Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure `useLaneTimeline` correctly updates the Web Animation when the container is resized, preserving the current playback progress, speed, and pause state.

**Architecture:** Update the `ResizeObserver` callback in `useLaneTimeline` to re-calculate the `maxScrollPx` and re-create/update the animation if it exists, restoring its state (currentTime/progress, playbackRate, playState).

**Tech Stack:** React, Web Animations API, ResizeObserver.

---

### Task 1: Update Mock and Add Failing Test for Resize Handling

**Files:**

- Modify: `src/hooks/use-lane-timeline.test.ts`

**Step 1: Update ResizeObserver mock to allow manual triggering**

```typescript
let roCallback: ResizeObserverCallback;
global.ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    roCallback = callback;
  }
  observe(_target: Element) {
    // Initial call
    roCallback([], this as unknown as ResizeObserver);
  }
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

const triggerResize = () => {
  roCallback([], {} as ResizeObserver);
};
```

**Step 2: Write the failing test**

```typescript
it("restores progress and state on resize", () => {
  let roCallback: ResizeObserverCallback = () => {};
  global.ResizeObserver = class ResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      roCallback = callback;
    }
    observe(_target: Element) {
      roCallback([], this as unknown as ResizeObserver);
    }
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;

  const mockAnimation = {
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
    playbackRate: 1.5,
    playState: "running",
    currentTime: 250,
    effect: {
      getComputedTiming: () => ({ progress: 0.25 }),
    },
    onfinish: null,
  };
  const animateMock = vi.fn().mockReturnValue(mockAnimation);

  const container = {
    scrollHeight: 1000,
    clientHeight: 400,
    querySelector: vi.fn().mockReturnValue({ animate: animateMock }),
  } as unknown as HTMLDivElement;
  const containerRef = { current: container };

  renderHook(() =>
    useLaneTimeline({
      containerRef,
      totalDurationMs: 1000,
      speed: 1.5,
      isPaused: false,
    }),
  );

  expect(animateMock).toHaveBeenCalledTimes(1);

  // Simulate resize
  act(() => {
    // @ts-ignore
    container.clientHeight = 500; // New clientHeight, maxScrollPx becomes 500
    roCallback([], {} as ResizeObserver);
  });

  // Should re-create animation with new keyframes
  expect(animateMock).toHaveBeenCalledTimes(2);
  expect(animateMock).toHaveBeenLastCalledWith(
    [{ transform: `translateY(-500px)` }, { transform: `translateY(0px)` }],
    expect.any(Object),
  );

  // Should restore state
  expect(mockAnimation.currentTime).toBe(250);
  expect(mockAnimation.playbackRate).toBe(1.5);
  expect(mockAnimation.play).toHaveBeenCalledTimes(2); // Initial + after resize
});
```

**Step 3: Run test to verify it fails**

Run: `npm test src/hooks/use-lane-timeline.test.ts`
Expected: FAIL (It won't call `animateMock` a second time because of `!animationRef.current` check).

**Step 4: Commit**

```bash
git add src/hooks/use-lane-timeline.test.ts
git commit -m "test: add failing test for resize handling in useLaneTimeline"
```

---

### Task 2: Implement Resize Handling in useLaneTimeline

**Files:**

- Modify: `src/hooks/use-lane-timeline.ts`

**Step 1: Update updateAnimation logic**

```typescript
const updateAnimation = () => {
  const maxScrollPx = container.scrollHeight - container.clientHeight;
  const targetElement = container.querySelector("#track-lane");

  let prevTime = 0;
  if (animationRef.current) {
    // Save progress before cancelling
    prevTime =
      typeof animationRef.current.currentTime === "number" ? animationRef.current.currentTime : 0;

    // Always cleanup old animation on resize
    animationRef.current.cancel();
    animationRef.current = null;
  }

  if (maxScrollPx > 0 && targetElement) {
    const keyframes = [
      { transform: `translateY(-${maxScrollPx}px)` },
      { transform: `translateY(0px)` },
    ];

    const animation = targetElement.animate(keyframes, {
      duration: totalDurationMs,
      fill: "both",
      easing: "linear",
    });

    // Restore state using props and saved progress
    animation.playbackRate = speed;
    animation.currentTime = prevTime;

    if (isPaused) {
      animation.pause();
    } else {
      animation.play();
    }

    animation.onfinish = () => {
      onFinish?.();
    };

    animationRef.current = animation;
  }
};
```

**Step 2: Run tests to verify it passes**

Run: `npm test src/hooks/use-lane-timeline.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add src/hooks/use-lane-timeline.ts
git commit -m "refactor: handle container resize in useLaneTimeline while preserving state"
```

---

### Task 3: Final Verification and Cleanup

**Step 1: Run all tests**

Run: `npm test`
Expected: PASS

**Step 2: Commit**

```bash
git commit -m "chore: finalize useLaneTimeline resize refactor"
```
