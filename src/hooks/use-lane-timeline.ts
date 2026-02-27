import { useCallback, useEffect, useRef } from "react";

interface UseLaneTimelineProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalDurationMs: number;
  speed: number;
  isPaused: boolean;
  onFinish?: () => void;
}

export function useLaneTimeline({
  containerRef,
  totalDurationMs,
  speed,
  isPaused,
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
      const targetElement = container.querySelector('#track-lane');
      
      // If animation already exists, we might need to recreate it if maxScrollPx changes significantly,
      // but for simplicity, we create it once and assume height is stable after load.
      if (!animationRef.current && maxScrollPx > 0 && targetElement) {
         const keyframes = [
          { transform: `translateY(-${maxScrollPx}px)` },
          { transform: `translateY(0px)` }
        ];

        const animation = targetElement.animate(keyframes, {
          duration: totalDurationMs,
          fill: "both",
          easing: "linear"
        });

        // Sync initial state
        animation.playbackRate = speed;
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
  }, [containerRef, totalDurationMs, onFinish]); // Only re-create if these critical props change

  // Handle Play/Pause and Speed updates smoothly
  useEffect(() => {
    const animation = animationRef.current;
    if (!animation) return;

    animation.playbackRate = speed;

    if (isPaused) {
      if (animation.playState !== 'paused') {
          animation.pause();
      }
    } else {
       if (animation.playState !== 'running' && animation.playState !== 'finished') {
          animation.play();
       }
    }
  }, [isPaused, speed]);

  const getCurrentTimeMs = useCallback(() => {
    const animation = animationRef.current;
    if (!animation || typeof animation.currentTime !== 'number') return 0;
    return animation.currentTime;
  }, []);

  const getProgress = useCallback((): number => {
    const animation = animationRef.current;
    if (!animation || !animation.effect) return 0;
    
    const timing = animation.effect.getComputedTiming();
    return (timing.progress !== null && timing.progress !== undefined) ? timing.progress : 0;
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

