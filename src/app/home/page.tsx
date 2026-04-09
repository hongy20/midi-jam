import { getSoundTracks } from "@/lib/action/sound-track";
import { HomePageClient } from "./components/home-page.client";
import { INITIAL_LOADING_TIMEOUT } from "./lib/constants";

export default async function HomePage() {
  const tracks = await getSoundTracks(INITIAL_LOADING_TIMEOUT);

  return <HomePageClient songsCount={tracks.length} />;
}
