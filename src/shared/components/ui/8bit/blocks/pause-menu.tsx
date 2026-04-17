import { Play, Power, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/shared/components/ui/8bit/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/8bit/card";
import { cn } from "@/shared/lib/utils";

interface PauseMenuProps extends React.ComponentProps<"div"> {
  onContinue?: () => void;
  onRestart?: () => void;
  onOptions?: () => void;
  onQuit?: () => void;
}

export default function PauseMenu({
  className,
  onContinue,
  onRestart,
  onOptions,
  onQuit,
  ...props
}: PauseMenuProps) {
  const menuItems = [
    {
      label: "CONTINUE",
      icon: Play,
      action: onContinue,
      variant: "default" as const,
    },
    {
      label: "RESTART",
      icon: RotateCcw,
      action: onRestart,
      variant: "secondary" as const,
    },
    {
      label: "OPTIONS",
      icon: Settings,
      action: onOptions,
      variant: "secondary" as const,
    },
    {
      label: "QUIT",
      icon: Power,
      action: onQuit,
      variant: "secondary" as const,
      className: "text-destructive hover:border-destructive hover:bg-destructive/5",
    },
  ];

  return (
    <Card
      className={cn("w-full max-w-sm [@media(max-height:450px)]:max-w-2xl", className)}
      {...props}
    >
      <CardHeader className="flex flex-col items-center justify-center pt-8 pb-4">
        <CardTitle font="retro" className="text-xl">
          PAUSED
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <div
          className={cn(
            "grid grid-cols-1 gap-4 w-full",
            "[@media(max-height:450px)]:grid-cols-2 [@media(max-height:450px)]:grid-rows-2 [@media(max-height:450px)]:gap-6 [@media(max-height:450px)]:p-2",
          )}
        >
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={item.variant}
              onClick={item.action}
              className={cn("btn-jam", item.className)}
              font="retro"
            >
              <item.icon className="size-5" />
              <span className="text-xs uppercase tracking-widest">{item.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
