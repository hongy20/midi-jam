import { useCallback, useEffect, useState } from "react";
import { requestMIDIAccess } from "@/lib/midi/midi-access";
import { getMIDIInputs, onMIDIDevicesChange } from "@/lib/midi/midi-devices";

interface UseMIDIInputsResult {
  inputs: WebMidi.MIDIInput[];
  isLoading: boolean;
  error: string | null;
}

/**
 * A React hook that manages MIDI input device discovery and connection.
 * @returns An object containing the list of available inputs, loading state, and any error.
 */
export function useMIDIInputs(): UseMIDIInputsResult {
  const [inputs, setInputs] = useState<WebMidi.MIDIInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);

  const updateInputs = useCallback((access: WebMidi.MIDIAccess) => {
    setInputs(getMIDIInputs(access));
  }, []);

  useEffect(() => {
    let mounted = true;

    async function setupMIDI() {
      try {
        const access = await requestMIDIAccess();
        if (!mounted) return;

        setMidiAccess(access);
        updateInputs(access);
        setIsLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : String(err));
        setIsLoading(false);
      }
    }

    setupMIDI();

    return () => {
      mounted = false;
    };
  }, [updateInputs]);

  useEffect(() => {
    if (!midiAccess) return;

    const handleDevicesChange = () => {
      updateInputs(midiAccess);
    };

    const unsubscribe = onMIDIDevicesChange(midiAccess, handleDevicesChange);
    return unsubscribe;
  }, [midiAccess, updateInputs]);

  return { inputs, isLoading, error };
}
