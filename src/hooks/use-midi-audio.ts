import { useEffect, useRef, useState, useCallback } from "react";
import * as Tone from "tone";

/**
 * Hook to handle MIDI audio synthesis using Tone.js.
 */
export function useMidiAudio() {
  const polySynthRef = useRef<Tone.PolySynth | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);

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

  const playNote = useCallback((midiNote: number, velocity: number) => {
    if (isMuted || !polySynthRef.current) return;
    
    // Ensure AudioContext is started
    if (Tone.getContext().state !== "running") {
      Tone.start();
    }

    const frequency = Tone.Frequency(midiNote, "midi").toFrequency();
    polySynthRef.current.triggerAttack(frequency, Tone.now(), velocity);
  }, [isMuted]);

  const stopNote = useCallback((midiNote: number) => {
    if (!polySynthRef.current) return;
    
    const frequency = Tone.Frequency(midiNote, "midi").toFrequency();
    polySynthRef.current.triggerRelease(frequency, Tone.now());
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Effect to handle state changes in useMidiPlayer or live input
  // This is better handled by explicit calls from the player or device listener
  
  return {
    playNote,
    stopNote,
    isMuted,
    toggleMute,
    setIsReady,
  };
}
