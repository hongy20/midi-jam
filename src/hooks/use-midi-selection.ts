import { useEffect, useState } from "react";

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
  const [selectedMIDIInput, setSelectedMIDIInput] =
    useState<WebMidi.MIDIInput | null>(null);
  const [selectedMIDIOutput, setSelectedMIDIOutput] =
    useState<WebMidi.MIDIOutput | null>(null);

  const selectMIDIInput = (input: WebMidi.MIDIInput | null) => {
    setSelectedMIDIInput(input);
  };

  // Handle selectedMIDIOutput matching
  useEffect(() => {
    if (!selectedMIDIInput) {
      setSelectedMIDIOutput(null);
      return;
    }

    // Try to find an output with the same name as the selected input
    const matchingOutput =
      availableOutputs.find((out) => out.name === selectedMIDIInput.name) ||
      null;
    setSelectedMIDIOutput(matchingOutput);
  }, [selectedMIDIInput, availableOutputs]);

  // Auto-deselect if the selected device is disconnected or no longer available
  useEffect(() => {
    if (selectedMIDIInput) {
      const isAvailable = availableInputs.some(
        (input) => input.id === selectedMIDIInput.id,
      );
      if (!isAvailable) {
        setSelectedMIDIInput(null);
      }
    }
  }, [selectedMIDIInput, availableInputs]);

  return { selectedMIDIInput, selectedMIDIOutput, selectMIDIInput };
}
