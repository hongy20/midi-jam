import { useCallback, useEffect, useRef } from "react";

// Custom hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface UseLaneTimelineProps {
  totalDurationMs: number;
  speed: number;
  initialProgress?: number;
  onFinish: () => void;
}

export function useLaneTimeline({
  totalDurationMs,
  speed,
  initialProgress = 0,
  onFinish,
}: UseLaneTimelineProps) {
  const baseGameTimeRef = useRef(initialProgress * totalDurationMs);
  const syncRealTimeRef = useRef(performance.now());
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const prevSpeed = usePrevious(speed);

  const getCurrentTimeMs = useCallback(() => {
    if (totalDurationMs <= 0) return 0;
    const elapsedRealTime = performance.now() - syncRealTimeRef.current;
    return Math.min(
      totalDurationMs,
      baseGameTimeRef.current + elapsedRealTime * speed,
    );
  }, [totalDurationMs, speed]);

  const getProgress = useCallback(() => {
    if (totalDurationMs <= 0) return 0;
    return getCurrentTimeMs() / totalDurationMs;
  }, [totalDurationMs, getCurrentTimeMs]);

  useEffect(() => {
    if (totalDurationMs <= 0) return;

    const elapsedRealTime = performance.now() - syncRealTimeRef.current;
    const lastSpeed = prevSpeed ?? speed; // On first render, prevSpeed is undefined

    baseGameTimeRef.current += elapsedRealTime * lastSpeed;
    syncRealTimeRef.current = performance.now();

    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

    const remainingGameTime = totalDurationMs - baseGameTimeRef.current;
    if (remainingGameTime > 0) {
      const realTimeRemaining = remainingGameTime / speed;
      timeoutIdRef.current = setTimeout(onFinish, realTimeRemaining);
    } else {
      // If we are already over, finish immediately
      onFinish();
    }

    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [totalDurationMs, speed, onFinish, prevSpeed]);

  const resetTimeline = useCallback(() => {
    baseGameTimeRef.current = 0;
    syncRealTimeRef.current = performance.now();

    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (totalDurationMs > 0) {
      const realTimeRemaining = totalDurationMs / speed;
      timeoutIdRef.current = setTimeout(onFinish, realTimeRemaining);
    }
  }, [totalDurationMs, speed, onFinish]);

  return {
    getCurrentTimeMs,
    getProgress,
    resetTimeline,
  };
}
