"use client";

import { ChevronRight, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/8bit/table";

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
      <div className="w-full max-w-2xl flex items-center justify-center shrink-0">
        <h1 className="retro text-2xl md:text-3xl tracking-tighter uppercase text-center">
          {title}
        </h1>
      </div>

      {/* Stats Table Area */}
      <div className="w-full max-w-md flex flex-col items-center py-4">
        <Table className="w-full">
          <TableBody>
            <TableRow>
              <TableCell className="opacity-60 uppercase text-xs">
                Total Score
              </TableCell>
              <TableCell className="text-right text-2xl font-black text-primary">
                {score}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="opacity-60 uppercase text-xs">
                Accuracy
              </TableCell>
              <TableCell className="text-right text-2xl font-black">
                {accuracy}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="opacity-60 uppercase text-xs border-b-0">
                Max Combo
              </TableCell>
              <TableCell className="text-right text-2xl font-black border-b-0">
                {combo}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Footer Actions */}
      <footer className="w-full flex flex-wrap items-center justify-center gap-4 shrink-0 px-4 sm:px-0">
        <Button
          variant="secondary"
          onClick={onHome}
          size="sm"
          font="retro"
          className="w-48"
        >
          <Home className="size-4 mr-2" />
          Home
        </Button>
        <Button
          variant="secondary"
          onClick={onSongs}
          size="sm"
          font="retro"
          className="w-48"
        >
          Songs
          <ChevronRight className="size-4 ml-2" />
        </Button>
        <Button onClick={onRetry} size="sm" font="retro" className="w-48">
          RETRY
          <RotateCcw className="size-4 ml-2" />
        </Button>
      </footer>
    </main>
  );
}
