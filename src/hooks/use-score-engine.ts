import { useState, useEffect, useRef, useMemo } from "react";
import type { MidiEvent } from "../lib/midi/midi-player";
import { calculateNoteWeights, PERFECT_WINDOW, GREAT_WINDOW, GOOD_WINDOW, POOR_WINDOW } from "../lib/midi/score-logic";
import { scoreStorage } from "../lib/score/score-storage";

export type Accuracy = "PERFECT" | "GREAT" | "GOOD" | "POOR" | "MISS" | null;

export function useScoreEngine(
  midiEvents: MidiEvent[],
  currentTime: number,
  liveActiveNotes: Set<number>,
  isPlaying: boolean,
  midiId: string | null = null,
) {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lastAccuracy, setLastAccuracy] = useState<Accuracy>(null);
  
  const [highScore, setHighScore] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  const eventWeights = useMemo(() => calculateNoteWeights(midiEvents), [midiEvents]);
  
  const processedNotesRef = useRef<Set<number>>(new Set());
  const prevLiveNotesRef = useRef<Set<number>>(new Set());
  
  // Track currently active MIDI notes that were successfully hit
  // Map<eventIdx, { startTime: number, note: number }>
  const activeHitsRef = useRef<Map<number, { startTime: number, note: number }>>(new Map());

  // Reset when midiEvents change or isPlaying becomes false
  useEffect(() => {
    if (!isPlaying) {
      setScore(0);
      setCombo(0);
      setMaxCombo(0);
      setLastAccuracy(null);
      processedNotesRef.current = new Set();
      prevLiveNotesRef.current = new Set();
      activeHitsRef.current = new Map();
    }
  }, [midiEvents, isPlaying]);

  // Load high scores
  useEffect(() => {
    if (midiId) {
      scoreStorage.getScore(midiId).then((data) => {
        setHighScore(data.highScore);
        setBestCombo(data.bestCombo);
      });
    } else {
      setHighScore(0);
      setBestCombo(0);
    }
  }, [midiId]);

  // Save when high scores are updated
  useEffect(() => {
    if (midiId && isPlaying && (score > highScore || maxCombo > bestCombo)) {
      const newHighScore = Math.max(score, highScore);
      const newBestCombo = Math.max(maxCombo, bestCombo);
      
      setHighScore(newHighScore);
      setBestCombo(newBestCombo);
      
      scoreStorage.saveScore(midiId, {
        highScore: newHighScore,
        bestCombo: newBestCombo,
      });
    }
  }, [score, maxCombo, midiId, highScore, bestCombo, isPlaying]);

  useEffect(() => {
    if (currentTime < 0 || !isPlaying) return;

    const newPresses = Array.from(liveActiveNotes).filter(n => !prevLiveNotesRef.current.has(n));
    const newReleases = Array.from(prevLiveNotesRef.current).filter(n => !liveActiveNotes.has(n));
    
    // Handle Presses
    for (const note of newPresses) {
      let bestMatchIdx = -1;
      let minDiff = Infinity;

      midiEvents.forEach((e, i) => {
        if (e.type === "noteOn" && e.note === note && !processedNotesRef.current.has(i)) {
          const diff = Math.abs(currentTime - e.time);
          if (diff < POOR_WINDOW && diff < minDiff) {
            minDiff = diff;
            bestMatchIdx = i;
          }
        }
      });

      if (bestMatchIdx !== -1) {
        processedNotesRef.current.add(bestMatchIdx);
        const points = eventWeights.get(bestMatchIdx) || 0;
        
        let accuracy: Accuracy = "MISS";
        let multiplier = 0;

        if (minDiff <= PERFECT_WINDOW) {
          accuracy = "PERFECT";
          multiplier = 1.0;
        } else if (minDiff <= GREAT_WINDOW) {
          accuracy = "GREAT";
          multiplier = 0.8;
        } else if (minDiff <= GOOD_WINDOW) {
          accuracy = "GOOD";
          multiplier = 0.5;
        } else if (minDiff <= POOR_WINDOW) {
          accuracy = "POOR";
          multiplier = 0.2;
        }

        setLastAccuracy(accuracy);
        
        if (multiplier > 0.2) { // GOOD or better
          setScore(s => s + points * multiplier * 0.5); // Press is 50%
          setCombo(c => {
            const next = c + 1;
            setMaxCombo(m => Math.max(m, next));
            return next;
          });
          // Track for release
          activeHitsRef.current.set(bestMatchIdx, { startTime: currentTime, note });
        } else {
          setCombo(0);
          if (multiplier > 0) {
            setScore(s => s + points * multiplier * 0.5);
          }
        }
      } else {
        setCombo(0);
      }
    }

    // Handle Releases
    for (const note of newReleases) {
      // Find which active hit this release corresponds to
      let hitIdx = -1;
      activeHitsRef.current.forEach((val, idx) => {
        if (val.note === note) hitIdx = idx;
      });

      if (hitIdx !== -1) {
        const hit = activeHitsRef.current.get(hitIdx)!;
        activeHitsRef.current.delete(hitIdx);

        // Find corresponding NoteOff event
        let noteOffIdx = -1;
        for (let i = hitIdx + 1; i < midiEvents.length; i++) {
          if (midiEvents[i].note === note && midiEvents[i].type === "noteOff") {
            noteOffIdx = i;
            break;
          }
        }

        if (noteOffIdx !== -1) {
          const noteOffEvent = midiEvents[noteOffIdx];
          const points = eventWeights.get(hitIdx) || 0;
          const diff = Math.abs(currentTime - noteOffEvent.time);
          
          let releaseMultiplier = 0;
          if (diff <= PERFECT_WINDOW) releaseMultiplier = 1.0;
          else if (diff <= GREAT_WINDOW) releaseMultiplier = 0.8;
          else if (diff <= GOOD_WINDOW) releaseMultiplier = 0.5;
          else if (diff <= POOR_WINDOW) releaseMultiplier = 0.2;

          // Also check if held long enough
          const expectedDuration = noteOffEvent.time - midiEvents[hitIdx].time;
          const actualDuration = currentTime - hit.startTime;
          const durationRatio = Math.min(1.0, actualDuration / expectedDuration);

          if (durationRatio < 0.8) {
             // Released too early
             setCombo(0);
          }

          setScore(s => s + points * releaseMultiplier * 0.5 * durationRatio);
        }
      }
    }

    // Detect misses (notes passed their POOR_WINDOW)
    midiEvents.forEach((e, i) => {
      if (e.type === "noteOn" && !processedNotesRef.current.has(i) && currentTime > e.time + POOR_WINDOW) {
        processedNotesRef.current.add(i);
        setCombo(0);
        setLastAccuracy("MISS");
      }
    });

    prevLiveNotesRef.current = new Set(liveActiveNotes);
  }, [currentTime, liveActiveNotes, midiEvents, eventWeights]);

  return {
    score,
    combo,
    maxCombo,
    lastAccuracy,
    highScore,
    bestCombo,
  };
}
