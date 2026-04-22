import { useMemo, useState } from "react";

interface UseMIDISelectionResult {
  selectedMIDIInput: WebMidi.MIDIInput | null;
  selectedMIDIOutput: WebMidi.MIDIOutput | null;
  selectMIDIInput: (input: WebMidi.MIDIInput | null) => void;
}

/**
 * A React hook that manages the currently selected MIDI input and its matching output device.
 * @param availableInputs - The list of currently available MIDI input devices.
 * @param availableOutputs - The list of currently available MIDI output devices.
 * @returns An object containing the selected input, selected output, and a function to select an input.
 */
export function useMIDISelection(
  availableInputs: WebMidi.MIDIInput[] = [],
  availableOutputs: WebMidi.MIDIOutput[] = [],
): UseMIDISelectionResult {
  const [selectedMIDIInput, setSelectedMIDIInput] = useState<WebMidi.MIDIInput | null>(null);

  const selectMIDIInput = (input: WebMidi.MIDIInput | null) => {
    setSelectedMIDIInput(input);
  };

  // 1. Derivative state: selectedMIDIOutput is purely based on selectedMIDIInput and availableOutputs
  const selectedMIDIOutput = useMemo(() => {
    if (!selectedMIDIInput) return null;
    return availableOutputs.find((out) => out.name === selectedMIDIInput.name) || null;
  }, [selectedMIDIInput, availableOutputs]);

  // 2. Adjusting state during render: auto-deselect if the selected device is no longer available.
  // This avoids the 'set-state-in-effect' warning and prevents a double-render when a device is disconnected.
  if (selectedMIDIInput) {
    const isAvailable = availableInputs.some((input) => input.id === selectedMIDIInput.id);
    if (!isAvailable) {
      setSelectedMIDIInput(null);
    }
  }

  return { selectedMIDIInput, selectedMIDIOutput, selectMIDIInput };
}
