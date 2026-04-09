import LoadingScreen from "@/components/8bit/loading-screen";
import { INITIAL_LOADING_TIMEOUT } from "@/lib/constants";

const LOADING_TIPS = [
  "Tip: Connect your MIDI keyboard before starting for the best experience.",
  "Tip: Use the Gear menu to configure your MIDI inputs and instruments.",
  "Tip: Lower your buffer size in Options if you experience audio latency.",
  "Did you know? You can play along with any MIDI song in your collection.",
  "Tip: Use the sustain pedal for more expressive piano performances.",
];

export default function HomeLoading() {
  return (
    <main className="flex items-center justify-center">
      <LoadingScreen
        autoProgress
        autoProgressDuration={INITIAL_LOADING_TIMEOUT}
        tips={LOADING_TIPS}
      />
    </main>
  );
}
