import NotFound1 from "@/shared/components/ui/8bit/blocks/not-found1";

/**
 * Custom 404 page for Midi Jam.
 * Simplified Server Component that uses Next.js Link for navigation.
 */
export default function NotFound() {
  return (
    <main className="bg-background flex h-dvh w-screen items-center justify-center overflow-hidden p-4">
      <NotFound1
        title="LOST IN THE MIDI?"
        description="The track you're looking for was never composed or has been deleted."
        cta="RETURN HOME"
        href="/"
        className="border-foreground/10 bg-card max-w-2xl border-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]"
      />
    </main>
  );
}
