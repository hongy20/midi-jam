"use client";

import { StageProvider } from "@/app/play/context/stage-context";
import { CollectionProvider } from "@/features/collection/context/collection-context";
import { useTrackSync } from "@/features/collection/hooks/use-track-sync";
import { TrackProvider } from "@/features/midi-assets/context/track-context";
import { GearProvider } from "@/features/midi-hardware/context/gear-context";
import { ScoreProvider } from "@/features/score/context/score-context";
import { OptionsProvider } from "@/features/settings/context/options-context";

/**
 * Child component that invokes coordinator hooks.
 * Needs to be a child of all providers.
 */
function Coordinator() {
  useTrackSync();
  return null;
}

/**
 * Bundles all granular providers into a single provider for the root layout.
 */
export function CombinedProvider({ children }: { children: React.ReactNode }) {
  return (
    <GearProvider>
      <OptionsProvider>
        <CollectionProvider>
          <TrackProvider>
            <StageProvider>
              <ScoreProvider>
                <Coordinator />
                {children}
              </ScoreProvider>
            </StageProvider>
          </TrackProvider>
        </CollectionProvider>
      </OptionsProvider>
    </GearProvider>
  );
}
