import { useCallback, useEffect, useRef, useState } from "react";

interface UseLaneTimelineProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalDurationMs: number;
  speed: number;
  isPaused: boolean;
}

export function useLaneTimeline({
  containerRef,
  totalDurationMs,
  speed,
  isPaused,
}: UseLaneTimelineProps) {
  const motionRef = useRef<Animation | null>(null);
  const timelineRef = useRef<any>(null); // ScrollTimeline
  const [_progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || totalDurationMs <= 0) return;

    let cleanup: (() => void) | undefined;

    const setupAnimation = () => {
      if (cleanup) cleanup();

      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) return;

      // 1. Initialize ScrollTimeline
      if (typeof window !== "undefined" && "ScrollTimeline" in window) {
        try {
          timelineRef.current = new (window as any).ScrollTimeline({
            source: container,
            axis: "block",
          });
        } catch (e) {
          console.error("Failed to initialize ScrollTimeline:", e);
        }
      }

      // 2. Initialize Motion Animation
      // For falling notes, we scroll from maxScroll down to 0.
      container.scrollTop = maxScroll;
      const motion = container.animate(
        [{ scrollTop: maxScroll }, { scrollTop: 0 }],
        {
          duration: totalDurationMs / speed,
          fill: "forwards",
          easing: "linear",
        },
      );

      motion.pause();
      if (isPaused) {
        motion.pause();
      } else {
        motion.play();
      }
      motion.playbackRate = speed;
      motionRef.current = motion;

      cleanup = () => {
        motion.cancel();
      };
    };

    // Use ResizeObserver on the first child (the tall inner lane)
    // to detect when the content is actually sized.
    const content = container.firstElementChild;
    if (content) {
      const observer = new ResizeObserver(() => {
        setupAnimation();
      });
      observer.observe(content);
      return () => {
        observer.disconnect();
        if (cleanup) cleanup();
      };
    }

    setupAnimation();
    return () => {
      if (cleanup) cleanup();
    };
  }, [containerRef, totalDurationMs, speed]);

  // Handle Play/Pause
  useEffect(() => {
    const motion = motionRef.current;
    if (!motion) return;

    if (isPaused) {
      motion.pause();
    } else {
      motion.play();
    }
  }, [isPaused]);

  // Sync speed
  useEffect(() => {
    const motion = motionRef.current;
    if (!motion) return;
    motion.playbackRate = speed;
  }, [speed]);

  const getCurrentTimeMs = useCallback(() => {
    if (motionRef.current) {
      // Animation currentTime is in ms, 0 to (totalDurationMs / speed).
      // Since playbackRate = speed, the "effective" time is currentTime * speed.
      const currentTime = (motionRef.current.currentTime as number) || 0;
      return currentTime * speed;
    }

    return 0;
  }, [speed]);

  const getProgress = useCallback(() => {
    const time = getCurrentTimeMs();
    return totalDurationMs > 0 ? Math.min(1, time / totalDurationMs) : 0;
  }, [getCurrentTimeMs, totalDurationMs]);

  const resetTimeline = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (motionRef.current) {
      motionRef.current.currentTime = 0;
    }

    const maxScroll = container.scrollHeight - container.clientHeight;
    container.scrollTop = maxScroll;
    setProgress(0);
  }, [containerRef]);

  return {
    getCurrentTimeMs,
    getProgress,
    motion: motionRef.current,
    resetTimeline,
  };
}
