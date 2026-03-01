import { useCallback, useEffect, useRef, useState } from "react";
import { LEAD_IN_DEFAULT_MS } from "@/lib/midi/constant";
import type { MidiEvent } from "@/lib/midi/midi-parser";
import { useMIDINotes } from "./use-midi-notes";

const PERFECT_THRESHOLD = 100; // ms
const GOOD_THRESHOLD = 250; // ms

export type HitQuality = "perfect" | "good" | "miss" | null;

interface UseLaneScoreEngineProps {
  midiInput: WebMidi.MIDIInput | null;
  modelEvents: MidiEvent[];
  getCurrentTimeMs: () => number;
  isPlaying: boolean;
}

export function useLaneScoreEngine({
  midiInput,
  modelEvents,
  getCurrentTimeMs,
  isPlaying,
}: UseLaneScoreEngineProps) {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastHitQuality, setLastHitQuality] = useState<HitQuality>(null);

  const processedNotesRef = useRef<Set<number>>(new Set());
  const currentIndexRef = useRef(0);

  const resetScore = useCallback(() => {
    setScore(0);
    setCombo(0);
    setLastHitQuality(null);
    processedNotesRef.current.clear();
    currentIndexRef.current = 0;
  }, []);

  const handleLiveNote = useCallback(
    (event: {
      type: "note-on" | "note-off";
      note: number;
      velocity: number;
    }) => {
      if (!isPlaying || event.type === "note-off") return;

      const currentTimeMs = getCurrentTimeMs();

      // Find closest model noteOn event for this pitch within a window
      let bestMatchIdx = -1;
      let minDelta = Infinity;

      // Only scan from currentIndexRef.current onwards
      // Since modelEvents is sorted by time, we can stop if we go too far past currentTimeMs
      for (let i = currentIndexRef.current; i < modelEvents.length; i++) {
        const modelEvent = modelEvents[i];
        if (modelEvent.type !== "noteOn") continue;

        const targetTimeMs = modelEvent.time * 1000 + LEAD_IN_DEFAULT_MS;
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

        setLastHitQuality(quality);
        setScore((s) => s + points * (1 + Math.floor(combo / 10) * 0.1));
        setCombo((c) => c + 1);
      } else {
        setLastHitQuality("miss");
        setCombo(0);
      }
    },
    [isPlaying, modelEvents, getCurrentTimeMs, combo],
  );

  useMIDINotes(midiInput, handleLiveNote);

  // Miss detection and window advancement
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const currentTimeMs = getCurrentTimeMs();

      for (let i = currentIndexRef.current; i < modelEvents.length; i++) {
        const modelEvent = modelEvents[i];
        if (modelEvent.type !== "noteOn") {
          // Advance window for noteOff events too if we've passed them
          if (
            modelEvent.time * 1000 + LEAD_IN_DEFAULT_MS <
            currentTimeMs - GOOD_THRESHOLD
          ) {
            currentIndexRef.current = i + 1;
          }
          continue;
        }

        const targetTimeMs = modelEvent.time * 1000 + LEAD_IN_DEFAULT_MS;

        // If this note is more than GOOD_THRESHOLD past the target line, it's a miss
        if (currentTimeMs > targetTimeMs + GOOD_THRESHOLD) {
          if (!processedNotesRef.current.has(i)) {
            processedNotesRef.current.add(i);
            setLastHitQuality("miss");
            setCombo(0);
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
  }, [isPlaying, modelEvents, getCurrentTimeMs]);

  return {
    score,
    combo,
    lastHitQuality,
    resetScore,
  };
}
