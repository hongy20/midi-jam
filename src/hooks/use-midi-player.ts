import { useCallback, useEffect, useRef, useState } from "react";
import type { MidiEvent } from "../lib/midi/midi-player";

export function useMidiPlayer(
  events: MidiEvent[],
  options?: {
    onNoteOn?: (note: number, velocity: number) => void;
    onNoteOff?: (note: number) => void;
    onAllNotesOff?: () => void;
  },
) {
  const COUNTDOWN_DURATION = 4;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(-COUNTDOWN_DURATION);
  const [speed, setSpeed] = useState(1);
  const [activeNotes, setActiveNotes] = useState<Map<number, number>>(
    new Map(),
  );
  const [duration, setDuration] = useState(0);
  const [countdownRemaining, setCountdownRemaining] = useState(0);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(-COUNTDOWN_DURATION);
  const eventIndexRef = useRef(0);
  const requestRef = useRef<number>(null);

  // Ref to track active notes for stable callbacks (silencing/re-striking)
  const activeNotesRef = useRef<Map<number, number>>(new Map());

  // Use refs for options to avoid re-triggering the effect
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Use a ref for events to avoid re-triggering the effect if the array identity changes
  const eventsRef = useRef(events);
  useEffect(() => {
    eventsRef.current = events;
    // Reset when events change
    eventIndexRef.current = 0;
    pausedTimeRef.current = -COUNTDOWN_DURATION;
    setCurrentTime(-COUNTDOWN_DURATION);
    setActiveNotes(new Map());
    activeNotesRef.current = new Map();
    setIsCountdownActive(false);
    setCountdownRemaining(0);

    // Calculate duration
    if (events.length > 0) {
      setDuration(events[events.length - 1].time);
    } else {
      setDuration(0);
    }
  }, [events]);

  const stop = useCallback(() => {
    // Silence all notes first using ref
    const { onNoteOff, onAllNotesOff } = optionsRef.current || {};

    if (onAllNotesOff) {
      onAllNotesOff();
    } else {
      activeNotesRef.current.forEach((_, note) => {
        onNoteOff?.(note);
      });
    }

    setIsPlaying(false);
    setIsCountdownActive(false);
    setCountdownRemaining(0);
    setCurrentTime(-COUNTDOWN_DURATION);
    startTimeRef.current = null;
    pausedTimeRef.current = -COUNTDOWN_DURATION;
    eventIndexRef.current = 0;
    setActiveNotes(new Map());
    activeNotesRef.current = new Map();
    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
  }, []); // No dependencies!

  const play = useCallback(() => {
    if (isPlaying) return;

    if (currentTime < 0) {
      setIsCountdownActive(true);
      // During countdown, we always progress at 1.0x speed
      startTimeRef.current = performance.now() - currentTime * 1000;
    } else {
      setIsPlaying(true);
      startTimeRef.current = performance.now() - (currentTime * 1000) / speed;
    }

    setIsPlaying(true);

    // Re-strike active notes using ref
    const { onNoteOn } = optionsRef.current || {};
    activeNotesRef.current.forEach((velocity, note) => {
      onNoteOn?.(note, velocity);
    });
  }, [isPlaying, currentTime, speed]); // currentTime and activeNotes removed

  const pause = useCallback(() => {
    if (!isPlaying) return;
    setIsPlaying(false);
    pausedTimeRef.current = currentTime;
    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);

    // Silence all notes using ref
    const { onNoteOff, onAllNotesOff } = optionsRef.current || {};

    if (onAllNotesOff) {
      onAllNotesOff();
    } else {
      activeNotesRef.current.forEach((_, note) => {
        onNoteOff?.(note);
      });
    }
  }, [isPlaying, currentTime]); // activeNotes removed

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run when speed changes. isPlaying check is inside.
  useEffect(() => {
    if (isPlaying && startTimeRef.current !== null && currentTime >= 0) {
      // Recalculate startTime to maintain the exact currentTime with the new speed
      // This prevents "jumps" in playback position when changing speed
      startTimeRef.current = performance.now() - (currentTime * 1000) / speed;
    }
  }, [speed]); // Only run when speed changes. isPlaying check is inside.

  useEffect(() => {
    if (!isPlaying) return;

    const tick = (now: number) => {
      if (startTimeRef.current === null) return;

      let elapsed: number;
      if (now < startTimeRef.current) {
        // Progression is 1.0 real second per second during countdown
        elapsed = (now - startTimeRef.current) / 1000;
      } else {
        elapsed = ((now - startTimeRef.current) / 1000) * speed;
      }

      // Handle countdown state updates
      if (elapsed < 0) {
        setCountdownRemaining(Math.ceil(Math.abs(elapsed)));
      } else {
        // Ensure countdown is cleared once elapsed >= 0
        setIsCountdownActive(false);
        setCountdownRemaining(0);
      }

      setCurrentTime(elapsed);

      // Process events - only if elapsed >= 0
      if (elapsed >= 0) {
        let index = eventIndexRef.current;
        let changed = false;
        const currentEvents = eventsRef.current;
        const { onNoteOn, onNoteOff } = optionsRef.current || {};

        const notesToToggle: {
          note: number;
          velocity: number;
          type: "add" | "delete";
        }[] = [];

        while (
          index < currentEvents.length &&
          currentEvents[index].time <= elapsed
        ) {
          const event = currentEvents[index];
          const type = event.type === "noteOn" ? "add" : "delete";

          notesToToggle.push({
            note: event.note,
            velocity: event.velocity,
            type,
          });

          if (type === "add") {
            onNoteOn?.(event.note, event.velocity);
          } else {
            onNoteOff?.(event.note);
          }

          index++;
          changed = true;
        }

        if (changed) {
          setActiveNotes((prev) => {
            const next = new Map(prev);
            for (const toggle of notesToToggle) {
              if (toggle.type === "add") next.set(toggle.note, toggle.velocity);
              else next.delete(toggle.note);
            }
            activeNotesRef.current = next; // Sync the ref
            return next;
          });
          eventIndexRef.current = index;
        }
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speed]); // Removed activeNotes, events and isCountdownActive from dependencies to prevent effect loops

  return {
    isPlaying,
    currentTime,
    duration,
    speed,
    activeNotes,
    countdownRemaining,
    isCountdownActive,
    play,
    pause,
    stop,
    setSpeed,
  };
}
