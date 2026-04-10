import { getSoundTracks } from "@/lib/action/sound-track";
import { CollectionPageClient } from "./components/collection-page.client";

export const metadata = {
  title: "Collection | MIDI Jam",
  description: "Select a song from your collection to play",
};

export default async function CollectionPage() {
  const tracks = await getSoundTracks(800);
  return <CollectionPageClient tracks={tracks} />;
}
