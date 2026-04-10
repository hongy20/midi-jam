import { GearPageClient } from "./components/gear-page.client";

export const metadata = {
  title: "Gear | MIDI Jam",
  description: "Configure your MIDI gear and instruments",
};

export default function GearPage() {
  return <GearPageClient />;
}
