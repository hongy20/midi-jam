"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/8bit/card";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <main className="flex h-dvh items-center justify-center p-8">
      <Card className="border-destructive mx-auto max-w-md border-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
        <CardHeader>
          <CardTitle className="retro text-destructive">System Failure!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="retro text-foreground/70 text-[10px] leading-relaxed">
            {error.message || "An unexpected error occurred."}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
