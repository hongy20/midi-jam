"use client";

import { use } from "react";

import { useAutoSelection, useGear } from "@/features/midi-hardware";
import { useNavigation } from "@/shared/hooks/use-navigation";

import { GearPageView } from "./gear-page.view";

export function GearPageClient() {
  const { toCollection, toHome } = useNavigation();
  const { selectMIDIInput, selectedMIDIInput, inputs, accessPromise } = useGear();

  // Only suspend on the client. On the server, we render the shell.
  if (typeof window !== "undefined") {
    use(accessPromise);
  }

  useAutoSelection(inputs, selectMIDIInput);

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
