import { useCallback, useEffect, useRef, useState } from "react";
import type { MidiEvent } from "../lib/midi/midi-player";

export function useMidiPlayer(
  events: MidiEvent[],
  options?: {
    onNoteOn?: (note: number, velocity: number) => void;
    onNoteOff?: (note: number) => void;
  },
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeNotes, setActiveNotes] = useState<Map<number, number>>(new Map());
  const [duration, setDuration] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const eventIndexRef = useRef(0);
  const requestRef = useRef<number>(null);

  // Use refs for options to avoid re-triggering the effect
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Use a ref for events to avoid re-triggering the effect if the array identity changes
  // but content remains the same (though usually we want to reset if events change)
  const eventsRef = useRef(events);
  useEffect(() => {
    eventsRef.current = events;
    // Reset when events change
    eventIndexRef.current = 0;
    pausedTimeRef.current = 0;
    setCurrentTime(0);
    setActiveNotes(new Map());

    // Calculate duration
    if (events.length > 0) {
      setDuration(events[events.length - 1].time);
    } else {
      setDuration(0);
    }
  }, [events]);

  const stop = useCallback(() => {
    // Silence all notes first
    const { onNoteOff } = optionsRef.current || {};
    activeNotes.forEach((_, note) => {
      onNoteOff?.(note);
    });

    setIsPlaying(false);
    setCurrentTime(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    eventIndexRef.current = 0;
    setActiveNotes(new Map());
    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
  }, [activeNotes]);

  const play = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    startTimeRef.current =
      performance.now() - (pausedTimeRef.current * 1000) / speed;

    // Re-strike active notes
    const { onNoteOn } = optionsRef.current || {};
    activeNotes.forEach((velocity, note) => {
      onNoteOn?.(note, velocity);
    });
  }, [isPlaying, speed, activeNotes]);

  const pause = useCallback(() => {
    if (!isPlaying) return;
    setIsPlaying(false);
    pausedTimeRef.current = currentTime;
    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);

    // Silence all notes
    const { onNoteOff } = optionsRef.current || {};
    activeNotes.forEach((_, note) => {
      onNoteOff?.(note);
    });
  }, [isPlaying, currentTime, activeNotes]);

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
    play,
    pause,
    stop,
    setSpeed,
  };
}
