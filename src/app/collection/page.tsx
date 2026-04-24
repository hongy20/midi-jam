import { getSongTracks } from "@/features/collection";

import { CollectionPageClient } from "./components/collection-page.client";

export const metadata = {
  title: "Collection | MIDI Jam",
  description: "Select a song from your collection to play",
};

export default function CollectionPage() {
  const tracksPromise = getSongTracks(800);

  return <CollectionPageClient tracksPromise={tracksPromise} />;
}
