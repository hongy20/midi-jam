import { getSoundTracks } from "@/features/collection";

import { HomePageClient } from "./components/home-page.client";

export default function HomePage() {
  const tracksPromise = getSoundTracks(1000);

  return <HomePageClient tracksPromise={tracksPromise} />;
}
