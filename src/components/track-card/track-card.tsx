import * as React from "react";
import { Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";
import { cn } from "@/lib/utils";

export interface CollectionTrack {
  id: string;
  name: string;
  artist: string;
  difficulty: string;
  url: string;
}

interface TrackCardProps extends React.ComponentPropsWithoutRef<"button"> {
  track: CollectionTrack;
  isSelected: boolean;
}

const TrackCard = React.forwardRef<HTMLButtonElement, TrackCardProps>(
  ({ track, isSelected, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "group relative outline-none focus-visible:ring-4 focus-visible:ring-foreground transition-all active:scale-95",
          className
        )}
        {...props}
      >
        <Card
          className={cn(
            "h-full border-8 transition-all overflow-hidden",
            isSelected 
              ? "border-primary bg-primary text-primary-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]" 
              : "border-foreground/20 hover:border-foreground"
          )}
        >
          <div className="flex flex-col h-full">
            <CardHeader className="p-4! pb-2! flex-row gap-4 items-center">
              <div className={cn(
                "size-12 flex items-center justify-center border-4 shrink-0",
                isSelected ? "border-primary-foreground bg-primary-foreground/20" : "border-foreground/20 bg-foreground/5"
              )}>
                <Play className={cn("size-6", isSelected ? "text-primary-foreground fill-current" : "text-foreground/40")} />
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <CardTitle className="retro text-[10px] leading-relaxed truncate uppercase">
                  {track.name}
                </CardTitle>
                <CardDescription className={cn(
                  "retro text-[8px] uppercase opacity-60 truncate mt-1",
                   isSelected ? "text-primary-foreground/60" : "text-foreground/40"
                )}>
                  {track.artist}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4! pt-0! mt-auto flex justify-end">
               <Badge 
                 variant={isSelected ? "secondary" : "default"} 
                 font="retro"
                 className={cn(
                   "text-[8px] uppercase px-2 py-0.5",
                   isSelected ? "bg-primary-foreground text-primary border-none" : ""
                 )}
               >
                 {track.difficulty}
               </Badge>
            </CardContent>
          </div>
        </Card>
      </button>
    );
  }
);
TrackCard.displayName = "TrackCard";

export { TrackCard };
