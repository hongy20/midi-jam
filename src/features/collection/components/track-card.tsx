"use client";

import "@/shared/components/ui/8bit/styles/retro.css";

import { Music } from "lucide-react";

import { Badge } from "@/shared/components/ui/8bit/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/8bit/card";
import { cn } from "@/shared/lib/utils";
import type { Track } from "@/shared/types/track";

interface TrackCardProps {
  track: Track;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * A retro-styled card representing a music track in the library.
 */
export function TrackCard({ track, isSelected, onClick, className }: TrackCardProps) {
  return (
    <div className={cn("h-full p-2", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group focus-visible:ring-foreground relative h-full w-full text-left transition-all outline-none focus-visible:ring-4 active:scale-95",
          !onClick && "cursor-default active:scale-100",
        )}
      >
        <Card
          className={cn(
            "relative h-full border-8 transition-colors",
            isSelected
              ? "border-primary bg-primary text-primary-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
              : "border-foreground/10 hover:border-foreground/40",
          )}
        >
          <div className="absolute top-2 right-4 z-10">
            <Badge className={cn("text-[7px]", isSelected && "bg-primary-foreground text-primary")}>
              {track.difficulty.toUpperCase()}
            </Badge>
          </div>

          <CardHeader className="pb-2">
            <div
              className={cn(
                "retro mb-2 text-2xl",
                isSelected ? "text-primary-foreground" : "text-foreground",
              )}
            >
              <Music className="size-8" />
            </div>
            <CardTitle
              className={cn(
                "retro truncate text-sm",
                isSelected ? "text-primary-foreground" : "text-foreground",
              )}
            >
              {track.name.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription
              className={cn(
                "retro truncate text-[9px] leading-relaxed",
                isSelected ? "text-primary-foreground/70" : "text-muted-foreground",
              )}
            >
              BY {track.artist.toUpperCase()}
            </CardDescription>
          </CardContent>
        </Card>
      </button>
    </div>
  );
}
