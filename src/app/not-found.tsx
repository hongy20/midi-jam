"use client";

import NotFound1 from "@/components/ui/8bit/blocks/not-found1";
import { useNavigation } from "@/hooks/use-navigation";

/**
 * Custom 404 page for Midi Jam.
 * Uses the 8bitcn not-found1 block with project-specific styling and navigation.
 */
export default function NotFound() {
  const { toHome } = useNavigation();

  return (
    <main className="h-dvh w-screen flex items-center justify-center bg-background overflow-hidden p-4">
      <NotFound1
        title="LOST IN THE MIDI?"
        description="The track you're looking for was never composed or has been deleted."
        cta="RETURN HOME"
        onAction={toHome}
        imageSrc="/images/404.png"
        className="max-w-2xl border-8 border-foreground/10 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] bg-card"
      />
    </main>
  );
}
