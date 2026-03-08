import { useEffect, useRef } from "react";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { LEAD_IN_DEFAULT_MS } from "@/lib/midi/constant";

interface UseDemoPlaybackProps {
  demoMode: boolean;
  isLoading: boolean;
  spans: NoteSpan[];
  getCurrentTimeMs: () => number;
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
}

export function useDemoPlayback({
  demoMode,
  isLoading,
  spans,
  getCurrentTimeMs,
  onNoteOn,
  onNoteOff,
}: UseDemoPlaybackProps) {
  const nextStartIndexRef = useRef(0);
  const activeSpansRef = useRef<Set<NoteSpan>>(new Set());
  const lastTimeRef = useRef(-1);

  useEffect(() => {
    if (!demoMode || isLoading || spans.length === 0) return;

    let rafId: number;

    const tick = () => {
      const rawTime = getCurrentTimeMs();
      // Adjust for lead-in: timeline starts at 0, but notes have LEAD_IN_DEFAULT_MS offset
      const currentTime = (rawTime - LEAD_IN_DEFAULT_MS) / 1000;

      // Handle timeline reset or jump
      if (
        rawTime < lastTimeRef.current ||
        Math.abs(rawTime - lastTimeRef.current) > 500
      ) {
        nextStartIndexRef.current = 0;
        for (const span of activeSpansRef.current) {
          onNoteOff(span.note);
        }
        activeSpansRef.current.clear();
      }
      lastTimeRef.current = rawTime;

      // 1. Process Offs
      for (const span of activeSpansRef.current) {
        if (span.startTime + span.duration <= currentTime) {
          onNoteOff(span.note);
          activeSpansRef.current.delete(span);
        }
      }

      // 2. Process Ons
      while (
        nextStartIndexRef.current < spans.length &&
        spans[nextStartIndexRef.current].startTime <= currentTime
      ) {
        const span = spans[nextStartIndexRef.current];
        // Only start if it's not already finished (in case of jumps)
        if (span.startTime + span.duration > currentTime) {
          onNoteOn(span.note, span.velocity || 0.7);
          activeSpansRef.current.add(span);
        }
        nextStartIndexRef.current++;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      // Cleanup: release any currently active notes
      for (const span of activeSpansRef.current) {
        onNoteOff(span.note);
      }
      activeSpansRef.current.clear();
      nextStartIndexRef.current = 0;
      lastTimeRef.current = -1;
    };
  }, [demoMode, isLoading, spans, getCurrentTimeMs, onNoteOn, onNoteOff]);
}
