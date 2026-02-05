import { useCallback, useEffect, useRef, useState } from "react";
import type { MidiEvent } from "../lib/midi/midi-parser";
import { usePlaybackClock } from "./use-playback-clock";

/**
 * A React hook that manages MIDI playback logic.
 *
 * It handles:
 * - Real-time playback timing using requestAnimationFrame (via usePlaybackClock).
 * - MIDI event scheduling (Note On/Off) with callback support.
 * - Playback state management (play, pause, stop).
 * - Variable playback speed with position correction.
 * - Built-in countdown mechanism before playback starts.
 */
export function useMidiPlayer(
  events: MidiEvent[],
  options?: {
    onNoteOn?: (note: number, velocity: number) => void;
    onNoteOff?: (note: number) => void;
    onAllNotesOff?: () => void;
  },
) {
  const COUNTDOWN_DURATION = 4;
  const [activeNotes, setActiveNotes] = useState<Map<number, number>>(
    new Map(),
  );
  const [duration, setDuration] = useState(0);

  const eventIndexRef = useRef(0);
  const activeNotesRef = useRef<Map<number, number>>(new Map());

  // Use refs for inputs to avoid re-triggering the main loop
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const eventsRef = useRef(events);

  const handleTick = useCallback((elapsed: number) => {
    if (elapsed < 0) return;

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
        activeNotesRef.current = next;
        return next;
      });
      eventIndexRef.current = index;
    }
  }, []);

  const clock = usePlaybackClock({
    duration,
    initialTime: -COUNTDOWN_DURATION,
    onTick: handleTick,
  });

  const stop = useCallback(() => {
    const { onNoteOff, onAllNotesOff } = optionsRef.current || {};

    if (onAllNotesOff) {
      onAllNotesOff();
    } else {
      activeNotesRef.current.forEach((_, note) => {
        onNoteOff?.(note);
      });
    }

    clock.stop();
    eventIndexRef.current = 0;
    setActiveNotes(new Map());
    activeNotesRef.current = new Map();
  }, [clock.stop]);

  const pause = useCallback(() => {
    if (!clock.isPlaying) return;

    const { onNoteOff, onAllNotesOff } = optionsRef.current || {};

    if (onAllNotesOff) {
      onAllNotesOff();
    } else {
      activeNotesRef.current.forEach((_, note) => {
        onNoteOff?.(note);
      });
    }

    clock.pause();
  }, [clock.isPlaying, clock.pause]);

  const play = useCallback(() => {
    if (clock.isPlaying) return;

    const { onNoteOn } = optionsRef.current || {};
    activeNotesRef.current.forEach((velocity, note) => {
      onNoteOn?.(note, velocity);
    });

    clock.play();
  }, [clock.isPlaying, clock.play]);

  useEffect(() => {
    eventsRef.current = events;
    // Calculate duration
    if (events.length > 0) {
      setDuration(events[events.length - 1].time);
    } else {
      setDuration(0);
    }
    // Full reset on event change
    stop();
  }, [events, stop]);

  return {
    isPlaying: clock.isPlaying,
    currentTime: clock.currentTime,
    duration,
    speed: clock.speed,
    activeNotes,
    countdownRemaining: clock.countdownRemaining,
    isCountdownActive: clock.isCountdownActive,
    play,
    pause,
    stop,
    setSpeed: clock.setSpeed,
  };
}
