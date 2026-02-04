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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeNotes, setActiveNotes] = useState<Map<number, number>>(
    new Map(),
  );
  const [duration, setDuration] = useState(0);
  const [countdownRemaining, setCountdownRemaining] = useState(0);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
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
    pausedTimeRef.current = 0;
    setCurrentTime(0);
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
    setCurrentTime(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    eventIndexRef.current = 0;
    setActiveNotes(new Map());
    activeNotesRef.current = new Map();
    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
  }, []); // No dependencies!

  const play = useCallback(() => {
    if (isPlaying || isCountdownActive) return;

    if (currentTime === 0) {
      setIsCountdownActive(true);
      if (countdownRemaining === 0) {
        setCountdownRemaining(4);
      }
      return;
    }

    setIsPlaying(true);
    startTimeRef.current =
      performance.now() - (pausedTimeRef.current * 1000) / speed;

    // Re-strike active notes using ref
    const { onNoteOn } = optionsRef.current || {};
    activeNotesRef.current.forEach((velocity, note) => {
      onNoteOn?.(note, velocity);
    });
  }, [isPlaying, isCountdownActive, currentTime, countdownRemaining, speed]); // currentTime and activeNotes removed

  const pause = useCallback(() => {
    if (isCountdownActive) {
      setIsCountdownActive(false);
      return;
    }
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
  }, [isPlaying, isCountdownActive, currentTime]); // activeNotes removed

  // Countdown timer effect
  useEffect(() => {
    if (!isCountdownActive) return;

    const intervalId = setInterval(() => {
      setCountdownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsCountdownActive(false);
          setIsPlaying(true);
          startTimeRef.current = performance.now();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isCountdownActive]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run when speed changes. isPlaying check is inside.
  useEffect(() => {
    if (isPlaying && startTimeRef.current !== null) {
      // Recalculate startTime to maintain the exact currentTime with the new speed
      // This prevents "jumps" in playback position when changing speed
      startTimeRef.current = performance.now() - (currentTime * 1000) / speed;
    }
  }, [speed]); // Only run when speed changes. isPlaying check is inside.

  useEffect(() => {
    if (!isPlaying) return;

    const tick = (now: number) => {
      if (startTimeRef.current === null) return;

      const elapsed = ((now - startTimeRef.current) / 1000) * speed;
      setCurrentTime(elapsed);

      // Process events
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

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speed]); // Removed activeNotes and events from dependencies to prevent effect loops

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
