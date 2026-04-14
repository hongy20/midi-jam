import { cva } from "class-variance-authority";
import Image from "next/image";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/8bit/alert";
import { Card, CardContent } from "@/components/ui/8bit/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/8bit/item";
import { cn } from "@/lib/utils";

const rarityVariants = cva("", {
  variants: {
    status: {
      common: "text-muted-foreground",
      rare: "text-blue-600",
      epic: "text-purple-600",
      legendary: "text-yellow-500",
      mythic: "text-rose-600",
    },
  },
  defaultVariants: {
    status: "common",
  },
});

export interface VictoryScreenItems {
  id: number;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  icon?: string;
}

export interface VictoryScreenBattleReport {
  id: number;
  title: string;
  description: string | number;
}
export interface VictoryScreenStats {
  id: number;
  title: string;
  stats: number | string;
}
export interface VictoryScreenProps
  extends React.ComponentPropsWithoutRef<"div"> {
  title?: string;
  itemsObtained?: VictoryScreenItems[];
  battleReport?: VictoryScreenBattleReport[];
  stats?: VictoryScreenStats[];
  className?: string;
  showItemIcon?: boolean;
}
function VictoryScreen({
  className,
  title = "VICTORY!",
  itemsObtained,
  stats,
  battleReport,
  showItemIcon = true,
  ...props
}: VictoryScreenProps) {
  return (
    <Card
      data-slot="victoryscreen"
      className={cn(
        "w-full h-full max-w-4xl max-h-[90dvh] flex flex-col overflow-hidden dark:bg-blue-950/10",
        className,
      )}
      {...props}
    >
      <CardContent className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="retro text-3xl md:text-5xl font-black bg-foreground text-background px-6 py-4 border-8 border-foreground dark:border-ring uppercase leading-tight select-none text-center">
            {title}
          </h1>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-around flex-wrap gap-4">
          {stats?.map((stat) => (
            <Alert
              key={stat.id}
              className="w-full md:w-auto md:flex-1 p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
            >
              <AlertTitle className="text-center text-sm md:text-md uppercase opacity-70">
                {stat.title}
              </AlertTitle>
              <AlertDescription className="text-2xl md:text-3xl font-black flex justify-center items-center mt-2 retro">
                {stat.stats}
              </AlertDescription>
            </Alert>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {itemsObtained && itemsObtained.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold uppercase tracking-wider">
                Items Obtained
              </h2>
              <ItemGroup className="w-full">
                {itemsObtained?.map((item, index) => (
                  <div key={item.id}>
                    <Item variant="outline" className="dark:bg-blue-950/50 p-2">
                      <ItemContent className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {showItemIcon && item.icon && (
                            <Image
                              src={item.icon}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="size-10 object-contain rounded-full"
                            />
                          )}
                          <ItemTitle className="leading-tight retro text-sm">
                            {item.name}
                          </ItemTitle>
                        </div>
                        <ItemDescription
                          className={cn(
                            "text-xs font-bold uppercase",
                            rarityVariants({ status: item.rarity }),
                          )}
                        >
                          {item.rarity}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                    {index < itemsObtained.length - 1 && <ItemSeparator />}
                  </div>
                ))}
              </ItemGroup>
            </div>
          )}

          {battleReport && battleReport.length > 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold uppercase tracking-wider">
                Performance
              </h2>
              <ItemGroup className="w-full">
                {battleReport?.map((report, index) => (
                  <div key={report.id}>
                    <Item variant="outline" className="dark:bg-blue-950/50 p-2">
                      <ItemContent className="flex items-center justify-between gap-4">
                        <ItemTitle className="text-sm opacity-70">
                          {report.title}
                        </ItemTitle>
                        <ItemDescription className="font-bold retro">
                          {report.description}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                    {index < battleReport.length - 1 && <ItemSeparator />}
                  </div>
                ))}
              </ItemGroup>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default VictoryScreen;
