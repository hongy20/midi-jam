import LoadingScreen from "@/components/ui/8bit/blocks/loading-screen";

const LOADING_TIPS = [
  "Tip: Connect your MIDI keyboard before starting for the best experience.",
  "Tip: Use the Gear menu to configure your MIDI inputs and instruments.",
  "Did you know? You can play along with any MIDI song in your collection.",
];

export default function HomeLoading() {
  return (
    <main className="flex h-dvh items-center justify-center">
      <LoadingScreen progress={null} tips={LOADING_TIPS} />
    </main>
  );
}
