import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";

/**
 * Hook to handle MIDI audio synthesis using Tone.js.
 */
export function useMidiAudio(demoMode = true) {
  const polySynthRef = useRef<Tone.PolySynth | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [_isReady, setIsReady] = useState(false);

  // Enforce muted state based on demoMode
  const effectiveIsMuted = demoMode ? isMuted : true;

  useEffect(() => {
    // Initialize synth
    const polySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "triangle",
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
    }).toDestination();

    polySynthRef.current = polySynth;

    return () => {
      polySynth.dispose();
    };
  }, []);

  const playNote = useCallback(
    (midiNote: number, velocity: number) => {
      if (effectiveIsMuted || !polySynthRef.current) return;

      // Ensure AudioContext is started
      if (Tone.getContext().state !== "running") {
        Tone.start();
      }

      const frequency = Tone.Frequency(midiNote, "midi").toFrequency();
      polySynthRef.current.triggerAttack(frequency, Tone.now(), velocity);
    },
    [effectiveIsMuted],
  );

  const stopNote = useCallback((midiNote: number) => {
    if (!polySynthRef.current) return;

    const frequency = Tone.Frequency(midiNote, "midi").toFrequency();
    polySynthRef.current.triggerRelease(frequency, Tone.now());
  }, []);

  const stopAllNotes = useCallback(() => {
    if (!polySynthRef.current) return;
    polySynthRef.current.releaseAll();
  }, []);

  const toggleMute = useCallback(() => {
    if (!demoMode) return;
    setIsMuted((prev) => !prev);
  }, [demoMode]);

  // Effect to handle state changes in useMidiPlayer or live input
  // This is better handled by explicit calls from the player or device listener

  return {
    playNote,
    stopNote,
    stopAllNotes,
    isMuted: effectiveIsMuted,
    toggleMute,
    setIsReady,
  };
}
