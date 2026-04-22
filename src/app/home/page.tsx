import { Suspense } from "react";

import { getSoundTracks } from "@/features/collection";
import LoadingScreen from "@/shared/components/ui/8bit/blocks/loading-screen";

import { HomePageClient } from "./components/home-page.client";

export default function HomePage() {
  const tracksPromise = getSoundTracks(1000);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomePageClient tracksPromise={tracksPromise} />
    </Suspense>
  );
}
