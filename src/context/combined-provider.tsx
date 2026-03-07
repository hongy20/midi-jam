"use client";

import { useTrackSync } from "@/hooks/use-track-sync";
import { CollectionProvider } from "./collection-context";
import { GearProvider } from "./gear-context";
import { HomeProvider } from "./home-context";
import { OptionsProvider } from "./options-context";
import { ScoreProvider } from "./score-context";
import { StageProvider } from "./stage-context";
import { TrackProvider } from "./track-context";

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
    <HomeProvider>
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
    </HomeProvider>
  );
}
