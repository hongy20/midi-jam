"use client";

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

import "@/shared/components/ui/8bit/styles/retro.css";

export interface SongCardTrack {
  id: string;
  name: string;
  artist: string;
  difficulty: string;
  url: string;
}

interface SongCardProps {
  track: SongCardTrack;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SongCard({ track, isSelected, onClick, className }: SongCardProps) {
  return (
    <div className={cn("h-full p-2", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group relative h-full w-full text-left outline-none focus-visible:ring-4 focus-visible:ring-foreground transition-all active:scale-95",
          !onClick && "cursor-default active:scale-100",
        )}
      >
        <Card
          className={cn(
            "relative h-full transition-colors border-8",
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
                "retro text-sm truncate",
                isSelected ? "text-primary-foreground" : "text-foreground",
              )}
            >
              {track.name.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription
              className={cn(
                "retro text-[9px] leading-relaxed truncate",
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
