import { INITIAL_LOADING_TIMEOUT } from "@/lib/constants";
import { HomePageClient } from "./home-page.client";

export default async function HomePage() {
  // Artificial delay to show the loading screen for visual polish
  await new Promise((r) => setTimeout(r, INITIAL_LOADING_TIMEOUT));

  return <HomePageClient />;
}
