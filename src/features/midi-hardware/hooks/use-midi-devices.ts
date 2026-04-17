import { useCallback, useEffect, useState } from "react";
import { requestMIDIAccess } from "../lib/midi-access";
import {
  getMIDIInputDevices,
  getMIDIOutputDevices,
  onMIDIDevicesStateChange,
} from "../lib/midi-devices";

interface UseMIDIDevicesResult {
  inputs: WebMidi.MIDIInput[];
  outputs: WebMidi.MIDIOutput[];
  accessPromise: Promise<WebMidi.MIDIAccess>;
}

/**
 * A React hook that manages MIDI input and output device discovery and connection.
 * @returns An object containing the list of available inputs, outputs, and the MIDI access promise.
 */
export function useMIDIDevices(): UseMIDIDevicesResult {
  const [accessPromise] = useState(() => requestMIDIAccess());
  const [inputs, setInputs] = useState<WebMidi.MIDIInput[]>([]);
  const [outputs, setOutputs] = useState<WebMidi.MIDIOutput[]>([]);

  const updateDevices = useCallback((access: WebMidi.MIDIAccess) => {
    setInputs(getMIDIInputDevices(access));
    setOutputs(getMIDIOutputDevices(access));
  }, []);

  useEffect(() => {
    let mounted = true;

    accessPromise
      .then((access) => {
        if (!mounted) return;
        updateDevices(access);

        const unsubscribe = onMIDIDevicesStateChange(access, () => {
          if (!mounted) return;
          updateDevices(access);
        });

        return () => {
          unsubscribe();
        };
      })
      .catch(() => {
        // Error is handled by the promise itself when consumed via React.use()
      });

    return () => {
      mounted = false;
    };
  }, [accessPromise, updateDevices]);

  return { inputs, outputs, accessPromise };
}
