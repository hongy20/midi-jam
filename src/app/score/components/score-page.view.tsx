"use client";

import { ChevronRight, Home, RotateCcw } from "lucide-react";

import { Button } from "@/shared/components/ui/8bit/button";
import { Table, TableBody, TableCell, TableRow } from "@/shared/components/ui/8bit/table";

interface ScorePageViewProps {
  title: string;
  score: string;
  combo: number;
  onRetry: () => void;
  onSongs: () => void;
  onHome: () => void;
}

export function ScorePageView({
  title,
  score,
  combo,
  onRetry,
  onSongs,
  onHome,
}: ScorePageViewProps) {
  return (
    <main className="bg-background flex h-dvh w-screen flex-col items-center justify-evenly overflow-hidden px-4 select-none">
      {/* Header / Title */}
      <div className="flex w-full max-w-2xl shrink-0 items-center justify-center">
        <h1 className="retro text-center text-2xl tracking-tighter uppercase md:text-3xl">
          {title}
        </h1>
      </div>

      {/* Stats Table Area */}
      <div className="flex w-full max-w-md flex-col items-center">
        <Table className="w-full">
          <TableBody>
            <TableRow>
              <TableCell className="text-xs uppercase opacity-60">Total Score</TableCell>
              <TableCell className="text-primary text-right text-2xl font-black">{score}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-b-0 text-xs uppercase opacity-60">Max Combo</TableCell>
              <TableCell className="border-b-0 text-right text-2xl font-black">{combo}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Footer Actions */}
      <footer className="jam-action-group">
        <Button variant="secondary" onClick={onHome} font="retro" className="btn-jam">
          <Home />
          Home
        </Button>
        <Button variant="secondary" onClick={onSongs} font="retro" className="btn-jam">
          <ChevronRight />
          Songs
        </Button>
        <Button onClick={onRetry} font="retro" className="btn-jam">
          <RotateCcw />
          RETRY
        </Button>
      </footer>
    </main>
  );
}
