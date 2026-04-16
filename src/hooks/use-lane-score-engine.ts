import { useCallback, useEffect, useMemo, useRef } from "react";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { calculateMaxRawPoints } from "@/lib/midi/score-utils";
import { useMIDINotes } from "./use-midi-notes";

const PERFECT_THRESHOLD = 200; // ms (increased from 150 for better tolerance)
const GOOD_THRESHOLD = 500; // ms (increased from 300)
const DURATION_GRACE_MS = 150; // ms to account for scheduling jitter

export type HitQuality = "perfect" | "good" | "miss" | null;

interface UseLaneScoreEngineProps {
  midiInput: WebMidi.MIDIInput | null;
  modelNotes: NoteSpan[];
  getCurrentTimeMs: () => number;
  initialScore?: number;
  initialCombo?: number;
  initialTimeMs?: number;
}

export function useLaneScoreEngine({
  midiInput,
  modelNotes,
  getCurrentTimeMs,
  initialScore = 0,
  initialCombo = 0,
  initialTimeMs = 0,
}: UseLaneScoreEngineProps) {
  const maxRawPoints = useMemo(
    () => calculateMaxRawPoints(modelNotes.length),
    [modelNotes.length],
  );
  // `initialScore` is normalized (0-100). Convert it back to raw points for internal tracking.
  const initialRawScore =
    maxRawPoints > 0 ? (initialScore / 100) * maxRawPoints : 0;

  const scoreRef = useRef(initialRawScore);

  const comboRef = useRef(initialCombo);
  const lastHitQualityRef = useRef<HitQuality>(null);

  const processedNotesRef = useRef<Set<number>>(new Set());
  const currentIndexRef = useRef(0);
  const activeHitsRef = useRef<
    Map<
      number,
      {
        actualOn: number;
        targetOn: number;
        targetOff: number;
        basePoints: number;
        comboMultiplier: number;
      }
    >
  >(new Map());

  // Restore state on mount if needed
  useEffect(() => {
    if (initialTimeMs > 0) {
      let nextIndex = 0;
      for (let i = 0; i < modelNotes.length; i++) {
        const note = modelNotes[i];
        const targetTimeMs = note.startTimeMs;

        if (targetTimeMs < initialTimeMs - GOOD_THRESHOLD) {
          processedNotesRef.current.add(i);
          nextIndex = i + 1;
        } else {
          break;
        }
      }
      currentIndexRef.current = nextIndex;
    }
  }, [initialTimeMs, modelNotes]);

  const resetScore = useCallback(() => {
    scoreRef.current = 0;
    comboRef.current = 0;
    lastHitQualityRef.current = null;
    processedNotesRef.current.clear();
    currentIndexRef.current = 0;
    activeHitsRef.current.clear();
  }, []);

  const calculateOverlapRatio = useCallback(
    (
      actualOn: number,
      actualOff: number,
      targetOn: number,
      targetOff: number,
    ) => {
      const targetDuration = targetOff - targetOn;
      if (targetDuration <= 0) return 0;

      // Intersection with grace periods applied to actual on/off
      const start = Math.max(actualOn - DURATION_GRACE_MS, targetOn);
      const end = Math.min(actualOff + DURATION_GRACE_MS, targetOff);
      const intersection = Math.max(0, end - start);

      return Math.min(1.0, intersection / targetDuration);
    },
    [],
  );

  const commitHitScore = useCallback(
    (note: number, currentTimeMs: number) => {
      const hit = activeHitsRef.current.get(note);
      if (!hit) return;

      const precision = calculateOverlapRatio(
        hit.actualOn,
        currentTimeMs,
        hit.targetOn,
        hit.targetOff,
      );

      scoreRef.current += hit.basePoints * precision * hit.comboMultiplier;
      activeHitsRef.current.delete(note);
    },
    [calculateOverlapRatio],
  );

  const processNoteEvent = useCallback(
    (event: {
      type: "note-on" | "note-off";
      note: number;
      velocity: number;
    }) => {
      const currentTimeMs = getCurrentTimeMs();

      // --- HANDLE NOTE OFF ---
      if (event.type === "note-off") {
        commitHitScore(event.note, currentTimeMs);
        return;
      }

      // --- HANDLE NOTE ON ---
      // Find closest model noteOn event for this pitch within a window
      let bestMatchIdx = -1;
      let minDelta = Infinity;

      for (let i = currentIndexRef.current; i < modelNotes.length; i++) {
        const note = modelNotes[i];
        const targetTimeMs = note.startTimeMs;
        const delta = Math.abs(currentTimeMs - targetTimeMs);

        if (targetTimeMs > currentTimeMs + GOOD_THRESHOLD) break;

        if (note.note === event.note && !processedNotesRef.current.has(i)) {
          if (delta < minDelta) {
            minDelta = delta;
            bestMatchIdx = i;
          }
        }
      }

      if (bestMatchIdx !== -1 && minDelta < GOOD_THRESHOLD) {
        processedNotesRef.current.add(bestMatchIdx);
        const note = modelNotes[bestMatchIdx];

        let quality: HitQuality = "good";
        let points = 50;

        if (minDelta < PERFECT_THRESHOLD) {
          quality = "perfect";
          points = 100;
        }

        const multiplier = 1 + Math.floor(comboRef.current / 10) * 0.1;

        // Register active hit - points are added on release
        activeHitsRef.current.set(event.note, {
          actualOn: currentTimeMs,
          targetOn: note.startTimeMs,
          targetOff: note.startTimeMs + note.durationMs,
          basePoints: points,
          comboMultiplier: multiplier,
        });

        lastHitQualityRef.current = quality;
        comboRef.current += 1;
      } else {
        lastHitQualityRef.current = "miss";
        comboRef.current = 0;
      }
    },
    [modelNotes, getCurrentTimeMs, commitHitScore],
  );

  useMIDINotes(midiInput, processNoteEvent);

  // Miss detection, window advancement, and stale hit cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTimeMs = getCurrentTimeMs();

      // 1. Check for missing noteOn (User never pressed)
      for (let i = currentIndexRef.current; i < modelNotes.length; i++) {
        const note = modelNotes[i];
        const targetTimeMs = note.startTimeMs;

        if (currentTimeMs > targetTimeMs + GOOD_THRESHOLD) {
          if (!processedNotesRef.current.has(i)) {
            processedNotesRef.current.add(i);
            lastHitQualityRef.current = "miss";
            comboRef.current = 0;
          }
          currentIndexRef.current = i + 1;
        } else {
          break;
        }
      }

      // 2. Check for missing noteOff (User held forever or release missed)
      for (const [note, hit] of activeHitsRef.current.entries()) {
        // If we are significantly past the target release, finalize the score
        if (currentTimeMs > hit.targetOff + GOOD_THRESHOLD) {
          commitHitScore(note, currentTimeMs);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [modelNotes, getCurrentTimeMs, commitHitScore]);

  const finalizeScore = useCallback(() => {
    const currentTimeMs = getCurrentTimeMs();
    for (const note of activeHitsRef.current.keys()) {
      console.log(
        "[ScoreEngine] finalizeScore caught a lingering hit for note:",
        note,
      );
      commitHitScore(note, currentTimeMs);
    }
  }, [getCurrentTimeMs, commitHitScore]);

  return {
    getScore: useCallback(() => {
      if (maxRawPoints === 0) return 0;
      return (scoreRef.current / maxRawPoints) * 100;
    }, [maxRawPoints]),
    getCombo: useCallback(() => comboRef.current, []),
    getLastHitQuality: useCallback(() => lastHitQualityRef.current, []),
    processNoteEvent,
    resetScore,
    finalizeScore,
  };
}
