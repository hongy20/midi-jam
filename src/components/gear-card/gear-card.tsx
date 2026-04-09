import { Piano } from "lucide-react";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { cn } from "@/lib/utils";

interface GearCardProps extends React.ComponentPropsWithoutRef<"button"> {
  instrument: WebMidi.MIDIInput;
  isSelected: boolean;
}

const GearCard = React.forwardRef<HTMLButtonElement, GearCardProps>(
  ({ instrument, isSelected, onClick, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          "group relative outline-none focus-visible:ring-4 focus-visible:ring-foreground transition-all active:scale-95",
          className,
        )}
        {...props}
      >
        <Card
          className={cn(
            "h-full border-8 transition-colors",
            isSelected
              ? "border-primary bg-primary text-primary-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
              : "border-foreground/20 hover:border-foreground grayscale hover:grayscale-0",
          )}
        >
          <CardHeader className="p-6! flex flex-col items-center gap-4">
            <div
              className={cn(
                "size-20 flex items-center justify-center border-4",
                isSelected
                  ? "border-primary-foreground bg-primary-foreground/20"
                  : "border-foreground/20 bg-foreground/5",
              )}
            >
              <Piano
                className={cn(
                  "size-10",
                  isSelected ? "text-primary-foreground" : "text-foreground/40",
                )}
              />
            </div>
            <CardTitle className="retro text-center text-sm! leading-relaxed">
              {instrument.name || "Unknown Device"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6! pt-0!">
            <CardDescription
              className={cn(
                "retro text-center text-[8px] uppercase tracking-widest",
                isSelected
                  ? "text-primary-foreground/60"
                  : "text-foreground/40",
              )}
            >
              {instrument.manufacturer || "Generic MIDI Input"}
            </CardDescription>
          </CardContent>
        </Card>

        {isSelected && (
          <div className="absolute -top-3 -right-3 bg-foreground text-background retro text-[8px] px-2 py-1 border-4 border-foreground z-10">
            SELECTED
          </div>
        )}
      </button>
    );
  },
);
GearCard.displayName = "GearCard";

export { GearCard };
