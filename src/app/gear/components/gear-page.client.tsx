"use client";

import { use, useEffect } from "react";
import { useGear } from "@/features/midi-hardware/context/gear-context";
import { useNavigation } from "@/features/navigation/hooks/use-navigation";
import { GearPageView } from "./gear-page.view";

export function GearPageClient() {
  const { toCollection, toHome } = useNavigation();
  const { selectMIDIInput, selectedMIDIInput, inputs, accessPromise } =
    useGear();

  // Suspends here until MIDI access is granted or errors out to error.tsx
  use(accessPromise);

  useEffect(() => {
    // Attach listener to all inputs to detect activity and auto-select
    const handlers = new Map<string, (e: Event) => void>();

    inputs.forEach((input) => {
      const handler = () => {
        selectMIDIInput(input);
      };
      input.addEventListener("midimessage", handler);
      handlers.set(input.id, handler);
    });

    return () => {
      inputs.forEach((input) => {
        const handler = handlers.get(input.id);
        if (handler) {
          input.removeEventListener("midimessage", handler);
        }
      });
    };
  }, [inputs, selectMIDIInput]);

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
