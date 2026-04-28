import { getTracks } from "@/features/collection";

import { HomePageClient } from "./components/home-page.client";

export default function HomePage() {
  const tracksPromise = getTracks(1000);

  return <HomePageClient tracksPromise={tracksPromise} />;
}
