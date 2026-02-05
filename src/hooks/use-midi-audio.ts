import { useCallback, useEffect, useRef } from "react";
import * as Tone from "tone";
import {
  MIDI_COMMAND_CONTROL_CHANGE,
  MIDI_COMMAND_NOTE_OFF,
  MIDI_COMMAND_NOTE_ON,
  MIDI_CONTROLLER_ALL_NOTES_OFF,
} from "@/lib/midi/constant";

/**
 * Hook to handle MIDI audio synthesis using Tone.js or external MIDI output.
 */
export function useMidiAudio(
  demoMode = true,
  outputDevice: WebMidi.MIDIOutput | null = null,
) {
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
      polySynth.dispose();
    };
  }, []);

  const playNote = useCallback(
    (midiNote: number, velocity: number) => {
      if (!demoMode) return;

      if (outputDevice) {
        // Send Note On to MIDI Output
        // Velocity is normalized 0-1, MIDI needs 0-127
        const midiVelocity = Math.floor(velocity * 127);
        outputDevice.send([MIDI_COMMAND_NOTE_ON, midiNote, midiVelocity]);
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
        // Send Note Off to MIDI Output
        outputDevice.send([MIDI_COMMAND_NOTE_OFF, midiNote, 0]);
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
      // Send All Notes Off to MIDI Output
      outputDevice.send([
        MIDI_COMMAND_CONTROL_CHANGE,
        MIDI_CONTROLLER_ALL_NOTES_OFF,
        0,
      ]);
      return;
    }

    if (!polySynthRef.current) return;
    polySynthRef.current.releaseAll();
  }, [outputDevice]);

  const playCountdownBeep = useCallback((isFinal = false) => {
    // Ensure AudioContext is started
    if (Tone.getContext().state !== "running") {
      Tone.start();
    }

    const synth = new Tone.MembraneSynth({
      volume: -12,
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0.01,
        release: 1,
      },
    }).toDestination();

    const note = isFinal ? "C5" : "C4";
    synth.triggerAttackRelease(note, "8n");

    // Dispose after play to avoid memory leaks
    setTimeout(() => synth.dispose(), 1000);
  }, []);

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
    playCountdownBeep,
  };
}
