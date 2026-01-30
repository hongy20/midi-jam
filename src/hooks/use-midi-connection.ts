import { useState } from "react";

interface UseMIDIConnectionResult {
  selectedDevice: WebMidi.MIDIInput | null;
  selectDevice: (device: WebMidi.MIDIInput | null) => void;
}

/**
 * A React hook that manages the currently selected MIDI input device.
 * @returns An object containing the selected device and a function to select a device.
 */
export function useMIDIConnection(): UseMIDIConnectionResult {
  const [selectedDevice, setSelectedDevice] =
    useState<WebMidi.MIDIInput | null>(null);

  const selectDevice = (device: WebMidi.MIDIInput | null) => {
    setSelectedDevice(device);
  };

  return { selectedDevice, selectDevice };
}
