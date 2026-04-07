import { useCallback, useEffect, useRef } from "react";
import type { MidiEvent } from "@/lib/midi/midi-parser";
import { useMIDINotes } from "./use-midi-notes";

const PERFECT_THRESHOLD = 100; // ms
const GOOD_THRESHOLD = 250; // ms

export type HitQuality = "perfect" | "good" | "miss" | null;

interface UseLaneScoreEngineProps {
  midiInput: WebMidi.MIDIInput | null;
  modelEvents: MidiEvent[];
  getCurrentTimeMs: () => number;
  initialScore?: number;
  initialCombo?: number;
  initialTimeMs?: number;
}

export function useLaneScoreEngine({
  midiInput,
  modelEvents,
  getCurrentTimeMs,
  initialScore = 0,
  initialCombo = 0,
  initialTimeMs = 0,
}: UseLaneScoreEngineProps) {
  const scoreRef = useRef(initialScore);
  const comboRef = useRef(initialCombo);
  const lastHitQualityRef = useRef<HitQuality>(null);

  const processedNotesRef = useRef<Set<number>>(new Set());
  const currentIndexRef = useRef(0);

  // Restore state on mount if needed
  useEffect(() => {
    if (initialTimeMs > 0) {
      let nextIndex = 0;
      for (let i = 0; i < modelEvents.length; i++) {
        const modelEvent = modelEvents[i];
        const targetTimeMs = modelEvent.timeMs;

        if (targetTimeMs < initialTimeMs - GOOD_THRESHOLD) {
          processedNotesRef.current.add(i);
          nextIndex = i + 1;
        } else {
          break;
        }
      }
      currentIndexRef.current = nextIndex;
    }
  }, [initialTimeMs, modelEvents]);

  const resetScore = useCallback(() => {
    scoreRef.current = 0;
    comboRef.current = 0;
    lastHitQualityRef.current = null;
    processedNotesRef.current.clear();
    currentIndexRef.current = 0;
  }, []);

  const handleLiveNote = useCallback(
    (event: {
      type: "note-on" | "note-off";
      note: number;
      velocity: number;
    }) => {
      if (event.type === "note-off") return;

      const currentTimeMs = getCurrentTimeMs();

      // Find closest model noteOn event for this pitch within a window
      let bestMatchIdx = -1;
      let minDelta = Infinity;

      // Only scan from currentIndexRef.current onwards
      // Since modelEvents is sorted by time, we can stop if we go too far past currentTimeMs
      for (let i = currentIndexRef.current; i < modelEvents.length; i++) {
        const modelEvent = modelEvents[i];
        if (modelEvent.type !== "noteOn") continue;

        const targetTimeMs = modelEvent.timeMs;
        const delta = Math.abs(currentTimeMs - targetTimeMs);

        // If this event is already too far in the future, we can stop searching
        if (targetTimeMs > currentTimeMs + GOOD_THRESHOLD) break;

        // If it's the correct note and not processed, check if it's the best match
        if (
          modelEvent.note === event.note &&
          !processedNotesRef.current.has(i)
        ) {
          if (delta < minDelta) {
            minDelta = delta;
            bestMatchIdx = i;
          }
        }
      }

      if (bestMatchIdx !== -1 && minDelta < GOOD_THRESHOLD) {
        processedNotesRef.current.add(bestMatchIdx);

        let quality: HitQuality = "good";
        let points = 50;

        if (minDelta < PERFECT_THRESHOLD) {
          quality = "perfect";
          points = 100;
        }

        lastHitQualityRef.current = quality;
        scoreRef.current +=
          points * (1 + Math.floor(comboRef.current / 10) * 0.1);
        comboRef.current += 1;
      } else {
        lastHitQualityRef.current = "miss";
        comboRef.current = 0;
      }
    },
    [modelEvents, getCurrentTimeMs],
  );

  useMIDINotes(midiInput, handleLiveNote);

  // Miss detection and window advancement
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTimeMs = getCurrentTimeMs();

      for (let i = currentIndexRef.current; i < modelEvents.length; i++) {
        const modelEvent = modelEvents[i];
        if (modelEvent.type !== "noteOn") {
          // Advance window for noteOff events too if we've passed them
          if (modelEvent.timeMs < currentTimeMs - GOOD_THRESHOLD) {
            currentIndexRef.current = i + 1;
          }
          continue;
        }

        const targetTimeMs = modelEvent.timeMs;

        // If this note is more than GOOD_THRESHOLD past the target line, it's a miss
        if (currentTimeMs > targetTimeMs + GOOD_THRESHOLD) {
          if (!processedNotesRef.current.has(i)) {
            processedNotesRef.current.add(i);
            lastHitQualityRef.current = "miss";
            comboRef.current = 0;
          }
          // Advance the window past this missed note
          currentIndexRef.current = i + 1;
        } else {
          // Since events are sorted, once we hit a note that isn't a miss yet, we can stop
          break;
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [modelEvents, getCurrentTimeMs]);

  return {
    getScore: useCallback(() => scoreRef.current, []),
    getCombo: useCallback(() => comboRef.current, []),
    getLastHitQuality: useCallback(() => lastHitQualityRef.current, []),
    resetScore,
  };
}
