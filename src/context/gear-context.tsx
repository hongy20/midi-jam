"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMIDIDevices } from "@/hooks/use-midi-devices";
import { useMIDISelection } from "@/hooks/use-midi-selection";

export interface GearContextType {
  inputs: WebMidi.MIDIInput[];
  outputs: WebMidi.MIDIOutput[];
  selectedMIDIInput: WebMidi.MIDIInput | null;
  selectedMIDIOutput: WebMidi.MIDIOutput | null;
  selectMIDIInput: (input: WebMidi.MIDIInput | null) => void;
  selectMIDIOutput: (output: WebMidi.MIDIOutput | null) => void;
  isLoading: boolean;
  error: string | null;
}

const GearContext = createContext<GearContextType | undefined>(undefined);

export function GearProvider({ children }: { children: ReactNode }) {
  const { inputs, outputs, isLoading, error } = useMIDIDevices();
  const { selectedMIDIInput, selectedMIDIOutput, selectMIDIInput } =
    useMIDISelection(inputs, outputs);

  const value: GearContextType = useMemo(
    () => ({
      inputs,
      outputs,
      selectedMIDIInput,
      selectedMIDIOutput,
      selectMIDIInput,
      selectMIDIOutput: () => {}, // TODO: Implement if needed, current app-context has it as empty
      isLoading,
      error,
    }),
    [
      inputs,
      outputs,
      selectedMIDIInput,
      selectedMIDIOutput,
      selectMIDIInput,
      isLoading,
      error,
    ],
  );

  return <GearContext.Provider value={value}>{children}</GearContext.Provider>;
}

export function useGear() {
  const context = useContext(GearContext);
  if (context === undefined) {
    throw new Error("useGear must be used within a GearProvider");
  }
  return context;
}
