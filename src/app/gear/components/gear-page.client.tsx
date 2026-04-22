"use client";

import { use } from "react";

import { useGear, useMIDIAutoSelect } from "@/features/midi-hardware";
import { useNavigation } from "@/shared/hooks/use-navigation";

import { GearPageView } from "./gear-page.view";

export function GearPageClient() {
  const { toCollection, toHome } = useNavigation();
  const { selectMIDIInput, selectedMIDIInput, inputs, accessPromise } = useGear();

  // Suspends here until MIDI access is granted or errors out to error.tsx
  use(accessPromise);

  useMIDIAutoSelect(inputs, selectMIDIInput);

  return (
    <GearPageView
      inputs={inputs}
      selectedMIDIInput={selectedMIDIInput}
      onSelect={selectMIDIInput}
      onContinue={toCollection}
      onBack={toHome}
    />
  );
}
