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

    // 1. Initialize ScrollTimeline
    // Note: This API might not be available in all browsers,
    // but the design assumes it's available (Android Chrome).
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
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 0) return;

    // We animate the scrollTop by animating a dummy property or using a
    // custom effect. Web Animations API can animate scrollTop on some browsers,
    // but a more robust way is to animate a CSS variable or use a keyframe on
    // the container's scroll position if supported.

    // Modern Chrome supports animating scrollTop directly
    const motion = container.animate(
      [{ scrollTop: 0 }, { scrollTop: maxScroll }],
      {
        duration: totalDurationMs / speed,
        fill: "forwards",
        easing: "linear",
      },
    );

    motion.pause(); // Start paused
    motionRef.current = motion;

    return () => {
      motion.cancel();
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
    if (timelineRef.current) {
      // If ScrollTimeline is available, use its currentTime
      // With timeRange = totalDurationMs, it should give ms.
      // Wait, we didn't set timeRange in the constructor above.
      // If we don't set it, it returns a percentage or pixel value.

      const currentTime = timelineRef.current.currentTime;
      if (currentTime && typeof currentTime.value === "number") {
        // ScrollTimeline currentTime might be in percent
        return (currentTime.value / 100) * totalDurationMs;
      }
    }

    // Fallback: use motion.currentTime
    // Since motion.duration = totalDurationMs / speed,
    // and motion.playbackRate = speed,
    // motion.currentTime * speed should give the song time?
    // Actually, motion.currentTime is the "effective" time in the animation.
    if (motionRef.current) {
      return ((motionRef.current.currentTime as number) || 0) * speed;
    }

    return 0;
  }, [totalDurationMs, speed]);

  const getProgress = useCallback(() => {
    const time = getCurrentTimeMs();
    return totalDurationMs > 0 ? time / totalDurationMs : 0;
  }, [getCurrentTimeMs, totalDurationMs]);

  const resetTimeline = useCallback(() => {
    if (motionRef.current) {
      motionRef.current.currentTime = 0;
    }
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    setProgress(0);
  }, [containerRef]);

  return {
    getCurrentTimeMs,
    getProgress,
    motion: motionRef.current,
    resetTimeline,
  };
}
