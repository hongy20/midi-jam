"use client";

import { useEffect } from "react";
import { useGear } from "@/context/gear-context";
import { useNavigation } from "@/hooks/use-navigation";
import GearLoading from "../loading";
import { GearPageView } from "./gear-page.view";

export function GearPageClient() {
  const { toCollection, toHome } = useNavigation();
  const { selectMIDIInput, selectedMIDIInput, inputs, isLoading, error } =
    useGear();

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

  if (error) {
    throw new Error(error);
  }

  if (isLoading) {
    return <GearLoading />;
  }

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
