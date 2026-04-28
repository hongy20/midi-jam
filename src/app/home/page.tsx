import { getCollection } from "@/features/collection";

import { HomePageClient } from "./components/home-page.client";

export default function HomePage() {
  const tracksPromise = getCollection(1000);

  return <HomePageClient tracksPromise={tracksPromise} />;
}
