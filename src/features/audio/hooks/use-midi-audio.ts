import { useCallback, useEffect, useRef } from "react";
import * as Tone from "tone";
import {
  MIDI_COMMAND_NOTE_OFF,
  MIDI_COMMAND_NOTE_ON,
} from "@/features/midi-assets/lib/constant";

/**
 * Hook to handle MIDI audio synthesis using Tone.js or external MIDI output.
 */
export function useMidiAudio(outputDevice: WebMidi.MIDIOutput | null = null) {
  const polySynthRef = useRef<Tone.PolySynth | null>(null);

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
      polySynthRef.current = null;
      polySynth.dispose();
    };
  }, []);

  const playNote = useCallback(
    (midiNote: number, velocity: number) => {
      if (outputDevice) {
        // Send Note On to MIDI Output
        // Velocity is normalized 0-1, MIDI needs 0-127
        const midiVelocity = Math.floor(velocity * 127);
        outputDevice.send([MIDI_COMMAND_NOTE_ON, midiNote, midiVelocity]);
        return;
      }

      // Offload to next tick as triggerAttack might be slow and take a few ms to finish,
      // avoiding blocking the main thread during high-frequency note events.
      setTimeout(() => {
        if (!polySynthRef.current) return;

        // Ensure AudioContext is started
        if (Tone.getContext().state !== "running") {
          Tone.start();
        }

        const frequency = Tone.Frequency(midiNote, "midi").toFrequency();
        polySynthRef.current.triggerAttack(frequency, Tone.now(), velocity);
      }, 0);
    },
    [outputDevice],
  );

  const stopNote = useCallback(
    (midiNote: number) => {
      if (outputDevice) {
        // Send Note Off to MIDI Output
        outputDevice.send([MIDI_COMMAND_NOTE_OFF, midiNote, 0]);
        return;
      }
      // Offload to next tick as triggerRelease might be slow and take a few ms to finish
      setTimeout(() => {
        if (!polySynthRef.current) return;

        const frequency = Tone.Frequency(midiNote, "midi").toFrequency();
        polySynthRef.current.triggerRelease(frequency, Tone.now());
      }, 0);
    },
    [outputDevice],
  );

  return {
    playNote,
    stopNote,
  };
}
