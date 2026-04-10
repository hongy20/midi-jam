"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

export default function GearError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex h-dvh items-center justify-center p-8">
      <Card className="mx-auto max-w-md border-8 border-destructive shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
        <CardHeader>
          <CardTitle className="retro text-destructive">
            Gear Failure detected!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="retro text-[10px] leading-relaxed text-foreground/70">
            {error.message}
          </p>
          <button
            type="button"
            className="retro cursor-pointer bg-foreground p-2 text-background transition-opacity hover:opacity-80"
            onClick={() => reset()}
          >
            RESET DEVICES
          </button>
        </CardContent>
      </Card>
    </main>
  );
}
