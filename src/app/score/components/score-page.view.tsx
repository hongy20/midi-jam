"use client";

import { ChevronRight, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

interface ScorePageViewProps {
  title: string;
  score: string;
  accuracy: string;
  combo: number;
  onRetry: () => void;
  onSongs: () => void;
  onHome: () => void;
}

export function ScorePageView({
  title,
  score,
  accuracy,
  combo,
  onRetry,
  onSongs,
  onHome,
}: ScorePageViewProps) {
  return (
    <main className="h-dvh w-screen flex flex-col items-center justify-evenly px-4 bg-background overflow-hidden select-none">
      {/* Header / Title */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-4 shrink-0">
        <h1 className="retro text-3xl md:text-5xl font-black bg-foreground text-background px-6 py-4 border-8 border-foreground dark:border-ring uppercase leading-tight text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
          {title}
        </h1>
      </div>

      {/* Stats Cards Area */}
      <div className="w-full max-w-xl flex flex-col gap-6 overflow-y-auto no-scrollbar py-4">
        {/* Total Score Card */}
        <Card className="border-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
          <CardHeader className="pb-1">
            <CardTitle font="retro" className="text-sm opacity-60 uppercase">
              Total Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="retro text-4xl md:text-5xl font-black tracking-widest text-primary">
              {score}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Stats Row */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
            <CardHeader className="pb-1">
              <CardTitle font="retro" className="text-xs opacity-60 uppercase">
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="retro text-2xl md:text-3xl font-black">
                {accuracy}
              </div>
            </CardContent>
          </Card>

          <Card className="border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
            <CardHeader className="pb-1">
              <CardTitle font="retro" className="text-xs opacity-60 uppercase">
                Max Combo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="retro text-2xl md:text-3xl font-black">
                {combo}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0 px-4 sm:px-0">
        <Button
          variant="secondary"
          onClick={onHome}
          size="sm"
          font="retro"
          className="w-full"
        >
          <Home className="size-4 mr-2" />
          Home
        </Button>
        <Button
          variant="secondary"
          onClick={onSongs}
          size="sm"
          font="retro"
          className="w-full"
        >
          Songs
          <ChevronRight className="size-4 ml-2" />
        </Button>
        <Button onClick={onRetry} size="sm" font="retro" className="w-full">
          RETRY
          <RotateCcw className="size-4 ml-2" />
        </Button>
      </footer>
    </main>
  );
}
