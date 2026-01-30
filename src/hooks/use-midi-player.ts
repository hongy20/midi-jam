import { useState, useEffect, useRef, useCallback } from "react";
import type { MidiEvent } from "../lib/midi/midi-player";

export function useMidiPlayer(events: MidiEvent[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const eventIndexRef = useRef(0);
  const requestRef = useRef<number>(null);

  // Use a ref for events to avoid re-triggering the effect if the array identity changes
  // but content remains the same (though usually we want to reset if events change)
  const eventsRef = useRef(events);
  useEffect(() => {
    eventsRef.current = events;
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
    startTimeRef.current = performance.now() - pausedTimeRef.current * 1000 / speed;
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
      
      // We need to work with the latest state of activeNotes
      // but in a rAF loop, we should probably use a functional update or a ref
      // To keep it simple and reactive, we'll use the functional update pattern later
      // For now, let's just collect changes
      const notesToToggle: { note: number; type: 'add' | 'delete' }[] = [];

      while (index < currentEvents.length && currentEvents[index].time <= elapsed) {
        const event = currentEvents[index];
        notesToToggle.push({ 
          note: event.note, 
          type: event.type === "noteOn" ? "add" : "delete" 
        });
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

      // Check for end of song
      if (index >= currentEvents.length && notesToToggle.length === 0 && Array.from(activeNotes).length === 0) {
        // We use a small delay or check to ensure we don't stop prematurely
        // but for now, if we're past all events, we stop.
        // Actually, let's keep it playing until the user stops or a new song is loaded
        // or we reach the absolute end.
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