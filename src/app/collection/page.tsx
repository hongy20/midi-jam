import { getTracks } from "@/features/collection";

import { CollectionPageClient } from "./components/collection-page.client";

export const metadata = {
  title: "Collection | MIDI Jam",
  description: "Select a song from your collection to play",
};

export default function CollectionPage() {
  const tracksPromise = getTracks(800);

  return <CollectionPageClient tracksPromise={tracksPromise} />;
}
