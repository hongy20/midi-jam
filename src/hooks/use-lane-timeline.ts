import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

interface UseLaneTimelineProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalDurationMs: number;
  speed: number;
  isPaused: boolean;
  initialTimeMs?: number;
  onFinish?: () => void;
}

export function useLaneTimeline({
  containerRef,
  totalDurationMs,
  speed,
  isPaused,
  initialTimeMs,
  onFinish,
}: UseLaneTimelineProps) {
  const animationRef = useRef<Animation | null>(null);

  // Initialize and manage the Web Animation (internal clock only)
  // We use useLayoutEffect to ensure the clock is ready before child components mount.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || totalDurationMs <= 0) return;

    // We still create a "dummy" animation on the container itself (or an invisible div)
    // to leverage the Web Animation API's built-in clock, playbackRate, and pause/resume logic.
    const keyframes = [{ opacity: 1 }, { opacity: 1 }];

    const animation = container.animate(keyframes, {
      duration: totalDurationMs,
      fill: "both",
      easing: "linear",
    });

    // Restore state using props and saved progress
    animation.playbackRate = speed;
    animation.currentTime = initialTimeMs ?? 0;

    if (isPaused) {
      animation.pause();
    } else {
      animation.play();
    }

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
  }, [containerRef, totalDurationMs, onFinish, speed, isPaused, initialTimeMs]);

  // Handle Play/Pause and Speed updates smoothly
  useEffect(() => {
    const animation = animationRef.current;
    if (!animation) return;

    animation.playbackRate = speed;

    if (isPaused) {
      if (animation.playState !== "paused") {
        animation.pause();
      }
    } else {
      if (
        animation.playState !== "running" &&
        animation.playState !== "finished"
      ) {
        animation.play();
      }
    }
  }, [isPaused, speed]);

  const getCurrentTimeMs = useCallback(() => {
    if (!animationRef.current) return initialTimeMs ?? 0;
    return (animationRef.current.currentTime as number) ?? initialTimeMs ?? 0;
  }, [initialTimeMs]);

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
      if (!isPaused) {
        animation.play();
      } else {
        animation.pause();
      }
    }
  }, [isPaused]);

  return {
    getCurrentTimeMs,
    getProgress,
    resetTimeline,
  };
}
