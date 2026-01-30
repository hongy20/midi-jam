import { useState, useEffect, useRef, useCallback } from "react";
import type { MidiEvent } from "../lib/midi/midi-player";

export function useMidiPlayer(
  events: MidiEvent[], 
  options?: {
    onNoteOn?: (note: number, velocity: number) => void;
    onNoteOff?: (note: number) => void;
  }
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

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
    setActiveNotes(new Set());
  }, [events]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    eventIndexRef.current = 0;
    setActiveNotes(new Set());
    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
  }, []);

  const play = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    startTimeRef.current = performance.now() - (pausedTimeRef.current * 1000) / speed;
  }, [isPlaying, speed]);

  const pause = useCallback(() => {
    if (!isPlaying) return;
    setIsPlaying(false);
    pausedTimeRef.current = currentTime;
    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
  }, [isPlaying, currentTime]);

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
      
      const notesToToggle: { note: number; velocity: number; type: 'add' | 'delete' }[] = [];

      while (index < currentEvents.length && currentEvents[index].time <= elapsed) {
        const event = currentEvents[index];
        const type = event.type === "noteOn" ? "add" : "delete";
        
        notesToToggle.push({ 
          note: event.note, 
          velocity: event.velocity,
          type 
        });

        if (type === 'add') {
          onNoteOn?.(event.note, event.velocity);
        } else {
          onNoteOff?.(event.note);
        }

        index++;
        changed = true;
      }

      if (changed) {
        setActiveNotes(prev => {
          const next = new Set(prev);
          for (const toggle of notesToToggle) {
            if (toggle.type === 'add') next.add(toggle.note);
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
    speed,
    activeNotes,
    play,
    pause,
    stop,
    setSpeed,
  };
}