import { INITIAL_LOADING_TIMEOUT } from "@/lib/constants";
import { WelcomePageContainer } from "./welcome-page.container";

export default async function WelcomePage() {
  // Artificial delay to show the loading screen for visual polish
  await new Promise((r) => setTimeout(r, INITIAL_LOADING_TIMEOUT));

  return <WelcomePageContainer />;
}
