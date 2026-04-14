import { useCallback, useEffect, useRef } from "react";
import * as Tone from "tone";
import {
  MIDI_COMMAND_NOTE_OFF,
  MIDI_COMMAND_NOTE_ON,
} from "@/lib/midi/constant";

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

      // REMOVED setTimeout(0) for diagnostic clarity
      if (!polySynthRef.current) return;

      // Ensure AudioContext is started
      if (Tone.getContext().state !== "running") {
        Tone.start();
      }

      console.log(`[AUDIO] TRIGGER_ON pitch=${midiNote} vel=${velocity}`);
      const frequency = Tone.Frequency(midiNote, "midi").toFrequency();
      polySynthRef.current.triggerAttack(frequency, Tone.now(), velocity);
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
      // REMOVED setTimeout(0)
      if (!polySynthRef.current) return;

      console.log(`[AUDIO] TRIGGER_OFF pitch=${midiNote}`);
      const frequency = Tone.Frequency(midiNote, "midi").toFrequency();
      polySynthRef.current.triggerRelease(frequency, Tone.now());
    },
    [outputDevice],
  );

  return {
    playNote,
    stopNote,
  };
}
