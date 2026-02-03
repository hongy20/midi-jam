import { useCallback, useEffect, useState } from "react";
import { requestMIDIAccess } from "@/lib/midi/midi-access";
import {
  getMIDIInputs,
  getMIDIOutputs,
  onMIDIDevicesChange,
} from "@/lib/midi/midi-devices";

interface UseMIDIInputsResult {
  inputs: WebMidi.MIDIInput[];
  outputs: WebMidi.MIDIOutput[];
  isLoading: boolean;
  error: string | null;
}

/**
 * A React hook that manages MIDI input and output device discovery and connection.
 * @returns An object containing the list of available inputs, outputs, loading state, and any error.
 */
export function useMIDIInputs(): UseMIDIInputsResult {
  const [inputs, setInputs] = useState<WebMidi.MIDIInput[]>([]);
  const [outputs, setOutputs] = useState<WebMidi.MIDIOutput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);

  const updateDevices = useCallback((access: WebMidi.MIDIAccess) => {
    setInputs(getMIDIInputs(access));
    setOutputs(getMIDIOutputs(access));
  }, []);

  useEffect(() => {
    let mounted = true;

    async function setupMIDI() {
      try {
        const access = await requestMIDIAccess();
        if (!mounted) return;

        setMidiAccess(access);
        updateDevices(access);
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
  }, [updateDevices]);

  useEffect(() => {
    if (!midiAccess) return;

    const handleDevicesChange = () => {
      updateDevices(midiAccess);
    };

    const unsubscribe = onMIDIDevicesChange(midiAccess, handleDevicesChange);
    return unsubscribe;
  }, [midiAccess, updateDevices]);

  return { inputs, outputs, isLoading, error };
}
