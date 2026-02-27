import { useCallback, useEffect, useRef } from "react";

interface UseLaneTimelineProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  originalTrackDurationMs: number;
  speed: number;
  isPaused: boolean;
}

export function useLaneTimeline({
  containerRef,
  originalTrackDurationMs,
  speed,
  isPaused,
}: UseLaneTimelineProps) {
  const currentTimeMsRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const maxScrollRef = useRef(0);
  const timelineRef = useRef<ScrollTimeline | null>(null);

  const loop = useCallback(
    (now: number) => {
      const container = containerRef.current;
      if (!container) return;

      if (isPaused) {
        lastTimestampRef.current = null;
        return;
      }

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = now;
      } else {
        const deltaTime = now - lastTimestampRef.current;
        lastTimestampRef.current = now;
        currentTimeMsRef.current += deltaTime * speed;
      }

      const t =
        originalTrackDurationMs > 0
          ? Math.min(currentTimeMsRef.current / originalTrackDurationMs, 1)
          : 0;
      container.scrollTop = (1 - t) * maxScrollRef.current;

      if (t < 1) {
        rafIdRef.current = requestAnimationFrame(loop);
      }
    },
    [isPaused, speed, originalTrackDurationMs, containerRef],
  );

  // Handle Play/Pause and loop initialization
  useEffect(() => {
    if (
      !isPaused &&
      originalTrackDurationMs > 0 &&
      currentTimeMsRef.current < originalTrackDurationMs
    ) {
      rafIdRef.current = requestAnimationFrame(loop);
    } else {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lastTimestampRef.current = null;
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [isPaused, originalTrackDurationMs, loop]);

  // Handle ResizeObserver to maintain correct maxScrollTop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      maxScrollRef.current = container.scrollHeight - container.clientHeight;
      // Initialize or update the static scroll if paused/finished
      const t =
        originalTrackDurationMs > 0
          ? Math.min(currentTimeMsRef.current / originalTrackDurationMs, 1)
          : 0;
      container.scrollTop = (1 - t) * maxScrollRef.current;
    });

    ro.observe(container);

    return () => ro.disconnect();
  }, [containerRef, originalTrackDurationMs]);

  // Handle ScrollTimeline for progress
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    timelineRef.current = new ScrollTimeline({
      source: container,
      axis: "block",
    });

    return () => {
      timelineRef.current = null;
    };
  }, [containerRef]);

  const getCurrentTimeMs = useCallback(() => {
    return currentTimeMsRef.current;
  }, []);

  const getProgress = useCallback(() => {
    const val = timelineRef.current?.currentTime;

    if (typeof val === "number") {
      return 1 - val / 100;
    }

    if (val) {
      const percent = val.to("percent").value; // value: number
      return 1 - percent / 100;
    }

    return originalTrackDurationMs > 0
      ? Math.min(1, currentTimeMsRef.current / originalTrackDurationMs)
      : 0;
  }, [originalTrackDurationMs]);

  const resetTimeline = useCallback(() => {
    currentTimeMsRef.current = 0;
    lastTimestampRef.current = null;
    const container = containerRef.current;
    if (container) {
      container.scrollTop = maxScrollRef.current;
    }
  }, [containerRef]);

  return {
    getCurrentTimeMs,
    getProgress,
    resetTimeline,
  };
}
