import { useCallback, useEffect, useRef } from "react";

interface UseLaneTimelineProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalDurationMs: number;
  speed: number;
  initialTimeMs?: number;
  onFinish?: () => void;
}

export function useLaneTimeline({
  containerRef,
  totalDurationMs,
  speed,
  initialTimeMs,
  onFinish,
}: UseLaneTimelineProps) {
  const animationRef = useRef<Animation | null>(null);

  // Initialize and manage the Web Animation (internal clock only)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || totalDurationMs <= 0) return;

    // We still create a "dummy" animation on the container itself (or an invisible div)
    // to leverage the Web Animation API's built-in clock, playbackRate, and pause/resume logic.
    // This animation doesn't need to move anything visible.
    const keyframes = [{ opacity: 1 }, { opacity: 1 }];

    const animation = container.animate(keyframes, {
      duration: totalDurationMs,
      fill: "both",
      easing: "linear",
    });

    // Restore state using props and saved progress
    animation.currentTime = initialTimeMs ?? 0;

    animation.play();

    animation.onfinish = () => {
      onFinish?.();
    };

    animationRef.current = animation;

    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }
    };
  }, [containerRef, totalDurationMs, onFinish, initialTimeMs]);

  // Handle Speed updates smoothly
  useEffect(() => {
    const animation = animationRef.current;
    if (!animation) return;

    animation.playbackRate = speed;
  }, [speed]);

  const getCurrentTimeMs = useCallback(() => {
    return (animationRef.current?.currentTime as number) ?? 0;
  }, []);

  const getProgress = useCallback((): number => {
    const animation = animationRef.current;
    if (!animation || !animation.effect) return 0;

    const timing = animation.effect.getComputedTiming();
    return timing.progress !== null && timing.progress !== undefined
      ? timing.progress
      : 0;
  }, []);

  const resetTimeline = useCallback(() => {
    const animation = animationRef.current;
    if (animation) {
      animation.currentTime = 0;
      animation.play();
    }
  }, []);

  return {
    getCurrentTimeMs,
    getProgress,
    resetTimeline,
  };
}
