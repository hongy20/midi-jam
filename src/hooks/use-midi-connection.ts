import { useEffect, useState } from "react";

interface UseMIDIConnectionResult {
  selectedDevice: WebMidi.MIDIInput | null;
  selectedOutput: WebMidi.MIDIOutput | null;
  selectDevice: (device: WebMidi.MIDIInput | null) => void;
}

/**
 * A React hook that manages the currently selected MIDI input and its matching output device.
 * @param availableInputs - The list of currently available MIDI input devices.
 * @param availableOutputs - The list of currently available MIDI output devices.
 * @returns An object containing the selected device, selected output, and a function to select a device.
 */
export function useMIDIConnection(
  availableInputs: WebMidi.MIDIInput[] = [],
  availableOutputs: WebMidi.MIDIOutput[] = [],
): UseMIDIConnectionResult {
  const [selectedDevice, setSelectedDevice] =
    useState<WebMidi.MIDIInput | null>(null);
  const [selectedOutput, setSelectedOutput] =
    useState<WebMidi.MIDIOutput | null>(null);

  const selectDevice = (device: WebMidi.MIDIInput | null) => {
    setSelectedDevice(device);
  };

  // Auto-select if there is only one device available and no device is selected
  useEffect(() => {
    if (selectedDevice === null && availableInputs.length === 1) {
      setSelectedDevice(availableInputs[0]);
    }
  }, [availableInputs, selectedDevice]);

  // Handle selectedOutput matching
  useEffect(() => {
    if (!selectedDevice) {
      setSelectedOutput(null);
      return;
    }

    // Try to find an output with the same name as the selected input
    const matchingOutput =
      availableOutputs.find((out) => out.name === selectedDevice.name) || null;
    setSelectedOutput(matchingOutput);
  }, [selectedDevice, availableOutputs]);

  // Auto-deselect if the selected device is disconnected or no longer available
  useEffect(() => {
    if (selectedDevice) {
      const isAvailable = availableInputs.some(
        (input) => input.id === selectedDevice.id,
      );
      if (!isAvailable) {
        setSelectedDevice(null);
      }
    }
  }, [selectedDevice, availableInputs]);

  return { selectedDevice, selectedOutput, selectDevice };
}
