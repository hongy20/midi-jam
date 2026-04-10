import LoadingScreen from "@/components/ui/8bit/blocks/loading-screen";

const LOADING_TIPS = [
  "Tip: Play a note on your gear to quickly identify and select it.",
  "Tip: Ensure your MIDI devices are connected before opening this page.",
  "Did you know? MIDI Jam supports multiple simultaneous MIDI inputs.",
];

export default function GearLoading() {
  return (
    <main className="flex h-dvh items-center justify-center">
      <LoadingScreen progress={null} tips={LOADING_TIPS} />
    </main>
  );
}
