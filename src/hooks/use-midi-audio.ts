import { useCallback, useEffect, useRef, useState } from "react";
import * as Tone from "tone";

/**
 * Hook to handle MIDI audio synthesis using Tone.js or external MIDI output.
 */
export function useMidiAudio(
  demoMode = true,
  outputDevice: WebMidi.MIDIOutput | null = null,
) {
  const polySynthRef = useRef<Tone.PolySynth | null>(null);
  const [_isReady, setIsReady] = useState(false);

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
      if (!demoMode) return;

      if (outputDevice) {
        // Send Note On to MIDI Output (Channel 1: 0x90)
        // Velocity is normalized 0-1, MIDI needs 0-127
        const midiVelocity = Math.floor(velocity * 127);
        outputDevice.send([0x90, midiNote, midiVelocity]);
        return;
      }

      if (!polySynthRef.current) return;

      // Ensure AudioContext is started
      if (Tone.getContext().state !== "running") {
        Tone.start();
      }

      const frequency = Tone.Frequency(midiNote, "midi").toFrequency();
      polySynthRef.current.triggerAttack(frequency, Tone.now(), velocity);
    },
    [demoMode, outputDevice],
  );

  const stopNote = useCallback(
    (midiNote: number) => {
      if (outputDevice) {
        // Send Note Off to MIDI Output (Channel 1: 0x80)
        outputDevice.send([0x80, midiNote, 0]);
        return;
      }

      if (!polySynthRef.current) return;

      const frequency = Tone.Frequency(midiNote, "midi").toFrequency();
      polySynthRef.current.triggerRelease(frequency, Tone.now());
    },
    [outputDevice],
  );

  const stopAllNotes = useCallback(() => {
    if (outputDevice) {
      // Send All Notes Off (Controller 123) to MIDI Output
      outputDevice.send([0xb0, 123, 0]);
      return;
    }

    if (!polySynthRef.current) return;
    polySynthRef.current.releaseAll();
  }, [outputDevice]);

  // Silence all audio immediately when Demo Mode is turned off
  useEffect(() => {
    if (!demoMode) {
      stopAllNotes();
    }
  }, [demoMode, stopAllNotes]);

  return {
    playNote,
    stopNote,
    stopAllNotes,
    setIsReady,
  };
}
