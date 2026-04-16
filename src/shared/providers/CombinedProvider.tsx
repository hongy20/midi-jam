"use client";

import { useTrackSync } from "@/features/collection/hooks/use-track-sync";
import { CollectionProvider } from "@/features/collection/context/collection-context";
import { GearProvider } from "@/features/midi-hardware/context/gear-context";
import { OptionsProvider } from "@/features/settings/context/options-context";
import { ScoreProvider } from "@/features/score/context/score-context";
import { StageProvider } from "@/app/play/context/stage-context";
import { TrackProvider } from "@/features/midi-assets/context/track-context";

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
