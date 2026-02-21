import { useCallback, useEffect, useRef, useState } from "react";
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

  const resetScore = useCallback(() => {
    setScore(0);
    setCombo(0);
    setLastHitQuality(null);
    processedNotesRef.current.clear();
  }, []);

  const handleLiveNote = useCallback(
    (event: {
      type: "note-on" | "note-off";
      note: number;
      velocity: number;
    }) => {
      if (!isPlaying || event.type === "note-off") return;

      const currentTimeMs = getCurrentTimeMs();

      // Find closest model noteOn event for this pitch
      let bestMatchIdx = -1;
      let minDelta = Infinity;

      for (let i = 0; i < modelEvents.length; i++) {
        const modelEvent = modelEvents[i];
        if (modelEvent.type !== "noteOn" || modelEvent.note !== event.note)
          continue;
        if (processedNotesRef.current.has(i)) continue;

        const delta = Math.abs(currentTimeMs - modelEvent.time * 1000);
        if (delta < minDelta) {
          minDelta = delta;
          bestMatchIdx = i;
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
        setScore((s) => s + points * (1 + Math.floor(combo / 10) * 0.1)); // Simple multiplier
        setCombo((c) => c + 1);
      } else {
        // If no match or too far off, it's a miss or ignore
        // For now, only count missed as reset combo if they pressed a wrong note
        setLastHitQuality("miss");
        setCombo(0);
      }
    },
    [isPlaying, modelEvents, getCurrentTimeMs, combo],
  );

  useMIDINotes(midiInput, handleLiveNote);

  // Miss detection for notes that passed through without being hit
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const currentTimeMs = getCurrentTimeMs();

      for (let i = 0; i < modelEvents.length; i++) {
        const modelEvent = modelEvents[i];
        if (modelEvent.type !== "noteOn") continue;
        if (processedNotesRef.current.has(i)) continue;

        // If note is more than GOOD_THRESHOLD past the target line
        if (currentTimeMs > modelEvent.time * 1000 + GOOD_THRESHOLD) {
          processedNotesRef.current.add(i);
          setLastHitQuality("miss");
          setCombo(0);
        }
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [isPlaying, modelEvents, getCurrentTimeMs]);

  return {
    score,
    combo,
    lastHitQuality,
    resetScore,
  };
}
