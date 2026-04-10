"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import { useMIDIDevices } from "@/hooks/use-midi-devices";
import { useMIDISelection } from "@/hooks/use-midi-selection";

export interface GearContextType {
  inputs: WebMidi.MIDIInput[];
  outputs: WebMidi.MIDIOutput[];
  selectedMIDIInput: WebMidi.MIDIInput | null;
  selectedMIDIOutput: WebMidi.MIDIOutput | null;
  selectMIDIInput: (input: WebMidi.MIDIInput | null) => void;
  selectMIDIOutput: (output: WebMidi.MIDIOutput | null) => void;
  accessPromise: Promise<WebMidi.MIDIAccess>;
}

const GearContext = createContext<GearContextType | undefined>(undefined);

export function GearProvider({ children }: { children: ReactNode }) {
  const { inputs, outputs, accessPromise } = useMIDIDevices();
  const { selectedMIDIInput, selectedMIDIOutput, selectMIDIInput } =
    useMIDISelection(inputs, outputs);

  const value: GearContextType = useMemo(
    () => ({
      inputs,
      outputs,
      selectedMIDIInput,
      selectedMIDIOutput,
      selectMIDIInput,
      selectMIDIOutput: () => {}, // TODO: Implement if needed
      accessPromise,
    }),
    [
      inputs,
      outputs,
      selectedMIDIInput,
      selectedMIDIOutput,
      selectMIDIInput,
      accessPromise,
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
