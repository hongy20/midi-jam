import { useCallback, useEffect, useRef, useState } from "react";

interface UsePlaybackClockOptions {
  duration: number;
  initialTime?: number;
  onTick?: (currentTime: number) => void;
}

/**
 * A React hook that manages high-resolution playback timing.
 * Supports play/pause/stop, variable speed, and negative lead-in time (countdown).
 */
export function usePlaybackClock({
  duration,
  initialTime = 0,
  onTick,
}: UsePlaybackClockOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [speed, setSpeed] = useState(1);

  // A ref to the `performance.now()` timestamp when playback was last started or resumed.
  // This is used as the anchor for calculating the `currentTime`.
  const startTimeRef = useRef<number | null>(null);
  // A ref to the ID returned by `requestAnimationFrame` to manage the animation loop.
  const requestRef = useRef<number | null>(null);

  const onTickRef = useRef(onTick);
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(initialTime);
    startTimeRef.current = null;
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, [initialTime]);

  const play = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    // This is the core of pause/resume and speed correction. It sets the
    // "zero" point for the animation frame's `now` timestamp based on
    // where we currently are in the logical time.
    if (currentTime < 0) {
      // Countdown always uses 1x speed
      startTimeRef.current = performance.now() - currentTime * 1000;
    } else {
      startTimeRef.current = performance.now() - (currentTime * 1000) / speed;
    }
  }, [isPlaying, currentTime, speed]);

  const pause = useCallback(() => {
    if (!isPlaying) return;
    setIsPlaying(false);
    // The current time is already frozen in the `currentTime` state,
    // so we just need to stop the animation frame loop.
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, [isPlaying]);

  // When speed changes, we need to adjust the start time reference
  // to prevent the playback position from jumping.
  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want to re-anchor when speed actually changes.
  useEffect(() => {
    if (isPlaying && startTimeRef.current !== null && currentTime >= 0) {
      startTimeRef.current = performance.now() - (currentTime * 1000) / speed;
    }
  }, [speed]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const tick = (now: number) => {
      if (startTimeRef.current === null) return;

      let elapsed: number;
      // If `startTimeRef` is in the future, it means we are in the countdown phase.
      const isCountdown = startTimeRef.current > now;

      if (isCountdown) {
        // Countdown always progresses at 1x speed.
        elapsed = (now - startTimeRef.current) / 1000;
      } else {
        // Normal playback is affected by speed.
        elapsed = ((now - startTimeRef.current) / 1000) * speed;
      }

      if (elapsed >= duration) {
        // Stop at the exact duration
        setCurrentTime(duration);
        setIsPlaying(false);
        onTickRef.current?.(duration);
        return; // End the loop
      }

      setCurrentTime(elapsed);
      onTickRef.current?.(elapsed);
      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isPlaying, speed, duration]);

  // Derived state for countdown
  const isCountdownActive = isPlaying && currentTime < 0;
  const countdownRemaining = isCountdownActive
    ? Math.ceil(Math.abs(currentTime))
    : 0;

  return {
    isPlaying,
    currentTime,
    speed,
    isCountdownActive,
    countdownRemaining,
    play,
    pause,
    stop,
    setSpeed,
  };
}
