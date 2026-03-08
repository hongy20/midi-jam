import { useCallback, useEffect, useRef } from "react";

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

  // Initialize and manage the Web Animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container || totalDurationMs <= 0) return;

    // Use a ResizeObserver to get the correct max scroll distance.
    // The note lane container should have its final height based on totalDurationMs.
    const updateAnimation = () => {
      const maxScrollPx = container.scrollHeight - container.clientHeight;
      const targetElement = container.querySelector("#track-lane");

      let currentProgress = initialTimeMs ?? 0;
      if (animationRef.current) {
        // Save progress before cancelling
        currentProgress = (animationRef.current.currentTime as number) ?? 0;

        // Always cleanup old animation on resize
        animationRef.current.cancel();
        animationRef.current = null;
      }

      if (maxScrollPx > 0 && targetElement) {
        // The animation must move the entire height of the lane relative to the hit line.
        // At t=0, the bottom of the lane (scrollHeight) is at the hit line (clientHeight).
        // At t=totalDuration, the top of the lane (0) is at the hit line (clientHeight).
        // Distance = (clientHeight - 0) - (clientHeight - scrollHeight) = scrollHeight.
        const keyframes = [
          { transform: `translateY(${-maxScrollPx}px)` },
          { transform: `translateY(${container.clientHeight}px)` },
        ];

        const animation = targetElement.animate(keyframes, {
          duration: totalDurationMs,
          fill: "both",
          easing: "linear",
        });

        // Restore state using props and saved progress
        animation.playbackRate = speed;
        animation.currentTime = currentProgress;

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

    const ro = new ResizeObserver(updateAnimation);
    ro.observe(container);

    return () => {
      ro.disconnect();
      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }
    };
  }, [containerRef, totalDurationMs, onFinish, speed, isPaused, initialTimeMs]); // Only re-create if these critical props change

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
