import { getSoundTracks } from "@/features/collection";

import { HomePageClient } from "./components/home-page.client";
export default async function HomePage() {
  const tracks = await getSoundTracks(1000);

  return <HomePageClient songsCount={tracks.length} />;
}
